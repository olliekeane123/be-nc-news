const express = require("express")
const usersRouter = express.Router()
const { getUsersController } = require("../../controllers")

usersRouter.get("/", getUsersController)

module.exports = usersRouter
