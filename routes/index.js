var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);

/* GET home page. */
router.get('/', function (req, res) {
    logger.debug("Rendering index...");
    res.render('index', { title: 'Express' });
});

module.exports = router;