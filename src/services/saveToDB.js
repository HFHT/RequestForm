import { MongoAPI } from './MongoDBAPI'

export const saveToDB = (cookieObj) => {
    if (!cookieObj) return
    //copy the object so we can delete a property without affecting the referenced object
    let application = { ...cookieObj }
    delete application.thisQuestion
    MongoAPI({ method: 'updateOne', db: 'HomeRepairApp', collection: 'App', data: { application }, find: { "_id": cookieObj.appID } })
}