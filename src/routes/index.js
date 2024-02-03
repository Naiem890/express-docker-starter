const router = require("express").Router();
const bookController = require("../controllers/bookController");

router.use("/books", bookController);

module.exports = router;
