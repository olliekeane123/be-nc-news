const express = require("express")
const apiRouter = express.Router()
const articlesRouter = require("./sub-routes/articles-router")
const topicsRouter = require("./sub-routes/topics-router")
const usersRouter = require("./sub-routes/users-router")
const commentsRouter = require("./sub-routes/comments-router")
const { getApiController } = require("../controllers")

apiRouter.get("/", getApiController)

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/users", usersRouter)

apiRouter.use("/comments", commentsRouter)

module.exports = apiRouter
