import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Item } from './Item';
import { titles } from '../services/Titles'

export default function OthersGrid({ language, others = [], error = {}, matches, setter }) {
  return (
    <TableContainer component={Paper} elevation={5} sx={{ marginTop: 1 }}>
      <Table sx={{ minWidth: 300, maxWidth: 500 }} padding='none' aria-label="Others in household">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}><Item elevation={0}><h3 style={{ marginBottom: 3, marginTop: 0 }}>{titles(language, 'OT_HEADER')}</h3></Item></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Item elevation={0}><b><i>{titles(language, 'OT_NAME')}</i></b></Item></TableCell>
            <TableCell><Item elevation={0}><b><i>{titles(language, 'OT_AGE')}</i></b></Item></TableCell>
            <TableCell><Item elevation={0}><b><i>{titles(language, 'OT_RELATION')}</i></b></Item></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {others.map((o, i) => (
            <TableRow
              key={i}
              hover={true}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ paddingRight: 0.5 }}>
                <TextField
                  id="Name"
                  placeholder={titles(language, 'OT_NAME')}
                  variant="filled"
                  size="small"
                  value={o.name}
                  onChange={(e) => setter({ key: i, prop: 'name', value: e.target.value })}
                  error={error.others}
                  required                  
                  inputProps={{ size: 40, 'data-lpignore': 'true' }}
                  type="text"
                />
              </TableCell>
              <TableCell sx={{ paddingRight: 0.5 }}>
                <TextField
                  id="Age"
                  placeholder={titles(language, 'OT_AGE')}
                  variant="filled"
                  size="small"                  
                  value={o.age}
                  onChange={(e) => setter({ key: i, prop: 'age', value: e.target.value })}
                  required                  
                  inputProps={{ size: 10, 'data-lpignore': 'true' }}
                  type="text"
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  id="Relation"
                  placeholder={titles(language, 'OT_RELATION')}
                  variant="filled"
                  size="small"                  
                  value={o.relation}
                  onChange={(e) => setter({ key: i, prop: 'relation', value: e.target.value })}
                  required                  
                  inputProps={{ size: 10, 'data-lpignore': 'true' }}
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
