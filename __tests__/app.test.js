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

describe("GET/POST/PATCH/DELETE /api/* - (Global Errors)", () => {
    test("GET  404: Returns appropriate Not Found Error message when unfound GET request is made", () => {
        return request(app)
            .get("/api/bananas")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("/api/bananas Not Found On Server")
            })
    })
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
    test("200: returns array of articles (default limit: 10, default page: 1) with the correct key values - including the key of body removed, and an added key of comment_count with the correct values. Array should be sorted by time created in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
                expect(articles).toHaveLength(10)
                expect(total_count).toBe(13)
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        avatar_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
    test("200: returns array of articles (default limit: 10, default page: 1) sorted by the any valid column specified in the query (default: descending order)", () => {
        return request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
                expect(articles).toHaveLength(10)
                expect(total_count).toBe(13)
                expect(articles).toBeSortedBy("comment_count", {
                    descending: true,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        avatar_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
    test("400: sends an appropriate status and error message when given a non-existent sort_by query (non-existent column)", () => {
        return request(app)
            .get("/api/articles?sort_by=bananas")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request: Invalid Sort_By Query")
            })
    })
    test("400: sends an appropriate status and error message when given a valid but non-existent sort_by query (ambiguous column - body is a column but does not exist in the returned query object)", () => {
        return request(app)
            .get("/api/articles?sort_by=body")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request: Invalid Sort_By Query")
            })
    })
    test("400: sends an appropriate status and error message when given an invalid sort_by query", () => {
        return request(app)
            .get("/api/articles?sort_by=123")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request: Invalid Sort_By Query")
            })
    })
    test("200: returns array of articles (default limit: 10, default page: 1) sorted in the order of the specified order query (With sort_by query)", () => {
        return request(app)
            .get("/api/articles?sort_by=comment_count&order=asc")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
                expect(articles).toHaveLength(10)
                expect(total_count).toBe(13)
                expect(articles).toBeSortedBy("comment_count", {
                    descending: false,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        avatar_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
    test("200: returns array of articles (default limit: 10, default page: 1) sorted in the order of the specified order query (Without sort_by query)", () => {
        return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
                expect(articles).toHaveLength(10)
                expect(total_count).toBe(13)
                expect(articles).toBeSortedBy("created_at", {
                    descending: false,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        avatar_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
    test("400: sends an appropriate status and error message when given an invalid order query", () => {
        return request(app)
            .get("/api/articles?order=invalid-order")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request: Invalid Order Query")
            })
    })
    test("200: returns array of articles (default limit: 10, default page: 1) filtered by the topic specified in the query", () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
                expect(articles).toHaveLength(10)
                expect(total_count).toBe(12)
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: "mitch",
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        avatar_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
    test("400: sends an appropriate status and error message when given an invalid topic query", () => {
        return request(app)
            .get("/api/articles?topic=invalid-topic")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request: Invalid Topic Query")
            })
    })
    test("200: returns array of articles with the offset point corresponding to the specified page in the query (default limit: 10) ", () => {
        return request(app)
            .get("/api/articles?p=2")
            .expect(200)
            .then(({ body: { articles, total_count } }) => {
                expect(articles).toHaveLength(3)
                expect(total_count).toBe(13)
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                })
                articles.forEach((article) => {
                    expect(article).not.toContainKey("body")
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        avatar_url: expect.any(String),
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
                expect(article.comment_count).toBe(11)
                expect(article.avatar_url).toBe(
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
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
                        avatar_url: expect.any(String)
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
                expect(body.msg).toBe("article_id Does Not Exist")
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
                expect(body.msg).toBe("article_id Does Not Exist")
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
                expect(body.msg).toBe("article_id Does Not Exist")
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

describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE:204 deletes the specified comment and sends no body back", () => {
        return request(app).delete("/api/comments/5").expect(204)
    })
    test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment Does Not Exist")
            })
    })
    test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .delete("/api/comments/not-a-comment")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("GET /api/users", () => {
    test("200: returns array of all users objects with the correct key values - username, name and avatar_url", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
                expect(users.length).toBe(4)
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                })
            })
    })
})

