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