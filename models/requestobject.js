var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestObjectSchema = new Schema({
  messagetype: String,
  messagedata: String
},
  { versionKey: false });

module.exports = mongoose.model('requestobject', RequestObjectSchema);