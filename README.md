# Goats API

Goats REST API is the service layer of [unholygrail.org](https://unholygrail.org) and a datasource for upcoming events and flier artwork. If you wish to contribute to the development of this project, see the pull request instruction below.

The client-side repository for this API can be found at [github.com/killeraliens/goats-client](https://github.com/killeraliens/goats-client), in case you would like to make frontend contributions.

This project is currently live at [unholygrail.org](https://unholygrail.org).


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes:

1. Clone this repository to your local machine `git clone git@github.com:killeraliens/goats-api.git`.
2. `cd` into the cloned repository.
4. Install the node dependencies `npm install`.
5. [start PostgreSQL](https://www.robinwieruch.de/postgres-sql-macos-setup).
6. Make sure migrations are current with `npm run migrate`.
8. And `npm run migrate:test` if you wish to run and create tests.
9. To run tests, use `npm run test`.
10. Start the local server with nodemon `npm run dev`.
11. Add an .env file to store keys and passwords locally.

## Make A Pull Request

1. View issues list.
2. Choose an issue with a `help wanted` tag.
3. Write a test for what you are working on.
4. [Make a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Technologies
- Node v10.15.3
- Express
- REST API
- PostgreSQL
- Testing with Mocha, Chai, Supertest
