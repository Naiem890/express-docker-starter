const mongoose = require("mongoose");

// Define Station Schema
const stationSchema = new mongoose.Schema({
  station_id: {
    type: Number,
    required: true,
    unique: true,
  },
  station_name: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

// Create Station model
const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
