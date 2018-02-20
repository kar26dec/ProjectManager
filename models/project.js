var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    projectname: String,
    createdby: Schema.Types.ObjectId,
    createddate: Date,
    visibility: String,
    updateddate: Date,
    description: String
},
    { versionKey: false });

module.exports = mongoose.model('project', ProjectSchema);