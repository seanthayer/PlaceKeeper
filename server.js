const dotenv = require('dotenv').config({ path: `${__dirname}/ENV_VARS.env` });
const fs = require('fs');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

const API_KEY = process.env.G_MAPS_API_KEY || false;

const port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());

app.all('*', function (req, res, next) {
  
  console.log(`[SERVER] REQUEST: '${req.method}' | URL: '${req.url}'`);
  
  next();
  
});

app.get('/', function (req, res) {
  
  /*	Description:
   *		Renders homepage.handlebars with an API_KEY (if present).
   */
  
  res.status(200).render('homepage', { homePage: true, API_KEY: API_KEY });
  
});

app.post('/exportFile', function (req, res) {
  
  /*	Description:
   *		Writes a '.json' file containing the request's pin data to the server's 'data/' directory.
   */
  
  let entryData = {
    
    fileName: req.body.fileName,
    data: req.body.data
    
  }
  
  let filePath = './data/' + entryData.fileName + '.json';
  let fileData = JSON.stringify(entryData.data, null, 2);
  
  fs.writeFile(filePath, fileData, (err) => {
    
    if (err) {
      
      res.sendStatus(500);
      
      throw err;
      
    } else {
      
      res.sendStatus(200);
      
    }
    
  });
  
});

app.get('/getMapsDirectory', function (req, res, next) {
  
  /*	Description:
   *		Sends a response containing a list of the current file names, in JSON format.
   */
  
  if (req.header('Referer')) {
    /*  Requiring the request to have a 'Referer' header creates a rudimentary way to keep users from accessing this URL through the address bar.
     *  Note that this can be easily bypassed if the user adds a link element to the page and sets this URL as the target.
     *  However, in this iteration of PlaceKeeper, it's not hugely important.
     */
    
    let dataDir = fs.readdirSync('./data/');
    
    if (dataDir) {
      
      res.status(200).send(JSON.stringify(dataDir));
      
    } else {
      
      res.sendStatus(404);
      
    }
    
  } else {
    
    next();
    
  }
  
});

app.get('/importMap/:map_name', function (req, res, next) {
  
  /*	Description:
   *		Sends a response containing the pin data for the selected file in JSON format.
   */
  
  // 'Referer' header explained in function " app.get('/getMapsDirectory', . . .) "
  if (req.header('Referer')) {
    
    let dataDir = fs.readdirSync('./data/');
    let fileName = req.params.map_name + '.json';
    
    let match_i = dataDir.indexOf(fileName);
    
    if (match_i != -1) {
      
      let importMap = require('./data/' + dataDir[match_i]);
      
      res.status(200).send(importMap);
      
    } else {
      
      res.sendStatus(404);
      
    }
    
  } else {
    
    next();
    
  }
  
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
  
  res.status(404).render('404');
  
});

app.listen(port, function () {
  
  console.log(`[SERVER] Listening on port: '${port}'`);
  
});
