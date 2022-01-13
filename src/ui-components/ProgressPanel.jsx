import { useState, useEffect, forwardRef } from 'react';
import { TextField } from '@mui/material'
import {  Check as CheckIcon, Cancel as CancelIcon, NotInterested as NotInterestedIcon } from '@mui/icons-material';

export default function ProgressPanel({answers, setAnswers, language}) {

    return(
    <>
        {answers.County && <h3>Resident</h3>}
        {!answers.Emergency && <h3>Emergency</h3>}
    </>
    )
}