const express = require('express');

const app = express();

app.get('/', (req, res) => {
  req.status(200).send('hallo frm the server side!');
});
const port = 3000;

app.listen(port, () => {
  console.log(`app runnong on port: ${port}...`);
});
