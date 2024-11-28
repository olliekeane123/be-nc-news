const express = require("express")
const articlesRouter = express.Router()
const {
    getArticlesController,
    getArticleByIdController,
    getCommentsByArticleIdController,
    postCommentController,
    patchVotesController,
} = require("../../controllers")

articlesRouter.get("/", getArticlesController)

articlesRouter.get("/:article_id", getArticleByIdController)

articlesRouter.get("/:article_id/comments", getCommentsByArticleIdController)

articlesRouter.post("/:article_id/comments", postCommentController)

articlesRouter.patch("/:article_id", patchVotesController)

module.exports = articlesRouter
