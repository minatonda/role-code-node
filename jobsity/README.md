# Node.js Challenge
<div style="text-align: center">
    <img src="jobsity.png"/>
</div>

# Node.js Challenge

## Description
This project is designed to test your knowledge of back-end web technologies, specifically in Node.js, REST APIs, and
decoupled services (microservices).

## Implemented
* A user-facing API that will receive requests from registered users asking for quote information. 
* An internal stock service that queries external APIs to retrieve the requested quote information.
* Endpoints in the API service should require authentication (no anonymous requests should be allowed). Each request
  should be authenticated via Basic Authentication.
* When a user requests a stock quote (calls the stock endpoint in the api service), if it exists, it should be saved and
  related to that user in the database.
* A user can get their history of queries made to the api service by hitting the history endpoint. The endpoint should
  return the list of entries saved in the database, showing the latest entries first.
* A super user (and only super users) can hit the stats endpoint, which will return the top 5 most requested stocks.
* Add unit tests for the services.
* Add contract/integration tests for the API service.
* Use JWT instead of basic authentication for endpoints.
* Use OpenAPI/Swagger to document the API.
* Add endpoint to reset user password sending an email with the new password.

## How to run the project
* Install dependencies: `cd api-service; npm install` and `cd stock-service; npm install`
* Start the api service: `npm run start`
* Start the stock service: `npm run start`