import { Grid, Chip } from '@mui/material'
import { Check as CheckIcon, Cancel as CancelIcon, NotInterested as NotInterestedIcon } from '@mui/icons-material';

const isYes = (ans) => {
    return ans === 'yes' || ans === 'sí'
}

export default function ProgressPanel({ answers, yesTranslate, setAnswers, language }) {
    console.log(answers)
    return (
        <div style={{ marginLeft: "4px" }}>
            <Grid container direction="row" spacing="4"
                justifyContent="flex-start"
                alignItems="baseline" >
                {isYes(answers.County) &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Resident' : 'Residente'} size="small" icon={<CheckIcon />} />
                    </Grid>
                }
                {answers.City &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Tucson' : 'Tucson'} size="small" icon={answers.City === "no" ? <NotInterestedIcon /> : <CheckIcon />} />
                    </Grid>
                }
                {answers.Emergency &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Not Emergency' : 'No emergencia'} size="small" icon={<CheckIcon />} />
                    </Grid>
                }
                {answers.OwnHome &&
                    <Grid item >
                        <Chip variant="outlined" color={isYes(answers.OwnHome) ? "success" : "error"} label={language === 'en' ? 'Home Owner' : 'Propietario de casa'} size="small" icon={isYes(answers.OwnHome) ? <CheckIcon /> : <CancelIcon />} />
                    </Grid>
                }
                {answers.MfgHome &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Mfg Home' : 'Casa Fabricada'} size="small" icon={answers.MfgHome === "no" ? <NotInterestedIcon />: <CheckIcon />} />
                    </Grid>
                }
                {answers.OwnLot === 'no' &&
                    <Grid item >
                        <Chip variant="outlined" color="error" label={language === 'en' ? 'Own the Property' : 'Sea dueño de la propiedad'} size="small" icon={<CancelIcon />} />
                    </Grid>
                }
                {answers.haveIns &&
                    <Grid item >
                        <Chip variant="outlined" color={isYes(answers.haveIns) ? "success" : "error"} label={language === 'en' ? 'Insurance' : 'Seguro'} size="small" icon={isYes(answers.haveIns) ? <CheckIcon /> : <CancelIcon />} />
                    </Grid>
                }
                {answers.Income &&
                    <Grid item >
                        <Chip variant="outlined" color={isYes(answers.Income) ? "success" : "error"} label={language === 'en' ? 'Income' : 'Ingreso'} size="small" icon={isYes(answers.Income) ? <CheckIcon /> : <CancelIcon />} />
                    </Grid>
                }
                {answers.Vet &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Veteran' : 'Veterano'} size="small" icon={answers.Vet === "no" ? <NotInterestedIcon /> : <CheckIcon />} />
                    </Grid>
                }
                {answers.Over55 &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Over 55' : 'Más de 55'} size="small" icon={answers.Over55 === "no" ? <NotInterestedIcon /> : <CheckIcon />} />
                    </Grid>
                }
                {answers.Repairs &&
                    <Grid item >
                        <Chip variant="outlined" color="success" label={language === 'en' ? 'Repairs' : 'Refacción'} size="small" icon={<CheckIcon />} />
                    </Grid>
                }
                <Grid item >
                    &nbsp;
                </Grid>
            </Grid>
        </div>
    )
}