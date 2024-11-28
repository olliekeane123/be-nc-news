const express = require("express")
const topicsRouter = express.Router()
const { getTopicsController } = require("../../controllers")

topicsRouter.get("/", getTopicsController)

module.exports = topicsRouter
