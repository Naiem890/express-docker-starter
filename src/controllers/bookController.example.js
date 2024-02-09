const router = require('express').Router();
const Book = require('../models/book.example');

// Get All Books & Search Books
router.get('/', async (req, res) => {
  // try {
  //   const {
  //     title, author, genre, sort, order,
  //   } = req.query;

  //   // If no search parameters provided, fetch all books
  //   if (!title && !author && !genre) {
  //     const allBooks = await Book.find().sort({
  //       [sort || 'id']: order === 'DESC' ? -1 : 1,
  //     });
  //     return res.status(200).json({ books: allBooks });
  //   }

  //   const searchQuery = {};
  //   if (title) searchQuery.title = title;
  //   if (author) searchQuery.author = author;
  //   if (genre) searchQuery.genre = genre;

  //   const foundBooks = await Book.find(searchQuery).sort({
  //     [sort || 'id']: order === 'DESC' ? -1 : 1,
  //   });

  //   res.status(200).json({ books: foundBooks });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
});

// Fetch Book by ID
router.get('/:id', async (req, res) => {
  // try {
  //   const { id } = req.params;

  //   // Find the book by ID
  //   const existingBook = await Book.findOne({ id });

  //   // If the book does not exist, return a 404 response
  //   if (!existingBook) {
  //     return res
  //       .status(404)
  //       .json({ message: `Book with id: ${id} was not found` });
  //   }

  //   // Respond with the book details
  //   res.status(200).json(existingBook);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
});

// Add a new Book
router.post('/', async (req, res) => {
  // console.log('Request Body: ', req.body);
  // try {
  //   const {
  //     id, title, author, genre, price,
  //   } = req.body;

  //   if (!id || !title || !author || !genre || !price) {
  //     return res.status(400).json({ error: 'All fields are required.' });
  //   }
  //   const newBook = new Book({
  //     id,
  //     title,
  //     author,
  //     genre,
  //     price,
  //   });

  //   const savedBook = await newBook.save();

  //   res.status(201).json(savedBook);
  // } catch (error) {
  //   console.error(error);

  //   if (error.code === 11000) {
  //     return res
  //       .status(400)
  //       .json({ message: 'Book with this id already exists' });
  //   }

  //   res.status(500).json({ message: 'Internal Server Error' });
  // }
});

// Update a Book
router.put('/:id', async (req, res) => {
  // try {
  //   const { id } = req.params;
  //   const {
  //     title, author, genre, price,
  //   } = req.body;

  //   // Validate if id is present in the request parameters
  //   if (!id) {
  //     return res.status(400).json({ error: 'Book ID is required.' });
  //   }

  //   // Find the book by ID
  //   const existingBook = await Book.findOne({ id });

  //   // If the book does not exist, return a 404 response
  //   if (!existingBook) {
  //     return res
  //       .status(404)
  //       .json({ message: `Book with id: ${id} was not found` });
  //   }

  //   // Update the book with the new details
  //   if (title) existingBook.title = title;
  //   if (author) existingBook.author = author;
  //   if (genre) existingBook.genre = genre;
  //   if (price) existingBook.price = price;

  //   // Save the updated book to the database
  //   const updatedBook = await existingBook.save();

  //   // Respond with the updated book details
  //   res.status(200).json(updatedBook);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
});

// Delete a Book
router.delete('/:id', async (req, res) => {
  // try {
  //   const { id } = req.params;

  //   const existingBook = await Book.findOne({ id });
  //   if (!existingBook) {
  //     return res.status(404).json({ message: `Book with id ${id} not found` });
  //   }

  //   await Book.deleteOne({ id });

  //   res
  //     .status(200)
  //     .json({ message: `Book with id ${id} successfully deleted` });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
});

module.exports = router;
