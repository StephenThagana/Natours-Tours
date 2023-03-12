const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('unhandled rejection!! shutting down');
  console.log(err.name, err.message);
  process.exit();
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_LOCAL;

const app = require('./app');
// console.log(process.env);
//  START SERVER

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('Database connection was successful');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port: ${port}...`);
});

process.on('UnhandledRejection', (err) => {
  console.log('unhandled rejection!! shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit();
  });
});
