const db = require("../db/connection")
const format = require("pg-format")
const { validateQueries } = require("../db/seeds/utils")

exports.checkIdExists = (column, idType, id) => {
    let query = `SELECT * FROM %I WHERE %I = %L`
    query = format(query, column, idType, id)
    return db.query(query).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({
                status: 404,
                msg: `${idType} Does Not Exist`,
            })
        }
    })
}

exports.getTopicsModel = () => {
    return db.query(`SELECT * FROM topics`).then(({ rows }) => {
        return rows
    })
}

exports.getArticlesModel = (sort_by, order, topic, limit, offset) => {
    return validateQueries(sort_by, order, topic).then(() => {
        const sortByValue = sort_by || "created_at"
        const orderValue = order || "DESC"
        const topicValue = topic || "%"

        let articlesQuery = `
            SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
                   CAST(COUNT(comments.article_id) AS INT) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.topic LIKE %L
            GROUP BY articles.article_id
            ORDER BY %I %s
            LIMIT %L OFFSET %L`

        articlesQuery = format(articlesQuery, topicValue, sortByValue, orderValue, limit, offset)

        //SELECT COUNT

        let countQuery = `
            SELECT COUNT(*) AS total_count
            FROM articles
            WHERE articles.topic LIKE %L`

        countQuery = format(countQuery, topicValue)

        return Promise.all([db.query(articlesQuery), db.query(countQuery)]).then(([articlesResult, countResult]) => {
            return {
                articles: articlesResult.rows,
                total_count: Number(countResult.rows[0].total_count)
            }
        })
    })
}


exports.getArticleByIdModel = (articleId) => {
    return db
        .query(
            `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id`,
            [articleId]
        )
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
    const commentValues = [body, username, articleId]
    return db
        .query(
            `INSERT INTO comments (body, author, article_id, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *;`,
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

exports.deleteCommentByIdModel = (commentId) => {
    return db
        .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
            commentId,
        ])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Comment Does Not Exist",
                })
            }
        })
}

exports.getUsersModel = () => {
    return db.query(`SELECT * FROM users`).then(({ rows }) => {
        return rows
    })
}

exports.getUserByUsernameModel = (username) => {
    return db
        .query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "User Does Not Exist",
                })
            } else {
                return rows[0]
            }
        })
}

exports.patchCommentVotesModel = ({ voteDifference }, commentId) => {
    return db
        .query(
            `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2 
        RETURNING *;`,
            [voteDifference, commentId]
        )
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.postArticleModel = ({
    title,
    topic,
    author,
    body,
    article_img_url,
}) => {
    return db
        .query(
            `INSERT INTO articles (title, topic, author, body, created_at, article_img_url) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, COALESCE($5, 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')) RETURNING *;`,
            [title, topic, author, body, article_img_url]
        )
        .then(({ rows }) => {
            const id = rows[0].article_id
            return db.query(
                `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
                [id]
            )
        })
        .then(({ rows }) => {
            return rows[0]
        })
}


