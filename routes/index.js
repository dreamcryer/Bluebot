var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);


var request = require('request');
var azure = require('azure-storage');
var storageAccount = 'blubotlog'
var storageKey = 'k2i9w+R9BcOi0wOnHBVNWGMuI+MN8rLQzhp3hnpgmysX5qaJfmuur9WJ5/DGNl0rL52yY5k/kMKKv2huJwvdHA==';
var storageContainer = 'agaveanomalyml';
var anomalyBatchUrl = 'https://ussouthcentral.services.azureml.net/workspaces/db9e31e5c7dd4f4ea1ce5c16b4425036/services/3b6ba3fb5c88414a95986794752b0746/jobs?api-version=2.0';
var anomalyUrl = 'https://ussouthcentral.services.azureml.net/workspaces/db9e31e5c7dd4f4ea1ce5c16b4425036/services/3b6ba3fb5c88414a95986794752b0746/execute?api-version=2.0';
var anomalyMlKey = 'ZeehYZTf4Kxu/1YhDjm4aTjOYGzow9K2Q//6UehrpNqhSUiRQXFNLgurn2L0kgsElCCkYFPUoLuORyTUUJ19GA==';
var anomalyThreshold = 0.7;


/* GET home page. */
router.get('/', function (req, res) {
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

    //var inputFile = 'WA104238072UsageBad.txt';
    //var requestBody = {
    //    'GlobalParameters': {},
    //    'Input': {
    //        'ConnectionString': 'DefaultEndpointsProtocol=https;AccountName=' + storageAccount + ';AccountKey=' + storageKey,
    //        'RelativeLocation': storageContainer + '/' + inputFile
    //    },
    //    'Outputs': {
    //        'Output': {
    //            'ConnectionString': 'DefaultEndpointsProtocol=https;AccountName=' + storageAccount + ';AccountKey=' + storageKey,
    //            'RelativeLocation': storageContainer + '/Outputresults.csv'
    //        }
    //    }
    //};
    //var headers = {
    //    'content-type': 'application/json',
    //    'Authorization': 'Bearer ' + anomalyMlKey
    //};

    //request({
    //    uri: anomalyBatchUrl,
    //    method: 'POST',
    //    timeout: 10000,
    //    followRedirect: true,
    //    maxRedirects: 10,
    //    body: JSON.stringify(requestBody),
    //    headers: headers
    //}, function (error, response, body) {
    //    logger.debug(body);
    //    res.render('index', { title: 'Express' });
    //});

    //res.render('index', { title: 'Express' });
});

module.exports = router;