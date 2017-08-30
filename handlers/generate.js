"use strict";
var dataProvider = require("../data/generate.js");

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
     */
    post: function generateFromCURL(req, res, next) {
        /**
         * Get the data for response 201
         * For response `default` status 403 is used.
         */
        var status = 201;
        var provider = null;
        if (req.body && req.body.type && req.body.type.toLowerCase() === "curl") {
            provider = dataProvider["post"]["201"];
        } else {
            status = 403;
            provider = dataProvider["post"]["default"];
        }
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data);
        });
    }
};