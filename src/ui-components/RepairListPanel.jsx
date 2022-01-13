import { useState } from 'react';
import { Button, FormGroup, Grid, FormControlLabel, Switch } from '@mui/material'
import { Task as TaskIcon } from '@mui/icons-material';
import ErrorTag from './ErrorTag';

const listRepairs = (repairs) => {
    let theList = []
    theList = repairs.filter((obj) => { return obj.set })
    return (theList)
}

export default function RepairListPanel({ repairs, setRepairs, repairsDone, language, matches }) {
    const [hasAlert, setHasAlert] = useState(null);

    const handleRepairSel = ({ event, repairs, thisRepair }) => {
        console.log(event, repairs, thisRepair)
        let newRepairs = repairs.map(item => Object.keys(item)[0] === thisRepair ? ({ ...item, set: !item.set }) : item)
        console.log(newRepairs)
        setRepairs(newRepairs)
    }
    const handleRepairDone = (event) => {
        console.log(event, repairs)
        let selectedRepairs = listRepairs(repairs)
        if (selectedRepairs.length === 0) {
            console.log('setHasAlert')
            setHasAlert(language === 'en' ? 'You must select one or more repairs!' : '¡Debe seleccionar una o más reparaciones!')
        } else {
            repairsDone(selectedRepairs)
        }
    }
    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleRepairDone} endIcon={<TaskIcon />} sx={matches ? { marginLeft: '4px' } : {}}>
                {language === 'en' ? 'Select the needed repairs -> Click when Done' : 'Seleccione las reparaciones necesarias -> Haga clic cuando esté listo'}
            </Button>
            <FormGroup>
                <Grid container rowSpacing={1} columnSpacing={1} sx={{ paddingLeft: '8px' }}>
                    {repairs.map((item, i) => {
                        return (
                            <Grid key={i} item xs={12} sm={4} md={4} lg={4} xl={4} >
                                <FormControlLabel key={i} control={
                                    <Switch checked={item.set}
                                        onChange={(e) => handleRepairSel({ event: e, repairs: repairs, thisRepair: Object.keys(item)[0] })}
                                        name={Object.keys(item)[0]} />

                                }
                                    label={item[Object.keys(item)[0]][language]}
                                />
                            </Grid>
                        )
                    }
                    )}
                </Grid>
            </FormGroup>
            <ErrorTag hasAlert={hasAlert} setHasAlert={setHasAlert}/>
        </div>
    )
}