var request = require('request');
var azure = require('azure-storage');
var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);

var storageAccount = 'blubotlog'
var storageKey = 'k2i9w+R9BcOi0wOnHBVNWGMuI+MN8rLQzhp3hnpgmysX5qaJfmuur9WJ5/DGNl0rL52yY5k/kMKKv2huJwvdHA==';
var storageContainer = 'agaveanomalyml';
var anomalyBatchUrl = 'https://ussouthcentral.services.azureml.net/workspaces/db9e31e5c7dd4f4ea1ce5c16b4425036/services/3b6ba3fb5c88414a95986794752b0746/jobs?api-version=2.0';
var anomalyUrl = 'https://ussouthcentral.services.azureml.net/workspaces/db9e31e5c7dd4f4ea1ce5c16b4425036/services/3b6ba3fb5c88414a95986794752b0746/execute?api-version=2.0';
var anomalyMlKey = 'ZeehYZTf4Kxu/1YhDjm4aTjOYGzow9K2Q//6UehrpNqhSUiRQXFNLgurn2L0kgsElCCkYFPUoLuORyTUUJ19GA==';
var anomalyThreshold = 0.7;
var Command = { 'Listblob': 'listblob', 'Predict': 'predict', 'Report': 'report' };

router.post('/cmd', function (req, res) {
    logger.debug(req.body);
    if (req.body != null || req.body != "") {
        var slackRequest = req.body.text.trim();
        var cmdTokens = slackRequest.split(' ');
        switch (cmdTokens[0]) {
            case Command.Listblob:
                var blob = azure.createBlobService(storageAccount, storageKey);
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
            case Command.Predict:
                logger.debug("Predict command.");
                if (true) {
                    var fileName = 'WA104238072UsageBad.txt';
                    var blob = azure.createBlobService(storageAccount, storageKey);
                    var blobLines = '';
                    var values = [];
                    
                    logger.debug("Getting blob text");
                    blob.getBlobToText(storageContainer, fileName, function (error, result, response) {
                        blobLines = result.split('\r\n');
                        blobLines.splice(0, 1);
                        
                        for (var i in blobLines) {
                            var fields = blobLines[i].split('\t');
                            values.push(fields);
                        }
                        
                        var requestBody = {
                            "Inputs": {
                                "NewData": {
                                    "ColumnNames": [
                                        "SessionId",
                                        "ApiId",
                                        "APIType",
                                        "AssetId",
                                        "AppURL",
                                        "Host",
                                        "Label"
                                    ],
                                    "Values": values
                                }
                            },
                            "GlobalParameters": {}
                        }
                        
                        var headers = {
                            'content-type': 'application/json',
                            'authorization': 'Bearer ' + anomalyMlKey,
                            'accept': 'application/json'
                        };
                        
                        logger.debug("making request to predict");
                        request({
                            uri: anomalyUrl,
                            method: 'POST',
                            timeout: 10000,
                            followRedirect: true,
                            maxRedirects: 10,
                            body: JSON.stringify(requestBody),
                            headers: headers
                        }, function (error, response, body) {
                            logger.debug('Predict request callback');
                            logger.debug(JSON.stringify(response));
                            if (!error) {
                                var result = (JSON.parse(body)).Results;
                                var resultValues = result.Output.value.Values;
                                var anomalies = [];
                                
                                for (var i in resultValues) {
                                    if (resultValues[i][8] > anomalyThreshold) {
                                        anomalies.push(resultValues[i]);
                                    }
                                }
                                
                                var message = 'Here are some suspecious activities:\r\n' + JSON.stringify(anomalies);
                                res.send(message);
                            }
                        });
                    });
                }
                else {
                    res.send('Usage: /bluebot predict {blobname}');
                }
                break;
            case Command.Report:
                res.send('Report last run:');
                break;
            default:
                res.send('Hi, ' + req.body.user_name + ' from ' + '#' + req.body.channel_name + ' on ' + req.body.team_domain);
                break;
        }
    }
});

module.exports = router;