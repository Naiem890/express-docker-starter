const router = require("express").Router();
const userController = require("../controllers/userController");
const stationController = require("../controllers/stationController");
const trainController = require("../controllers/trainController");
const walletController = require("../controllers/walletController");
const ticketController = require("../controllers/ticketController");
const routerController = require("../controllers/routerController");

router.use("/users", userController);
router.use("/stations", stationController);
router.use("/trains", trainController);
router.use("/wallets", walletController);
router.use("/tickets", ticketController);
router.use("/routes", routerController);

module.exports = router;
