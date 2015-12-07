var express = require('express');
var app = express();

var oneDay = 86400000;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/files', { maxAge: oneDay }));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});