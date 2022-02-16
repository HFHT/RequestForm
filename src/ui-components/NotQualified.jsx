import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { titles, constants } from '../services/Titles'

export default function NotQualified({ open, language, msg, handleClose, proceed, handleProceed }) {
    console.log(proceed)
    const [selection, setSelection] = useState('')
    const handleClick = ((theSelection) => {
        console.log(theSelection)
        setSelection(theSelection)
        theSelection === 'otherLink' ?
            window.open(constants.OTHERLINK, "_self")
            :
            handleProceed()
    })
    return (<>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {msg === null ? "" : msg[language]}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {proceed ?
                        titles(language, 'HR_NOTEMERGENCY')
                        :
                        titles(language, 'HR_NOTQUALIFIED')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ToggleButtonGroup
                    color="info"
                    value={selection === '' ? (proceed ? 'emergency' : 'otherLink') : 'otherLink'}
                    exclusive
                    orientation='vertical'
                >
                    {proceed &&
                        <ToggleButton value='emergency' onClick={() => handleClick('emergency')}>
                            {titles(language, 'AP_EMERGENCY')}
                        </ToggleButton>
                    }
                    <ToggleButton value='otherLink' onClick={() => handleClick('otherLink')}>
                        {titles(language, 'HR_OTHERLINK')}
                    </ToggleButton>
                </ToggleButtonGroup>
            </DialogActions>
        </Dialog>

    </>
    )
}
