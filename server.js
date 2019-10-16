const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { log } = require('./utils/utils');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});
//.then(() => log('DB Connection successful'));
//.catch(err => console.log('ERROR DB'));

const port = process.env.PORT || 3300;
const server = app.listen(port, () => {});

process.on('unhandledRejection', err => {
  console.log('UNHANDLEDREJECTION');
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHTEXCEPTION');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. Shutting down gracefully');
  server.close(() => {
    console.log('🚒 Process terminated!');
    //process.exit(1);
  });
});
