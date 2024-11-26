const express = require("express")
const app = express()
const {
    getApiController,
    getTopicsController,
    getArticlesController,
    getArticleByIdController,
    getCommentsByArticleIdController
} = require("./controllers")
const {
    psqlErrorHandler,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers")


app.get("/api", getApiController)

app.get("/api/topics", getTopicsController)

app.get("/api/articles", getArticlesController)

app.get("/api/articles/:article_id", getArticleByIdController)



app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app
