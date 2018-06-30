# API CHALLENGE

A [node.js](https://nodejs.org/en/) API that makes requests to the terribly designed Generic Motors (GM) API and returns structured, consistent responses.

This API was built with:
- [Express](http://expressjs.com/) for its routing, error handling, and middleware support.
- [Request](https://github.com/request/request) to simplify the process of making external HTTP requests.
- [body-parser](https://github.com/expressjs/body-parser) to parse incoming request bodies easily in middleware.

## Requirements

- Node (v4.4.3) and npm (v3.8.6)

## Installation

- Install dependencies: `npm install`
- Start the server: `node ./src/start.js`

## Testing the API
- Test the API using [Postman](https://chrome.google.com/webstore/detail/postman-rest-client-packa/fhbjgbiflinjbdggehcddcbncdddomop)
- To run tests: `npm test`
- To check code coverage: `npm run coverage` followed by `open coverage/lcov-report/index.html` to view the HTML report

Unit tests should display as shown below:

![Image of Unit Tests](http://i.imgur.com/9usoDOV.png)

Coverage:

![Image of Coverage Test](http://i.imgur.com/mJe4k9I.png)
