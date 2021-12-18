import { useState, useEffect, forwardRef } from 'react';
import { FormGroup, FormControlLabel, Checkbox, List, Divider, ListItem, ListItemIcon, ListItemText, ListSubheader, Switch, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Paper, Input, useMediaQuery } from '@mui/material'
import { Check as CheckIcon, Cancel as CancelIcon, NotInterested as NotInterestedIcon } from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import Autocomplete from "react-google-autocomplete";
import './App.css';
import { MongoAPI } from './services/MongoDBAPI'

const dbDate = () => {
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
    return (setter(currentState[repair] = false))
  })

}

function App(props) {
  const gilad = true
  const AutoCompleteComponent = forwardRef((props, ref) =>
    <Autocomplete  {...props} ref={ref}
      apiKey={`${process.env.REACT_APP_GOOGLE_APIKEY}`}
      placeholder={language === 'en' ? 'Your address...' : 'Su dirección...'}
      options={{
        types: ["address"],
        componentRestrictions: { country: "us" },
      }}
      onPlaceSelected={(selected) => {
        console.log(selected)
        console.log(selected.hasOwnProperty('name'))
        console.log(isCounty(selected))
        console.log(isCity(selected, zipCodes[0]))
        saveAnswer(isCity(selected, zipCodes[0]))
      }
      }
    />
  )
  const matches = useMediaQuery('(min-width:600px)');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showQuestion, setShowQuestion] = useState([true])
  const [repairs, setRepairs] = useState({});
  const [zipCodes, setZipCodes] = useState([]);
  const [language, setLanguage] = useState(props.language);
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [answer, setAnswer] = useState('')
  const [whichQuestion, setWhichQuestion] = useState("0")
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
  const saveAnswer = (answer) => {
    setAnswer('');
    questions[0].Questions[whichQuestion][answer] === 'r' ? console.log("Reject") :
      setWhichQuestion(questions[0].Questions[whichQuestion][answer])
    showQuestion[questions[0].Questions[whichQuestion][answer]] = true
    setShowQuestion(showQuestion)
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
    try {
      getQuestions()
    }
    catch { console.log('network error') }
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      setRepairState(questions[0].RepairList, repairs, setRepairs)
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
          <List

            subheader={<ListSubheader><h3>{questions[0].Desc[language]}</h3></ListSubheader>}
          >
            {questions[0].Questions.map((question, i) => {
              return (
                <div key={question.qn}>
                  {question.action === '' && <Question question={question} language={language} answers={answers} translate={yesTranslate} onChange={handleAnswer} show={showQuestion[question.qn]} matches={matches} />}
                  {question.action === 'County' && <Address AutoCompleteComponent={AutoCompleteComponent} show={showQuestion[question.qn]} />}
                  {question.action === 'RepairList' && <RepairList question={question} repairList={questions[0].RepairList} language={language} onChange={handleRepairSel} show={showQuestion[question.qn]} matches={matches} />}
                  {question.action === 'Done' && <CheckEligible question={question} language={language} onChange={handleRepairSel} show={showQuestion[question.qn]} matches={matches} />}
                </div>
              )
            }).reverse()}
          </List>
        </div>
      }
    </div>
  );
}

export default App;

const Question = ({ question, language, answers, translate, onChange, show, matches }) => {
  console.log(question, answers, translate, onChange, show)
  return (<div>
    {show &&
      <>
        <ListItem
          sx={answers[question.qn] ? { backgroundColor: '#cddbd2' } : ''}
          selected={!answers[question.qn]}
        >
          {!answers[question.qn] &&
            <Item elevation={0}>
              <ToggleButtonGroup
                orientation={matches ? "horizontal" : "vertical"}
                color="primary"
                value={answers[question.qn]}
                disabled={answers[question.qn]}
                exclusive
                onChange={onChange}
              >
                <ToggleButton value={`${translate}`} >{translate}</ToggleButton>
                <ToggleButton value="no" >no</ToggleButton>
              </ToggleButtonGroup>
            </Item>
          }
          <ListItemIcon>
            {console.log(answers[question.qn])}
            {answers[question.qn] ? (
              question[answers[question.qn]] === 'r' ?
                <CancelIcon /> :
                <CheckIcon />
            ) :
              null
            }
          </ListItemIcon>
          <ListItemText primary={question.q[language]} />
        </ListItem>
        <Divider />
      </>
    }
  </div>
  )
}

const Address = ({ AutoCompleteComponent, show }) => {
  return (
    <div>
      {show &&
        <ListItem >
          <div style={{ width: "250px" }}>
            <Input
              fullWidth
              color="secondary"
              inputComponent={AutoCompleteComponent}
            />
          </div>
        </ListItem>
      }
    </div>
  )
}

const RepairList = ({ question, repairList, onChange, language, show, matches }) => {
  console.log(question, onChange, show)
  return (
    <div>
      {show &&
        <ListItem>
          <Item elevation={0}><h3>Select Repairs</h3></Item>
          <FormGroup>
            {repairList.map((item, i) => {
              return (
                <FormControlLabel key={i} control={
                  <Switch checked={false} onChange={onChange} name={item} />
                }
                  label={item}
                />)
            }
            )}
          </FormGroup>

        </ListItem>}
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