const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

async function dbConnect() {
  // eslint-disable-next-line no-undef
  const { DB_URI, NODE_ENV } = process.env;

  try {
    await mongoose.connect(DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // Drop the database
    const result = await mongoose.connection.db.dropDatabase();
    console.log('Database dropped', result);
    console.log(`Database connected in ${NODE_ENV} mode`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports = dbConnect;
