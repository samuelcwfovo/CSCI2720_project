const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
UserSchema.plugin(AutoIncrement, { inc_field: 'locId' });
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