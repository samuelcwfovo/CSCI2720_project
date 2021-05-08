//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

const fetch = require('node-fetch');

const API_KEY = 'AIzaSyBNcklVz6OSbXWIS2S0pafMYKr5onunoOs'

// Return a promise containing all hospital waittime information in json
/* Json Schema:
    waitTime:
        { type: Array,
          items: {
              hospName: String,
              topWait: String
          }
        }
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

function findHospLocation(hospName) {
    let hospLocation = {
        "Alice Ho Miu Ling Nethersole Hospital": {
            latitude: 22.45869002057366,
            longitude: 114.17476612567285
        },
        "Caritas Medical Centre": {
            latitude: 22.34146349373747,
            longitude: 114.15319130786472
        },
        "Kwong Wah Hospital": {
            latitude: 22.315180227922948,
            longitude: 114.17241317232386
        },
        "North District Hospital": {
            latitude: 22.496868163189255,
            longitude: 114.12469066547412
        },
        "North Lantau Hospital": {
            latitude: 22.282026223892675,
            longitude: 113.93927002662713
        },
        "Princess Margaret Hospital": {
            latitude: 22.341359255117137,
            longitude: 114.13382128067774
        },
        "Pok Oi Hospital": {
            latitude: 22.445400901475498,
            longitude: 114.04190556256265
        },
        "Prince of Wales Hospital": {
            latitude: 22.379950025157378,
            longitude: 114.20188672660751
        },
        "Pamela Youde Nethersole Eastern Hospital": {
            latitude: 22.269597967468385,
            longitude: 114.23626453408603
        },
        "Queen Elizabeth Hospital": {
            latitude: 22.30889489105163,
            longitude: 114.17463149568599
        },
        "Queen Mary Hospital": {
            latitude: 22.27018321817183,
            longitude: 114.13113526984472
        },
        "Ruttonjee Hospital": {
            latitude: 22.27584362511142,
            longitude: 114.17530460469499
        },
        "St John Hospital": {
            latitude: 22.208047122944805,
            longitude: 114.0315189971911
        },
        "Tseung Kwan O Hospital": {
            latitude: 22.318274304722497,
            longitude: 114.26975999990627
        },
        "Tuen Mun Hospital": {
            latitude: 22.407736629353007,
            longitude: 113.97562412923689
        },
        "Tin Shui Wai Hospital": {
            latitude: 22.458461296230727,
            longitude: 113.99584432047119
        },
        "United Christian Hospital": {
            latitude: 22.323230332864227,
            longitude: 114.22700667598068
        },
        "Yan Chai Hospital": {
            latitude: 22.36971114563646,
            longitude: 114.11959581084757
        },
    }

    return hospLocation[hospName];
}


module.exports = { getHospData, findHospDataByName, findHospLocation };
