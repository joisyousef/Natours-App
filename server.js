const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const { type } = require('superagent/lib/utils');

// Load environment variables
dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB
mongoose
  .connect(DB)
  // .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
