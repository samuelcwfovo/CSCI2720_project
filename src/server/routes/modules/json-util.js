function isEmpty(obj) {
    return JSON.stringify(obj) == {};
}

function retriveQuery(orig, validCol) {
    let query = {};
    for (col in orig) {
        if (col in validCol) {
            query[col] = orig[col];
        }
    }

    return query;
}

module.exports = {isEmpty, retriveQuery};