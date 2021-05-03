var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const saltRounds = 10;
const accessTokenSecret = process.env.TOKENSECRET;

const retrieveHospitalData = require('./modules/retrieve-hospital-data');

router.use(bodyParser.json());
router.use(cookieParser());



mongoose.connect("mongodb://127.0.0.1:27017/project");
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
    location: { type: Number, unique: true, required: true },
    waitingTime: { type: String },
    updateTime: { type: String },
});
var WaitingTimeModel = mongoose.model('WaitingTime', WaitingTimeSchema);

var CommentSchema = Schema({
    locationName: { type: String, required: true },
    author: { type: String },
    comment: { type: String },
    creationDate: { type: Date }
});
var CommentModel = mongoose.model('Comment', CommentSchema);

function updateWaitTime(id, Wtime, Utime){
	WaitingTimeModel.updateOne({
		location: id 
	}, {
		$set:{
		location: id,
		waitingTime: Wtime,
		updateTime: Utime
		}
	}, {
		upsert: true
	}, function(err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log("updated succeeded");
		}
	});
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

                    const token = jwt.sign({ userId: decoded.userId, userName: decoded.userName, admin: decoded.admin }, accessTokenSecret, { expiresIn: '1h' })


                    res.cookie('token', token, { maxAge: 900000 });

                    req.decoded = decoded
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
                        admin: user.admin
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
                admin: false,
            })

            newUser.save(function (err, savedUser) {
                if (err) return res.status(500).json({ code: 0, error: err, description: "save user error" });

                const payload = {
                    userId: savedUser.userId,
                    userName: savedUser.userName,
                    admin: savedUser.admin
                }

                const token = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' })

                res.cookie('token', token, { maxAge: 900000 });
                return res.status(201).json({ code: 2, userInfo: payload, description: "created." })
            })
        })
    });
});


router.get('/api/hospital', authenticateJWT, (req, res) => {
    LocationModel.find()
        .select()
        .exec(function (err, locations) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "find locations error" });

            return res.status(200).json({ code: 2, hospitals: locations, description: "get hospital data successfully." })
        })
})


router.put('/api/admin/refresh', authenticateJWT, (req, res) => {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "refresh permission denied." });


    const dataP = retrieveHospitalData.getHospData();

    dataP.then(data => {
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
        });

        return res.status(201).json({ code: 2, description: "refresh successfully." })

        // Object.keys(data['waitTime']).forEach(function (key) {
        //     var id;

        //     LocationModel.findOne({ 'name': data['waitTime'][key]['hospName'] }, function (err, hosp) {
        //         if (err) { console.log(err) }
        //         else if (!hosp) {
        //             var newLocation = new LocationModel({
        //                 name: data['waitTime'][key]['hospName'],
        //                 latitude: 0,
        //                 longitude: 0,
        //             });
        //             newLocation.save(function (err, newLoc) {
        //                 if (err) { console.log(err) }
        //                 else {
        //                     updateWaitTime(newLoc.id, data['waitTime'][key]['topWait'], data['updateTime']);
        //                 }
        //             });
        //         } else {
        //             updateWaitTime(hosp.id, data['waitTime'][key]['topWait'], data['updateTime']);
        //         }
        //     });
        // })
        // return res.status(201).json({ code: 0, description: "refreshed successfully" })
    }).catch(error => console.log('caught', error))
});

module.exports = router;