const express = require("express")
const articlesRouter = express.Router()
const {
    getArticlesController,
    getArticleByIdController,
    getCommentsByArticleIdController,
    postCommentController,
    patchVotesController,
    postArticleController
} = require("../../controllers")

articlesRouter.route("/").get(getArticlesController).post(postArticleController)

articlesRouter
    .route("/:article_id")
    .get(getArticleByIdController)
    .patch(patchVotesController)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleIdController)
    .post(postCommentController)

module.exports = articlesRouter
