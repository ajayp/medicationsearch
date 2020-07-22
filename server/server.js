// Import express framework
const express = require('express');
// Import middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger/logger');

// Import routes
const medicationRouter = require('./routes/medication-route');
// Setup default port
const PORT = process.env.PORT || 4000;
// Create express app
const app = express();
// Implement middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const csp = require('helmet-csp')

app.use(csp({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        manifestSrc: ["'self'"],
        upgradeInsecureRequests: true,
    },
    setAllHeaders: false,
    disableAndroid: false,
    browserSniff: true
}));

app.disable('x-powered-by'); //server side on port 4000 due to proxy 

app.set('query parser', (queryString) => {
    return new URLSearchParams(queryString)
})

// implement route for react build
app.use(express.static(__dirname + '/build'))

// Implement route for /api/search
app.use('/api/search', medicationRouter);
// Implement route for errors
app.use((err, req, res, next) => {
    logger.error(err.stack)
    res.status(500).send('Something broke!')
})
// Start express app
app.listen(PORT, function () {
    logger.info(`Server is running on: ${PORT}`)
})

module.exports = app;