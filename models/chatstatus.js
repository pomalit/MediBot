var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChatStatusSchema = new Schema({
  user_id: { type: String, unique: true },
  location: {
    lat: Number,
    long: Number
  },
  symptom: String,
  status: String
});

module.exports = mongoose.model("ChatStatus", ChatStatusSchema);