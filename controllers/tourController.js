const fs = require('fs');

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
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
};
exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
