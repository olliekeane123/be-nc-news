const db = require("../db/connection")

exports.getTopicsModel = () => {
    return db.query(`SELECT * FROM topics`).then(({ rows }) => {
        return rows
    })
}

exports.getArticlesModel = () => {
    return db
        .query(
            `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`
        )
        .then(({ rows }) => {
            return rows
        })
}

exports.getArticleByIdModel = (articleId) => {
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
