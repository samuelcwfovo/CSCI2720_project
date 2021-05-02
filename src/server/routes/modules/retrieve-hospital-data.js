const fetch = require('node-fetch');

// Return a promise containing all hospital waittime information in json
/* Json Schema:
    waitTime:
        { type: Array,
          items: String}
    updateTime: String
*/
function getHospData() {
    return fetch('https://www.ha.org.hk/opendata/aed/aedwtdata-en.json')
        .then(res => res.json())
        .catch(err => err.text());
}

// Return a promise containing target hospital information in json
/* Json Schema:
    hospName: String
    topWait: String
*/
function findHospDataByName(hospName) {
    return getHospData()
        .then(data => data.waitTime)
        .then(list => {
            for (hosp of list) {
                if (hosp.hospName == hospName) {
                    return hosp;
                }
            }
            return null;
        })
}

module.exports = { getHospData, findHospDataByName };
