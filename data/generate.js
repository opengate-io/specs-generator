"use strict";
var parseCurl = require("parse-curl");
var generateSchema = require("generate-schema");
var converter = require("swagger2openapi");
var queryString = require("query-string");
var request = require("request");
var Url = require("url");
var swaggerTemplate = require("./swagger.json");

function processResponse(curlRequest, info, callback) {
    let urlObject = Url.parse(curlRequest.url);
    let responseSchema = generateSchema.json("ResponseObject", JSON.parse(info));
    swaggerTemplate.host = urlObject.host;
    swaggerTemplate.basePath = urlObject.pathname;
    swaggerTemplate.schemes = [urlObject.protocol.replace(":", "")];
    swaggerTemplate.paths["/"][curlRequest.method.toLowerCase()] = {
        "responses": {
            "200": {
                "description": "Success",
                "schema": {
                    "$ref": "#/definitions/ResponseObject"
                }
            }
        }
    };
    if (!swaggerTemplate.paths["/"][curlRequest.method.toLowerCase()].parameters) {
        swaggerTemplate.paths["/"][curlRequest.method.toLowerCase()].parameters = []
    }
    if (urlObject.search) {
        for (let [k, v] of Object.entries(queryString.parse(urlObject.search))) {
            let value = Number.parseInt(v);
            let isInteger = !isNaN(value);
            swaggerTemplate.paths["/"][curlRequest.method.toLowerCase()].parameters.push({ in: "query",
                name: k,
                type: isInteger ? "integer" : "string",
                default: isInteger ? value : v
            });
        }
    }
    if (curlRequest.header["Authorization"]) {
        swaggerTemplate.paths["/"][curlRequest.method.toLowerCase()].parameters.push({ in: "header",
            name: "Authorization",
            type: "string",
            required: true
        });
    }
    if (curlRequest.body) {
        swaggerTemplate.paths["/"][curlRequest.method.toLowerCase()].parameters.push({ in: "body",
            name: "body",
            schema: {
                "$ref": "#/definitions/RequestObject"
            }
        });
        swaggerTemplate.definitions["RequestObject"] = generateSchema.json("RequestObject", JSON.parse(curlRequest.body));
        delete swaggerTemplate.definitions["RequestObject"].$schema;
    }
    delete responseSchema.$schema;
    swaggerTemplate.definitions["ResponseObject"] = responseSchema;
    converter.convertObj(swaggerTemplate, {}, function (err, options) {
        // options.openapi contains the converted definition
        callback(options.openapi);
    });
}

function specsFromCURL(req, res, callback) {
    var curl = req.body.data.replace("--data-binary", "-d");
    var curlRequest = parseCurl(curl);
    if (curlRequest && curlRequest.url) {
        var options = {
            url: curlRequest.url,
            headers: curlRequest.header,
            method: curlRequest.method.toUpperCase(),
            body: curlRequest.body
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                processResponse(curlRequest, body, function(openapiSpecs) {
                    callback(null, openapiSpecs);
                });
            } else {
                callback(error, null);
            }
        });
    }
}

/**
 * Operations on /generate
 */
module.exports = {
    /**
     * summary: 
     * description: Generate &#39;API&#39; specs from CURL format.
     * parameters: body
     * produces: 
     * responses: 201, default
     * operationId: generateFromCURL
     */
    post: {
        201: function (req, res, callback) {
            specsFromCURL(req, res, callback);
        },
        default: function (req, res, callback) {
            callback(null, {
                message: "Unexpected parameters or missing."
            });
        }
    }
};