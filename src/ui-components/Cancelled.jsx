import { titles } from '../services/Titles'
import { Item } from './Item';

export default function Cancelled({ language }) {

    return (<>
        <Item elevation={3}><h2>{titles(language, 'HR_CANCELLED')}</h2></Item>
        <Item elevation={0}><p>{titles(language, 'HR_CANCELLEDTEXT')}</p></Item>
    </>
    )
}
