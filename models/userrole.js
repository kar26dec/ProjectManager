var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserRoleSchema = new Schema({
    userid: Schema.Types.ObjectId,
    roleid: Schema.Types.ObjectId,
    projectid: Schema.Types.ObjectId,
    createddate: Date
},
    { versionKey: false });

module.exports = mongoose.model('userrole', UserRoleSchema);