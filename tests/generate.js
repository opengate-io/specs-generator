"use strict";
var Test = require("tape");
var Express = require("express");
var BodyParser = require("body-parser");
var Swaggerize = require("swaggerize-express");
var Path = require("path");
var Request = require("supertest");
var Mockgen = require("../data/mockgen.js");
var Parser = require("swagger-parser");
/**
 * Test for /generate
 */
Test("/generate", function (t) {
    var apiPath = Path.resolve(__dirname, "../config/swagger.yaml");
    var App = Express();
    App.use(BodyParser.json());
    App.use(BodyParser.urlencoded({
        extended: true
    }));
    App.use(Swaggerize({
        api: apiPath,
        handlers: Path.resolve(__dirname, "../handlers")
    }));
    Parser.validate(apiPath, function (err, api) {
        t.error(err, "No parse error");
        t.ok(api, "Valid swagger api");
        /**
         * summary: 
         * description: Generate &#39;API&#39; specs from CURL format.
         * parameters: body
         * produces: 
         * responses: 201, default
         */
        t.test("test generateFromCURL post operation type=CURL", function (t) {
            Mockgen().requests({
                path: "/generate",
                operation: "post"
            }, function (err, mock) {
                var request;
                t.error(err);
                t.ok(mock);
                t.ok(mock.request);
                //Get the resolved path from mock request
                //Mock request Path templates({}) are resolved using path parameters
                request = Request(App)
                    .post("" + mock.request.path);
                if (mock.request.body) {
                    //Send the request body
                    mock.request.body.type = "CURL";
                    mock.request.body.data = "curl http://petstore.swagger.io/v2/swagger.json?foo=bar";
                    request = request.send(mock.request.body);
                }
                request.end(function (err, res) {
                    t.error(err, "No error");
                    t.ok(res.statusCode === 201, "Ok response status");
                    t.end();
                });
            });
        });
            /**
         * summary: 
         * description: Generate &#39;API&#39; specs from CURL format.
         * parameters: body
         * produces: 
         * responses: 201, default
         */
        t.test("test generateFromCURL post operation type=Unknown", function (t) {
            Mockgen().requests({
                path: "/generate",
                operation: "post"
            }, function (err, mock) {
                var request;
                t.error(err);
                t.ok(mock);
                t.ok(mock.request);
                //Get the resolved path from mock request
                //Mock request Path templates({}) are resolved using path parameters
                request = Request(App)
                    .post("" + mock.request.path);
                if (mock.request.body) {
                    //Send the request body
                    mock.request.body.type = "Unknown";
                    mock.request.body.data = "curl http://petstore.swagger.io/v2/swagger.json";
                    request = request.send(mock.request.body);
                }
                request.end(function (err, res) {
                    t.error(err, "No error");
                    t.ok(res.statusCode === 403, res.message);
                    t.end();
                });
            });
        });
    });
});