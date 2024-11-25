const { getApiModel, getTopicsModel, getArticlesModel } = require("./models")

exports.getApiController = (req, res, next) => {
    const endpoints = getApiModel()
    res.status(200).send({ endpoints: endpoints })
}

exports.getTopicsController = (req, res, next) => {
    getTopicsModel()
        .then((topics) => {
            res.status(200).send({ topics: topics })
        })
        .catch(next)
}

exports.getArticlesController = (req, res, next) => {
    const {article_id} = req.params
    getArticlesModel(article_id)
    .then((article)=>{
        res.status(200).send({article: article})
    })
    .catch(next)
}
