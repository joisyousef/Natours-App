// eslint-disable-next-line import/no-useless-path-segments
const { query } = require('express');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
// );       was for testing
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 > tours.length)
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid ID',
//     });
//   next();
// };     was for testing middleware functionality

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'Fail',
//       message: 'Missing name or price in request body',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // 1) FILTERING
    const queryObj = { ...req.query };
    const excludeFields = ['sort', 'fields', 'limit', 'page'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr));

    // EXECUTE QUERY
    const tours = await query;

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  // const tour = tours.find((el) => el.id === id);
};
exports.createTour = async (req, res) => {
  // const newTours = new Tour({});
  // newTours.save();
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
};
