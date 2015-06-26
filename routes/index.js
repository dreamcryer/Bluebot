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
var slackIncomingWebhook = 'https://hooks.slack.com/services/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';

/* GET home page. */
router.get('/', function (req, res) {
    var anomalies = [["27e3d0ce-b415-92b8-7ee7-d079dde09568", "65", "method", "WA104238072", "http://osf-agave/rtm/dasau/PowerPointTutorialEdog/PowerPointInteractiveTutorial.html", "8192", "2", "1", "0.861775159835815"], ["27e3d0ce-b415-92b8-7ee7-d079dde09568", "100", "method", "WA104238072", "http://osf-agave/rtm/dasau/PowerPointTutorialEdog/PowerPointInteractiveTutorial.html", "8192", "2", "1", "0.813113272190094"], ["27e3d0ce-b415-92b8-7ee7-d079dde09568", "200", "method", "WA104238072", "http://osf-agave/rtm/dasau/PowerPointTutorialEdog/PowerPointInteractiveTutorial.html", "8192", "2", "1", "0.741334140300751"]];
    var formatted = formatAnomaliesForSlack(anomalies);
    var message = {
        'attachments': formatted.attachments
    }
    
    request({
        uri: slackIncomingWebhook,
        mehotd: 'POST',
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        body: JSON.stringify(message) //message
    }, function (error, response, body) {
        logger.debug('Salck incoming webhook callback');
        logger.debug(JSON.stringify(response));
        res.send(JSON.stringify(message));
    });

    
    //logger.debug("Predict command.");
    //if (true) {
    //    var fileName = 'WA104238072UsageBad.txt';
    //    var blob = azure.createBlobService(storageAccount, storageKey);
    //    var blobLines = '';
    //    var values = [];
        
    //    logger.debug("Getting blob text");
    //    blob.getBlobToText(storageContainer, fileName, function (error, result, response) {
    //        blobLines = result.split('\r\n');
    //        blobLines.splice(0, 1);
            
    //        for (var i in blobLines) {
    //            var fields = blobLines[i].split('\t');
    //            values.push(fields);
    //        }
            
    //        var requestBody = {
    //            "Inputs": {
    //                "NewData": {
    //                    "ColumnNames": [
    //                        "SessionId",
    //                        "ApiId",
    //                        "APIType",
    //                        "AssetId",
    //                        "AppURL",
    //                        "Host",
    //                        "Label"
    //                    ],
    //                    "Values": values
    //                }
    //            },
    //            "GlobalParameters": {}
    //        }
            
    //        var headers = {
    //            'content-type': 'application/json',
    //            'authorization': 'Bearer ' + anomalyMlKey,
    //            'accept': 'application/json'
    //        };
            
    //        logger.debug("making request to predict");
    //        request({
    //            uri: anomalyUrl,
    //            method: 'POST',
    //            timeout: 10000,
    //            followRedirect: true,
    //            maxRedirects: 10,
    //            body: JSON.stringify(requestBody),
    //            headers: headers
    //        }, function (error, response, body) {
    //            logger.debug('Predict request callback');
    //            logger.debug(JSON.stringify(response));
    //            if (!error) {
    //                var result = (JSON.parse(body)).Results;
    //                var resultValues = result.Output.value.Values;
    //                var anomalies = [];
                    
    //                for (var i in resultValues) {
    //                    if (resultValues[i][8] > anomalyThreshold) {
    //                        anomalies.push(resultValues[i]);
    //                    }
    //                }
                    
    //                var message = 'Here are some suspecious activities:\r\n' + JSON.stringify(anomalies);
    //                res.send(message);
    //            }
    //        });
    //    });
    //}
    //else {
    //    res.send('Usage: /bluebot predict {blobname}');
    //}

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

    //res.render('index', { title: 'Bluebot' });
});

function formatAnomaliesForSlack(anomalies) {
    var formatted = { 'attachments': [] };
    var anomalyAttachment = {
        'fallback': JSON.stringify(anomalies),
        'text': 'Bluebot found the following anomalies.',
        'title': 'API Usage Anomaly',
        'fields': []
    }
    
    for (var i in anomalies) {
        anomalyAttachment.fields.push({
            'title': anomalies[i][0],
            'value': anomalies[i][3] + '\n' + anomalies[i][4],
            'short': false
        });
        anomalyAttachment.fields.push({
            'title': 'API ID',
            'value': anomalies[i][1],
            'short': true
        });
        anomalyAttachment.fields.push({
            'title': 'Host',
            'value': anomalies[i][5],
            'short': true
        });
        anomalyAttachment.fields.push({
            'title': 'Scored Probability',
            'value': anomalies[i][8],
            'short': true
        });
    }
    
    formatted.attachments.push(anomalyAttachment);
    
    return formatted;
}

module.exports = router;