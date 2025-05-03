// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// const connectDB = require('./config/db');


// // Load env vars
// dotenv.config({ path: './config/config.env' });

// // Connect to database
// connectDB();

// // Route files
// const auth = require('./routes/auth');
// const projects = require('./routes/projects');
// const tasks = require('./routes/tasks');

// const app = express();

// // Body parser
// app.use(express.json());

// // Dev logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Enable CORS
// app.use(cors());

// // Mount routers
// app.use('/api/v1/auth', auth);
// app.use('/api/v1/projects', projects);
// app.use('/api/v1/tasks', tasks);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     error: 'Server Error',
//   });
// });

// const PORT = process.env.PORT || 5000;

// const server = app.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// );

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
connectDB();

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/projects', require('./routes/projects'));
app.use('/api/v1/tasks', require('./routes/tasks'));

// Make sure to export the app
module.exports = app;