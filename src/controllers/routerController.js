const router = require("express").Router();

router.put("/", async (req, res) => {
  const { from, to, optimize } = req.query;

  if (!from || !to || !optimize) {
    return res.status(400).json({ message: "All fields are required" });
  }

  return res.status(200).json({
    total_cost: 100,
    total_time: 60,
    stations: [
      {
        station_id: 1,
        station_name: "Station 1",
        arrival_time: "10:00",
        departure_time: "10:05",
      },
      {
        station_id: 2,
        station_name: "Station 2",
        arrival_time: "10:00",
        departure_time: "10:05",
      },
    ],
  });
});

module.exports = router;
