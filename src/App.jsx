import { useState, useEffect, forwardRef } from 'react';
import { Button, FormGroup, FormControlLabel, Grid, Snackbar, Alert as MuiAlert, Checkbox, List, Divider, ListItem, ListItemIcon, ListItemText, ListSubheader, Switch, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Paper, Input, useMediaQuery } from '@mui/material'
import { Task as TaskIcon, Check as CheckIcon, Cancel as CancelIcon, NotInterested as NotInterestedIcon, KeyboardReturnTwoTone } from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import AutoComplete from "react-google-autocomplete";
import './App.css';
import { MongoAPI } from './services/MongoDBAPI'

const dbDate = () => {
  /* fix the following for time zone */
  //  return new Date().toISOString().split('T')[0]
  var dateObj = new Date()
  dateObj.setHours(dateObj.getHours() - 7)
  return dateObj.toISOString().substr(0, 10)
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  //  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const isCounty = (googleAddrObj) => {
  var result = googleAddrObj.address_components.filter(obj => obj.types[0] === "administrative_area_level_2")
  console.log(result)
  return (result[0].long_name === "Pima County" ? 'yes' : 'no')
}

const isCity = (googleAddrObj, zipCodeObj) => {
  var result = googleAddrObj.address_components.filter(obj => obj.types[0] === "postal_code")
  console.log(result)
  console.log(zipCodeObj)
  var zipInfo = zipCodeObj.ZipCodes.filter(obj => obj.ZIP === result[0].long_name)
  console.log(zipInfo)
  return (zipInfo.length === 0 ? 'no' : (zipInfo[0].CityOfTucson === 'P' ? 'ck' : 'no'))
}

async function setRepairState(repairList, currentState, setter) {
  repairList.map((repair) => {
    console.log(currentState)
    setter(currentState[repair] = false)
  })
  return (currentState)
}

function App(props) {
  const matches = useMediaQuery('(min-width:600px)');
  const [hasAlert, setHasAlert] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [repairs, setRepairs] = useState({});
  const [zipCodes, setZipCodes] = useState([]);
  const [language, setLanguage] = useState(props.language);
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [answer, setAnswer] = useState('')
  const [answerList, setAnswerList] = useState([]);
  const [whichQuestion, setWhichQuestion] = useState(0)
  const [addressInfo, setAddressInfo] = useState({})
  const [showAddress, setShowAddress] = useState(false)
  const handleChange = (event, language) => {
    setLanguage(language);
    setYesTranslate(language === 'en' ? "yes" : "sí")
    console.log(event.target.value)
  };
  const handleRepairSel = (event, selected) => {
    console.log(event, selected)
  }
  const handleAnswer = (event, answer) => {
    console.log(event.target.value, answer, whichQuestion)
    answers[whichQuestion] = event.target.value
    setAnswers(answers)
    saveAnswer(event.target.value)
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setHasAlert(null);
  };

  const saveAnswer = (answer) => {
    setAnswer('');
    if (questions[0].Questions[whichQuestion][answer] === 'r') { console.log("Reject") }
    else {
      setWhichQuestion(questions[0].Questions[whichQuestion][answer])
      const thisAnswer = questions[0].Questions[whichQuestion].f
      answerList.push(thisAnswer)
      setAnswerList(answerList)
    }
    console.log(whichQuestion)
  };

  var applicant = {
    "_id": 0,
    "Version": 0,
    "Date": dbDate(),
    "Language": "en",
    "Answers": [
    ]
  }
  console.log(applicant)
  useEffect(() => {
    const getQuestions = async () => {
      await MongoAPI({ method: 'max', db: 'HomeRepairApp', collection: 'Questions', find: "Version", limit: 1 }, setQuestions)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'ZipCodes', find: { "_id": 0 } }, setZipCodes)
    }
    getQuestions()
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      questions[0].RepairList.map((repair) => {
        const repairSave = repairs
        repairSave[repair] = false
        console.log(repairSave)
        setRepairs(repairSave)
      })
      console.log(questions[0].RepairList)
    }
  }, [questions])

  questions && console.log(questions[0])
  repairs && console.log(repairs)
  return (
    <div>
      {(questions.length === 0) ? <CircularProgress /> :
        <div>
          <SelLanguage language={language} onChange={handleChange} matches={matches} />
          {questions[0].Questions[whichQuestion].action === '' &&
            <Question question={questions[0].Questions[whichQuestion]} header={questions[0].Desc[language]} language={language} translate={yesTranslate} onChange={handleAnswer} matches={matches} />}
          {questions[0].Questions[whichQuestion].action === "County" &&
            <div style={{ width: "auto" }}>
              <Item elevation={0}><h3>{language === 'en' ? 'Provide the address of the home' : 'Proporcione la dirección de la casa'}</h3></Item>
              <AutoComplete
                apiKey={`${process.env.REACT_APP_GOOGLE_APIKEY}`}
                placeholder={language === 'en' ? 'Your address...' : 'Su dirección...'}
                options={{
                  types: ["address"],
                  componentRestrictions: { country: "us" },
                }}
                onPlaceSelected={(selected) => {
                  console.log(selected)
                  setAddressInfo(selected)
                  console.log(selected.hasOwnProperty('name'))
                  if (selected.hasOwnProperty('name')) {
                    setHasAlert(language === 'en' ? 'Please reenter the address and select it from the list!' : '¡Vuelva a ingresar la dirección y selecciónela de la lista!')
                  } else {
                    setHasAlert(null);
                    console.log(isCounty(selected))
                    console.log(isCity(selected, zipCodes[0]))
                    answers[whichQuestion] = isCounty(selected, zipCodes[0])
                    setAnswers(answers)
                    saveAnswer(isCity(selected, zipCodes[0]))
                  }
                }}
              />
            </div>
          }
          {questions[0].Questions[whichQuestion].action === "RepairList" &&
            <RepairList repairList={questions[0].RepairList} language={language} onChange={handleRepairSel} matches={matches} />
          }
          <Snackbar open={hasAlert!==null} autoHideDuration={7000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
              {hasAlert}
            </Alert>
          </Snackbar>
          <AnswerList answerList={answerList} language={language} />
        </div>
      }
    </div>
  )
}
export default App;

