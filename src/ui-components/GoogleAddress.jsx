import { useState, useEffect } from 'react';
import AutoComplete from "react-google-autocomplete";
import { isCity } from '../services/IsCity'
import { isCounty } from '../services/IsCounty'
import { Item } from './Item';
import { titles } from '../services/Titles'
import ErrorTag from './ErrorTag';

export default function GoogleAddress({ language, zipCodes, addressInfo, setAddressInfo, handleAnswer, handleAddress }) {
    const [hasAlert, setHasAlert] = useState(null)

    // When Google autocomplete is done, addressInfo will be updated
    // Update the answers using handleAnswer, trim the list of questions using handleAddress
    useEffect(() => {
        if (Object.keys(addressInfo).length == 0) { return }
        handleAnswer({ mode: null, ansKey: "City", clientAns: isCity(addressInfo, zipCodes), reject: [], rejectMsg: null, skip: {}, proceed: false })
        handleAnswer({ mode: null, ansKey: "County", clientAns: isCounty(addressInfo), reject: [], rejectMsg: null, skip: {}, proceed: false })
        handleAddress({ county: isCounty(addressInfo), city: isCity(addressInfo, zipCodes) })
    }, [addressInfo])

    return (
        <>
            <div style={{ width: "auto" }}>
                <Item elevation={0}><h3>{titles(language, 'GA_ADDRESS')}</h3></Item>
                <AutoComplete
                    apiKey={`${process.env.REACT_APP_GOOGLE_APIKEY}`}
                    placeholder={titles(language, 'GA_YOUR')}
                    options={{
                        types: ["address"],
                        componentRestrictions: { country: "us" },
                    }}
                    onPlaceSelected={(selected) => {
                        if (selected.hasOwnProperty('name')) {
                            setHasAlert(titles(language, 'GA_REENTER'))
                        } else {
                            setHasAlert(null);
                            setAddressInfo(selected)                            
                        }
                    }}
                />
                <ErrorTag hasAlert={hasAlert} setHasAlert={setHasAlert} />
            </div>
        </>
    )
}