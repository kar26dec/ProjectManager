var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,   
    createddate: Date
},
    { versionKey: false });

module.exports = mongoose.model('user', UserSchema);