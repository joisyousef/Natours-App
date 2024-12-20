const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate environment variables
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

// Replace password in database URL
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('DB Connection Successful');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
};
connectDB();

// Read JSON files
let tours;
try {
  tours = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tours.json'), 'utf-8'),
  );
} catch (err) {
  console.error('Error reading JSON file:', err.message);
  process.exit(1);
}

// Import data into DB
const importData = async () => {
  try {
    if (!Array.isArray(tours) || tours.length === 0) {
      throw new Error('Tours data is invalid or empty.');
    }
    const createdTours = await Tour.create(tours);
    console.log(
      `Data successfully loaded! Imported ${createdTours.length} tours.`,
    );
  } catch (err) {
    console.error('Error importing data:', err.message);
  } finally {
    exitProcess();
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    const result = await Tour.deleteMany();
    console.log(
      `Data successfully deleted! Removed ${result.deletedCount} records.`,
    );
  } catch (err) {
    console.error('Error deleting data:', err.message);
  } finally {
    exitProcess();
  }
};

// Graceful process exit
const exitProcess = async () => {
  await mongoose.disconnect();
  process.exit();
};

// Check command-line arguments
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
