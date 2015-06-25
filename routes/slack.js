var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);

router.post('/cmd', function (req, res) {
    logger.debug(req.body);
    res.send('test');
});

module.exports = router;