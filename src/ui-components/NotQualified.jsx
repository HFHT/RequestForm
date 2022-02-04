import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, useMediaQuery } from '@mui/material'
import { titles, constants } from '../services/Titles'
import { Item } from './Item';

export default function NotQualified({ open, language, msg, handleClose, proceed, handleProceed }) {
    const [selection, setSelection] = useState(proceed ? 'emergency' : 'otherLink')
    const handleClick = ((e, theSelection) => {
        setSelection(theSelection)
        theSelection === 'emergency' ?
            handleProceed()
            :
            window.open(constants.OTHERLINK, "_self")
    })
    return (<>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {titles(language, 'HR_NOTQUALIFIED')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {msg === null ? "" : msg[language]}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ToggleButtonGroup
                    color="info"
                    value={selection}
                    exclusive
                    orientation='vertical'
                    onChange={handleClick}
                >
                    {proceed && <ToggleButton value='emergency'>{titles(language, 'AP_EMERGENCY')}</ToggleButton>}
                    <ToggleButton value='otherLink'>{titles(language, 'HR_OTHERLINK')}</ToggleButton>
                </ToggleButtonGroup>
            </DialogActions>
        </Dialog>

    </>
    )
}
