function formatMedicationName (searchQueryName) {
    let name = searchQueryName;
    // check if space exist between words, wrap name in quotes
    if (/\s/g.test(name)) {
        name = `"${name}"`;
    }
    return name;
}
exports.formatMedicationName = formatMedicationName;

const normalizeConversions = [
    { regex: new RegExp('ä|æ|ǽ', 'g'), clean: 'ae' },
    { regex: new RegExp('ö|œ', 'g'), clean: 'oe' },
    { regex: new RegExp('ü', 'g'), clean: 'ue' },
    { regex: new RegExp('Ä', 'g'), clean: 'Ae' },
    { regex: new RegExp('Ü', 'g'), clean: 'Ue' },
    { regex: new RegExp('Ö', 'g'), clean: 'Oe' },
    { regex: new RegExp('À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ', 'g'), clean: 'A' },
    { regex: new RegExp('à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª', 'g'), clean: 'a' },
    { regex: new RegExp('Ç|Ć|Ĉ|Ċ|Č', 'g'), clean: 'C' },
    { regex: new RegExp('ç|ć|ĉ|ċ|č', 'g'), clean: 'c' },
    { regex: new RegExp('Ð|Ď|Đ', 'g'), clean: 'D' },
    { regex: new RegExp('ð|ď|đ', 'g'), clean: 'd' },
    { regex: new RegExp('È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě', 'g'), clean: 'E' },
    { regex: new RegExp('è|é|ê|ë|ē|ĕ|ė|ę|ě', 'g'), clean: 'e' },
    { regex: new RegExp('Ĝ|Ğ|Ġ|Ģ', 'g'), clean: 'G' },
    { regex: new RegExp('ĝ|ğ|ġ|ģ', 'g'), clean: 'g' },
    { regex: new RegExp('Ĥ|Ħ', 'g'), clean: 'H' },
    { regex: new RegExp('ĥ|ħ', 'g'), clean: 'h' },
    { regex: new RegExp('Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ', 'g'), clean: 'I' },
    { regex: new RegExp('ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı', 'g'), clean: 'i' },
    { regex: new RegExp('Ĵ', 'g'), clean: 'J' },
    { regex: new RegExp('ĵ', 'g'), clean: 'j' },
    { regex: new RegExp('Ķ', 'g'), clean: 'K' },
    { regex: new RegExp('ķ', 'g'), clean: 'k' },
    { regex: new RegExp('Ĺ|Ļ|Ľ|Ŀ|Ł', 'g'), clean: 'L' },
    { regex: new RegExp('ĺ|ļ|ľ|ŀ|ł', 'g'), clean: 'l' },
    { regex: new RegExp('Ñ|Ń|Ņ|Ň', 'g'), clean: 'N' },
    { regex: new RegExp('ñ|ń|ņ|ň|ŉ', 'g'), clean: 'n' },
    { regex: new RegExp('Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ', 'g'), clean: 'O' },
    { regex: new RegExp('ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º', 'g'), clean: 'o' },
    { regex: new RegExp('Ŕ|Ŗ|Ř', 'g'), clean: 'R' },
    { regex: new RegExp('ŕ|ŗ|ř', 'g'), clean: 'r' },
    { regex: new RegExp('Ś|Ŝ|Ş|Š', 'g'), clean: 'S' },
    { regex: new RegExp('ś|ŝ|ş|š|ſ', 'g'), clean: 's' },
    { regex: new RegExp('Ţ|Ť|Ŧ', 'g'), clean: 'T' },
    { regex: new RegExp('ţ|ť|ŧ', 'g'), clean: 't' },
    { regex: new RegExp('Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ', 'g'), clean: 'U' },
    { regex: new RegExp('ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ', 'g'), clean: 'u' },
    { regex: new RegExp('Ý|Ÿ|Ŷ', 'g'), clean: 'Y' },
    { regex: new RegExp('ý|ÿ|ŷ', 'g'), clean: 'y' },
    { regex: new RegExp('Ŵ', 'g'), clean: 'W' },
    { regex: new RegExp('ŵ', 'g'), clean: 'w' },
    { regex: new RegExp('Ź|Ż|Ž', 'g'), clean: 'Z' },
    { regex: new RegExp('ź|ż|ž', 'g'), clean: 'z' },
    { regex: new RegExp('Æ|Ǽ', 'g'), clean: 'AE' },
    { regex: new RegExp('ß', 'g'), clean: 'ss' },
    { regex: new RegExp('Ĳ', 'g'), clean: 'IJ' },
    { regex: new RegExp('ĳ', 'g'), clean: 'ij' },
    { regex: new RegExp('Œ', 'g'), clean: 'OE' },
    { regex: new RegExp('ƒ', 'g'), clean: 'f' }
];

// remove accents
function normalizeString (str) {
    for (let i = 0; i <= normalizeConversions.length - 1; i++) {
        str = str.replace(normalizeConversions[i].regex, normalizeConversions[i].clean);
    };
    return str;
};

exports.normalizeString = normalizeString;