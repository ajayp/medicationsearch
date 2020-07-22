// Import express framework
const express = require('express');
// Import middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger/logger');

var whitelist = [process.env.ORIGIN, 'http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
    //console.log(req.header)
    var corsOptions;
    console.log(req.headers);
    console.log(req.header('Origin'))
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};

const corsOptions = {
    origin: 'http://example.com'
}



//app.use(cors(corsOptionsDelegate));

// Import routes
const medicationRouter = require('./routes/medication-route');
// Setup default port
const PORT = process.env.PORT || 4000;
// Create express app
const app = express();


// app.use(cors(corsOptionsDelegate));
// app.use(cors(corsOptions))
// Implement middleware
// app.use(cors());
// app.use(compression());
//app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const csp = require('helmet-csp');
// app.use(csp({
//     directives: {
//         defaultSrc: ["'none'"],
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         styleSrc: ["'self'"],
//         imgSrc: ["'self'"],
//         manifestSrc: ["'self'"],
//         connectSrc: ["'self'"],
//         upgradeInsecureRequests: true,
//     },
//     // setAllHeaders: false,
//     disableAndroid: false,
//     browserSniff: true
// }));
app.disable('x-powered-by'); //server side on port 4000 due to proxy 


// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "122.22.22.22");
//     next();
// });




// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     console.log('dd')
//     next();
// });


// app.use((req, res, next) => {
//     console.log(req)
//     // res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "122.22.22.22");
//     next();
// });


app.set('query parser', (queryString) => {
    return new URLSearchParams(queryString)
})

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.mywebsite.com");

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
});

// implement route for react build
app.use(express.static(__dirname + '/build'))

//app.options('/api/search', cors(corsOptions));

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