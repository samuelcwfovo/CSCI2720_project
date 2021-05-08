//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

const saltRounds = 10;
const accessTokenSecret = process.env.TOKENSECRET;
const HISTORY_API_LINK = "https://api.data.gov.hk/v1/historical-archive/get-file?url=http%3A%2F%2Fwww.ha.org.hk%2Fopendata%2Faed%2Faedwtdata-en.json&time=";


const retrieveHospitalData = require('./modules/retrieve-hospital-data');
const { convertDateMongoose } = require('./modules/date-parser');

router.use(bodyParser.json());
router.use(cookieParser());

mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () { console.log("Database Connected."); });



var Schema = mongoose.Schema;

var UserSchema = Schema({
    userName: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    admin: { type: Boolean },
    favouritePlace: [{ type: Number }],
});
UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });
var UserModel = mongoose.model('User', UserSchema);


var LocationSchema = Schema({
    locId: { type: Number, required: true, unique: true },
    name: { type: String, unique: true, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});
var LocationModel = mongoose.model('Location', LocationSchema);


var WaitingTimeSchema = Schema({
    locationId: { type: Number, required: true },
    waitingTime: { type: String },
    date: { type: Date },
});
var WaitingTimeModel = mongoose.model('WaitingTime', WaitingTimeSchema);


var CommentSchema = Schema({
    locationId: { type: Number, required: true },
    author: { type: String },
    comment: { type: String },
    creationDate: { type: Date }
});
var CommentModel = mongoose.model('Comment', CommentSchema);


function updateWaitTime(locId, Wtime, Utime) {
    WaitingTimeModel.updateOne({ 'locationId': locId, 'date': Utime }, {
        $set: {
            locationId: locId,
            waitingTime: Wtime,
            date: Utime,
        },
    }, { upsert: true }, function (err) {
        if (err) { console.log(err) };
    })
}

const refreshDBData = () => {
    const dataP = retrieveHospitalData.getHospData();

    dataP.then(data => {
        let updateTime = new Date(convertDateMongoose(data['updateTime']));

        data['waitTime'].forEach((element, index) => {
            let hospName = element['hospName'];
            let time = element['topWait'];
            let locations = retrieveHospitalData.findHospLocation(hospName);

            let newLocation = {
                locId: index,
                name: hospName,
                latitude: locations.latitude,
                longitude: locations.longitude,
            }

            LocationModel.updateOne({ 'locId': newLocation.locId }, { $set: newLocation }, { upsert: true }, function (err, loc) {
                if (err) { console.log(err) };
            })

            updateWaitTime(newLocation.locId, time, updateTime);

        });

        console.log('refreshed Data');
    }).catch(error => console.log('caught', error))
}


const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) { return res.status(401).json({ code: 1, description: "token not found" }) }

    jwt.verify(token, accessTokenSecret, function (err, decoded) {
        if (err) return res.status(401).json({ code: 1, error: err, description: "token can not decode/ verify." });

        if (decoded.userId && decoded.userName) {

            //check is account valid. otherwise auth will pass if account delete in db.
            UserModel.findOne({ 'userName': decoded.userName })
                .exec(function (err, user) {
                    if (err) return res.status(500).json({ code: 0, error: err, description: "db find user error." });
                    if (!user) return res.status(401).json({ code: 1, description: "username not found." });

                    const token = jwt.sign({
                        userId: user.userId,
                        userName: user.userName,
                        admin: user.admin,
                    }, accessTokenSecret, { expiresIn: '1h' })


                    res.cookie('token', token, { maxAge: 900000 });

                    req.decoded = user;
                    next()
                })
        }

    });
};

router.post('/api/auth/token', authenticateJWT, (req, res) => {

    const decoded = req.decoded;
    return res.status(200).json({ code: 2, userInfo: decoded, description: "auth success." });

})


