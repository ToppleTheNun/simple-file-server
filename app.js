var express = require('express');
var serveIndex = require('serve-index');
var app = express();

var oneDay = 86400000;

app.set('port', (process.env.PORT || 5000));
app.use(serveIndex('public', { icons: true, view: 'details' }));
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});