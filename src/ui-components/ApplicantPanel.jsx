import { useState, useEffect, forwardRef } from 'react';
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'

export default function ApplicantPanel(props, setter) {
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
        email: false
    })
    const error = {}
    const handleChange = (event, newAlignment) => {
        setGender(newAlignment);
    };

    return (
        <div>
            <form >
                <TextField
                    id="outlined-basic"
                    placeholder="Your name"
                    label="Name"
                    variant="outlined"
                    inputProps={{ 'data-lpignore': 'true' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error.name}
                    required
                    type="text"
                />
                <TextField
                    id="outlined-basic"
                    placeholder="Phone number"
                    label="Phone"
                    variant="outlined"
                    inputProps={{ 'data-lpignore': 'true' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={error.phone}
                    required
                    type="tel"
                />
                <TextField
                    id="outlined-basic"
                    placeholder="Alternate phone number"
                    label="Alternate Phone"
                    variant="outlined"
                    inputProps={{ 'data-lpignore': 'true' }}
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    error={error.phone}
                    required
                    type="tel"
                />
                <TextField
                    id="outlined-basic"
                    label="Email"
                    placeholder="Email address"
                    variant="outlined"
                    inputProps={{ 'data-lpignore': 'true' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error.mail}
                    required
                    type="email"
                />
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        label="Gender"
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <MenuItem value={''}>&nbsp;</MenuItem>
                        <MenuItem value={'female'}>Female</MenuItem>
                        <MenuItem value={'male'}>Male</MenuItem>
                        <MenuItem value={'na'}>Rather not say</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Marital Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={maritalStatus}
                        label="Marital Status"
                        onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                        <MenuItem value={''}>&nbsp;</MenuItem>
                        <MenuItem value={'Married'}>Married</MenuItem>
                        <MenuItem value={'Single'}>Single</MenuItem>
                        <MenuItem value={'Divorced'}>Divorced</MenuItem>
                        <MenuItem value={'Seperated'}>Seperated</MenuItem>
                        <MenuItem value={'Widowed'}>Widowed</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Military Service</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={militaryBranch}
                        label="Military Service"
                        multiple
                        onChange={(e) => setMilitaryBranch(e.target.value)}
                    >
                        <MenuItem value={''}>&nbsp;</MenuItem>
                        <MenuItem value={'Army'}>Army</MenuItem>
                        <MenuItem value={'Marine'}>Marine</MenuItem>
                        <MenuItem value={'Navy'}>Navy</MenuItem>
                        <MenuItem value={'AirForce'}>Air Force</MenuItem>
                        <MenuItem value={'SpaceForce'}>Space Force</MenuItem>
                        <MenuItem value={'CoastGuard'}>Coast Guard</MenuItem>
                        <MenuItem value={'NationalGuard'}>National Guard</MenuItem>
                        <MenuItem value={'Unkown'}>Unkown</MenuItem>
                    </Select>
                </FormControl>



                <TextField
                    id="outlined-basic"
                    label="Service Dates"
                    placeholder="for example: 1972-1976"
                    variant="outlined"
                    inputProps={{ 'data-lpignore': 'true' }}
                    value={militaryService}
                    onChange={(e) => setMilitaryService(e.target.value)}
                    error={error.mail}
                    required
                    type="text"
                />
                <TextField
                    id="outlined-basic"
                    label="Year of Birth"
                    placeholder="Year of Birth"
                    variant="outlined"
                    inputProps={{ 'data-lpignore': 'true' }}
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    error={error.mail}
                    required
                    type="number"
                    inputProps={{ min: "1900", max: "2000" }}
                />
            </form>

        </div>
    )
}

