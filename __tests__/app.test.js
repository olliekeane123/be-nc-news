const request = require("supertest")
const endpointsJson = require("../endpoints.json")
const app = require("../mvc/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

afterAll(() => {
    return db.end()
})
beforeEach(() => {
    return seed(data)
})

describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(endpoints).toEqual(endpointsJson)
            })
    })
})

describe("GET /api/topics", () => {
    test("200: Responds with an array of objects (topics)", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String),
                    })
                })
            })
    })
})

describe("GET /api/articles", () => {
    test("200: returns array of all articles objects with the correct key values - including the key of body removed, and an added key of comment_count with the correct values. Array should be sorted by time created in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("GET:200 sends a single article to the client", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article.article_id).toBe(1)
                expect(article.title).toBe(
                    "Living in the shadow of a great man"
                )
                expect(article.topic).toBe("mitch")
                expect(article.author).toBe("butter_bridge")
                expect(article.body).toBe("I find this existence challenging")
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                expect(article.votes).toBe(100)
                expect(article.article_img_url).toBe(
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                )
            })
    })
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article Does Not Exist")
            })
    })
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .get("/api/articles/not_an_article")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("GET:200 sends an array of comments corresponding to the requested article_id, sorted by date/time descending", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(11)
                expect(comments).toBeSortedBy("created_at", {
                    descending: true,
                })
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                    })
                })
            })
    })
    test("GET:200 sends an empty array when specified article has 0 comments", () => {
        return request(app)
            .get("/api/articles/13/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toEqual([])
            })
    })
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
            .get("/api/articles/999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article Does Not Exist")
            })
    })
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .get("/api/articles/not_an_article/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("POST:201 inserts a new comment to the db and sends the comment body back to the client", () => {
        const newComment = {
            username: "butter_bridge",
            body: "This is just a test comment",
        }
        return request(app)
            .post("/api/articles/13/comments")
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: "This is just a test comment",
                    article_id: 13,
                    author: "butter_bridge",
                    votes: 0,
                    created_at: expect.any(String),
                })
            })
    })
    test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no username/body)", () => {
        const newComment = {
            body: "Helloooo",
        }
        return request(app)
            .post("/api/articles/13/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("POST:400 sends an appropriate status and error message when given a non-existent username", () => {
        const newComment = {
            username: "nonexistent_username",
            body: "This is just a test comment",
        }
        return request(app)
            .post("/api/articles/13/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("POST:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
        const newComment = {
            username: "butter_bridge",
            body: "This is just a test comment",
        }
        return request(app)
            .post("/api/articles/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article Does Not Exist")
            })
    })
    test("POST:400 sends an appropriate status and error message when given an invalid article_id", () => {
        const newComment = {
            username: "butter_bridge",
            body: "This is just a test comment",
        }
        return request(app)
            .post("/api/articles/not_an_article/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("PATCH /api/articles/:article_id", () => {
    test("PATCH:200 alters the vote property of the specified article (article_id) by the value of the (positive) voteDifference sent in the request, responds with updated article to the client", () => {
        const voteBody = { voteDifference: 50 }
        return request(app)
            .patch("/api/articles/13")
            .send(voteBody)
            .expect(200)
            .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle).toMatchObject({
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: 50,
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number),
                })
            })
    })
    test("PATCH:200 alters the vote property of the specified article (article_id) by the value of the (negative) voteDifference sent in the request, responds with updated article to the client", () => {
        const voteBody = { voteDifference: -50 }
        return request(app)
            .patch("/api/articles/2")
            .send(voteBody)
            .expect(200)
            .then(({ body: { updatedArticle } }) => {
                expect(updatedArticle).toMatchObject({
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: -50,
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number),
                })
            })
    })
    test("PATCH:400 responds with an appropriate status and error message when provided with a bad voteBody (invalid voteDifference))", () => {
        const voteBody = { voteDifference: "banana" }
        return request(app)
            .patch("/api/articles/2")
            .send(voteBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
        const voteBody = { voteDifference: 50 }
        return request(app)
            .patch("/api/articles/999")
            .send(voteBody)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article Does Not Exist")
            })
    })
    test("PATCH:400 sends an appropriate status and error message when given an invalid article_id", () => {
        const voteBody = { voteDifference: 50 }
        return request(app)
            .patch("/api/articles/not_an_article")
            .send(voteBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})
