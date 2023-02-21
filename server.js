const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(port, () => {
  console.log(`app running on port: ${port}...`);
});
