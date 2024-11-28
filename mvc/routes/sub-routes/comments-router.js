const express = require("express")
const commentsRouter = express.Router()
const { deleteCommentByIdController, patchCommentVotesController } = require("../../controllers")

commentsRouter
    .route("/:comment_id")
    .patch(patchCommentVotesController)
    .delete(deleteCommentByIdController)

module.exports = commentsRouter
