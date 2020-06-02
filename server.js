const express = require('express');
const jsforce = require('jsforce');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./oauthConfig');
// Setup HTTP server
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'obj-utils-client/build')));

//initialize session
app.use(session({ secret: 'S3CRE7', resave: true, saveUninitialized: true }));
//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let oauth2;

let dynamicOauth = function (target) {
    if (target.toLowerCase() === 'sandbox') {
        return new jsforce.OAuth2({
            loginUrl: process.env.LOGIN_SANDBOX_URL || config.oauthConfig.sandbox_login,
            clientId: process.env.CLIENT_KEY || config.oauthConfig.client_id,
            redirectUri: process.env.REDIRECT_URL || config.oauthConfig.redirect_url
        });
    } else {
        return new jsforce.OAuth2({
            loginUrl: process.env.LOGIN_PROD_URL || config.oauthConfig.prod_login,
            clientId: process.env.CLIENT_KEY || config.oauthConfig.client_id,
            redirectUri: process.env.REDIRECT_URL || config.oauthConfig.redirect_url
        });
    }
}

/**
 * redirect to the Authorization/login page based on the target 
 */
app.get("/auth/login", function (req, res) {
    // let queryParams = Object.entries(req.query);
    // console.log(req.query['target']);
    oauth2 = dynamicOauth(req.query['target']);
    // Redirect to Salesforce login/authorization page
    res.redirect(oauth2.getAuthorizationUrl({ scope: 'api id web refresh_token' }));
});

/**
 * To get the Access and Refresh token after oAuth
 */
app.get('/token', function (req, res) {
    const conn = new jsforce.Connection({ oauth2: oauth2 });
    const code = req.query.code;
    conn.authorize(code, function (err, userInfo) {
        if (err) { return console.error("This error is in the auth callback: " + err); }
        // console.log('Access Token: ' + conn.accessToken);
        // console.log('refreshToken: ' + conn.refreshToken);
        console.log('Instance URL: ' + conn.instanceUrl);
        console.log('User ID: ' + userInfo.id);
        console.log('Org ID: ' + userInfo.organizationId);
        console.log('userinfo: ', userInfo);
        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        req.session.refreshToken = conn.refreshToken;
        var string = encodeURIComponent('true');
        
        // console.log(req.header('host'));
        conn.identity(function (err, respsonse) {
            if (err) { return console.error(err); }
            console.log("user ID: " + respsonse.user_id);
            console.log("organization ID: " + respsonse.organization_id);
            console.log("username: " + respsonse.username);
            console.log("display name: " + respsonse.display_name);
            res.redirect('http://' + req.header('host') + '?tokenValidated=' + string + '&username=' + respsonse.username);
        });
    });
});

/**
 * To get the objects list from the sfdc instance
 */
app.get('/api/objectsList', function (req, res) {
    // console.log('accessToken: ', req.session.accessToken);
    console.log('instanceUrl: ', req.session.instanceUrl);
    if(!req.session.accessToken || !req.session.instanceUrl) {
        throw new Error('INVALID_SESSION_ID');
    }
    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    let url = "/services/data/v48.0/sobjects/";
    // console.log(conn);
    conn.request({
        method: 'GET',
        url: url,
        headers: {
            'content-type': 'application/json',
        },
    }).then(resp => {
        res.json(resp);
    }).catch(err => {
        throw new Error(err);
    });
});

/**
 * To get the object related details from sfdc instance
 */
app.get('/api/sobject/describe', function (req, res) {
    // console.log('accessToken: ', req.session.accessToken);
    console.log('instanceUrl: ', req.session.instanceUrl);

    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    conn.sobject(req.query.sobject).describe(function(err, meta) {
        if(err) { 
            console.error(err);
            res.status(500).send(err);
        }
        res.json(meta);
    });
});

/**
 * To query metadata related details using sfdc Tooling api
 */
app.get('/api/toolingQuery', function (req, res) {
    // console.log('accessToken: ', req.session.accessToken);
    console.log('instanceUrl: ', req.session.instanceUrl);

    let conn = new jsforce.Connection({
        oauth2: { oauth2 },
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    let queries = req.query.soqlQueries;
    // console.log('soqlQueries: ', queries);

    let objectData = {};

    conn.tooling.query(queries[0]).execute(function (err, recs) {
        if (err) {
            // console.error(err);
            res.status(500).send(err);
        }
        
        objectData.fieldDef = recs;
        let objectId;

        if (recs.size > 0 && recs.records && recs.records[0].EntityDefinition && recs.records[0].EntityDefinition.DurableId) {
            objectId = recs.records[0].EntityDefinition.DurableId;
        } else {
            objectId = req.query.sobject;
        }
        
        conn.tooling.query(queries[1] + "'" + objectId + "'").execute(function (err, recs) {
            if (err) {
                return console.error(err);
            }
            
            objectData.fieldDetails = recs;
            res.json(objectData);
        });
    });
});

/**
 * To logout from the sfdc session
 */
app.get('/logout', function (req, res) {
    // console.log('accessToken: ', req.session.accessToken);
    console.log('instanceUrl: ', req.session.instanceUrl);

    let conn = new jsforce.Connection({
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
    });

    conn.logout(function (err) {
        if (err) { 
            // return console.error(err);
            res.status(500).send(err);
        }
        // now the session has been expired.
        // console.log('host: ', req.header('host'));
        res.redirect('http://' + req.header('host'));
    });
});

module.exports = app;

