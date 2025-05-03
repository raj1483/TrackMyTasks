const app = require('./app');
require('dotenv').config();
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.stack}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);