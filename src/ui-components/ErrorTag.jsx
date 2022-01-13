import { forwardRef } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ErrorTag({ hasAlert, setHasAlert }) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setHasAlert(null);
    };
    return (
        <>
            <Snackbar open={hasAlert !== null} autoHideDuration={7000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    {hasAlert}
                </Alert>
            </Snackbar>
        </>
    )

}