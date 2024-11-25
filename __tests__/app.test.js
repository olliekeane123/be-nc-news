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

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

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
