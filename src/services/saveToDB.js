import { MongoAPI } from './MongoDBAPI'

export const saveToDB = (cookieObj) => {
    if (!cookieObj) return
    //copy the object so we can delete a property without affecting the referenced object
    let application = { ...cookieObj }
    delete application.thisQuestion
    MongoAPI({ method: 'updateOne', db: 'HomeRepairApp', collection: 'App', data: { application }, find: { "_id": cookieObj.appID } })
    saveToLegacy(cookieObj)
}

export async function saveToLegacy(cookieObj) {
    if (cookieObj && cookieObj.hasOwnProperty('applicant') && cookieObj.applicant.hasOwnProperty('name')) {
        console.log(cookieObj)
        const options = {
            method: "POST",
            body: JSON.stringify({ cookieObj }),
            //        mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        };

        const baseURL = `${process.env.REACT_APP_AZURE_FUNC_URL}`;

        return fetch(`https://hfht.azhoffs.com/assets/code/HR_appWebForm.php`, options)
            .then(response => response.json())
            .then(data => { console.log(data) })
            .catch(error => console.log(error));
    }
}