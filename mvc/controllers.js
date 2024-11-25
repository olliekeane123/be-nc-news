const { getApiModel, getTopicsModel } = require("./models")

exports.getApiController = (req, res, next) => {
    const endpoints = getApiModel()
    res.status(200).send({ endpoints: endpoints })
}

exports.getTopicsController = (req, res, next) => {
    getTopicsModel()
        .then((topics) => {
            res.status(200).send({ topics: topics })
        })
        .catch((err)=>{
            console.log('Error Caught: ', err)
            next(err)
        })
}
