var fs = require('fs');
var https = require('https');

var express = require('express');
var serveIndex = require('serve-index');
var app = express();

var appConfig = require('./app.json');

var oneDay = 86400000;

app.set('port', (process.env.PORT || 5000));
app.use(serveIndex('public', { icons: true, view: 'details' }));
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.use(function(req, res, next) {
    if(req.protocol !== 'https') {
        return res.status(403).send({message: 'SSL required'});
    }
    // allow the request to continue
    next();
});

var httpsOptions = {
    pfx: fs.readFileSync(appConfig.pfx),
    passphrase: appConfig.passphrase
};

https.createServer(httpsOptions, app).listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
