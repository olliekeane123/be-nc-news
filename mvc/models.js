const db = require("../db/connection")
const { convertTimestampToDate } = require("../db/seeds/utils")

exports.checkCategoryExists = (articleId) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Article Does Not Exist",
                })
            }
        })
}

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
                    msg: "Article Does Not Exist",
                })
            } else {
                return rows[0]
            }
        })
}

exports.getCommentsByArticleIdModel = (articleId) => {
    return db
        .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
            [articleId]
        )
        .then(({ rows }) => {
            return rows
        })
}

exports.postCommentModel = ({ username, body }, articleId) => {
    const commentValues = [body, 0, username, articleId]
    return db
        .query(
            `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *;`,
            commentValues
        )
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.patchVotesModel = ({ voteDifference }, articleId) => {
    return db
        .query(
            `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2;`,
            [voteDifference, articleId]
        )
        .then(() => {
            return db.query(
                `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
                [articleId]
            )
        })
        .then(({ rows }) => {
            return rows[0]
        })
}