router.post('/api/auth/login', (req, res) => {

    UserModel.findOne({ 'userName': req.body.userName })
        .exec(function (err, user) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "find user error" });
            if (!user) return res.status(400).json({ code: 1, description: "username / password incorrect." });

            bcrypt.compare(req.body.password, user.hashedPassword, function (err, result) {
                if (err) return res.status(500).json({ code: 0, error: err, description: "check password error" });

                if (result) {
                    const payload = {
                        userId: user.userId,
                        userName: user.userName,
                        admin: user.admin,
                    }

                    const token = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' })


                    res.cookie('token', token, { maxAge: 900000 });
                    return res.status(200).json({ code: 2, userInfo: payload, description: "auth success." });

                } else {
                    return res.status(400).json({ code: 1, description: "username / password incorrect." });
                }
            });

        })
});


router.post('/api/auth/signup', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function (err, hashpw) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "hash password error" });

        UserModel.findOne({ 'userName': req.body.userName }, function (err, user) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "find exist user error" });
            if (user) return res.status(400).json({ code: 1, description: "user name already used." });

            let newUser = new UserModel({
                userName: req.body.userName,
                hashedPassword: hashpw,
                admin: req.body.userName === "admin" ? true : false,
            })

            newUser.save(function (err, savedUser) {
                if (err) return res.status(500).json({ code: 0, error: err, description: "save user error" });

                const payload = {
                    userId: savedUser.userId,
                    userName: savedUser.userName,
                    admin: savedUser.admin,
                }

                const token = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' })

                res.cookie('token', token, { maxAge: 900000 });
                return res.status(201).json({ code: 2, userInfo: payload, description: "created." })
            })
        })
    });
});

router.get('/api/hospital/:locId', authenticateJWT, (req, res) => {

    Promise.all([
        LocationModel.findOne({ locId: req.params.locId }).lean(),
        WaitingTimeModel.findOne({ locationId: req.params.locId }).lean()
    ]).then(results => {

        if (!results[0]) return res.status(400).json({ code: 1, error: err, description: "location not found." });
        if (!results[1]) return res.status(400).json({ code: 1, error: err, description: "waitTime not found." });

        results[0].waitTime = results[1]

        return res.status(200).json({ code: 2, location: results[0], description: "find location succeeded" });
    }).catch(err => {
        if (err) return res.status(500).json({ code: 0, error: err, description: "find location by locID error" });
    })
})

router.get('/api/hospital', authenticateJWT, async (req, res) => {

    let locations = await LocationModel.find().lean();

    locations = await Promise.all(
        locations.map(async (location) => {
            try {
                const waitTime = await WaitingTimeModel.findOne({ 'locationId': location.locId })
                    .sort({ 'date': -1 }).lean();
                return { ...location, waitTime };
            } catch (err) {
                return res.status(500).json({ code: 0, error: err, description: "find waitTime error" });
            }
        })
    );

    return res.status(200).json({ code: 2, hospitals: locations, description: "get hospital data successfully." })
})

router.get('/api/comment/:locId', authenticateJWT, (req, res) => {

    CommentModel.find({ locationId: req.params.locId }).sort({ 'creationDate': -1 }).exec(function (err, comments) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "find comment error" });

        return res.status(200).json({ code: 2, comments, description: "find comment succeeded" });
    })
})

router.post('/api/comment', authenticateJWT, (req, res) => {

    let newComment = new CommentModel({
        locationId: req.body.locationId,
        author: req.body.author,
        comment: req.body.comment,
        creationDate: Date.now(),
    })

    newComment.save(function (err, savedComment) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "save comment error" });

        return res.status(201).json({ code: 2, description: "comment created." })

    })
})

router.get('/api/favourite', authenticateJWT, (req, res) => {
    return res.status(201).json({ code: 2, favouritePlaces: req.decoded.favouritePlace, description: "get favourite place sucess." })
})


router.put('/api/favourite', authenticateJWT, (req, res) => {
    console.log("put favourite", req.decoded.userId)

    UserModel.updateOne({ 'userId': req.decoded.userId }, { $set: { favouritePlace: req.body.favourite } }, function (err, user) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "update favourite place error" });
        return res.status(201).json({ code: 2, description: "favourite place updated." })
    })

})

