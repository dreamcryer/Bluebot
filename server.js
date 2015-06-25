//var app = require('./app.js');
//app.set('port', process.env.PORT || 1337);

//var server = app.listen(app.get('port'), function () {

//});

var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Azure Node\n');
}).listen(port);