const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

// Read and parse the JSON file into an array
let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

// GET route to retrieve all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

// POST route to add a new tour
app.post('/api/v1/tours', (req, res) => {
  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1; // Handle case when array is empty
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // Write the updated tours array back to the file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Failed to save the new tour.',
        });
      }

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
