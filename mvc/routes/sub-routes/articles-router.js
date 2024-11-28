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

articlesRouter
    .route("/:article_id")
    .get(getArticleByIdController)
    .patch(patchVotesController)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleIdController)
    .post(postCommentController)

module.exports = articlesRouter
