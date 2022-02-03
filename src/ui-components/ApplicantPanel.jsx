import { useState, useEffect } from 'react';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material';
import { Box } from '@mui/system';
import { titles } from '../services/Titles'
import { MongoSetterAPI } from '../services/MongoDBAPI'
import OthersGrid from './OthersGrid';

// Helper function to check and set the error state for empty required fields
const required = (reqFields) => {
    if (reqFields.length < 1) { return null }
    let errorObj = {}
    reqFields.forEach(rObj => {
        let rKey = Object.keys(rObj)
        errorObj[rKey[0]] = rObj[rKey[0]] === ''
    });
    return errorObj
}

const validEmail = (emailAddr) => {
    let emailUser = emailAddr.substring(0, emailAddr.indexOf('@'))
    let emailDomain = emailAddr.substring(emailAddr.indexOf('@') + 1)
    let emailOrg = emailDomain.substring(emailDomain.indexOf('.') + 1)
    //    console.log(emailUser.length, emailDomain.length, emailOrg.length)
    return (emailUser.length === 0 || emailDomain.length === 0 || emailOrg.length === 0)
}

const validName = (thisName) => {
    let firstName = thisName.substring(0, thisName.indexOf(' '))
    let lastName = thisName.substring(thisName.indexOf(' ') + 1)
    return (firstName.length === 0 || lastName.length === 0)
}

const validPhone = (phone, altPhone) => {
    return ({ phone: phone.length !== 13, altPhone: (altPhone.length !== 0 && altPhone.length !== 13) })
}

const validOthers = (others) => {
    return (others[0].name === '' && (others[0].age === '' || others[0].relation === ''))
}

const validKeys = ['(', ')', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '']

