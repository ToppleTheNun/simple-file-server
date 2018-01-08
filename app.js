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


// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});

var httpsOptions = {
    pfx: fs.readFileSync(appConfig.pfx),
    passphrase: appConfig.passphrase
};

https.createServer(httpsOptions, app).listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
