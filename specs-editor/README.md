# Specs Generator

Specs Generator lets you import from CURL format into API specs [Swagger API specifications](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) in YAML inside your browser and to preview documentations in real time. Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

[![Build Status](https://travis-ci.org/opengate-io/specs-generator.svg?branch=master)](https://travis-ci.org/opengate-io/specs-generator)

## Running locally

##### Prerequisites
- Node 6.x
- NPM 3.x

If you have Node.js and npm installed, you can run `npm start` to spin up a static server.

Otherwise, you can open `index.html` directly from your filesystem in your browser.

If you'd like to make code changes to Specs Generator, you can start up a Webpack hot-reloading dev server via `npm run dev`. 