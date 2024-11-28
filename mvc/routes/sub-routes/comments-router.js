const express = require("express")
const commentsRouter = express.Router()
const { deleteCommentByIdController } = require("../../controllers")

commentsRouter.delete("/:comment_id", deleteCommentByIdController)

module.exports = commentsRouter
