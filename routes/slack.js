var azure = require('azure');
var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);

router.post('/cmd', function (req, res) {
    logger.debug(req.body);
    if (req.body != null || req.body != "") {
        var slackRequest = req.body.text.trim();
        var cmdTokens = slackRequest.split(' ');
        switch (cmdTokens[0]) {
            case 'listblob':
                var blob = azure.createBlobService('blubotlog', 'k2i9w+R9BcOi0wOnHBVNWGMuI+MN8rLQzhp3hnpgmysX5qaJfmuur9WJ5/DGNl0rL52yY5k/kMKKv2huJwvdHA==');
                blob.listBlobsSegmented(
                    'agaveanomalyml',
                    null,
                    function (error, result, response) {
                        var fileList = '';
                        if (!error) {
                            for (var i in result.entries) {
                                fileList += result.entries[i].name + ', ';
                            }
                            
                            if (fileList != '') {
                                fileList = fileList.substring(0, fileList.length - 2);
                            }
                        }
                        else {
                            logger.debug('Error getting segments');
                        }
                        res.send('Blob files: ' + fileList);
                    }
                );
                break;
            case 'predict':
                res.send('Predict new data:');
                break;
            case 'report':
                res.send('Report last run:');
                break;
            default:
                res.send('Hi, ' + req.body.user_name + ' from ' + '#' + req.body.channel_name + ' on ' + req.body.team_domain);
                break;
        }
    }
});

module.exports = router;