describe("GET /api/users/:username", () => {
    test("GET:200 sends a single user to the client corresponding to requested username", () => {
        return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body: { user } }) => {
                expect(user.username).toBe("lurker")
                expect(user.name).toBe("do_nothing")
                expect(user.avatar_url).toBe(
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
                )
            })
    })
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent username", () => {
        return request(app)
            .get("/api/users/testusername")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User Does Not Exist")
            })
    })
    test("GET:400 sends an appropriate status and error message when given an invalid username path", () => {
        return request(app)
            .get("/api/articles/not_a_username")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("PATCH /api/comments/:comment_id", () => {
    test("PATCH:200 alters the vote property of the specified comment (comment_id) by the value of the (positive) voteDifference sent in the request, responds with updated comment to the client", () => {
        const voteBody = { voteDifference: 1 }
        return request(app)
            .patch("/api/comments/3")
            .send(voteBody)
            .expect(200)
            .then(({ body: { updatedComment } }) => {
                expect(updatedComment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: 101,
                    created_at: expect.any(String),
                })
            })
    })
    test("PATCH:200 alters the vote property of the specified comment (comment_id) by the value of the (negative) voteDifference sent in the request, responds with updated comment to the client", () => {
        const voteBody = { voteDifference: -60 }
        return request(app)
            .patch("/api/comments/3")
            .send(voteBody)
            .expect(200)
            .then(({ body: { updatedComment } }) => {
                expect(updatedComment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: 40,
                    created_at: expect.any(String),
                })
            })
    })
    test("PATCH:400 responds with an appropriate status and error message when provided with a bad voteBody (invalid voteDifference))", () => {
        const voteBody = { voteDifference: "banana" }
        return request(app)
            .patch("/api/comments/2")
            .send(voteBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent comment_id", () => {
        const voteBody = { voteDifference: 50 }
        return request(app)
            .patch("/api/comments/999")
            .send(voteBody)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("comment_id Does Not Exist")
            })
    })
    test("PATCH:400 sends an appropriate status and error message when given an invalid comment_id", () => {
        const voteBody = { voteDifference: 50 }
        return request(app)
            .patch("/api/comments/not_a_comment")
            .send(voteBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("POST /api/articles", () => {
    test("POST:201 inserts a new article to the db and sends the article body back to the client", () => {
        const newArticle = {
            title: "Test title",
            topic: "cats",
            author: "butter_bridge",
            body: "This is just a test article",
            article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body: { newArticle } }) => {
                expect(newArticle).toMatchObject({
                    article_id: expect.any(Number),
                    title: "Test title",
                    topic: "cats",
                    author: "butter_bridge",
                    body: "This is just a test article",
                    created_at: expect.any(String),
                    votes: 0,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: 0,
                })
            })
    })
    test("POST:201 when passed article without article_img_url inserts a new article to the db and sends the article body back to the client with the default article_img_url", () => {
        const newArticle = {
            title: "Test title",
            topic: "cats",
            author: "butter_bridge",
            body: "This is just a test article",
        }
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body: { newArticle } }) => {
                expect(newArticle).toMatchObject({
                    article_id: expect.any(Number),
                    title: "Test title",
                    topic: "cats",
                    author: "butter_bridge",
                    body: "This is just a test article",
                    created_at: expect.any(String),
                    votes: 0,
                    article_img_url:
                        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
                    comment_count: 0,
                })
            })
    })

    test("POST:400 responds with an appropriate status and error message when provided with an invalid article body (missing title)", () => {
        const badArticle = {
            topic: "cats",
            author: "butter_bridge",
            body: "This is just a test article",
            article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
        return request(app)
            .post("/api/articles")
            .send(badArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })

    test("POST:400 responds with an appropriate status and error message when provided with an invalid topic", () => {
        const badArticle = {
            title: "Test title",
            topic: "nonexistent_topic",
            author: "butter_bridge",
            body: "This is just a test article",
            article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
        return request(app)
            .post("/api/articles")
            .send(badArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })

    test("POST:400 responds with an appropriate status and error message when provided with a non-existent author", () => {
        const badArticle = {
            title: "Test title",
            topic: "cats",
            author: "nonexistent_author",
            body: "This is just a test article",
            article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
        return request(app)
            .post("/api/articles")
            .send(badArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            })
    })
})
