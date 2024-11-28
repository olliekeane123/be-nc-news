const endpoints = require("../endpoints.json")
const {
    checkArticleExists,
    getTopicsModel,
    getArticlesModel,
    getArticleByIdModel,
    getCommentsByArticleIdModel,
    postCommentModel,
    patchVotesModel,
    deleteCommentByIdModel,
    getUsersModel,
    getUserByUsernameModel,
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
    const { sort_by, order, topic } = req.query
    getArticlesModel(sort_by, order, topic)
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
    const promises = [
        getCommentsByArticleIdModel(article_id),
        checkArticleExists(article_id),
    ]
    Promise.all(promises)
        .then(([comments]) => {
            res.status(200).send({ comments })
        })
        .catch(next)
}

exports.postCommentController = (req, res, next) => {
    const {
        body,
        params: { article_id },
    } = req
    const promises = [
        checkArticleExists(article_id),
        postCommentModel(body, article_id),
    ]
    Promise.all(promises)
        .then(([_, comment]) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}

exports.patchVotesController = (req, res, next) => {
    const {
        body,
        params: { article_id },
    } = req
    const promises = [
        patchVotesModel(body, article_id),
        checkArticleExists(article_id),
    ]
    Promise.all(promises)
        .then(([updatedArticle]) => {
            res.status(200).send({ updatedArticle })
        })
        .catch(next)
}

exports.deleteCommentByIdController = (req, res, next) => {
    const { comment_id } = req.params
    deleteCommentByIdModel(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}

exports.getUsersController = (req, res, next) => {
    getUsersModel().then((users) => {
        res.status(200).send({ users })
    })
}

exports.getUserByUsernameController = (req, res, next) => {
    const { username } = req.params
    getUserByUsernameModel(username)
        .then((user) => {
            res.status(200).send({ user })
        })
        .catch(next)
}

exports.patchCommentVotesController = (req, res, next) => {
    const {
        body,
        params: { comment_id },
    } = req
    const promises = [
        patchVotesModel(body, article_id),
        checkArticleExists(article_id),
    ]
    Promise.all(promises)
        .then(([updatedArticle]) => {
            res.status(200).send({ updatedArticle })
        })
        .catch(next)
}
