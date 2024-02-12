const router = require("express").Router();
const User = require("../models/User"); // Adjust the path as needed

router.post("/", async (req, res) => {
  try {
    const { user_id, user_name, balance } = req.body;

    if (!user_id || !user_name || !balance) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = new User({ user_id, user_name, balance });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
