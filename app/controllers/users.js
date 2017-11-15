var router = require('express').Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var events = require('events');
var nodemailer = require('nodemailer');
var random = require('randomstring');

var User = require('./../models/User.js');
var responseGenerator = require('./../../libs/responseGenerator.js');
var config = require('./../../config/config.js');
var eventEmitter = new events.EventEmitter();

eventEmitter.on('welcome-mail', function (data) {

    console.log("Welcome " + data.firstname + " " + data.lastname);
    console.log(delete data.password);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.username,
            pass: config.pass
        }
    });

    const mailOptions = {
        from: 'edTickets <harishmatta06@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: 'Welcome to edTickets', // Subject line
        html: `<p>Hello! ${data.firstname} ${data.lastname} </p>` // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

eventEmitter.on('send-unique', function (data) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.username,
            pass: config.pass
        }
    });


    const mailOptions = {
        from: 'edTickets <harishmatta06@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: 'Pssword Reset', // Subject line
        html: `<p>Your Unique Id for resetting the password : <b style="color:red">${data.id}</b></p>` // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

// API to register an account
router.post('/register', function (req, res) {

    User.findOne({
        'email': req.body.email
    }, function (err, result) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else if (result) {
            var response = responseGenerator.generate(true, "User already exists", 409, null);
            console.log(result);
            res.send(response);
        } else {
            var newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password
            });

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    newUser.password = hash;
                    newUser.save(function (err) {
                        if (err) {

                            var response = responseGenerator.generate(true, "Some error", 500, null);
                            res.send(response);
                        } else {

                            var response = responseGenerator.generate(false, "Account created successfully! Now you can Login!!", 200, null);
                            eventEmitter.emit('welcome-mail', newUser);
                            res.send(response);
                        }
                    });
                });
            });

        }
    });

});

// API to verify Login
router.post('/login', function (req, res) {
    User.findOne({
        'email': req.body.email
    }, function (err, result) {
        //console.log(result);
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else if (result == null) {
            var response = responseGenerator.generate(true, "Invalid username", 409, null);
            res.send(response);
        } else if (result) {
            bcrypt.compare(req.body.password, result.password, function (err, isMatch) {
                if (err) throw err;
                console.log(isMatch);
                if (isMatch) {
                    //var response = responseGenerator.generate(false, "Login Successful", 200, result);
                    console.log(config.secret);
                    //console.log(result);
                    var payload = result.toObject();
                    delete payload.password;
                    var token = jwt.sign(payload, config.secret, {
                        expiresIn: 30 * 60
                    });
                    res.json({
                        error: false,
                        token: token
                    });
                } else if (!isMatch) {
                    var response = responseGenerator.generate(true, "Invalid Password", 500, null);
                    res.send(response);
                }
            });
        }
    });
});

// API to send OTP 
router.post('/forgot-password', function (req, res) {
    var email = req.body.email;
    req.session.email = email;
    req.session.shortid = random.generate(6);
    console.log(req.session.shortid);
    eventEmitter.emit('send-unique', {
        email: email,
        id: req.session.shortid
    });
    console.log("Forgot- " + req.session.shortid);
    var response = responseGenerator.generate(false, "Unique ID sent successfully", 200, req.session.shortid);
    res.json(response);
});

// API to verify the OTP sent to mail
router.get('/verify-unique', function (req, res) {
    var id = req.query.otp;
    console.log("Matta-->" + id);
    console.log("Veify- " + req.session.shortid);
    if (id === req.session.shortid) {
        var response = responseGenerator.generate(false, "Unique matched", 200, req.session.shortid);
        res.json(response);
        //req.session.destroy();
    } else {
        var response = responseGenerator.generate(true, "Unique ID didn't match", 200, null);
        res.json(response);
    }
});

// API to reset-passowrd
router.post('/reset-password', function (req, res) {
    var password = req.body.password;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            password = hash;
            User.findOneAndUpdate({
                email: req.session.email
            }, {
                $set: {
                    password: password
                }
            }, function (err, doc) {
                if (err) {
                    var response = responseGenerator.generate(true, "Some Internal Error", 500, null);
                    res.json(response);
                } else {
                    var response = responseGenerator.generate(false, "Password changed successfully", 200, null);
                    res.json(response);
                }
            });
        });
    });

});

module.exports = router;