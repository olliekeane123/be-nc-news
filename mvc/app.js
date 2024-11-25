const express = require("express")
const app = express()
const { getApiController, getTopicsController, getArticlesController } = require("./controllers")
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./error-handlers')

app.use(express.json())

app.get("/api", getApiController)

app.get("/api/topics", getTopicsController)

app.get("/api/articles/:article_id", getArticlesController)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app
