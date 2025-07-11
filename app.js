const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

const app = express();
const glopalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');

// 1) Global Middlewares
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development ') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `windowMs`
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on  this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on  this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on  this server!`, 404));
});
app.use(glopalErrorHandler);
module.exports = app;
