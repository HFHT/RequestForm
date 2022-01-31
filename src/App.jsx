import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, useMediaQuery } from '@mui/material'

import './App.css';
import { MongoAPI } from './services/MongoDBAPI'
import GoogleAddress from './ui-components/GoogleAddress';
import ProgressPanel from './ui-components/ProgressPanel';
import QuestionPanel from './ui-components/QuestionPanel';
import RepairListPanel from './ui-components/RepairListPanel';
import ResultPanel from './ui-components/ResultPanel';
import ApplicantPanel from './ui-components/ApplicantPanel';
import Submitted from './ui-components/Submitted';
import { Item } from './ui-components/Item';
import { titles } from './services/Titles'
import { whichBrowser } from './services/WhichBrowser';
import { parseCookie, getExpiration, saveCookie } from './services/HandleCookie';

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
  const [cookies, setCookies] = useState({
    "Expires": getExpiration(30),
    "appID": "",
    "answers": {},
    "applicant": {},
    "addressInfo": {},
    "selectedRepairs": "",
    "state": {
      "thisQuestion": "",
      "proceed": false,
      "lastQuestion": false,
      "questionsDone": false,
      "filloutApp": false,
      "applicantDone": false
    }
  })
  const [awaitStateRestore, setAwaitStateRestore] = useState(false)
  const [awaitRelease, setAwaitRelease] = useState(false)
  const [instructions, setInstructions] = useState(null)
  const [questions, setQuestions] = useState([])
  const [programList, setProgramList] = useState([])
  const [programs, setPrograms] = useState({})
  const [thisQuestion, setThisQuestion] = useState(null)
  const [income, setIncome] = useState(null)
  const [answers, setAnswers] = useState({})
  const [repairs, setRepairs] = useState([])
  const [zipCodes, setZipCodes] = useState(null)
  const [language, setLanguage] = useState(props.language)
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [rejectMsg, setRejectMsg] = useState(null)
  const [proceed, setProceed] = useState(false)
  const [addressInfo, setAddressInfo] = useState({})
  const [selectedRepairs, setSelectedRepairs] = useState('')
  const [lastQuestion, setLastQuestion] = useState(false)
  const [questionsDone, setQuestionsDone] = useState(false)
  const [filloutApp, setFilloutApp] = useState(false)  /* tri state false - initial, yes - proceed, no - abort */
  const [applicant, setApplicant] = useState({})
  const [applicantDone, setApplicantDone] = useState(false)

  // Handle changes to the desired language
  const handleChange = (event, language) => {
    setLanguage(language);
    setYesTranslate(language === 'en' ? "yes" : "sí")
  };

  // Handle dialog close events, prevent the user from clicking away the modal.
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  };

  const handleProceed = (event) => {
    setRejectMsg(null)
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
    if (filterQuestions.length !== 0) {
      setQuestions(filterQuestions)
    }
  }

  // Update the answers state variable, check for an answer that results in a rejection
  // Remove the just answered questions from the questions array,
  // also check this answer to determine if any subsequent questions can be skipped
  // by updating the questions state, a corresponding useEffect will fire
  const handleAnswer = ({ mode, clientAns, ansKey, reject, rejectMsg, skip, proceed }) => {
    updateAnswer({ ansKey: ansKey, ansValue: clientAns, setter: setAnswers })
    if (reject.indexOf(clientAns) > -1) {
      setProceed(proceed)
      setRejectMsg(rejectMsg)
    }
    if (mode === 'shift') {
      let curQuestions = [...questions]
      curQuestions.shift()
      if (skip.hasOwnProperty('ans')) {
        if (skip.ans.indexOf(clientAns) > -1) {
          curQuestions.shift()
        }
      }
      setQuestions(curQuestions)
    }
  }

  //The following three useEffect prepare the environment
  // 1) fetch all the initial data from the database
  // 2) upon completion:
  //    a) Set the fetched data into their respective state variables
  //    b) Check if the client has a cookie set, if so then restore the program stat from the cookie
  // 3) Once cookie data is restored, release the UI

  // 1 - Upon page load fetch all the required information from the Mongo database
  useEffect(() => {
    const getInstructions = async () => {
      await MongoAPI({ method: 'max', db: 'HomeRepairApp', collection: 'Questions', find: "Version", limit: 1 }, setInstructions)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'ZipCodes', find: { "_id": 0 } }, setZipCodes)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'Programs', find: { "_id": 0 } }, setPrograms)
    }
    getInstructions()
    //!!!!! Fire off another request to add a tracking record, do this via a new Azure function 
    //which uses node.js agent.getNames() to append IP information

  }, [])

  // 2- When the fetch from the database completes set all the needed state variables with it's contents
  useEffect(() => {
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

    //Check if a valid cookie has been previously set, if so restore the state to where they left off.
    let savedCookie = parseCookie(document.cookie)
    if (savedCookie.hasOwnProperty('myState') && !props.debug) {
      console.log('state coming from cookie', savedCookie.myState.state.thisQuestion)
      const Expires = savedCookie.myState.Expires
      setCookies(thisCookie => ({ ...thisCookie, Expires }))
      setAnswers(savedCookie.myState.answers)
      setAddressInfo(savedCookie.myState.addressInfo)
      setApplicant(savedCookie.myState.applicant)
      setThisQuestion(savedCookie.myState.state.thisQuestion)
      setLastQuestion(savedCookie.myState.state.lastQuestion)
      setSelectedRepairs(savedCookie.myState.selectedRepairs)
      setProceed(savedCookie.myState.state.proceed)
      setQuestionsDone(savedCookie.myState.state.questionsDone)
      setFilloutApp(savedCookie.myState.state.filloutApp)
      setApplicantDone(savedCookie.myState.state.applicantDone)
      setAwaitStateRestore(true)
    } else {
      setAwaitStateRestore(true)
    }
    console.log(parseCookie(document.cookie))
    console.log(whichBrowser())

  }, [instructions])

  // 3 - Once all the cookie states have been restored, release the display of the UI
  useEffect(() => {
    setAwaitRelease(true)
  }, [awaitStateRestore])

  // Saving the current state to a cookie  
  // When the cookie object is updated, save the cookie
  useEffect(() => {
    console.log('cookies', cookies)
    cookies && saveCookie({ name: 'myState', value: cookies })
  }, [cookies])

  // The folowing useEffects are for capturing the clients input
  // 1) The address
  // 2) The answers
  // 3) The questions (they will change as a result of answers provided)
  // 4) The selected repairs
  // 5) The applicant contact information

  // 1- When the client has provided the address update the cookie
  useEffect(() => {
    addressInfo && addressInfo.hasOwnProperty('address_components') && setCookies(thisCookie => ({ ...thisCookie, addressInfo }))
  }, [addressInfo])

  // 2- When the client has provided an answer to a question update the cookie
  useEffect(() => {
    answers && Object.keys(answers).length > 0 && setCookies(thisCookie => ({ ...thisCookie, answers }))
  }, [answers])

  // 3- When an item is added or removed from the questions array, set the current question, also test for if it is the last question
  useEffect(() => {
    lastQuestion && setQuestionsDone(true)
    questions[0] && questions[0].hasOwnProperty('done') && questions[0].done === "yes" &&
      setLastQuestion(true)
    setThisQuestion(questions[0])
  }, [questions])

  // 4- When the client has finished specifying the repairs, update the progress state and cookie
  useEffect(() => {
    selectedRepairs !== '' &&
      handleAnswer({ mode: null, ansKey: "Repairs", clientAns: "yes", reject: [], rejectMsg: null, skip: {} })
    selectedRepairs !== '' && setCookies(thisCookie => ({ ...thisCookie, selectedRepairs }))
  }, [selectedRepairs])

  // 5- When the client has finished fillout out form, set done
  useEffect(() => {
    applicant && applicant.hasOwnProperty('name') && setApplicantDone(true)
    applicant && applicant.hasOwnProperty('name') && setCookies(thisCookie => ({ ...thisCookie, applicant }))
  }, [applicant])

  // In order to restore state from the cookie, need to capture all major state changes
  // When any major state changes occur update the cookie
  useEffect(() => {
    console.log('major state', awaitStateRestore)
    if (!awaitStateRestore) return
    let state = {
      thisQuestion: thisQuestion,
      proceed: proceed,
      lastQuestion: lastQuestion,
      questionsDone: questionsDone,
      filloutApp: filloutApp,
      applicantDone: applicantDone
    }
    addressInfo && addressInfo.hasOwnProperty('address_components') && setCookies(thisCookie => ({ ...thisCookie, state }))
  }, [thisQuestion, proceed, lastQuestion, questionsDone, filloutApp, applicantDone])

  // Place holder for doing something when someone doesn't qualify
  useEffect(() => {
    console.log(rejectMsg)
  }, [rejectMsg])

  return (
    <div>
      {((instructions && (!instructions.hasOwnProperty('Questions') || !instructions.hasOwnProperty('Programs'))) || !zipCodes || !awaitRelease) ? <CircularProgress /> :
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
          {addressInfo && addressInfo.hasOwnProperty('address_components') && !questionsDone && !rejectMsg &&
            <QuestionPanel
              language={language}
              questions={questions}
              thisQuestion={thisQuestion}
              income={income}
              answers={answers}
              handleAnswer={handleAnswer}
              yesTranslate={yesTranslate} />}
          {questionsDone && selectedRepairs === "" && <RepairListPanel repairs={repairs} setRepairs={setRepairs} language={language} setSelectedRepairs={setSelectedRepairs} matches={matches} />}
          {questionsDone && selectedRepairs && selectedRepairs !== "" && !filloutApp && <ResultPanel language={language} programList={programList} programs={programs} answers={answers} selectedRepairs={selectedRepairs} setter={setFilloutApp} matches={matches} />}
          {questionsDone && filloutApp === 'yes' && !applicantDone && <ApplicantPanel language={language} programList={programList} programs={programs} answers={answers} selectedRepairs={selectedRepairs} setter={setApplicant} />}
          {questionsDone && applicantDone && <Submitted />}
          {questionsDone && filloutApp === 'no' && <h3>Cancelled</h3>}

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
                <Button onClick={handleProceed}>{titles(language, 'AP_EMERGENCY')}</Button>
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