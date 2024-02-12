const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  station_id: {
    type: Number,
    required: true,
  },
  arrival_time: String,
  departure_time: String,
  fare: {
    type: Number,
    required: true,
  },
});

const trainSchema = new mongoose.Schema({
  train_id: {
    type: Number,
    required: true,
    unique: true,
  },
  train_name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  stops: [stopSchema],
});

// make virtualizatin with station_id with station modal
// trainSchema.virtual("stops.station", {
//   ref: "Station",
//   localField: "stops.station_id",
//   foreignField: "station_id",
//   justOne: true,
// });

const Train = mongoose.model("Train", trainSchema);

module.exports = Train;
