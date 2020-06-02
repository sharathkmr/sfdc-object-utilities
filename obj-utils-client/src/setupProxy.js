const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/auth/login', createProxyMiddleware({ target: 'http://localhost:3001/' }));
    app.use('/token', createProxyMiddleware({ target: 'http://localhost:3001/' }));
    app.use('/logout', createProxyMiddleware({ target: 'http://localhost:3001/' }));
    app.use('/api/objectsList', createProxyMiddleware({ target: 'http://localhost:3001/' }));
    app.use('/api/toolingQuery', createProxyMiddleware({ target: 'http://localhost:3001/' }));
    app.use('/api/sobject/describe', createProxyMiddleware({ target: 'http://localhost:3001/' }));
};