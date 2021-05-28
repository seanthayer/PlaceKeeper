const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.all('*', function (req, res, next) {
  
  console.log(`[SERVER] REQUEST: '${req.method}' | URL: '${req.url}'`);
  
  next();
  
});

app.get('/', function (req, res) {
  
  res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
  
});

app.get('*', function (req, res) {
  
  /*
   *   _  _    ___  _  _   
   *  | || |  / _ \| || |  
   *  | || |_| | | | || |_ 
   *  |__   _| |_| |__   _|
   *     |_|  \___/   |_|  
   *                   
   */
  
  res.sendStatus(404);
  
});

app.listen(port, function () {
  
  console.log(`[SERVER] Listening on port: '${port}'`);
  
});
