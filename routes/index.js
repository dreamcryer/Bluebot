var azure = require('azure');
var express = require('express');
var router = express.Router();

var tableService = azure.createTableService("k2i9w+R9BcOi0wOnHBVNWGMuI+MN8rLQzhp3hnpgmysX5qaJfmuur9WJ5/DGNl0rL52yY5k/kMKKv2huJwvdHA==");

/* GET home page. */
router.get('/', function (req, res) {
    tableService.logger = new azure.Logger(azure.Logger.LogLevels.DEBUG);
    tableService.logger.log("DEBUG", "Rendering Index page...")
    res.render('index', { title: 'Express' });
});

module.exports = router;