router.get('/api/historical/past-10-hour/:locId', async (req, res) => {
    let HosData = await retrieveHospitalData.getHospData();
    let apiUpdateTime = new Date(convertDateMongoose(HosData['updateTime']));
    let apiUpdateTime2 = apiUpdateTime;


    let past10Hrs = [apiUpdateTime - 2700000];
    for (var i = 0; i < 9; i++) {
        past10Hrs.unshift(past10Hrs[0] - 3600000);
    }

    let DBpast10Hrs = [new Date(apiUpdateTime2 - 3600000)];
    for (var i = 0; i < 9; i++) {
        DBpast10Hrs.unshift(new Date(DBpast10Hrs[0] - 3600000));
    }


    let dbData = await WaitingTimeModel
        .find({
            locationId: req.params.locId,
            date: { $in: DBpast10Hrs }
        })
        .sort({ date: -1 })
        .lean();


    let dbTimes = [];
    dbData.forEach(data => {
        dbTimes.push(data.date.getTime())
    })

    let links = [];
    past10Hrs.forEach(time => {
        if (!dbTimes.includes(time - 900000)) {
            const t = new Date(time);

            let YYYY = t.getFullYear() + "";
            let MM = t.getMonth() + 1;
            if (MM < 10)
                MM = "" + "0" + MM;
            else
                MM = MM + "";
            let DD = t.getDate();
            if (DD < 10)
                DD = "" + "0" + DD;
            else
                DD = DD + "";
            let hh = t.getHours();
            if (hh < 10)
                hh = "" + "0" + hh;
            else
                hh = hh + "";
            let mm = t.getMinutes();
            if (mm < 10)
                mm = "" + "0" + mm;
            else
                mm = mm + "";

            let dateFormat = YYYY + MM + DD + "-" + hh + mm;
            links.push(HISTORY_API_LINK + dateFormat);
        }
    })

    console.log("links", links)

    let finalData = dbData;

    let results = await Promise.all(
        links.map(async (link) => {
            try {
                const result = await fetch(link);
                return result.json();
            } catch (err) {
                console.log("fetch link error ", err, link)
            }
        })
    );

    results.forEach(result => {

        let apiTime = new Date(convertDateMongoose(result['updateTime']));
        result['waitTime'].forEach((element, index) => {
            let time = element['topWait'];
            updateWaitTime(index, time, apiTime);
        })

        finalData.push({
            "date": new Date(convertDateMongoose(result['updateTime'])),
            "waitingTime": result["waitTime"][req.params.locId] ? result["waitTime"][req.params.locId]["topWait"] : "",
        })
    })




    return res.status(200).json({ code: 2, finalData: finalData, description: "get past-10-hour successfully." })


})

