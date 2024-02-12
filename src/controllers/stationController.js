const router = require("express").Router();
const Station = require("../models/Station");
const Train = require("../models/Train");

router.post("/", async (req, res) => {
  try {
    const { station_id, station_name, longitude, latitude } = req.body;

    if (!station_id || !station_name || !longitude || !latitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newStation = new Station({
      station_id,
      station_name,
      longitude,
      latitude,
    });

    await newStation.save();

    res.status(201).json(newStation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const stations = await Station.find({});
    res.json({ stations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:station_id/trains", async (req, res) => {
  try {
    const stationId = req.params.station_id;

    const station = await Station.findOne({ station_id: stationId });

    if (!station) {
      return res
        .status(404)
        .json({ message: `station with id: ${stationId} was not found` });
    }

    let trains = [];

    for (const train of await Train.find()) {
      for (const stop of train.stops) {
        if (Number(stop.station_id) === Number(stationId)) {
          trains.push({
            train_id: train.train_id,
            arrival_time: stop.arrival_time,
            departure_time: stop.departure_time,
          });
          break;
        }
      }
    }

    trains.sort((a, b) => {
      if (a.departure_time === null && b.departure_time === null) {
        return a.train_id - b.train_id;
      } else if (a.departure_time === null) {
        return -1;
      } else if (b.departure_time === null) {
        return 1;
      } else if (a.departure_time === b.departure_time) {
        if (a.arrival_time === null && b.arrival_time === null) {
          return a.train_id - b.train_id;
        } else if (a.arrival_time === null) {
          return -1;
        } else if (b.arrival_time === null) {
          return 1;
        } else {
          return a.arrival_time.localeCompare(b.arrival_time);
        }
      } else {
        return a.departure_time.localeCompare(b.departure_time);
      }
    });

    res.status(200).json({ station_id: stationId, trains: trains });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
