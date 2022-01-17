import { useState, useEffect, forwardRef } from 'react';
import { TextField } from '@mui/material'
import { Task as TaskIcon } from '@mui/icons-material';

// Check to see if all selected repairs are part of the program
// Need to convert selected repairs from array of objects to array, then do an array comparison
const checkRepairs = (selected, allowed) => {
    let theseRepairs = selected.map((r) => {
        return Object.keys(r)[0]
    })
    console.log(theseRepairs, allowed)
    return checker(theseRepairs, allowed)
}

// Check to insure that all selected repairs are in the allowed array
const checker = (selected, allowed) => selected.every(s => {
    return allowed.includes(s)
});

export default function ResultPanel({ language, programList, programs, answers, selectedRepairs, setter }) {
    console.log(programList, programs, answers, selectedRepairs)
    const [matchPrograms, setMatchPrograms] = useState(null)
    const [contactName, setContactName] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [contactErrors, setContactErrors] = useState({
        name: false,
        phone: false,
        email: false
    })

    const repairs = [{ Program: "ABWK", "Active": true }, { Program: "AIP", "Active": true }]
    // Determine which repair programs the applicant is eligible for
    useEffect(() => {
        let filterPrograms = programList.filter((p) => {
            console.log(p)
            if (p.Active) {
                if (p.hasOwnProperty('Repair') && !checkRepairs(selectedRepairs, p.Repair)) {
                    return false
                }
                if (p.hasOwnProperty('ck')) {
                    console.log(p.ck)
                    // need to handle spanish!!!!
                    return (answers[p.ck.ans] === p.ck.val)
                }
                return true
            } else {
                return false
            }
        })
        setMatchPrograms(filterPrograms)
    }, [])

    return (
        <><h1>ResultPanel</h1>
            <Contact
                contactName={contactName}
                setContactName={setContactName}
                contactPhone={contactPhone}
                setContactPhone={setContactPhone}
                contactEmail={contactEmail}
                setContactEmail={setContactEmail}
                error={contactErrors}
            />
        </>
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