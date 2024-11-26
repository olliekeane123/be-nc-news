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
                // exampleArticle manually counted as 11
                const exampleArticle = articles.find(
                    (article) =>
                        article.title === "Living in the shadow of a great man"
                )
                expect(exampleArticle).toMatchObject({
                    comment_count: 11,
                })

                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("created_at", {
                    coerce: true,
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
                        comment_count: expect.any(Number),
                    })
                })
            })
    })
})

describe("/api/articles/:article_id", () => {
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
                expect(body.msg).toBe("article does not exist")
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
