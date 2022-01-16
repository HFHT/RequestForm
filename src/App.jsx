import { useState, useEffect, useReducer, forwardRef } from 'react';
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
  const [lastQuestion, setLastQuestion] = useState(false)
  const [questionsDone, setQuestionsDone] = useState(false)
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

  const handleAddress = ({ city, county }) => {
    if (!city) { return (null) }
    // filter through list of questions remove city and or county 
    let filterQuestions = questions.filter((q) => {
      switch (q.attrib) {
        case 'County': {
          return county === "no"
        }
        case 'City': {
          return city === 'P'
        }
        default:
          return true
      }
    })
    console.log(filterQuestions)

    if (filterQuestions.length !== 0) {
      setQuestions(filterQuestions)
    }
  }

  const handleAnswer = ({ mode, clientAns, ansKey, reject, rejectMsg, skip }) => {
    console.log(clientAns, ansKey, reject, rejectMsg)
    updateAnswer({ ansKey: ansKey, ansValue: clientAns, setter: setAnswers })
    if (reject.indexOf(clientAns) > -1) {
      console.log(rejectMsg)
      setRejectMsg(rejectMsg)
    }
    if (mode === 'shift') {
      let curQuestions = [...questions]
      console.log(curQuestions)
      curQuestions.shift()
      if (skip.hasOwnProperty('ans')) {
        console.log(skip)
        if (skip.ans.indexOf(clientAns) > -1) {
          curQuestions.shift()
        }
      }
      setQuestions(curQuestions)
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

  useEffect(() => {
    console.log('question state', questions)
    lastQuestion && setQuestionsDone(true)
    questions[0] && questions[0].hasOwnProperty('done') && questions[0].done === "yes" &&
      setLastQuestion(true)
    setThisQuestion(questions[0])
  }, [questions])

  useEffect(() => {
    console.log('repairList state', selectedRepairs)
    selectedRepairs !== '' &&
      handleAnswer({ mode: null, ansKey: "Repairs", clientAns: "yes", reject: [], rejectMsg: null, skip: {} })
  }, [selectedRepairs])

  return (
    <div>
      {(instructions && instructions.hasOwnProperty('Questions') && zipCodes.length) ? <CircularProgress /> :
        <div>
          <SelLanguage language={language} onChange={handleChange} matches={matches} />
          <ProgressPanel language={language} yesTranslate={yesTranslate} answers={answers} setAnswers={setAnswers} />
          <GoogleAddress
            language={language}
            zipCodes={zipCodes}
            addressInfo={addressInfo}
            setAddressInfo={setAddressInfo}
            handleAnswer={handleAnswer}
            handleAddress={handleAddress} />

          {addressInfo && addressInfo.hasOwnProperty('address_components') && questions.length > 0 && !rejectMsg &&
            <QuestionPanel
              language={language}
              questions={questions}
              thisQuestion={thisQuestion}
              income={income}
              answers={answers}
              handleAnswer={handleAnswer}
              yesTranslate={yesTranslate} />}
          {questionsDone && selectedRepairs === "" && <RepairListPanel repairs={repairs} setRepairs={setRepairs} language={language} setSelectedRepairs={setSelectedRepairs} matches={matches} />}
          {questionsDone && selectedRepairs !== "" && <ResultPanel language={language} />}

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