import { useState } from 'react';
import { ToggleButtonGroup, ToggleButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { titles, constants } from '../services/Titles'
import { Item } from './Item';

export default function Submitted({language, appID}) {
   
  return (<>
      <Item elevation={3}><h2>{titles(language, 'HR_SUBMITTED')}</h2></Item>
      <Item elevation={0}><p>{titles(language, 'HR_SUBMITTEXT')}</p></Item>
      <Item elevation={5}><h3>{appID}</h3></Item>
  </>
  )
}
