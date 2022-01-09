import { useState, useEffect, forwardRef } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, FormGroup, FormControlLabel, Grid, Snackbar, Alert as MuiAlert, Switch, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Paper, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Task as TaskIcon } from '@mui/icons-material';

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
  padding: theme.spacing(0.5),
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

const listRepairsx = (repairs) => {
  let theList = []
  for (const property in repairs) {
    console.log(Object.keys(property))
    if (repairs[property]) { theList.push(property) }
  }
  console.log(theList)
  return (theList)
}

const listRepairs = (repairs) => {
  let theList = []
  theList = repairs.filter((obj) => { return obj.set })
  console.log(theList)
  return (theList)
}

const isCity = (googleAddrObj, zipCodeObj) => {
  if (googleAddrObj.hasOwnProperty('address_components')) {
    console.log(googleAddrObj, zipCodeObj)
    var result = googleAddrObj.address_components.filter(obj => obj.types[0] === "postal_code")
    console.log(result)
    console.log(zipCodeObj)
    var zipInfo = zipCodeObj.ZipCodes.filter(obj => obj.ZIP === result[0].long_name)
    console.log(zipInfo)
    return (zipInfo.length === 0 ? 'no' : zipInfo[0].CityOfTucson)
  } else {
    return (null)
  }
}

