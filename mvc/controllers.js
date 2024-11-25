const { getApiModel } = require("./models")

exports.getApiController = (req, res) => {
    const endpoints = getApiModel()
    res.status(200).send({endpoints: endpoints})
}
