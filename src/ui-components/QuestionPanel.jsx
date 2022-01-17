import { useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { Item } from './Item';
import { titles } from '../services/Titles'

export default function QuestionPanel({ thisQuestion, income, answers, language, matches, yesTranslate, handleAnswer }) {
  const [rejectMsg, setRejectMsg] = useState(null)
  console.log(thisQuestion)

  useEffect(() => {
    console.log(thisQuestion)
  }, [])
  return (
    <>
      {!rejectMsg &&
        <>
          <Item elevation={0}><h3>{titles(language, 'QP_ANSWER')}</h3></Item>
          <Stack direction="row" spacing={2} >
            <Item elevation={0}>
              <ToggleButtonGroup
                orientation={matches ? "horizontal" : "vertical"}
                color="primary"
                exclusive
                onChange={(e) => handleAnswer({ mode: 'shift', clientAns: e.target.value, ansKey: thisQuestion.attrib, reject: thisQuestion.reject, rejectMsg: thisQuestion.r, skip: thisQuestion.ck, proceed: thisQuestion.hasOwnProperty('proceed') })}
              >
                <ToggleButton value={"yes"}>{yesTranslate}</ToggleButton>
                <ToggleButton value="no">no</ToggleButton>
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
      }
    </>
  )
}

const Incomex = ({ open, language, income, subHeader, matches }) => {
  return (
    <>
      {open &&
        <Stack direction="column" spacing={0} >
          <Item elevation={0}><h3>{subHeader}</h3></Item>
          <Item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 150 }, { maxWidth: 400 }} size="small" aria-label="a dense table">
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