function App(props) {
  const matches = useMediaQuery('(min-width:600px)');
  const [hasAlert, setHasAlert] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(
    {
      "Emergency": false,
      "OwnHome": false,
      "MfgHome": false,
      "OwnLot": false,
      "County": false,
      "Income": false,
      "Addr": false,
      "City": false,
      "Vet": false,
      "Over55": false,
      "Contact": false,
      "HomeIns" : false
    }
  );
  const [repairs, setRepairs] = useState(
    [
      {
        "Electric": {
          "en": "Electric",
          "es": "Eléctrico"
        }, "set": false
      },
      {
        "Stucco": {
          "en": "Exterior Stucco/Siding",
          "es": "Estuco exterior / revestimiento"
        }, "set": false
      },
      {
        "Paint": {
          "en": "Exterior Paint",
          "es": "Pintura exterior"
        }, "set": false
      },
      {
        "Fence": {
          "en": "Fence",
          "es": "Valla"
        }, "set": false
      },
      {
        "Floor": {
          "en": "Flooring",
          "es": "Piso"
        }, "set": false
      },
      {
        "Interior": {
          "en": "Interior Wall/Ceiling",
          "es": "Pared interior / techo"
        }, "set": false
      },
      {
        "HeatCool": {
          "en": "Heating and Cooling",
          "es": "Calefacción y Refrigeración"
        }, "set": false
      },
      {
        "HotWater": {
          "en": "Hot Water",
          "es": "Agua caliente"
        }, "set": false
      },
      {
        "Plumbing": {
          "en": "Plumbing",
          "es": "Plomería"
        }, "set": false
      },
      {
        "Ramp": {
          "en": "Ramp",
          "es": "Rampa"
        }, "set": false
      },
      {
        "Roof": {
          "en": "Roof",
          "es": "Techo"
        }, "set": false
      },
      {
        "Windows": {
          "en": "Windows",
          "es": "Ventanas"
        }, "set": false
      },
      {
        "Yard": {
          "en": "Yard Work",
          "es": "Trabajar en el jardín"
        }, "set": false
      }
    ]
  );

  const [zipCodes, setZipCodes] = useState([]);
  const [language, setLanguage] = useState(props.language);
  const [yesTranslate, setYesTranslate] = useState(language === 'en' ? "yes" : "sí")
  const [rejectMsg, setRejectMsg] = useState(null)
  const [addressInfo, setAddressInfo] = useState({})
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
  const handleRepairSel = ({ event, repairList, thisRepair }) => {
    console.log(event, repairList, thisRepair)
    let newRepairs = repairList.map(item => Object.keys(item)[0] === thisRepair ? ({ ...item, set: !item.set }) : item)
    console.log(newRepairs)
    //    newRepairs[event.target.name].set = !newRepairs[event.target.name].set
    /* Use spread operator to make sure React detects the new state */
    setRepairs(newRepairs)
  }
  const handleRepairDone = (event) => {
    console.log(event, repairs)
    let selectedRepairs = listRepairs(repairs)
    if (selectedRepairs.length === 0) {
      console.log('setHasAlert')
      setHasAlert(language === 'en' ? 'You must select one or more repairs!' : '¡Debe seleccionar una o más reparaciones!')
    } else {
      //      answers[whichQuestion] = "yes"
      //      setAnswers(answers)
      //      saveAnswer("yes")
    }
  }
  const handleAnswer = ({ event, ansKey, reject, rejectMsg, yesAction, noAction }) => {
    console.log(event.target.value, ansKey)
    let newAnswers = answers
    newAnswers[ansKey] = event.target.value
    if (newAnswers[ansKey] === "no") { noAction && noAction() } else { yesAction && yesAction() }
    console.log(answers)
    //    answers[whichQuestion] = event.target.value
    setAnswers({ ...newAnswers })
    if (reject.indexOf(event.target.value) > -1) {
      console.log(rejectMsg)
      setRejectMsg(rejectMsg)
    }
    //    saveAnswer(event.target.value)
  }

  const handleMailError = ({ e }) => {
    console.log(e)
  }
  const updateAnswer = ({ ansKey, ansValue }) => {
    let newAnswers = answers
    newAnswers[ansKey] = ansValue
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setHasAlert(null);
  };

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
    const getQuestions = async () => {
      await MongoAPI({ method: 'max', db: 'HomeRepairApp', collection: 'Questions', find: "Version", limit: 1 }, setQuestions)
      await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'ZipCodes', find: { "_id": 0 } }, setZipCodes)
    }
    getQuestions()
    console.log(zipCodes)
  }, [])

  useEffect(() => {
    console.log(rejectMsg)
  }, [rejectMsg])

  useEffect(() => {
    console.log(zipCodes)
    Object.keys(addressInfo).length !== 0 &&
      setCityCheck(isCity(addressInfo, zipCodes[0]))
    updateAnswer({ ansKey: "City", ansValue: isCity(addressInfo, zipCodes[0]) })
  }, [addressInfo])

  return (
    <div>
      {(questions.length === 0 && zipCodes.length) ? <CircularProgress /> :
        <div>
          <SelLanguage language={language} onChange={handleChange} matches={matches} />
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
                console.log(selected.hasOwnProperty('name'))
                if (selected.hasOwnProperty('name')) {
                  setHasAlert(language === 'en' ? 'Please reenter the address and select it from the list!' : '¡Vuelva a ingresar la dirección y selecciónela de la lista!')
                } else {
                  setHasAlert(null);
                  setCountyCheck(isCounty(selected))
                  setCountyYesNo(isCounty(selected))
                  updateAnswer({ ansKey: "County", ansValue: isCounty(selected) })
                }
                setAddressInfo(selected)
              }}
            />
          </div>
          {addressInfo.hasOwnProperty('address_components') && !rejectMsg &&
            <>
              <Item elevation={0}><h3>{language === 'en' ? 'Please answer the questions:' : 'Por favor responda las preguntas:'}</h3></Item>
              {countyCheck === "no" &&
                <Questionx
                  question={{ en: "Do you live in Pima County?", es: "¿Vives en el condado de Pima?" }}
                  language={language}
                  translate={yesTranslate}
                  ansKey="County"
                  onChange={handleAnswer}
                  matches={matches}
                  value={answers["County"]}
                  yesAction={() => setCountyYesNo("yes")}
                  reject={["no"]}
                  rejectMsg={{
                    en: "The home must be in Pima County.",
                    es: "La casa debe estar en el condado de Pima."
                  }}
                />
              }
              {cityCheck === "P" &&
                <Questionx
                  question={{
                    en: "Is your home within the city limits of Tucson?",
                    es: "¿Está su casa dentro de los límites de la ciudad de Tucson?"
                  }}
                  language={language}
                  translate={yesTranslate}
                  ansKey="City"
                  onChange={handleAnswer}
                  matches={matches}
                  value={answers["City"]}
                  yesAction={() => setCityYesNo("yes")}
                  noAction={() => setCityYesNo("no")}
                  reject={[]}
                  rejectMsg={{}}
                />
              }
              {countyYesNo === "yes" &&
                <>
                  <Questionx
                    question={{ en: "Is this an emergency repair?", es: "¿Es esta una reparación de emergencia?" }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="Emergency"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["Emergency"]}
                    reject={["yes", "sí"]}
                    rejectMsg={{
                      en: "The Home Repair Program is not for emergency repairs.",
                      es: "El programa de reparación de viviendas no es para reparaciones de emergencia."
                    }}
                  />
                  <Questionx
                    question={{ en: "Do you own the home and is it your primary residence?", es: "¿Eres dueño de la casa y es tu residencia principal?" }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="OwnHome"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["OwnHome"]}
                    reject={["no"]}
                    rejectMsg={{
                      en: "You must own the home and it must be your primary residence.",
                      es: "Debe ser propietario de la casa y debe ser su residencia principal."
                    }}
                  />
                  <Questionx
                    question={{ en: "Is your home a manufactured or mobile home?", es: "¿Es su casa una casa prefabricada o móvil?" }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="MfgHome"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["MfgHome"]}
                    reject={[]}
                    rejectMsg={{}}
                  />
                  {(["yes", "sí"].indexOf(answers["MfgHome"]) > -1) &&
                    <Questionx
                      question={{
                        en: "Do you own the lot and is your home permanently attached to the ground?",
                        es: "¿Es usted el propietario del lote y su casa está pegada al suelo de forma permanente?"
                      }}
                      language={language}
                      translate={yesTranslate}
                      ansKey="OwnLot"
                      onChange={handleAnswer}
                      matches={matches}
                      value={answers["OwnLot"]}
                      reject={["no"]}
                      rejectMsg={{
                        en: "You must own the lot and it must be permanently attached to the ground.",
                        es: "Debe ser propietario del lote y debe estar permanentemente unido al suelo."
                      }}
                    />
                  }
                  <Questionx
                    question={{ en: "Do you have Homeowners Insurance?", es: "¿Tiene seguro de propietario de vivienda?" }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="HomeIns"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["HomeIns"]}
                    reject={["no"]}
                    rejectMsg={{
                      en: "You must have a Homeowners Insurance Policy.",
                      es: "Debe tener una póliza de seguro para propietarios de viviendas."
                    }}
                  />
                  <Contact
                    contactName={contactName}
                    setContactName={setContactName}
                    contactPhone={contactPhone}
                    setContactPhone={setContactPhone}
                    contactEmail={contactEmail}
                    setContactEmail={setContactEmail}                                        
                    error={contactErrors}
                  />

                  <Questionx
                    question={{
                      en: "Are you or your spouse a United States Veteran?",
                      es: "¿Es usted o su cónyuge un veterano de los Estados Unidos?"
                    }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="Vet"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["Vet"]}
                    reject={[]}
                    rejectMsg={{}}
                  />
                  <Questionx
                    question={{
                      en: "Are you or your spouse over 55 years of age?",
                      es: "¿Usted o su cónyuge son mayores de 55 años?"
                    }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="Over55"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["Over55"]}
                    reject={[]}
                    rejectMsg={{}}
                  />
                  <Questionx
                    question={{
                      en: "Based on the income chart, is your income less than the Maximum Income for your Family Size?",
                      es: "Según la tabla de ingresos, ¿sus ingresos son menores que el ingreso máximo para el tamaño de su familia?"
                    }}
                    language={language}
                    translate={yesTranslate}
                    ansKey="Income"
                    onChange={handleAnswer}
                    matches={matches}
                    value={answers["Income"]}
                    reject={["no"]}
                    rejectMsg={{
                      en: "The combined family income must be less than the Maximum Income for your size of family.",
                      es: "El ingreso familiar combinado debe ser menor que el ingreso máximo para el tamaño de su familia."
                    }}
                  />
                  <Incomex language={language} matches={matches} income={questions[0].Income}
                    subHeader={questions[0].IncomeDesc[language]}
                  />
                  <RepairList repairList={repairs} language={language} onChange={handleRepairSel} onClick={handleRepairDone} matches={matches} />

                  <Result />
                </>
              }
            </>
          }
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
          <Snackbar open={hasAlert !== null} autoHideDuration={7000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
              {hasAlert}
            </Alert>
          </Snackbar>
        </div>
      }
    </div>
  )
}
export default App;

