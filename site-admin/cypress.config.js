const cucumber = require('cypress-cucumber-preprocessor').default
const { defineConfig } = require("cypress");

//For connecting to SQL Server
const mysql = require("mysql2")
function queryTestDb(query, config) {
// creates a new mysql connection using credentials from cypress.json env's
const connection = mysql.createConnection(config.env.db)
// start connection to db
connection.connect()
// exec query + disconnect to db as a Promise
return new Promise((resolve, reject) => {
  connection.query(query, (error, results) => {
    if (error) reject(error)
    else {
      connection.end()
      return resolve(results)
    }
  })
  })
}

module.exports = defineConfig({
  
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('file:preprocessor', cucumber())
      on('task', { queryDb: query => { return queryTestDb(query, config) }, }); //For running sql query

    },
    specPattern: "**/*.feature",
  },
});
