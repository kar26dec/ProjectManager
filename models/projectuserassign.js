var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectUserAssignSchema = new Schema({
    projectid: Schema.Types.ObjectId,
    createddate: Date,
    userid: Schema.Types.ObjectId,
    roleid: Schema.Types.ObjectId
},
    { versionKey: false });

module.exports = mongoose.model('projectuserassign', ProjectUserAssignSchema);