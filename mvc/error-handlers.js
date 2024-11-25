exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "INVALID TEXT REPRESENTATION" })
    } else {
        next(err)
    }
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        console.log("Sending error response: ", err)
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
