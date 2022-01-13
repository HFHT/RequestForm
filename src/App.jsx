import { useState, useEffect, forwardRef } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, FormGroup, FormControlLabel, Grid, Snackbar, Alert as MuiAlert, Switch, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Paper, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Task as TaskIcon } from '@mui/icons-material';

import './App.css';
import { MongoAPI } from './services/MongoDBAPI'
import GoogleAddress from './ui-components/GoogleAddress';
import ProgressPanel from './ui-components/ProgressPanel';
import QuestionPanel from './ui-components/QuestionPanel';
import RepairListPanel from './ui-components/RepairListPanel';
import ResultPanel from './ui-components/ResultPanel';
import { Item } from './ui-components/Item';

const dbDate = () => {
  /* fix the following for time zone */
  //  return new Date().toISOString().split('T')[0]
  var dateObj = new Date()
  dateObj.setHours(dateObj.getHours() - 7)
  return dateObj.toISOString().substr(0, 10)
}

const updateAnswer = ({ ansKey, ansValue, setter }) => {
  if (ansValue === null) { return (null) }
  let thisAnswer = {}
  thisAnswer[ansKey] = ansValue
  setter(answers => ({
    ...answers,
    ...thisAnswer
  }))
}

function App(props) {
  const matches = useMediaQuery('(min-width:600px)')
  const [hasAlert, setHasAlert] = useState(null)
  const [instructions, setInstructions] = useState(null)
  const [questions, setQuestions] = useState([])
  const [thisQuestion, setThisQuestion] = useState(null)
  const [income, setIncome] = useState(null)
  const [answers, setAnswers] = useState({})
  const [repairs, setRepairs] = useState([])
  const [zipCodes, setZipCodes] = useState([])
  const [language, setLanguage] = useState(props.language)
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [rejectMsg, setRejectMsg] = useState(null)
  const [addressInfo, setAddressInfo] = useState({})
  const [selectedRepairs, setSelectedRepairs] = useState('')
  const [cityCheck, setCityCheck] = useState(null)
  const [countyCheck, setCountyCheck] = useState(null)
  const [cityYesNo, setCityYesNo] = useState(null)
  const [countyYesNo, setCountyYesNo] = useState(null)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  const [contactErrors, setContactErrors] = useState({
    name: false,
    phone: false,
    email: false
  })

  const handleChange = (event, language) => {
    setLanguage(language);
    setYesTranslate(language === 'en' ? "yes" : "sí")
    console.log(event.target.value)
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setHasAlert(null);
  };
  const handleMailError = ({ e }) => {
    console.log(e)
  }

  const handleAddress = ({ ansKey, ansValue }) => {
    if (ansValue === null) { return (null) }
    // filter through list of questions remove city and or county 
    let filterQuestions = questions.filter((q) => {
      return q
    })
    console.log(filterQuestions)
    updateAnswer({ ansKey: ansKey, ansValue: ansValue, setter: setAnswers })
  }

  const handleAnswer = ({ clientAns, ansKey, reject, rejectMsg }) => {
    console.log(clientAns, ansKey, reject, rejectMsg)
    updateAnswer({ ansKey: ansKey, ansValue: clientAns, setter: setAnswers })
    if (reject.indexOf(clientAns) > -1) {
      console.log(rejectMsg)
      setRejectMsg(rejectMsg)
    }
  }

  var applicant = {
    "_id": 0,
    "Version": 0,
    "Date": dbDate(),
    "Language": "en",
    "Answers": [
    ]
  }

  //console.log(applicant)
  useEffect(() => {
    const getInstructions = async () => {
      await MongoAPI({ method: 'max', db: 'HomeRepairApp', collection: 'Questions', find: "Version", limit: 1 }, setInstructions)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'ZipCodes', find: { "_id": 0 } }, setZipCodes)
    }
    getInstructions()
  }, [])

  useEffect(() => {
    console.log(rejectMsg)
  }, [rejectMsg])

  useEffect(() => {
    console.log(instructions)
    instructions && instructions.hasOwnProperty('Questions') &&
      setQuestions(instructions.Questions)
    instructions && instructions.hasOwnProperty('Questions') &&
      setThisQuestion(instructions.Questions[0])
    instructions && instructions.hasOwnProperty('Income') &&
      setIncome(instructions.Income)
    instructions && instructions.hasOwnProperty('RepairList') &&
      setRepairs(instructions.RepairList)
    instructions && instructions.hasOwnProperty('Answers') &&
      setAnswers(instructions.Answers)
  }, [instructions])

  return (
    <div>
      {(instructions && instructions.hasOwnProperty('Questions') && zipCodes.length) ? <CircularProgress /> :
        <div>
          <SelLanguage language={language} onChange={handleChange} matches={matches} />
          <GoogleAddress
            language={language}
            zipCodes={zipCodes}
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            handleAddress={handleAddress} />
          <ProgressPanel language={language} answers={answers} setAnswers={setAnswers} />
          {addressInfo && addressInfo.hasOwnProperty('address_components') &&
            <QuestionPanel
              language={language}
              questions={questions}
              thisQuestion={thisQuestion}
              income={income}
              answers={answers}
              handleAnswer={handleAnswer}
              yesTranslate={yesTranslate} />}
          {false && selectedRepairs === "" && <RepairListPanel repairs={repairs} setRepairs={setRepairs} language={language} repairsDone={setSelectedRepairs} matches={matches} />}
          {false && <ResultPanel language={language} />}

          <Dialog
            open={rejectMsg !== null}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {rejectMsg === null ? "" : rejectMsg[language]}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Insert <a href="https://www.habitattucson.org/services/other-resources/">link</a> to other possible services.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      }
    </div>
  )
}
export default App;

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