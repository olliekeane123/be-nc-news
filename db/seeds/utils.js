exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
    if (!created_at) return { ...otherProperties }
    return { created_at: new Date(created_at), ...otherProperties }
}

exports.createRef = (arr, key, value) => {
    return arr.reduce((ref, element) => {
        ref[element[key]] = element[value]
        return ref
    }, {})
}

exports.formatComments = (comments, idLookup) => {
    return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
        const article_id = idLookup[belongs_to]
        return {
            article_id,
            author: created_by,
            ...this.convertTimestampToDate(restOfComment),
        }
    })
}

exports.validateQueries = (sort_by, order, topic) => {
    const allowedSortByValues = [
        "title",
        "topic",
        "author",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
    ]
    const allowedOrderValues = ["ASC", "asc", "DESC", "desc"]
    const allowedTopicValues = ["mitch", "cats"]

    if (sort_by && !allowedSortByValues.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: "Bad Request: Invalid Sort_By Query",
        })
    }
    if (order && !allowedOrderValues.includes(order)) {
        return Promise.reject({
            status: 400,
            msg: "Bad Request: Invalid Order Query",
        })
    }
    if (topic && !allowedTopicValues.includes(topic)) {
        return Promise.reject({
            status: 400,
            msg: "Bad Request: Invalid Topic Query",
        })
    }
    return Promise.resolve()
}
