
const fs = require('fs');
const Fuse = require('fuse.js');
const logger = require('../logger/logger');
const { formatMedicationName } = require('../utils/utils');

let fuse;
const fuseOptions = {
    shouldSort: true, // order by score
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 50,
    minMatchCharLength: 3,
    keys: [
        'b', // The brandName name is the name given by the company that makes the drug and is usually easy to say for sales and marketing purposes.
        'g', // The genericName name, on the other hand, is the name of the active ingredient.
    ],
};

async function init () {
    const medicationFile = '../data/medication.json';
    if (!fs.existsSync(require.resolve(medicationFile))) {
        throw new Error(`cannot find ${medicationFile}`);
    }
    const content = await fs.readFileSync(require.resolve(medicationFile), 'utf8');
    fuse = new Fuse(JSON.parse(content), fuseOptions);
}

init().then(() => {
    logger.info('medication data file loaded');
}).catch((err) => {
    logger.error(`${err}`);
});

const medicationSearchController = {
    /**
    * Search for medication
    * @param {searchQueryName} name medication Name
    * @returns {promise} returns matched medications object
    */
    searchMedication: async (searchQuery) => {
        try {
            let searchResults = await fuse.search(formatMedicationName(searchQuery));
            if (!searchResults.length) {
                return searchResults;
            } else {
                /*  searchResults are ORDERED by matching score, best match is in element[0]
                    internal data structure returns a brandName and it's associated genericName ingredient name
                    // brand example
                    {
                      "brandName": "LIPITOR", <-- marketing name by company
                      "genericName": "ATORVASTATIN CALCIUM", <-- ingredient name
                      "strength": "EQ 10MG BASE"
                    },
                    // generic example
                    {
                      "brandName": "ATORVASTATIN CALCIUM",  <-- this is a generic
                      "genericName": "ATORVASTATIN CALCIUM",  <-- ingredient name
                      "strength": "EQ 10MG BASE"
                    },
                */
                const { b: brandName, g: genericName } = searchResults[0];
                if (searchQuery !== brandName) {
                    //partial match
                    return searchResults;
                } else {
                    // we have a match, if the match is only on the brandName and not the genericName
                    // then we need to search by genericName ingredent to get full list of medications
                    if (searchQuery !== genericName) {
                        searchResults = await fuse.search(formatMedicationName(genericName));
                    }

                    // fuzzy search is partial truth, filter out any false positives,
                    // at this point we are looking to match by genericName
                    const pattern = new RegExp(`(^|\\W)${genericName}($|\\W)`);
                    const arrLength = searchResults.length;
                    const filteredResults = [];
                    for (let i = 0; i < arrLength; i++) {
                        if (pattern.test(searchResults[i].g)) {
                            filteredResults.push(searchResults[i]);
                        }
                    }
                    // let api consumer determine how this data should be presented
                    return filteredResults;
                }
            }
        } catch (err) {
            throw new Error(err);
        }
    }
};

module.exports = medicationSearchController;
