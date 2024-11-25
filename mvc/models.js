const endpoints = require("../endpoints.json")
const db = require("../db/connection")

exports.getApiModel = () => {
    return endpoints
}

exports.getTopicsModel = () => {
    return db.query(`SELECT * FROM topics`).then(({ rows }) => {
        return rows
    })
}

exports.getArticlesModel = (articleId) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "article does not exist",
                })
            } else {
                return rows[0]
            }
        })
}
