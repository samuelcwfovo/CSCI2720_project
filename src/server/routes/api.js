var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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
    favouritePlace: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
});
UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });
var UserModel = mongoose.model('User', UserSchema);

var LocationSchema = Schema({
    name: { type: String, unique: true, required: true },
    latitude: { type: Number, required: true },
	longitude: { type: Number, required: true },
});
LocationSchema.plugin(AutoIncrement, { inc_field: 'locId' });
var LocationModel = mongoose.model('Location', LocationSchema);

var WaitingTimeSchema = Schema({
    location: { type: Schema.Types.ObjectId, ref: 'Location', unique: true, required: true },
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


router.post('/api/auth/token', (req, res) => {
    if (!req.cookies.token) { return res.status(400).json({ code: 1, description: "token not found" }) }

    jwt.verify(req.cookies.token, accessTokenSecret, function (err, decoded) {
        if (err) return res.status(400).json({ code: 1, error: err, description: "token can not decode/ verify." });

        if (decoded.userId && decoded.userName) {

            //check is account valid. otherwise auth will pass if account delete in db.
            UserModel.findOne({ 'userName': decoded.userName })
                .exec(function (err, user) {
                    if (err) return res.status(500).json({ code: 0, error: err, description: "db find user error." });
                    if (!user) return res.status(401).json({ code: 1, description: "username not found." });

                    return res.status(200).json({ code: 2, userInfo: decoded, description: "auth success." });
                })
        }

    });
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


                    res.cookie('token', token, { maxAge: 90000000 });
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

                res.cookie('token', token, { maxAge: 90000000 });
                return res.status(201).json({ code: 2, userInfo: payload, description: "created" })
            })
        })
    });
});

router.post('/api/admin/refresh', (req, res) => {
  if (!req.cookies.token) {return res.status(400).json({ code: 1, description: "token not found"})}
  
  const decoded = jwt.verify(req.cookies.token, accessTokenSecret)

  if (decoded.admin){
	const dataP = retrieveHospitalData.getHospData()
	dataP.then(data => {
		Object.keys(data['waitTime']).forEach(function(key) {
			var id;
				
			LocationModel.findOne({ 'name': data['waitTime'][key]['hospName'] }, function (err, hosp) {
				if (err) {console.log(err)}
				else if (!hosp){
					var newLocation = new LocationModel({
						name: data['waitTime'][key]['hospName'],
						latitude: 0,
						longitude: 0,
					});
					newLocation.save(function (err, newLoc){
						if (err) {console.log(err)}
						else{
							updateWaitTime(newLoc.id, data['waitTime'][key]['topWait'], data['updateTime']);
						}
					});
				}else{
					updateWaitTime(hosp.id, data['waitTime'][key]['topWait'], data['updateTime']);
				}
			});	
		})
		return res.status(201).json({ code: 0, description: "refreshed successfully"})
    }).catch(error => console.log('caught', error))
  }else{
	  return res.status(400).json({ code: 1, description: "invalid admin identity"})
  }
});

module.exports = router;
