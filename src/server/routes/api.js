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
    comments: { 
	  author: { type: String },
	  comment: { type: String },
	  creationDate: { type: Date }
	}
});
LocationSchema.plugin(AutoIncrement, { inc_field: 'locId' });
var LocationModel = mongoose.model('Location', LocationSchema);




router.post('/api/auth/token', (req, res) => {
    if (!req.cookies.token) { return res.status(400).json({ code: 1, description: "token not found" }) }

    const decoded = jwt.verify(req.cookies.token, accessTokenSecret)

    if (decoded.userId && decoded.userName) {
        return res.status(200).json({ code: 2, userInfo: decoded, description: "auth success." });
    }

    return res.status(400).json({ code: 1, description: "token can not decode." })
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

                    const token = jwt.sign(payload, accessTokenSecret)


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
                admin: true,
            })

            newUser.save(function (err, savedUser) {
                if (err) return res.status(500).json({ code: 0, error: err, description: "save user error" });

                const payload = {
                    userId: savedUser.userId,
                    userName: savedUser.userName,
                    admin: savedUser.admin
                }

                const token = jwt.sign(payload, accessTokenSecret)

                res.cookie('token', token, { maxAge: 900000 });
                return res.status(201).json({ code: 2, userInfo: payload, description: "created" })
            })
        })
    });
});



module.exports = router;
