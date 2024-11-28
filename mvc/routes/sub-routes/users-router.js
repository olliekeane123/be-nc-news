const express = require("express")
const usersRouter = express.Router()
const {
    getUsersController,
    getUserByUsernameController,
} = require("../../controllers")

usersRouter.get("/", getUsersController)

usersRouter.get("/:username", getUserByUsernameController)

module.exports = usersRouter
