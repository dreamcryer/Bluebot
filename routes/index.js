var log = require('log');
var express = require('express');
var router = express.Router();
var logger = new log('debug', process.stdout);


//var request = require('request');
//var azure = require('azure');


/* GET home page. */
router.get('/', function (req, res) {
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

    res.render('index', { title: 'Express' });
});

module.exports = router;