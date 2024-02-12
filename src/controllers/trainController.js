const router = require("express").Router();
const Train = require("../models/Train");

router.post("/", async (req, res) => {
  try {
    const { train_id, train_name, capacity, stops } = req.body;

    // Calculate service start and end times
    const service_start = stops[0].departure_time;
    const service_ends = stops[stops.length - 1].arrival_time;

    // Calculate number of stops
    const num_stations = stops.length;

    // Create a new train instance
    const newTrain = new Train({
      train_id,
      train_name,
      capacity,
      stops,
    });

    // Save the train to the database
    await newTrain.save();

    // Return the saved train object in the response
    res.status(201).json({
      train_id,
      train_name,
      capacity,
      service_start,
      service_ends,
      num_stations,
    });
  } catch (err) {
    // If there's an error, return an error response
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const trains = await Train.find({});
    res.json(trains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