router.get('/api/historical/past-7-day/:locId', async (req, res) => {
    let HosData = await retrieveHospitalData.getHospData();
    let apiUpdateTime = new Date(convertDateMongoose(HosData['updateTime']));
    let apiUpdateTime2 = apiUpdateTime;


    console.log("apiUpdateTime", apiUpdateTime)
    let past7Days = [new Date(apiUpdateTime - 85500000)];
    for (var i = 0; i < 6; i++) {
        past7Days.unshift(new Date(past7Days[0] - 86400000));
    }

    let DBpast7Days = [new Date(apiUpdateTime2 - 86400000)];
    for (var i = 0; i < 6; i++) {
        DBpast7Days.unshift(new Date(DBpast7Days[0] - 86400000));
    }


    let dbData = await WaitingTimeModel
        .find({
            locationId: req.params.locId,
            date: { $in: DBpast7Days }
        })
        .sort({ date: -1 })
        .lean();


    let dbTimes = [];
    dbData.forEach(data => {
        dbTimes.push(data.date.getTime())
    })

    let links = [];
    past7Days.forEach(time => {
        if (!dbTimes.includes(time - 900000)) {
            const t = new Date(time);

            let YYYY = t.getFullYear() + "";
            let MM = t.getMonth() + 1;
            if (MM < 10)
                MM = "" + "0" + MM;
            else
                MM = MM + "";
            let DD = t.getDate();
            if (DD < 10)
                DD = "" + "0" + DD;
            else
                DD = DD + "";
            let hh = t.getHours();
            if (hh < 10)
                hh = "" + "0" + hh;
            else
                hh = hh + "";
            let mm = t.getMinutes();
            if (mm < 10)
                mm = "" + "0" + mm;
            else
                mm = mm + "";

            let dateFormat = YYYY + MM + DD + "-" + hh + mm;
            links.push(HISTORY_API_LINK + dateFormat);
        }
    })

    console.log("links", links)

    let finalData = dbData;

    let results = await Promise.all(
        links.map(async (link) => {
            try {
                const result = await fetch(link);
                return result.json();
            } catch (err) {
                console.log("fetch link error ", err, link)
            }
        })
    );

    results.forEach(result => {
        let apiTime = new Date(convertDateMongoose(result['updateTime']));
        result['waitTime'].forEach((element, index) => {
            let time = element['topWait'];
            updateWaitTime(index, time, apiTime);
        })

        finalData.push({
            "date": new Date(convertDateMongoose(result['updateTime'])),
            "waitingTime": result["waitTime"][req.params.locId] ? result["waitTime"][req.params.locId]["topWait"] : "",
        })
    })




    return res.status(200).json({ code: 2, finalData: finalData, description: "get past-7-days successfully." })


})




router.put('/api/admin/refresh', authenticateJWT, (req, res) => {

    if (!req.decoded.admin) { return res.status(401).json({ code: 1, error: err, description: "not auth." }) };

    const dataP = retrieveHospitalData.getHospData();

    dataP.then(data => {
        let updateTime = new Date(convertDateMongoose(data['updateTime']));

        data['waitTime'].forEach((element, index) => {
            let hospName = element['hospName'];
            let time = element['topWait'];
            let locations = retrieveHospitalData.findHospLocation(hospName);

            let newLocation = {
                locId: index,
                name: hospName,
                latitude: locations.latitude,
                longitude: locations.longitude,
            }

            LocationModel.updateOne({ 'locId': newLocation.locId }, { $set: newLocation }, { upsert: true }, function (err, loc) {
                if (err) { console.log(err) };
            })

            updateWaitTime(newLocation.locId, time, updateTime);

        });

        return res.status(201).json({ code: 2, description: "refresh successfully." })
    }).catch(error => console.log('caught', error))
});

router.post('/api/admin/user', authenticateJWT, (req, res) => {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "create user permission denied." });

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ code: 1, description: "Please enter Username/Password to create new user" });
    }

    bcrypt.hash(req.body.password, saltRounds, function (err, hashpw) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "hash password error" });

        UserModel.findOne({ 'userName': req.body.username }, function (err, user) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "find exist user error" });
            if (user) return res.status(400).json({ code: 1, description: "user name already used." });

            let newUser = new UserModel({
                userName: req.body.username,
                hashedPassword: hashpw,
                admin: false,
            })

            newUser.save(function (err, savedUser) {
                if (err) return res.status(500).json({ code: 0, error: err, description: "save user error" });
                return res.status(201).json({ code: 2, description: "created." })
            })
        })
    });
});

router.get('/api/admin/user', authenticateJWT, (req, res) => {
    UserModel.find({},
        {
            userId: 1,
            userName: 1
        }
    ).exec(function (err, users) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "find users error" });

        return res.status(200).json({ code: 2, description: "find users succeeded", users });
    })
});

router.put('/api/admin/user', authenticateJWT, (req, res) => {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "update user permission denied." });

    if (!req.body.username && !req.body.password) {
        return res.status(400).json({ code: 1, description: "Please enter Username/Password to update" });
    }

    bcrypt.hash(req.body.password, saltRounds, function (err, hashpw) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "hash password error" });

        var uSet = {};

        if (req.body.username) uSet.userName = req.body.username;
        if (req.body.password) uSet.hashedPassword = hashpw;

        uSet = { $set: uSet }

        UserModel.updateOne({ 'userId': req.body.uid }, uSet, function (err, user) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "database error" });
            if (!user) return res.status(400).json({ code: 1, description: "cannot find the targeted user." });

            return res.status(201).json({ code: 2, description: "Username/Password updated." })
        })
    });
});

