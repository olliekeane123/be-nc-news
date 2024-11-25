const { getApiModel, getTopicsModel } = require("./models")

exports.getApiController = (req, res) => {
    const endpoints = getApiModel()
    res.status(200).send({endpoints: endpoints})
}

exports.getTopicsController = (req, res) => {
    console.log('hello from controller')
    getTopicsModel().then((topics)=>{
        console.log(topics)
        res.status(200).send({topics: topics})
    })
}