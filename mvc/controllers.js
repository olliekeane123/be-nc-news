const { promises } = require("supertest/lib/test")
const endpoints = require("../endpoints.json")
const {
    getTopicsModel,
    getArticlesModel,
    getArticleByIdModel,
    getCommentsByArticleIdModel,
    checkCategoryExists,
} = require("./models")

exports.getApiController = (req, res, next) => {
    res.status(200).send({ endpoints })
}

exports.getTopicsController = (req, res, next) => {
    getTopicsModel().then((topics) => {
        res.status(200).send({ topics })
    })
}

exports.getArticlesController = (req, res, next) => {
    getArticlesModel()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next)
}

exports.getArticleByIdController = (req, res, next) => {
    const { article_id } = req.params
    getArticleByIdModel(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.getCommentsByArticleIdController = (req, res, next) => {
    const { article_id } = req.params
    const promises = [getCommentsByArticleIdModel(article_id), checkCategoryExists(article_id)]
    Promise.all(promises)
        .then(([comments]) => {
            res.status(200).send({ comments })
        })
        .catch(next)
}
