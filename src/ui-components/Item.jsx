import { Paper, Button } from '@mui/material'
import { styled } from '@mui/material/styles';

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    //  textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  export const HeadText = styled('h3')(({ theme }) => ({
    ...theme.typography.h6,
    padding: theme.spacing(0),
    fontSize: '1.17rem',
    margin: 0,    
    //  textAlign: 'center',
    color: theme.palette.text.secondary,
  }));  

  export const SubText = styled('p')(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0),
    marginTop: '-.4rem',
    //  textAlign: 'center',
    color: theme.palette.text.secondary,
  }));  