export default function ApplicantPanel({ language, matches, setter }) {
    const [applicant, setApplicant] = useState({
        name: '',
        phone: '',
        altPhone: '',
        email: '',
        gender: '',
        birthYear: '',
        maritalStatus: '',
        militaryBranch: [],
        militaryService: '',
        others: [{ name: '', age: '', relation: '' }],
        lot: '',
        repairs: ''
    })
    const [formOk, setFormOk] = useState(false)
    const [error, setError] = useState({})
    const [saveResult, setSaveResult] = useState(null)

    const handleSubmit = (e) => {     
        //First time through the error object will not have any keys, so don't submit.
        formOk && Object.keys(error).length > 0 && setter(applicant)
        //Handle the case where a user tries to submit the form when it first appears.
        checkForm()
    };

    const handleOther = ({ key, prop, value, addNew = false }) => {
        console.log(key, prop, value, validKeys.includes(value.slice(-1)))
        if (prop === 'age' && !validKeys.includes(value.slice(-1))) { return }
        if (prop === 'age' && value.length > 3) { return }
        // Grab the object
        let thisOthers = applicant.others
        console.log(thisOthers)
        // Update the value of the property
        thisOthers[key][prop] = value
        console.log(thisOthers)
        // Add a new row if the last array element name and either age or relation is not blank
        const lastOthers = thisOthers[thisOthers.length - 1]
        lastOthers.name !== '' && (lastOthers.age !== '' || lastOthers.relation !== '') && thisOthers.push({ name: '', age: '', relation: '' })
        // Update state
        setApplicant(appl => ({
            ...appl,
            ...{others: thisOthers}
        }))
    };
    const handlePhone = (phoneKey, phoneValue) => {
        if (phoneValue && !validKeys.includes(phoneValue.slice(-1))) { return }
        if (phoneValue.slice(-1) === '(' && phoneValue.length !== 1) { return }
        if (phoneValue.slice(-1) === ')' && phoneValue.length !== 5) { return }
        if (phoneValue.slice(-1) === '-' && phoneValue.length !== 9) { return }
        if (phoneValue.length > 16) { return }
        let onlyNumber = phoneValue.replace(/\D/g, '')
        let areaCode = onlyNumber.substring(0, 3)
        let centlOfc = onlyNumber.substring(3, 6)
        let subscriber = onlyNumber.substring(6, 10)
        let formattedNumber = ''
        if (onlyNumber.length > 6 || phoneValue.slice(-1) === '-') {
            formattedNumber = `(${areaCode})${centlOfc}-${subscriber}`
        } else {
            if (onlyNumber.length > 3 || phoneValue.slice(-1) === ')') {
                formattedNumber = `(${areaCode})${centlOfc}`
            } else {
                if (onlyNumber.length > 0 || phoneValue.slice(-1) === '(') {
                    formattedNumber = `(${areaCode}`
                }
            }
        }
        setApplicant(appl => ({
            ...appl,
            ...{ [phoneKey]: formattedNumber }
        }))
    }

    const checkForm = () => {
        setError(required([{ gender: applicant.gender }, { maritalStatus: applicant.maritalStatus }, { repairs: applicant.repairs }]))
        setError(err => ({
            ...err,
            ...{ email: validEmail(applicant.email) }
        }))
        setError(err => ({
            ...err,
            ...{ name: validName(applicant.name) }
        }))
        setError(err => ({
            ...err,
            ...validPhone(applicant.phone, applicant.altPhone)
        }))
        setError(err => ({
            ...err,
            ...{ others: validOthers(applicant.others) }
        }))
    }

    useEffect(() => {
        //!!!! Need to add a case for when the database returns a bad reply. Currently any reply is okay :-(
        saveResult && saveResult.hasOwnProperty('acknowledged') &&
            console.log(saveResult)
        if (saveResult && saveResult.hasOwnProperty('acknowledged') && formOk) {
            setter(applicant)
        }
    }, [saveResult])

    useEffect(() => {
        //Continually check the form as the user inputs the data
        checkForm()
    }, [applicant])

    useEffect(() => {
        //Any time the error object changes, set formOk to true when every property is false (no errors)
        error && setFormOk(Object.values(error).every(item => item === false))
    }, [error])

    useEffect(() => {
        setError({})
    }, [])

    return (
        <div>
            <form >
                <Button variant="outlined" color="primary" onClick={handleSubmit} endIcon={<SendIcon />} sx={matches ? { marginLeft: '4px' } : {}}>
                    {titles(language, 'CA_BUTTON')}
                </Button>
                <Box sx={{ padding: 0.5, paddingTop: 1.5 }}>
                    <TextField
                        id="name"
                        placeholder={titles(language, 'CA_YOURNAME')}
                        label={titles(language, 'CA_NAME')}
                        variant="filled"
                        value={applicant.name}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ name: e.target.value }
                        }))}
                        error={error.name}
                        required
                        inputProps={{ size: 46, 'data-lpignore': 'true' }}
                        type="text"
                    />
                </Box>
                <Box sx={{ padding: 0.5 }}>
                    <TextField
                        id="phone"
                        placeholder={titles(language, 'CA_PHONENUMBER')}
                        label={titles(language, 'CA_PHONE')}
                        variant="filled"
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={applicant.phone}
                        onChange={(e) => handlePhone('phone', e.target.value)}
                        error={error.phone}
                        required
                        type="tel"
                        sx={{ paddingRight: 1 }}
                    />
                    <TextField
                        id="altphone"
                        placeholder={titles(language, 'CA_ALTPHONENUMBER')}
                        label={titles(language, 'CA_ALTPHONE')}
                        variant="filled"
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={applicant.altPhone}
                        onChange={(e) => handlePhone('altPhone', e.target.value)}
                        error={error.altPhone}
                        type="tel"
                    />
                </Box>
                <Box sx={{ padding: 0.5 }}>
                    <TextField
                        id="email"
                        label={titles(language, 'CA_EMAIL')}
                        placeholder={titles(language, 'CA_EMAILADDR')}
                        variant="filled"
                        value={applicant.email}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ email: e.target.value }
                        }))}
                        error={error.email}
                        required
                        inputProps={{ size: 46, 'data-lpignore': 'true' }}
                        type="email"
                    />
                </Box>
                <Box sx={{ paddingTop: 0.5 }}>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }} required>
                        <InputLabel id="gender-select-label">{titles(language, 'CA_GENDER')}</InputLabel>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            value={applicant.gender}
                            label={titles(language, 'CA_GENDER')}
                            onChange={(e) => setApplicant(appl => ({
                                ...appl,
                                ...{ gender: e.target.value }
                            }))}
                            error={error.gender}
                        >
                            <MenuItem value={'female'}>{titles(language, 'CA_GENFEMALE')}</MenuItem>
                            <MenuItem value={'male'}>{titles(language, 'CA_GENMALE')}</MenuItem>
                            <MenuItem value={'na'}>{titles(language, 'CA_GENNA')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }} required>
                        <InputLabel id="marital-select-label">{titles(language, 'CA_MARITAL')}</InputLabel>
                        <Select
                            labelId="marital-select-label"
                            id="marital-select"
                            value={applicant.maritalStatus}
                            label={titles(language, 'CA_MARITAL')}
                            onChange={(e) => setApplicant(appl => ({
                                ...appl,
                                ...{ maritalStatus: e.target.value }
                            }))}
                            error={error.maritalStatus}
                        >
                            <MenuItem value={'Married'}>{titles(language, 'CA_MSMARRIED')}</MenuItem>
                            <MenuItem value={'Single'}>{titles(language, 'CA_MSSINGLE')}</MenuItem>
                            <MenuItem value={'Divorced'}>{titles(language, 'CA_MSDIVORCED')}</MenuItem>
                            <MenuItem value={'Seperated'}>{titles(language, 'CA_MSSEPERATED')}</MenuItem>
                            <MenuItem value={'Widowed'}>{titles(language, 'CA_MSWIDOWED')}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ paddingTop: 0.5 }}>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 210 }}>
                        <InputLabel id="military-select-label">{titles(language, 'CA_MILBRANCH')}</InputLabel>
                        <Select
                            labelId="military-select-label"
                            id="military-select"
                            value={applicant.militaryBranch}
                            label={titles(language, 'CA_MILBRANCH')}
                            multiple
                            onChange={(e) => setApplicant(appl => ({
                                ...appl,
                                ...{ militaryBranch: e.target.value }
                            }))}
                        >
                            <MenuItem value={'Army'}>{titles(language, 'CA_MBARMY')}</MenuItem>
                            <MenuItem value={'Marine'}>{titles(language, 'CA_MBMARINE')}</MenuItem>
                            <MenuItem value={'Navy'}>{titles(language, 'CA_MBNAVY')}</MenuItem>
                            <MenuItem value={'AirForce'}>{titles(language, 'CA_MBAIRFORCE')}</MenuItem>
                            <MenuItem value={'SpaceForce'}>{titles(language, 'CA_MBSPACEFORCE')}</MenuItem>
                            <MenuItem value={'CoastGuard'}>{titles(language, 'CA_MBCOASTGUARD')}</MenuItem>
                            <MenuItem value={'NationalGuard'}>{titles(language, 'CA_MBNATIONALGUARD')}</MenuItem>
                            <MenuItem value={'Unknown'}>{titles(language, 'CA_MBUNKNOWN')}</MenuItem>
                        </Select>
                        <FormHelperText>{titles(language, 'CA_MBSELECTALL')}</FormHelperText>
                    </FormControl>
                    <TextField
                        id="service"
                        label={titles(language, 'CA_MSDATES')}
                        helperText={titles(language, 'CA_MSDATESEXAMPLE')}
                        placeholder={titles(language, 'CA_MSDATES')}
                        variant="filled"
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={applicant.militaryService}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ militaryService: e.target.value }
                        }))}
                        error={error.msDates}
                        type="text"
                        sx={{ paddingTop: 1 }}
                    />
                </Box>
                <Box sx={{ padding: 0.5 }}>
                    <TextField
                        id="birth"
                        label={titles(language, 'CA_BIRTHYEAR')}
                        placeholder={titles(language, 'CA_BIRTHYEAR')}
                        variant="filled"
                        value={applicant.birthYear}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ birthYear: e.target.value }
                        }))}
                        error={error.birth}
                        type="number"
                        inputProps={{ min: "1900", max: "2001", 'data-lpignore': 'true' }}
                        sx={{ paddingRight: 1 }}
                    />
                    <TextField
                        id="lotNo"
                        label={titles(language, 'CA_LOT')}
                        helperText={titles(language, 'CA_LOTHELPER')}
                        placeholder={titles(language, 'CA_LOT')}
                        variant="filled"
                        value={applicant.lotNo}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ lotNo: e.target.value }
                        }))}
                        error={error.lotNo}
                        inputProps={{ size: 14, 'data-lpignore': 'true' }}
                        type="text"
                    />
                </Box>
                <Box sx={{ padding: 0.5 }}>
                    <TextField
                        id="repairs"
                        label={titles(language, 'CA_REPAIRS')}
                        placeholder={titles(language, 'CA_REPAIRS')}
                        variant="filled"
                        multiline
                        value={applicant.repairs}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ repairs: e.target.value }
                        }))}
                        error={error.repairs}
                        required
                        inputProps={{ cols: 48, 'data-lpignore': 'true' }}
                        type="text"
                    />
                </Box>
                <Box sx={{ padding: 0.5, width: 'max-content' }}>
                    <OthersGrid
                        id="others"
                        others={applicant.others}
                        setter={handleOther}
                        language={language}
                        label={titles(language, 'CA_OTHERS')}
                        placeholder={titles(language, 'CA_OTHERS')}
                        variant="filled"
                        value={applicant.others}
                        onChange={(e) => setApplicant(appl => ({
                            ...appl,
                            ...{ email: e.target.value }
                        }))}
                        error={error}
                        required
                        inputProps={{ size: 46, 'data-lpignore': 'true' }}
                        type="text"
                    />
                </Box>
            </form>
        </div>
    )
}

