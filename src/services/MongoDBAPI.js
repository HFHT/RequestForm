// Azure serverless functions are utilized to access the MongoDB

export async function MongoAPI( req, setter ) {
    const headers = new Headers();

    const options = {
        method: "GET",
        headers: headers
    };
    
    return fetch(`https://hfhtapi.azurewebsites.net/api/HFHTMongoAPI?req=${JSON.stringify(req)}`, options)
        .then(response => response.json())
        .then(data => {setter(data)})
        .catch(error => console.log(error));

}
