const express = require("express")
const app = express()
const {
    globalErrorHandler,
    psqlErrorHandler,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers")
const apiRouter = require("./routes/api-router")

app.use(express.json())

app.use("/api", apiRouter)

app.all("*", globalErrorHandler)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app
