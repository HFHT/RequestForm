import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { parseCookie } from './services/HandleCookie'
import { MongoAPI } from './services/MongoDBAPI'

require('dotenv').config()
var language = window.navigator.language
const date = new Date()
//the debug param stops the loading of state from the cookie, so you can start the questions again.
var params = new URLSearchParams(window.location.search)
//fetch the program variables from the MongoDB and pass as parms to React
let response = {}
async function getInstructions() {
  response.Questions = await MongoAPI({ method: 'max', db: 'HomeRepairApp', collection: 'Questions', find: "Version", limit: 1 })
  response.ZipCodes = await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'ZipCodes', find: { "_id": 0 } })
  response.Programs = await MongoAPI({ method: 'find', db: 'HomeRepairApp', collection: 'Programs', find: { "_id": 0 } })
  return response
}
(async () => {
  try {
    const results = await getInstructions().then(data => data)
    const instructions = { Programs: results.Programs.Programs, ProgramList: results.Questions.Programs, Income: results.Questions.Income, RepairList: results.Questions.RepairList, Answers: results.Questions.Answers, Questions: results.Questions.Questions, ZipCodes: results.ZipCodes.ZipCodes }
    ReactDOM.render(
      <React.StrictMode>
        {
          !('fetch' in window) ? <h3>Fetch API not found, please upgrade your browser.</h3> :
          <App language={language.substring(0, 2)} date={date.toISOString()} appID={(Date.now()/10).toFixed()} debug={params.get('debug')} instructions={instructions} cookie={params.get('debug') ? '' : parseCookie(document.cookie)} />
          }
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
  catch (e) {
    ReactDOM.render(
      <React.StrictMode>
        {<h3>&nbsp;Trouble connecting to the Home Repair service. You may be experiencing problems with your internet connection. Please try again later.</h3>}
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
})()