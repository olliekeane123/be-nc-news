exports.globalErrorHandler = (req, res, next) =>{
    const {originalUrl} = req
    res.status(404).send({msg: `${originalUrl} Not Found On Server`})
}

exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502" || err.code === "23503" || err.code === "42601") {
        res.status(400).send({ msg: "Bad Request" })
    } else if (err.code === "42703" || err.code === "42702") {
        res.status(404).send({ msg: "Column Does Not Exist" })
    } else if (err.code === "42P10") {
        res.status(400).send({ msg: "Bad Request: Invalid Sort By" })
    }else {
        next(err)
    }
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    if (err) {
        res.status(500).send({ msg: "Internal Server Error" })
    }
}
