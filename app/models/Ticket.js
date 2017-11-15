var mongoose = require('mongoose');

var ticketSchema = new mongoose.Schema({

    ticketid: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "open"
    },
    filename: {
        type: String
    },
    messages: [{
        sender: {
            type: String
        },
        message: {
            type: String
        },
        created: {
            type: Date,
            default: Date.now
        },
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

var Ticket = module.exports = mongoose.model('Ticket', ticketSchema);