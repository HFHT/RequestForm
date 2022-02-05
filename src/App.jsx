import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, useMediaQuery } from '@mui/material'

import './App.css';
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
import { getExpiration, saveCookie } from './services/HandleCookie';
import { MongoAPI } from './services/MongoDBAPI'
import { saveToDB } from './services/saveToDB';
import NotQualified from './ui-components/NotQualified';

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

const trimAlreadyAnswered = (lastIdx, questions) => {
  console.log(lastIdx, questions)
  if (!lastIdx) return questions
  let filterQuestions = questions.filter((q) => {
    return q.i >= lastIdx
  })
  console.log(filterQuestions)
  return filterQuestions
}

function App(props) {
  console.debug(props)
  let emptyCookie = {
    "Expires": getExpiration(30),
    "date": props.date,
    "appID": props.appID,
    "language": props.language,
    "answers": {},
    "applicant": {},
    "addressInfo": {},
    "selectedRepairs": "",
    "eligiblePrograms": null,
    "thisQuestion": { i: 0 },
    "rejectMsg": null,
    "state": {
      "isRejected": false,
      "proceed": false,
      "questionsDone": false,
      "filloutApp": false,
      "applicantDone": false
    }
  }
  // If not already set, save a forever cookie so we know this persons appID in the future (not used for now)
  !props.cookie.hasOwnProperty('appID') && saveCookie({ name: 'appID', value: { "Expires": "Tue, 19 Jan 2038 04:14:07 GMT", "appID": props.appID, "date": props.date } })
  const matches = useMediaQuery('(min-width:600px)')
  const [cookies, setCookies] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState : emptyCookie)
  const [awaitStateRestore, setAwaitStateRestore] = useState(false)
  const [awaitRelease, setAwaitRelease] = useState(false)
  const [instructions, setInstructions] = useState(props.instructions)
  const [questions, setQuestions] = useState(props.cookie.hasOwnProperty('myState') ? trimAlreadyAnswered(props.cookie.myState.thisQuestion.i, props.instructions.Questions) : props.instructions.Questions)
  const [programList, setProgramList] = useState(props.instructions.ProgramList)
  const [programs, setPrograms] = useState(props.instructions.Programs)
  const [eligiblePrograms, setEligiblePrograms] = useState(null)
  const [thisQuestion, setThisQuestion] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.thisQuestion : null)
  const [income, setIncome] = useState(props.instructions.Income)
  const [answers, setAnswers] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.answers : props.instructions.Answers)
  const [repairs, setRepairs] = useState(props.instructions.RepairList)
  const [zipCodes, setZipCodes] = useState(props.instructions.ZipCodes)
  const [language, setLanguage] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.language : props.language)
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [rejectMsg, setRejectMsg] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.rejectMsg : null)
  const [proceed, setProceed] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.state.proceed : false)
  const [addressInfo, setAddressInfo] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.addressInfo : {})
  const [selectedRepairs, setSelectedRepairs] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.selectedRepairs : '')
  const [questionsDone, setQuestionsDone] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.state.questionsDone : false)
  const [filloutApp, setFilloutApp] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.state.filloutApp : false)  /* tri state false - initial, yes - proceed, no - abort */
  const [applicant, setApplicant] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.applicant : {})
  const [applicantDone, setApplicantDone] = useState(props.cookie.hasOwnProperty('myState') ? props.cookie.myState.state.applicantDone : false)
  const [haveAddress, setHaveAddress] = useState(false)
  const [haveRepairs, setHaveRepairs] = useState(false)
  const [haveEligiblePrograms, setHaveEligiblePrograms] = useState(false)
  const [isRejected, setIsRejected] = useState(false)

  // Handle changes to the desired language
  const handleChange = (event, language) => {
    setLanguage(language);
    setCookies(thisCookie => ({ ...thisCookie, language }))
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
  // 5) App determines eligible programs
  // 6) The applicant contact information
  // 7) The applicant does not meet the criteria

  // 1- When the client has provided the address update the cookie
  useEffect(() => {
    if (addressInfo && addressInfo.hasOwnProperty('address_components')) {
      setCookies(thisCookie => ({ ...thisCookie, addressInfo }))
      setHaveAddress(true)
    }
  }, [addressInfo])

  // 2- When the client has provided an answer to a question update the cookie
  useEffect(() => {
    answers && Object.keys(answers).length > 0 && setCookies(thisCookie => ({ ...thisCookie, answers }))
  }, [answers])

  // 3- When an item is added or removed from the questions array, set the current question, also test for if it is the last question
  useEffect(() => {
    questions && questions[0] && setThisQuestion(questions[0])
    questions && questions.length === 0 && setQuestionsDone(true)
  }, [questions])

  // 4- When the client has finished specifying the repairs, update the progress state and cookie
  useEffect(() => {
    if (selectedRepairs !== '') {
      handleAnswer({ mode: null, ansKey: "Repairs", clientAns: "yes", reject: [], rejectMsg: null, skip: {} })
      setCookies(thisCookie => ({ ...thisCookie, selectedRepairs }))
      setHaveRepairs(true)
    }
  }, [selectedRepairs])

  // 5- When the app figures out eligible programs, update the progress state and cookie
  useEffect(() => {
    if (eligiblePrograms) {
      setCookies(thisCookie => ({ ...thisCookie, eligiblePrograms }))
      setHaveEligiblePrograms(true)
    }
  }, [eligiblePrograms])

  // 6- When the client has finished fillout out form, set done
  useEffect(() => {
    applicant && applicant.hasOwnProperty('name') && setApplicantDone(true)
    applicant && applicant.hasOwnProperty('name') && setCookies(thisCookie => ({ ...thisCookie, applicant }))
  }, [applicant])

  // 7 - Set rejectMsg when the client doesn't qualify
  useEffect(() => {
    if (rejectMsg) {
      setCookies(thisCookie => ({ ...thisCookie, rejectMsg }))
      setIsRejected(true)
    }
  }, [rejectMsg])

  // In order to restore state from the cookie, need to capture all major state changes
  // When any major state changes occur update the cookie
  useEffect(() => {
    console.log('major state', awaitStateRestore)
    if (addressInfo && addressInfo.hasOwnProperty('address_components')) {
      var state = {
        isRejected: isRejected,
        proceed: proceed,
        questionsDone: questionsDone,
        filloutApp: filloutApp,
        applicantDone: applicantDone
      }
      setCookies(thisCookie => ({ ...thisCookie, state }))
      saveToDB(cookies)
    }
  }, [haveAddress, haveRepairs, haveEligiblePrograms, isRejected, proceed, questionsDone, filloutApp, applicantDone])

  useEffect(() => {
    thisQuestion && setCookies(thisCookie => ({ ...thisCookie, thisQuestion }))
  }, [thisQuestion])

  return (
    <>
      {((instructions && (!instructions.hasOwnProperty('Questions') || !instructions.hasOwnProperty('Programs'))) || !zipCodes) ? <CircularProgress /> :
        <>
          <SelLanguage aria-label='123456' language={language} onChange={handleChange} matches={matches} />
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
          {questionsDone && selectedRepairs && selectedRepairs !== "" && !filloutApp && <ResultPanel language={language} programList={programList} programs={programs} answers={answers} selectedRepairs={selectedRepairs} setter={setFilloutApp} setEligiblePrograms={setEligiblePrograms} matches={matches} />}
          {questionsDone && filloutApp === 'yes' && !applicantDone && <ApplicantPanel language={language} programList={programList} programs={programs} answers={answers} selectedRepairs={selectedRepairs} setter={setApplicant} />}
          {questionsDone && applicantDone && <Submitted appID={cookies.appID} language={language} />}
          {questionsDone && filloutApp === 'no' && <h3>Cancelled</h3>}
          <NotQualified open={rejectMsg !== null} language={language} msg={rejectMsg} handleClose={handleClose} proceed={proceed} handleProceed={handleProceed} />
        </>
      }
    </>
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