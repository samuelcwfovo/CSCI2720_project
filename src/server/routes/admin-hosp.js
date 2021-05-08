//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

const express = require('express');

const models = require('./modules/mongoose-models')

const jwt = require('jsonwebtoken');

const {isEmpty, retrieveQuery} = require('./modules/json-util')

const {authenticateJWT} = require('./modules/auth-util')

let router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json())

let LocationModel = models.LocationModel;

const PATH = '/api/admin/hospital';
const validCol = ['locId', 'name', 'latitude', 'longitude'];

// Return all documents satisfying request conditions
router.get(PATH, authenticateJWT, function (req, res) {
    if (!req.decoded.admin) return res.status(400).json({ code: 1, description: "Permission denied." });

    else {
        LocationModel.find( retrieveQuery(req.query, validCol) ).exec(function (err, hosps) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "DB find error" });
        else if (isEmpty(hosps)) return res.status(200).json({ code : 1, description : "Success, but no hospital found", hospitals: hosps });
        else return res.status(200).json({ code : 2, description : "Success", hospitals: hosps });
        })
    }
});

// Create ONE document with request body
router.post(PATH, authenticateJWT, function (req, res) {
    if (!req.decoded.admin) return res.status(400).json({ code: 1, description: "Permission denied." });

    LocationModel.create( retrieveQuery(req.body, validCol) )
        .then(doc => res.status(200).json({ code : 2, description : "Success"}))
        .catch(err => {if (err) return res.status(500).json({ code: 0, error: err, description: "DB create error" })});
});

// Remove first record satisfing conditions in req.body
// Add {removeAll: true} in req.body for removing all records satisfing conditions
router.delete(PATH, authenticateJWT, function (req, res) {
    if (!req.decoded.admin) return res.status(400).json({ code: 1, description: "Permission denied." });

    let condition = retrieveQuery(req.body, validCol);
    if (isEmpty(condition)) return res.status(400).json({ code: 1, description: "No valid condition is given." });
    
    LocationModel.remove(condition)
        .setOptions({ single: !req.body.removeAll })
        .exec(function (err, deleted) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "DB remove error" });
            else return res.status(200).json({ code : 1, description : "Success", removedCount: deleted.deletedCount });
        })
})

// Update the first document satisfing condition in req.body
/* Request body schema:
    {
        condition: {
            locId: Number,
            name: String,
            latitude: Number,
            longitude: Number,
        }
        new: {
            locId: { value: Number, update: Boolean },
            name: { value: String, update: Boolean },
            latitude: { value: Number, update: Boolean },
            longitude: { value: Number, update: Boolean },
        }
    }
*/
// At least one attribute in condition is required
// Column with attribute 'update' == true will be updated
router.put(PATH, authenticateJWT, function (req, res) {
    if (!req.decoded.admin) return res.status(400).json({ code: 1, description: "Permission denied." });

    let updateQuery = {}
    for (col in req.body.new) {
        if (validCol.includes(col) && req.body.new[col].update) {
            updateQuery[col] = req.body.new[col].value;
        }
    }

    let condition = retrieveQuery(req.body.condition, validCol);
    if (isEmpty(condition)) return res.status(400).json({ code: 1, description: "No valid condition is given." });

    LocationModel.findOneAndUpdate( retrieveQuery(req.body.condition, validCol), updateQuery, function (err, doc) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "DB update error" });
        else return res.status(200).json({ code : 1, description : "Success", origDoc: doc });
    })
})

module.exports = router;
