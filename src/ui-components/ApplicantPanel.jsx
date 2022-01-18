import { useState, useEffect, forwardRef } from 'react';
import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material';
import { Box } from '@mui/system';
import { titles } from '../services/Titles'

export default function ApplicantPanel({ language, matches, setter }) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [altPhone, setAltPhone] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [birthYear, setBirthYear] = useState('')
    const [maritalStatus, setMaritalStatus] = useState('')
    const [militaryBranch, setMilitaryBranch] = useState([])
    const [militaryService, setMilitaryService] = useState('')

    const [contactErrors, setContactErrors] = useState({
        name: false,
        phone: false,
        altphone: false,
        email: false,
        msDates: false,
        birth: false
    })
    const error = {}
    const handleChange = (event, newAlignment) => {
        setGender(newAlignment);
    };
    const handleSubmit = (event) => {
        console.log(event)
    };

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
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={error.name}
                        required
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={error.phone}
                        required
                        type="tel"
                    />
                    <TextField
                        id="altphone"
                        placeholder={titles(language, 'CA_ALTPHONENUMBER')}
                        label={titles(language, 'CA_ALTPHONE')}
                        variant="filled"
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        error={error.altphone}
                        type="tel"
                        sx={{ paddingLeft: 1}}
                    />
                </Box>
                <Box sx={{ padding: 0.5 }}>
                    <TextField
                        id="email"
                        label={titles(language, 'CA_EMAIL')}
                        placeholder={titles(language, 'CA_EMAILADDR')}
                        variant="filled"
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error.email}
                        required
                        inputProps={{ size: 46 }}
                        type="email"
                    />
                </Box>
                <Box sx={{ paddingTop: 0.5 }}>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="gender-select-label">{titles(language, 'CA_GENDER')}</InputLabel>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            value={gender}
                            label={titles(language, 'CA_GENDER')}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <MenuItem value={'female'}>{titles(language, 'CA_GENFEMALE')}</MenuItem>
                            <MenuItem value={'male'}>{titles(language, 'CA_GENMALE')}</MenuItem>
                            <MenuItem value={'na'}>{titles(language, 'CA_GENNA')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="marital-select-label">{titles(language, 'CA_MARITAL')}</InputLabel>
                        <Select
                            labelId="marital-select-label"
                            id="marital-select"
                            value={maritalStatus}
                            label={titles(language, 'CA_MARITAL')}
                            onChange={(e) => setMaritalStatus(e.target.value)}
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
                            value={militaryBranch}
                            label={titles(language, 'CA_MILBRANCH')}
                            multiple
                            onChange={(e) => setMilitaryBranch(e.target.value)}
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
                        value={militaryService}
                        onChange={(e) => setMilitaryService(e.target.value)}
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
                        inputProps={{ 'data-lpignore': 'true' }}
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        error={error.birth}
                        type="number"
                        inputProps={{ min: "1900", max: "2000" }}
                    />
                </Box>
            </form>

        </div>
    )
}

