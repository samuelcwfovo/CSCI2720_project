const fetch = require('node-fetch');

const API_KEY = 'AIzaSyBNcklVz6OSbXWIS2S0pafMYKr5onunoOs'

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

// Return a promise containing target hospital coordinates in json
/* Json Schema:
    lat: Number,
    lng: Number
*/
function getHospCoordinate(hospName) {
    hospName = hospName.replace(' ', '+');
    let URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${hospName}&key=${API_KEY}`
    return fetch(URL)
            .then(res => res.json())
            .then(res => res.results[0].geometry.location);
}

module.exports = { getHospData, findHospDataByName, getHospCoordinate };