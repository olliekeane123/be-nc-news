const endpoints = require("../endpoints.json")
const db = require("../db/connection")

exports.getApiModel = () => {
    return endpoints
}

exports.getTopicsModel = () => {
    // throw error = { status: 400, msg: "badd request or somthing" }
    return db.query(`SELECT * FROM topics`).then(({ rows }) => {
        return rows
    })
}
