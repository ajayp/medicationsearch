// Import express
const express = require('express');
// Import controller
const medicationSearchController = require('../controllers/medicationsearch-controller');
// Create express router
const router = express.Router();
// clean up accent chars
const utils = require('../utils/utils');
//logger
const logger = require('../logger/logger');

const cors = require('cors');


var whitelist = [process.env.ORIGIN, 'http://localhost:3001']
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

// router.get('/*', cors(corsOptionsDelegate), async (req, res) => {
router.get('/*', async (req, res) => {
    try {
        let query = new URLSearchParams(req.query)
        if (!query.has('q')) {
            return res.status(400).send('No query string provided')
        } else {
            query = req.query.q.trim().toUpperCase();
            query = utils.normalizeString(query);
            if (query.length < 2 || query.length > 36) {
                return res.status(400).send('min/max number of characters permitted is between 2 and 35');
            }
            const result = await medicationSearchController.searchMedication(query);
            res.status(200).send(result);
        }
    } catch (err) {
        logger.error(err);
        res.status(502).send('medication search service unavailable');
    }
});
module.exports = router;