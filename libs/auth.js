var jwt = require('jsonwebtoken');
var responseGenerator = require('./responseGenerator.js');
var config = require('./../config/config.js');

module.exports.auth = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token);

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                var response = responseGenerator.generate(true, "Failed to Authenticate", 403, null);
                res.json(response);
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded;
                console.log(decoded);
                next();
            }
        });

    } else {

        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};