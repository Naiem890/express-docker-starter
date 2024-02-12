const router = require("express").Router();
const User = require("../models/User");

router.get("/:wallet_id", async (req, res) => {
  try {
    const wallet_id = req.params.wallet_id;
    const user = await User.findOne({ user_id: wallet_id });

    if (!user) {
      return res
        .status(404)
        .json({ message: `wallet with id: ${wallet_id} was not found` });
    }

    const response = {
      wallet_id: user.user_id,
      balance: user.balance,
      wallet_user: {
        user_id: user.user_id,
        user_name: user.user_name,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:wallet_id", async (req, res) => {
  const { recharge } = req.body;
  const wallet_id = req.params.wallet_id;

  // Validate recharge amount
  if (recharge < 100 || recharge > 10000) {
    return res.status(400).json({ message: `invalid amount: ${recharge}` });
  }

  try {
    const user = await User.findOne({ user_id: wallet_id });
    if (!user) {
      return res
        .status(404)
        .json({ message: `wallet with id: ${wallet_id} was not found` });
    }

    // Update and save the user's balance
    user.balance += recharge;
    await user.save();

    const response = {
      wallet_id: user.user_id,
      balance: user.balance,
      wallet_user: {
        user_id: user.user_id,
        user_name: user.user_name,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