const AnswerList =  ({ answerList, language }) => {
  console.log(answerList, language)
  return (
    <List>
      {answerList.map((answer, i) => {
        return (
          answer[language] &&
          <ListItem key={i} sx={{ backgroundColor: '#cddbd2' }}>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary={answer[language]} />
            <Divider />
          </ListItem>
        )
      })}
    </List>
  )
}

const SelLanguage = ({ language, onChange, matches }) => {
  return (
    <Stack direction="row" spacing={2} >
      <Item elevation={0}>
        <ToggleButtonGroup
          orientation={matches ? "horizontal" : "vertical"}
          color="primary"
          value={language}
          exclusive
          onChange={onChange}
        >
          <ToggleButton value="en">English</ToggleButton>
          <ToggleButton value="es">español</ToggleButton>
        </ToggleButtonGroup>
      </Item>
      <Item elevation={0}>
        <h3>Select language / Seleccione el idioma</h3>
      </Item>
    </Stack>

  )
}

const Question = ({ question, header, language, translate, onChange, matches }) => {
  return (
    <div>
      <Item elevation={0}><h3>{header}</h3></Item>
      <Stack direction="row" spacing={2} >
        <Item elevation={0}>
          <ToggleButtonGroup
            orientation={matches ? "horizontal" : "vertical"}
            color="primary"
            value=""
            exclusive
            onChange={onChange}
          >
            <ToggleButton value={`${translate}`}>{translate}</ToggleButton>
            <ToggleButton value="no">no</ToggleButton>
          </ToggleButtonGroup>
        </Item>
        <Item>
          <h3>{question.q[language]}</h3>
        </Item>
      </Stack>
    </div>
  )
}

const RepairList = ({ repairList, onChange, language, matches }) => {
  console.log(onChange)
  return (
    <div>
      <Button variant="contained" color="primary" endIcon={<TaskIcon />} sx={matches ? {marginLeft: '4px'} : {}}>
      {language === 'en' ? 'Select the needed repairs -> Click when Done' : 'Seleccione las reparaciones necesarias -> Haga clic cuando esté listo'} 
      </Button>
      <FormGroup>
        <Grid container rowSpacing={1} columnSpacing={1} sx={{paddingLeft: '8px'}}>
        {repairList.map((item, i) => {
          return (
            <Grid key={i} item xs={12} sm={4} md={4} lg={4} xl={4} >
            <FormControlLabel key={i} control={
              <Switch checked={false} onChange={onChange} name={item} />
            }
              label={item}
            />
            </Grid>
            )
        }
        )}
        </Grid>
      </FormGroup>
    </div>
  )
}

const Address = ({ setter }) => {
  return (
    <div>
    </div>
  )
}

const CheckEligible = ({ show }) => {
  return (
    <div>
      {show &&
        <h3>Check eligibility....</h3>
      }
    </div>
  )
}