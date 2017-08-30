"use strict";
var dataProvider = require("../data/cors.js");
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
     */
    get: function getCORS(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider["get"]["200"];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
