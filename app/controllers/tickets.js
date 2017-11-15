var router = require('express').Router();
var mongoose = require('mongoose');
var events = require('events');
var nodemailer = require('nodemailer');
var random = require('randomstring');
var multer = require('multer');
var fs = require('fs');
var config = require('./../../config/config.js');

var User = require('./../models/User.js');
var Ticket = require('./../models/Ticket.js');

var responseGenerator = require('./../../libs/responseGenerator.js');
var auth = require('./../../libs/auth.js');

var eventEmitter = new events.EventEmitter();

// Event when admin sends a message for a particular ticket
eventEmitter.on('Admin-Message', function (data) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.username,
            pass: config.pass
        }
    });

    const mailOptions = {
        from: 'edTickets <harishmatta06@gmail.com>', // sender address
        to: data.user, // list of receivers
        subject: 'Message from Admin', // Subject line
        html: `<p>Hello,
                A new message has been received from admin, regarding your query. Please login and check whether your query with id <span style="color:red"> ${data.id}</span>, is resolved or not.
             </p>` // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

// Event when user sends a message for a particular ticket
eventEmitter.on('User-Message', function (data) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.username,
            pass: config.pass
        }
    });

    const mailOptions = {
        from: 'edTickets <harishmatta06@gmail.com>', // sender address
        to: 'harishmatta06@gmail.com', // list of receivers
        subject: 'Message from User', // Subject line
        html: `<p>Hello,
                    A new message has been received from User, regarding query with id <span style="color:red">${data}</span> Respond to resolve the query!
                 </p>` // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

// Event trigggered when user/admin closes the ticket
eventEmitter.on('Ticket-Close', function (data) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.username,
            pass: config.pass
        }
    });

    var mails = [data.email, "harishmatta06@gmail.com"];
    var mailList = mails.toString();
    console.log(mailList);

    const mailOptions = {
        from: 'edTickets <harishmatta06@gmail.com>', // sender address
        to: mailList, // list of receivers
        subject: 'Status Changed!', // Subject line
        html: `<p>Hello,
                        your query with id <span style="color:red">${data.id}</span> has been successfully closed!
                     </p>` // plain text body
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

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

// Uploading a File
router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        res.json({
            error_code: 0,
            err_desc: null,
            data: req.file.filename,
            //destination: req.file.destination
        });
    });
});

// Downloading files uploaded
router.get('/download/:id', function (req, res) {
    var file = './uploads/' + req.params.id;
    if (fs.existsSync(file)) {
        res.download(file);
    } else {
        res.send("<h2>404. File not found</h2>")
    }
});

router.use(auth.auth);

// Creating a new Ticket
router.post('/create', function (req, res) {

    var newTicket = new Ticket({
        ticketid: random.generate(10),
        email: req.user.email,
        username: req.user.firstname + ' ' + req.user.lastname,
        title: req.body.title,
        description: req.body.description,
        filename: req.body.filename
    });

    newTicket.save(function (err) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            //console.log("Saved--");
            var response = responseGenerator.generate(false, "Ticket Raised Suuccessfully", 200, newTicket);
            res.send(response);
        }
    });
});

// Single Ticket Based on Ticket ID
router.get('/ticket/:id', function (req, res) {

    console.log(req.params.id);
    Ticket.findOne({
        ticketid: req.params.id
    }, function (err, result) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            var response = responseGenerator.generate(false, "Ticket Info", 200, result);
            res.send(response);
        }
    });
});

// All Tickets By User
router.get('/tickets', function (req, res) {
    console.log("xxx--" + req.user);
    Ticket.find({
        email: req.user.email
    }, function (err, result) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            //delete req.user;
            var response = responseGenerator.generate(false, "Tickets of users", 200, result);
            res.send(response);
        }
    });
});

// All tickets in DB
router.get('/admin/tickets', function (req, res) {
    Ticket.find({}, function (err, result) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            var response = responseGenerator.generate(false, "All Tickets", 200, result);
            res.send(response);
        }
    });
});

// Changing status of Ticket
router.post('/ticket/statuschange/:id', function (req, res) {
    var data = {
        id: req.params.id,
        email: req.body.email
    };
    console.log(data);
    Ticket.findOneAndUpdate({
        ticketid: req.params.id
    }, {
        $set: {
            status: "close"
        }
    }, function (err) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            console.log(data);
            eventEmitter.emit('Ticket-Close', data)
            var response = responseGenerator.generate(false, "Status Changed", 200, null);
            res.send(response);
        }
    });
});

// Deleting a Ticket
router.delete('/deleteticket/:id', function (req, res) {

    Ticket.findOneAndRemove({
        ticketid: req.params.id
    }, function (err) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            var response = responseGenerator.generate(false, "Ticket Deleted", 200, null);
            res.send(response);
        }
    });
});

// User Message
router.post('/message/:id', function (req, res) {

    //var text = req.body.message;
    var message = {
        sender: req.user.firstname + ' ' + req.user.lastname,
        message: req.body.message
    };
    //console.log("--->"+message);
    Ticket.findOneAndUpdate({
        ticketid: req.params.id
    }, {
        $push: {
            "messages": message
        },
    }, function (err) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            //console.log(result);
            eventEmitter.emit('User-Message', req.params.id);
            var response = responseGenerator.generate(false, "Message Sent", 200, null);
            res.send(response);
        }
    });
});

// Admin Message
router.post('/admin/message/:id', function (req, res) {

    var data = {
        user: req.body.username,
        id: req.params.id
    };
    console.log(data);

    var message = {
        sender: "Admin",
        message: req.body.message
    };

    Ticket.findOneAndUpdate({
        ticketid: req.params.id
    }, {
        $push: {
            "messages": message
        },
    }, function (err) {
        if (err) {
            var response = responseGenerator.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            //console.log(result)
            eventEmitter.emit('Admin-Message', data);
            var response = responseGenerator.generate(false, "Message Sent", 200, null);
            console.log(response);
            res.send(response);
        }
    });
});

module.exports = router;