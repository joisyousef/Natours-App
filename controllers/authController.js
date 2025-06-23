const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  // Add validation
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all required fields!', 400));
  }

  // Log the incoming role for debugging
  console.log('Incoming role:', role);

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role: role || 'user', // Make sure role is included
  });

  // Log the created user's role for debugging
  console.log('Created user role:', newUser.role);

  const token = signToken(newUser._id);

  // Remove password from output
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is correct, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// Middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }
  // 4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again.', 401),
    );
  }
  // Grant access to protected route
  req.user = freshUser;
  next();
});

// Middleware to restrict access to certain roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is an array, ['admin', 'lead-guide']. role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }
    next();
  };

// Middleware to forgot password
exports.forgotPassword = catchAsync(async (req, res, next) =>{}
)
exports.resetPassword = catchAsync(async (req, res, next) => {})

