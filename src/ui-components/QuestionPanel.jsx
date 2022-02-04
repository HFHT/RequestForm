import { useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { Item } from './Item';
import { titles } from '../services/Titles'

export default function QuestionPanel({ thisQuestion, income, answers, language, matches, yesTranslate, handleAnswer }) {

  useEffect(() => {
    console.log(thisQuestion)
  }, [])
  return (
    <>
      <Item elevation={0}><h3 aria-label={titles(language, 'QP_ANSWER')}>{titles(language, 'QP_ANSWER')}</h3></Item>
      <Stack direction="row" spacing={2} >
        <Item elevation={0}>
          <ToggleButtonGroup
            aria-label='this is a question'
            orientation={matches ? "horizontal" : "vertical"}
            color="primary"
            exclusive
            onChange={(e) => handleAnswer({ mode: 'shift', clientAns: e.target.value, ansKey: thisQuestion.attrib, reject: thisQuestion.reject, rejectMsg: thisQuestion.r, skip: thisQuestion.ck, proceed: thisQuestion.hasOwnProperty('proceed') })}
          >
            <ToggleButton value={"yes"} aria-label={`Yes button: ${thisQuestion.q[language]} ${ariaLabel(language, income.Values, thisQuestion.attrib === "Income")}`}>{yesTranslate}</ToggleButton>
            <ToggleButton value="no" aria-label={`No button: ${thisQuestion.q[language]}`}>no</ToggleButton>
          </ToggleButtonGroup>
        </Item>
        <Item>
          <h3>{thisQuestion.q[language]}</h3>
        </Item>
      </Stack>
      <Incomex open={thisQuestion.attrib === "Income"} language={language} matches={matches} income={income.Values}
        subHeader={income.IncomeDesc[language]}
      />
    </>
  )
}

const ariaLabel = (language, income, open) => {
  if (!open) return ''
  const theTable = income.map((row, i) => {
    return language === 'en' ?
      `Family size of ${row.size} with maximum income of ${parseInt(row.maxIncome.replace(/\$|,/g, ''))} dollars`
      :
      `Tamaño de familia de ${row.size} con ingreso máximo de ${parseInt(row.maxIncome.replace(/\$|,/g, ''))} dólares`
  })
  return theTable


}

const Incomex = ({ open, language, income, subHeader, matches }) => {
  return (
    <>
      {open &&
        <Stack direction="column" spacing={0} >
          <Item elevation={0}><h3>{subHeader}</h3></Item>
          <Item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 150, maxWidth: 400 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "50%" }} size="small" align="center">{titles(language, 'QP_SIZE')}</TableCell>
                    <TableCell style={{ width: "50%" }} size="small" align="center">{titles(language, 'QP_INCOME')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {income.map((row, i) => (
                    <TableRow
                      key={i}
                      hover={true}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell size="small" align="center">{row.size}</TableCell>
                      <TableCell size="small" align="center">{row.maxIncome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Stack>
      }
    </>
  )
}
