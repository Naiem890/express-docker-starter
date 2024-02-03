const router = require("express").Router();

// Get all Books
router.get("/", async (req, res) => {});

// Add a new Book
router.post("/", async (req, res) => {});

// Update a Book
router.put("/:id", async (req, res) => {});

// Delete a Book
router.delete("/:id", async (req, res) => {});

module.exports = router;
