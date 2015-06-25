//var debug = require('debug')('Bluebot');
//var app = require('./app');

//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function () {
//    debug('Express server listening on port ' + server.address().port);
//});

var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Azure Node\n');
}).listen(port);