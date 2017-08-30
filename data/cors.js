"use strict";
var Mockgen = require("./mockgen.js");
/**
 * Operations on /cors
 */
module.exports = {
    /**
     * summary: 
     * description: Get &#39;API&#39; resource from browser request (CORS passthrough).
     * parameters: url
     * produces: 
     * responses: 200, default
     * operationId: getCORS
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: "/cors",
                operation: "get",
                response: "200"
            }, callback);
        },
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: "/cors",
                operation: "get",
                response: "default"
            }, callback);
        }
    }
};
