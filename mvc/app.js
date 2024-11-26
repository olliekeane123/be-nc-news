const express = require("express")
const app = express()
const {
    getApiController,
    getTopicsController,
    getArticlesController,
    getArticleByIdController,
    getCommentsByArticleIdController,
    postCommentController,
    patchVotesController
} = require("./controllers")
const {
    psqlErrorHandler,
    customErrorHandler,
    serverErrorHandler,
} = require("./error-handlers")

app.use(express.json())

app.get("/api", getApiController)

app.get("/api/topics", getTopicsController)

app.get("/api/articles", getArticlesController)

app.get("/api/articles/:article_id", getArticleByIdController)

app.get("/api/articles/:article_id/comments", getCommentsByArticleIdController)

app.post("/api/articles/:article_id/comments", postCommentController)

app.patch("/api/articles/:article_id", patchVotesController)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app
