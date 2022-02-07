// Azure serverless functions are utilized to access the MongoDB

export async function MongoSetterAPI(req, setter, isObj = false) {
    const headers = new Headers();

    const options = {
        method: "GET",
        headers: headers
    };

    const baseURL = `${process.env.REACT_APP_AZURE_FUNC_URL}`;

    return fetch(`${baseURL}/api/HFHTMongoAPI?req=${JSON.stringify(req)}`, options)
        .then(response => response.json())
        .then(data => { isObj ? setter(data) : setter(data[0]) })
        .catch(error => console.log(error));

}

export async function MongoAPI(req, isObj = false) {
    const headers = new Headers();

    const options = {
        method: "GET",
        headers: headers
    };

    const baseURL = `${process.env.REACT_APP_AZURE_FUNC_URL}`;

    return fetch(`${baseURL}/api/HFHTMongoAPI?req=${JSON.stringify(req)}`, options)
        .then(response => response.json())
        .then(data => { return isObj ? data : data[0] })
        .catch(error => console.log(error));

}

export async function getPgmSettingfromLegacy() {
    const options = {
        method: "GET",
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        })
    };

    const baseURL = `${process.env.REACT_APP_AZURE_FUNC_URL}`;

    return fetch(`https://hfht.azhoffs.com/assets/code/HR_appGetPgmSetting.php`, options)
        .then(response => response.json())
        .then(data => { console.log(data); return data.data })
        .catch(error => console.log(error));
}