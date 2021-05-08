//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
let Schema = mongoose.Schema;

mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () { console.log("Database Connected."); });

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


module.exports = {UserModel, LocationModel, WaitingTimeModel, CommentModel}