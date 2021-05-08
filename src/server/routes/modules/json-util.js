//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

function isEmpty(obj) {
    return JSON.stringify(obj) == '{}';
}

function retrieveQuery(orig, validCol) {
    let query = {};
    for (col in orig) {
        if (validCol.includes(col)) {
            query[col] = orig[col];
        }
    }

    return query;
}

module.exports = {isEmpty, retrieveQuery};