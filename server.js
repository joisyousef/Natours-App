const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