const Questionx = ({ question, language, translate, onChange, ansKey, value, matches, reject, rejectMsg, yesAction, noAction }) => {
  console.debug(question, ansKey, yesAction, noAction)
  return (
    <div>
      <Stack direction="row" spacing={2} >
        <Item elevation={0}>
          <ToggleButtonGroup
            orientation={matches ? "horizontal" : "vertical"}
            color="primary"
            value={value}
            exclusive
            onChange={(e) => onChange({ event: e, ansKey: ansKey, reject: reject, rejectMsg: rejectMsg, yesAction: yesAction, noAction: noAction })}
          >
            <ToggleButton value={`${translate}`}>{translate}</ToggleButton>
            <ToggleButton value="no">no</ToggleButton>
          </ToggleButtonGroup>
        </Item>
        <Item>
          <h3>{question[language]}</h3>
        </Item>
      </Stack>
    </div>
  )
}

const Incomex = ({ language, income, subHeader, matches }) => {
  return (
    <Stack direction="column" spacing={0} >
      <Item elevation={0}><h3>{subHeader}</h3></Item>
      <Item>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 150 }, { maxWidth: 400 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "50%" }} size="small" align="center">{language === 'en' ? 'Family Size' : 'Tamaño de la familia'}</TableCell>
                <TableCell style={{ width: "50%" }} size="small" align="center">{language === 'en' ? 'Maximum Income' : 'Renta máxima'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {income.map((row, i) => (
                <TableRow
                  key={i}
                  hover={true}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell size="small" align="center">{row.size}</TableCell>
                  <TableCell size="small" align="center">{row.maxIncome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Item>
    </Stack>
  )
}

const Contact = ({ contactCard, contactName, setContactName, contactPhone, setContactPhone, contactEmail, setContactEmail, error }) => {
  console.log(contactCard, error)
  return (
    <>
      <form >
        <TextField
          id="outlined-basic"
          placeholder="Enter your name"
          label="Name"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          error={error.name}
          required
          type="text"
        />
        <TextField
          id="outlined-basic"
          placeholder="Enter phone number"
          label="Phone"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          error={error.phone}
          required
          type="tel"
        />
        <TextField
          id="outlined-basic"
          placeholder="Enter phone number"
          label="Alt Phone"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          error={error.phone}
          required
          type="tel"
        />        
        <TextField
          id="outlined-basic"
          label="Email"
          placeholder="Enter email address"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={error.mail}
          required
          type="email"
        />
        <TextField
          id="outlined-basic"
          label="Sex"
          placeholder="Enter sex"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={error.mail}
          required
          type="email"
        />        
        <TextField
          id="outlined-basic"
          label="Marital Status"
          placeholder="Enter Marital Status"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={error.mail}
          required
          type="email"
        />      
        <TextField
          id="outlined-basic"
          label="Military"
          placeholder="Enter Military"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={error.mail}
          required
          type="email"
        />     
        <TextField
          id="outlined-basic"
          label="Hear about us"
          placeholder="Enter Military"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={error.mail}
          required
          type="email"
        />      
        <TextField
          id="outlined-basic"
          label="Others in Household"
          placeholder="Enter Military"
          variant="outlined"
          inputProps={{ 'data-lpignore': 'true' }}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          error={error.mail}
          required
          type="email"
        />                     
      </form>



    </>
  )
}


const Result = () => {
  return (
    <div></div>
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

const RepairList = ({ repairList, onChange, onClick, language, matches }) => {
  console.log(onChange)
  console.log(repairList)
  //  repairList.map((item, i) => { console.log(item,Object.keys(item)[0],i) })
  return (
    <div>
      <Button variant="contained" color="primary" onClick={onClick} endIcon={<TaskIcon />} sx={matches ? { marginLeft: '4px' } : {}}>
        {language === 'en' ? 'Select the needed repairs -> Click when Done' : 'Seleccione las reparaciones necesarias -> Haga clic cuando esté listo'}
      </Button>
      <FormGroup>
        <Grid container rowSpacing={1} columnSpacing={1} sx={{ paddingLeft: '8px' }}>
          {repairList.map((item, i) => {
            return (
              <Grid key={i} item xs={12} sm={4} md={4} lg={4} xl={4} >
                <FormControlLabel key={i} control={
                  <Switch checked={item.set}
                    onChange={(e) => onChange({ event: e, repairList: repairList, thisRepair: Object.keys(item)[0] })}
                    name={Object.keys(item)[0]} />

                }
                  label={item[Object.keys(item)[0]][language]}
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