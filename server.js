const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { log } = require('./utils/utils');

process.on('unhandledRejection', err => {
  log(err.name, err.message);
  log('UNHANDLED REJECTION : Shutting down...');

  process.exit(1);
});

process.on('uncaughtException', err => {
  log('UNCAUGHT EXCEPTION : Shutting down...');
  log(err);
  log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(() => log('DB Connection successful'));
//.catch(err => console.log('ERROR DB'));

const port = process.env.PORT || 3300;
const server = app.listen(port, () => {
  log(`App runing on port ${port} ...`);
});
