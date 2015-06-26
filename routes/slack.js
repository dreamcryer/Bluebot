var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);

router.post('/cmd', function (req, res) {
    if (req.body != null || req.body != "") {
        var slackRequest = req.body.text.trim();
        var cmdTokens = slackRequest.split(' ');
        switch (cmdTokens[0]) {
            case 'list':
                res.send('Blob files:');
                break;
            case 'predict':
                res.send('Predict new data:');
                break;
            case 'report':
                res.send('Report last run:');
                break;
            default:
                res.send('Hi, ' + req.body.user_name + 'from ' + '#' + req.body.channel_name + 'on ' + req.body.team_domain);
                break;
        }
    }
});

module.exports = router;