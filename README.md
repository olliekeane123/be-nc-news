# Northcoders News API

## **Hosted Version**

You can access the hosted version of the API at https://ollie-be-nc-news.onrender.com/api.

## **Project Summary**

Nc-news is a RESTful API built using Node.js, Express, and PostgreSQL. It serves as the backend for a news platform application, providing endpoints to get, post, patch, and delete data with support for dynamic queries to the database.

Following TDD methods, The API is fully tested using Jest and Supertest, for both happy paths and sad paths with robust error-handling implemented.

## **Available Endpoints**

GET /api -Serves up a JSON representation of all the available endpoints of the API (See for example outputs and more details for each enpoint)

GET /api/topics -Serves an array of all topics

GET /api/articles -Serves an array of all articles. Sorted by date/time (created_at) in descending order

GET /api/articles/:article_id -Serves an object of one article specified by article_id parameter

GET /api/articles/:article_id/comments -Serves an array of comments relating to the article specified by article_id parameter

GET /api/users -Serves an array of all users

GET /api/users/:username  -Serves an object of one user specified by the :username parameter

POST /api/articles/:article_id/comments -Inserts a new comment to the database and sends the comment body back to the client

PATCH /api/articles/:article_id -Alters the vote property of the specified article (article_id) by the value of the voteDifference sent in the request, responds with updated article to the client

DELETE /api/articles/:article_id -Deletes the specified comment and sends no body back

## **Getting Started**

Follow these instructions to set up and run the project locally.

1. Ensure you have the following installed:

    - Node.js: v22.0.0 or higher
    - PostgreSQL: v16.0 or higher

2. Clone the Repository:
   https://github.com/olliekeane123/be-nc-news.git

3. Install the dependencies with 'npm install'

4. Ensure access to neccessary environment variables:

    - Make sure dotenv is installed locally
    - Create **.env.development** file and name the appropriate database inside **(PGDATABASE=nc_news)**
    - Create **.env.test** file and name the appropriate database inside **(PGDATABASE=nc_news_test)**

5. Setup and seed local database with 'npm run setup-dbs' and 'npm run seed'

6. To test and ensure everything is set up properly, run 'npm test' or 'npm run test app' to ignore the tests for the utilities functions

7. _Optional_: Run 'npm start' to start the API on a local server (default: 8000)

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
