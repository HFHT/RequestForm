import { useState, useEffect, forwardRef } from 'react';
import { FormGroup, FormControlLabel, Checkbox, Switch, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Paper, Input, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles';
import Autocomplete from "react-google-autocomplete";
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
      apiKey={'AIzaSyBlaLkYq-YAJECTBOoiW8qzfLB25T2H0TQ'}
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
  const [repairs, setRepairs] = useState({});
  const [zipCodes, setZipCodes] = useState([]);
  const [language, setLanguage] = useState(props.language);
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [answer, setAnswer] = useState('')
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
    saveAnswer(event.target.value)
  };
  const saveAnswer = (answer) => {
    setAnswer('');
    questions[0].Questions[whichQuestion][answer] === 'r' ? console.log("Reject") :
      setWhichQuestion(questions[0].Questions[whichQuestion][answer])
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
          <Stack direction="row" spacing={2} >
            <Item elevation={0}>
              <ToggleButtonGroup
                orientation={matches ? "horizontal" : "vertical"}
                color="primary"
                value={language}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="en">English</ToggleButton>
                <ToggleButton value="es">español</ToggleButton>
              </ToggleButtonGroup>
            </Item>
            <Item elevation={0}>
              <h3>Select language / Seleccione el idioma</h3>
            </Item>
          </Stack>
          {questions[0].Questions[whichQuestion].action === "County" ?
            <div>
              <Item elevation={0}><h3>Provide Contact Information</h3></Item>
              <div style={{ width: "250px" }}>
                <Input
                  fullWidth
                  color="secondary"
                  inputComponent={AutoCompleteComponent}
                />
              </div>

            </div>
            :
            (questions[0].Questions[whichQuestion].action === "RepairList" ?
              <div>
                <Item elevation={0}><h3>Select Repairs</h3></Item>
                <FormGroup>
                  {questions[0].RepairList.map((item, i) => {
                    return (
                      <FormControlLabel key={i} control={
                        <Switch checked={item} onChange={handleRepairSel} name={item} />
                      }
                        label={item}
                      />)
                  }
                  )}
                </FormGroup>
              </div>
              :
              <div>
                <Item elevation={0}><h3>{questions[0].Desc[language]}</h3></Item>
                <Stack direction="row" spacing={2} >
                  <Item elevation={0}>
                    <ToggleButtonGroup
                      orientation={matches ? "horizontal" : "vertical"}
                      color="primary"
                      value={answer}
                      exclusive
                      onChange={handleAnswer}
                    >
                      <ToggleButton value={`${yesTranslate}`}>{yesTranslate}</ToggleButton>
                      <ToggleButton value="no">no</ToggleButton>
                    </ToggleButtonGroup>
                  </Item>
                  <Item>
                    <h3>{questions[0].Questions[whichQuestion].q[language]}</h3>
                  </Item>
                </Stack>
              </div>
            )
          }
        </div>
      }
    </div>
  );
}

export default App;