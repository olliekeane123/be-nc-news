const express = require("express")
const app = express()
const { getApiController, getTopicsController } = require("./controllers")
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./error-handlers')

app.use(express.json())

app.get("/api", getApiController)

app.get("/api/topics", getTopicsController)

module.exports = app
