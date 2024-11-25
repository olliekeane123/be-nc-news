const express = require("express")
const app = express()
const { getApiController } = require("./controllers")

app.use(express.json())

app.get("/api", getApiController)

module.exports = app
