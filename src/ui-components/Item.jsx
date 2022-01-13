import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles';

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    //  textAlign: 'center',
    color: theme.palette.text.secondary,
  }));