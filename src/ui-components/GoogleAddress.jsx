import { useState, useEffect, forwardRef } from 'react';
import { Snackbar, Alert } from '@mui/material'
import { Task as TaskIcon } from '@mui/icons-material';
import AutoComplete from "react-google-autocomplete";
import { isCity } from '../services/IsCity'
import { isCounty } from '../services/IsCounty'
import { Item } from './Item';
import ErrorTag from './ErrorTag';

export default function GoogleAddress({ language, zipCodes, addressInfo, setAddressInfo, handleAnswer, handleAddress }) {
    const [hasAlert, setHasAlert] = useState(null)
    //    const [cityCheck, setCityCheck] = useState(null)
    //    const [countyCheck, setCountyCheck] = useState(null)
    //    const [cityYesNo, setCityYesNo] = useState(null)
    //    const [countyYesNo, setCountyYesNo] = useState(null)

    useEffect(() => {
        if (Object.keys(addressInfo).length == 0) { return }
        handleAnswer({ mode: null, ansKey: "City", clientAns: isCity(addressInfo, zipCodes), reject: [], rejectMsg: null, skip: {} })
        handleAnswer({ mode: null, ansKey: "County", clientAns: isCounty(addressInfo), reject: [], rejectMsg: null, skip: {} })
        handleAddress({ county: isCounty(addressInfo), city: isCity(addressInfo, zipCodes) })
    }, [addressInfo])
    return (
        <>
            <div style={{ width: "auto" }}>
                <Item elevation={0}><h3>{language === 'en' ? 'Provide the address of the home' : 'Proporcione la dirección de la casa'}</h3></Item>
                <AutoComplete
                    apiKey={`${process.env.REACT_APP_GOOGLE_APIKEY}`}
                    placeholder={language === 'en' ? 'Your address...' : 'Su dirección...'}
                    options={{
                        types: ["address"],
                        componentRestrictions: { country: "us" },
                    }}
                    onPlaceSelected={(selected) => {
                        if (selected.hasOwnProperty('name')) {
                            setHasAlert(language === 'en' ? 'Please reenter the address and select it from the list!' : '¡Vuelva a ingresar la dirección y selecciónela de la lista!')
                        } else {
                            setHasAlert(null);
//                            handleAddress({ ansKey: "County", ansValue: isCounty(selected) })
                        }
                        setAddressInfo(selected)
                    }}
                />
                <ErrorTag hasAlert={hasAlert} setHasAlert={setHasAlert} />
            </div>
        </>
    )
}