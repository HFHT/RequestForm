import { useState, useEffect } from 'react';
import { ToggleButtonGroup, ToggleButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { titles } from '../services/Titles'

// Check to see if all selected repairs are part of the program
// Need to convert selected repairs from array of objects to array, then do an array comparison
const checkRepairs = (selected, allowed) => {
    let theseRepairs = selected.map((r) => {
        return Object.keys(r)[0]
    })
    return checker(theseRepairs, allowed)
}

// Check to insure that all selected repairs are in the allowed array
const checker = (selected, allowed) => selected.every(s => {
    return allowed.includes(s)
});

export default function ResultPanel({ language, programList, programs, answers, selectedRepairs, matches, setter }) {
    const [matchPrograms, setMatchPrograms] = useState(null)
    const [alignment, setAlignment] = useState('yes')
    const handleChange = ((e, newAlignment) => {
        setAlignment(newAlignment)
        setter(newAlignment)
    })

    // Determine which repair programs the applicant is eligible for
    useEffect(() => {
        let filterPrograms = programList.filter((p) => {
            if (p.Active) {
                if (p.hasOwnProperty('Repair') && !checkRepairs(selectedRepairs, p.Repair)) {
                    return false
                }
                if (p.hasOwnProperty('ck')) {
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
        <>
            {matchPrograms && programs && programs.hasOwnProperty('Programs') &&
                <>
                    {(matchPrograms.length < 1) ? <NotQualified /> :
                        <>
                            <h2>{titles(language, 'HR_ELIGIBLE')}</h2>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 300, maxWidth: 500 }} aria-label="Available Repair Programs">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b><i>{titles(language, 'HR_PROGRAM')}</i></b></TableCell>
                                            <TableCell align="right"><b><i>{titles(language, 'HR_WAITLIST')}</i></b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {matchPrograms.map((p, i) => (
                                            <TableRow
                                                key={i}
                                                hover={true}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                {p.Funding && <TableCell>{p.r[language]}</TableCell>}
                                                {!p.Funding && <TableCell>{p.r[language]}<br /><b><i>{p.f[language]}</i></b></TableCell>}
                                                <TableCell align="right">{programs.Programs[p.Program]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <ToggleButtonGroup
                                color="info"
                                value={alignment}
                                exclusive
                                onChange={handleChange}
                            >
                                <ToggleButton value="yes">{titles(language, 'HR_PROCEED')}</ToggleButton>
                                <ToggleButton value="no">{titles(language, 'HR_CANCEL')}</ToggleButton>
                            </ToggleButtonGroup>

                        </>}
                </>
            }
        </>
    )
}

const NotQualified = (props) => {
    return (
        <h2>Habitat Tucson currently has no repair programs that satisfy your needs.</h2>
    )
}
