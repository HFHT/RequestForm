import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, useMediaQuery } from '@mui/material'

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

// Helper function to update the answers state 
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
  const [programList, setProgramList] = useState([])
  const [programs, setPrograms] = useState([])
  const [thisQuestion, setThisQuestion] = useState(null)
  const [income, setIncome] = useState(null)
  const [answers, setAnswers] = useState({})
  const [repairs, setRepairs] = useState([])
  const [zipCodes, setZipCodes] = useState([])
  const [language, setLanguage] = useState(props.language)
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [rejectMsg, setRejectMsg] = useState(null)
  const [proceed, setProceed] = useState(false)
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

  // Handle changes to the desired language
  const handleChange = (event, language) => {
    setLanguage(language);
    setYesTranslate(language === 'en' ? "yes" : "sí")
    console.log(event.target.value)
  };

  // Handle dialog close events, prevent the user from clicking away the modal.
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setHasAlert(null);
  };

  const handleProceed = (event) => {
    console.log(event)
    setRejectMsg(null)
  }

  const handleMailError = ({ e }) => {
    console.log(e)
  }

  // Based on the address information filter the questions to remove/keep county and/or city questions.
  // by updating the questions state, a corresponding useEffect will fire
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

  // Update the answers state variable, check for an answer that results in a rejection
  // Remove the just answered questions from the questions array,
  // also check this answer to determine if any subsequent questions can be skipped
  // by updating the questions state, a corresponding useEffect will fire
  const handleAnswer = ({ mode, clientAns, ansKey, reject, rejectMsg, skip, proceed }) => {
    console.log(clientAns, ansKey, reject, rejectMsg, proceed)
    updateAnswer({ ansKey: ansKey, ansValue: clientAns, setter: setAnswers })
    if (reject.indexOf(clientAns) > -1) {
      console.log(rejectMsg)
      setProceed(proceed)
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

  // Upon page load fetch all the required information from the Mongo database
  useEffect(() => {
    const getInstructions = async () => {
      await MongoAPI({ method: 'max', db: 'HomeRepairApp', collection: 'Questions', find: "Version", limit: 1 }, setInstructions)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'ZipCodes', find: { "_id": 0 } }, setZipCodes)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'Programs', find: { "_id": 0 } }, setPrograms)
    }
    getInstructions()
  }, [])

  useEffect(() => {
    console.log(rejectMsg)
  }, [rejectMsg])

  // When the fetch from the database completes set all the needed state variables with it's contents
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
    instructions && instructions.hasOwnProperty('Programs') &&
      setProgramList(instructions.Programs)
  }, [instructions])

  // When an item is added or removed from the questions array, set the current question, also test for if it is the last question
  useEffect(() => {
    console.log('question state', questions)
    lastQuestion && setQuestionsDone(true)
    questions[0] && questions[0].hasOwnProperty('done') && questions[0].done === "yes" &&
      setLastQuestion(true)
    setThisQuestion(questions[0])
  }, [questions])

  // When the client has finished specifying the repairs, update the progress state
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
          {questionsDone && selectedRepairs !== "" && <ResultPanel language={language} programList={programList} programs={programs} answers={answers} selectedRepairs={selectedRepairs} />}

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
            <DialogActions>
              {proceed &&
                <Button onClick={handleProceed}>Continue application as a NON EMERGENCY.</Button>
              }
            </DialogActions>
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