router.delete('/api/admin/user', authenticateJWT, (req, res) => {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "delete user permission denied." });

    if (!req.body.uid) {
        return res.status(400).json({ code: 1, description: "cannot get uid from request" });
    }

    UserModel.deleteOne({ 'userId': req.body.uid }, function (err, user) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "database error" });
        if (!user) return res.status(400).json({ code: 1, description: "cannot find the targeted user." });

        return res.status(201).json({ code: 2, description: "user deleted." })
    })
});

const { isEmpty, retrieveQuery } = require('./modules/json-util')
const validCol = ['locId', 'name', 'latitude', 'longitude'];

// Return all documents satisfying request conditions
router.get('/api/admin/hospital', authenticateJWT, async function (req, res) {
    let locations = await LocationModel.find().lean();

    locations = await Promise.all(
        locations.map(async (location) => {
            try {
                const waitTime = await WaitingTimeModel.findOne({ 'locationId': location.locId })
                    .sort({ 'date': -1 }).lean();
                return { ...location, waitTime };
            } catch (err) {
                return res.status(500).json({ code: 0, error: err, description: "find waitTime error" });
            }
        })
    );

    return res.status(200).json({ code: 2, description: "Success", hospitals: locations });
});

// Create ONE document with request body
router.post('/api/admin/hospital', authenticateJWT, function (req, res) {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "create hospital permission denied." });

    let newLocation = new LocationModel({
        locId: req.body.locId,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    })

    newLocation.save(function (err, savedloc) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "save location error" });
        let newWaitingTime = new WaitingTimeModel({
            date: req.body.locId,
            locationId: req.body.locId,
            waitingTime: req.body.wt,
        })
        newWaitingTime.save(function (err, savedwt) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "save waiting time error" });
            return res.status(201).json({ code: 2, description: "created." })
        })
    })
});

// Remove first record satisfing conditions in req.body
// Add {removeAll: true} in req.body for removing all records satisfing conditions
router.delete('/api/admin/hospital', authenticateJWT, function (req, res) {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "delete hospital permission denied." });

    console.log(req.body.locId);

    LocationModel.deleteOne({ 'locId': req.body.locId }, function (err, deleted) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "DB remove error" });
        else return res.status(200).json({ code: 2, description: "Success", removedCount: deleted.deletedCount });
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
router.put('/api/admin/hospital', authenticateJWT, function (req, res) {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "update hospital permission denied." });

    let updateQuery = {}
    for (col in req.body.new) {
        if (validCol.includes(col) && req.body.new[col].update) {
            updateQuery[col] = req.body.new[col].value;
        }
    }

    let condition = retrieveQuery(req.body.condition, validCol);
    if (isEmpty(condition)) return res.status(400).json({ code: 1, description: "No valid condition is given." });

    LocationModel.findOneAndUpdate(retrieveQuery(req.body.condition, validCol), updateQuery, function (err, doc) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "DB update error" });
        else return res.status(200).json({ code: 2, description: "Success", origDoc: doc });
    })
})


const initDBLocations = async () => {
    let locations = await LocationModel.find().lean();
    if (locations.length === 0) refreshDBData();
}

initDBLocations();

//db auto update wait Time every min.
setInterval(async () => {
    let data = await retrieveHospitalData.getHospData();
    let apiUpdateTime = new Date(convertDateMongoose(data['updateTime']));
    const waitingTimeData = await WaitingTimeModel.findOne().sort({ 'date': -1 }).lean();

    if (waitingTimeData === null || (apiUpdateTime > waitingTimeData.date)) {
        data['waitTime'].forEach((element, index) => {
            let time = element['topWait'];
            updateWaitTime(index, time, apiUpdateTime);
        })
        console.log("DB wait Time auto updated.")
    }

}, 60000);

module.exports = router;
