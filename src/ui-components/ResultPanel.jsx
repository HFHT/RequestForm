import { useState, useEffect, forwardRef } from 'react';
import { TextField } from '@mui/material'
import { Task as TaskIcon } from '@mui/icons-material';

export default function ResultPanel(props) {
    const [contactName, setContactName] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [contactErrors, setContactErrors] = useState({
        name: false,
        phone: false,
        email: false
      })    
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