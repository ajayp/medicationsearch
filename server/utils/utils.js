function formatMedicationName (searchQueryName) {
    let name = searchQueryName;
    // check if space exist between words, wrap name in quotes
    if (/\s/g.test(name)) {
        name = `"${name}"`;
    }
    return name;
}
exports.formatMedicationName = formatMedicationName;
