var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    rolename: String,    
    createddate: Date
},
    { versionKey: false });

module.exports = mongoose.model('role', RoleSchema);