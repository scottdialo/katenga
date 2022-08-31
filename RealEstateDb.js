const mongoose = require("mongoose");
const realEstateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tel: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

//create a model that will display in mongodb Database
module.exports = mongoose.model("RealEstatePosts", realEstateSchema);
