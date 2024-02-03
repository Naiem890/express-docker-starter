const router = require("express").Router();
const bookController = require("../controllers/bookController");

router.use("/book", bookController);

module.exports = router;
