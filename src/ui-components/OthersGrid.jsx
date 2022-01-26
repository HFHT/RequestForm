import { useState, useEffect } from 'react';
import { TextField, ToggleButtonGroup, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { Item } from './Item';
import { titles } from '../services/Titles'


export default function OthersGrid({ language, others = [], error = {}, matches, setter }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300, maxWidth: 500 }} aria-label="Others in household">
        <TableHead>
          <TableRow>
            <TableCell><Item elevation={0}><b><i>{titles(language, 'OT_NAME')}</i></b></Item></TableCell>
            <TableCell align="right"><Item elevation={0}><b><i>{titles(language, 'OT_AGE')}</i></b></Item></TableCell>
            <TableCell align="right"><Item elevation={0}><b><i>{titles(language, 'OT_RELATION')}</i></b></Item></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {others.map((o, i) => (
            <TableRow
              key={i}
              hover={true}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <TextField
                  id="name"
                  placeholder={titles(language, 'OT_NAME')}
                  label={titles(language, 'OT_NAME')}
                  variant="filled"
                  inputProps={{ 'data-lpignore': 'true' }}
                  value={o.name}
                  onChange={(e) => setter({ key: i, prop: 'name', value: e.target.value })}
                  error={error.other}
                  inputProps={{ size: 46 }}
                  type="text"
                />
              </TableCell>
              <TableCell>
                <TextField
                  id="age"
                  placeholder={titles(language, 'OT_AGE')}
                  label={titles(language, 'OT_AGE')}
                  variant="filled"
                  inputProps={{ 'data-lpignore': 'true' }}
                  value={o.age}
                  onChange={(e) => setter({ key: i, prop: 'age', value: e.target.value })}
                  error={error.other}
                  inputProps={{ size: 46 }}
                  type="text"
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  id="relation"
                  placeholder={titles(language, 'OT_RELATION')}
                  label={titles(language, 'OT_RELATION')}
                  variant="filled"
                  inputProps={{ 'data-lpignore': 'true' }}
                  value={o.relation}
                  onChange={(e) => setter({ key: i, prop: 'relation', value: e.target.value })}
                  error={error.other}
                  inputProps={{ size: 46 }}
                  type="text"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  )
}
