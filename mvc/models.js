// const dataTest = require("../db/data/test-data/index")
// const dataDev = require("../db/data/development-data/index")
const endpoints = require("../endpoints.json")
const db = require("../db/connection")

exports.getApiModel = () => {
    return endpoints
}

exports.getTopicsModel = () => {
    return db.query(`SELECT * FROM topics`).then(({rows})=>{
        return rows
    })
}
