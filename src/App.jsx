import { useState, useEffect } from 'react';
import { CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Paper, useMediaQuery } from '@mui/material'
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

function App(props) {
  const matches = useMediaQuery('(min-width:600px)');
  const [questions, setQuestions] = useState([]);
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
  const handleAnswer = (event, answer) => {
    console.log(event.target.value, answer, whichQuestion)
    setAnswer('');
    questions[0].Questions[whichQuestion][event.target.value] === 'r' ? console.log("Reject") :
      setWhichQuestion(questions[0].Questions[whichQuestion][event.target.value])

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
    }
    getQuestions()
  }, []);
  questions && console.log(questions[0])
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
          {questions[0].Questions[whichQuestion].action === "Address" ?
            <div>
              <Item elevation={0}><h3>Provide Contact Information</h3></Item>
              <Autocomplete
                apiKey={'AIzaSyBlaLkYq-YAJECTBOoiW8qzfLB25T2H0TQ'}
                options={{
                  types: ["address"],
                  componentRestrictions: { country: "us" },
                }}
                onPlaceSelected={(place) => {
                  console.log(place);
                }}
              />
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
          }
        </div>
      }
    </div>
  );
}

export default App;