var router = require('express').Router();


router.use('/', require('./users.js'));
router.use('/user', require('./tickets.js'));

module.exports = router;