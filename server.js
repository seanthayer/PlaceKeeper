const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const express = require('express');
const app = express();

const mysql = require('mysql');
const maxMySQLConnections = 10;

const port = process.env.PORT || 3000;

const pinSchema = {

  map: 'string',
  name: 'string',
  description: 'string',
  lat: 'number',
  lng: 'number'

};

var pool = mysql.createPool({

  connectionLimit: maxMySQLConnections,

  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_USEDB

});

/*
 *      Middleware functions
 */

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.all('*', (req, res, next) => {
  
  console.log(`[SERVER] REQUEST: '${req.method}' | URL: '${req.url}'`);
  
  next();
  
});

app.get('/API/getMaps', async (req, res) => {

  let results = await selectMapTitles().catch((err) => { 

    return err;

  });

  if (results.error) {

    console.error('[ERROR]: ' + results.error);

    res.sendStatus(500);

  } else {

    res.status(200).send(results);

  }

});

app.get('/API/getMap/:title', async (req, res) => {

  let title = req.params.title;

  let results = await selectMapPins(title).catch((err) => { 

    return err;

  });

  if (results.error) {

    console.error('[ERROR]: ' + results.error);

    res.sendStatus(500);

  } else {

    res.status(200).send(results);

  }

});

app.post('/API/postMap', async (req, res) => {

  let mapTitle = req.body.title;
  let mapPins = req.body.pins;
  let validData = true;
  let pinValues;
  let results;

  for (let i = 0; i < mapPins.length; i++) {
    const pin = mapPins[i];

    if (!validateSchema(pin, pinSchema)) {

      validData = false;
      break;

    }

  }

  if (mapTitle && validData) {

    pinValues = mapPins.map((e) => { return Object.values(e); });

    results = await insertNewMap(mapTitle, pinValues).catch((err) => {

      return err;

    });

    if (results.error) {

      console.error('[ERROR]: ' + results.error);

      res.sendStatus(500);

    } else {

      res.status(201).send(results);

    }

  } else {

    res.sendStatus(400);

  }

});

app.get('/*', (req, res) => {
  
  res.status(200).sendFile(path.join(__dirname, 'build', 'index.html'));
  
});

app.get('*', (req, res) => {
  
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

/*
 *      Query Functions
 */

function selectMapTitles() {

  return new Promise((resolve, reject) => {

    pool.query('SELECT title FROM MAPS',
    function(err, results) {

      if (err) {
    
        reject({

          error: err

        });
    
      } else {

        resolve(results);
    
      }
    
    });

  });

}

function selectMapPins(title) {

  return new Promise((resolve, reject) => {

    pool.query('SELECT name, description, lat, lng FROM PINS WHERE Map = ?', title,
    function(err, results) {

      if (err) {
    
        reject({

          error: err
          
        });
    
      } else {

        resolve(results);
    
      }
    
    });

  });

}

function dropMapIfExists(title) {

  return new Promise((resolve, reject) => {

    pool.query('DELETE FROM MAPS WHERE Title = ?', title,
    function(err, results) {

      if (err) {

        reject({

          error: err

        });

      } else {

        resolve(results);

      }

    });

  });

}

async function insertNewMap(title, pinSet) {

  let pinIDs = [];

  await dropMapIfExists(title);

  return new Promise((resolve, reject) => {

    // Map title
    pool.query('INSERT INTO MAPS VALUES (?)', title,
    async function(err, results) {

      if (err) {

        reject({

          error: err

        });

      } else {

        pinIDs = await insertPinSet(pinSet).catch((err) => {

          return err;

        });

        if (pinIDs.error) {

          reject({

            error: err
  
          });
          
        } else {

          resolve(pinIDs);

        }

      }

    });

  });

}

function insertPinSet(pinSet) {

  let pinIDs = [];
  let valueSet = '(0, ?, ?, ?, ?, ?)';
  let setValues = '';

  pinSet.forEach((row, i, array) => {

    // Row fields are escaped here, preventing SQL injection when inserting 'setValues' in the Promised query.
    let sql = mysql.format(valueSet, row);

    // Concatenating each valueSet
    setValues += (( i < (array.length - 1) ) ? (sql + ',') : (sql));

  });

  return new Promise((resolve, reject) => {

    pool.query(`INSERT INTO PINS VALUES ${setValues}`,
    function(err, results) {
  
      if (err) {

        reject({
  
          error: err
  
        });
  
      } else {

        for (let i = 0; i < pinSet.length; i++)
          pinIDs.push(i + results.insertId);

        resolve(pinIDs);
  
      }
  
    });

  });

}

function validateSchema(input, schema) {

  let inputKeys = Object.keys(input);
  let schemaKeys = Object.keys(schema);

  let inputTypes = Object.values(input).map((e) => { return (e != null ? typeof(e) : null); });
  let schemaTypes = Object.values(schema);

  let validSchema = true;

  for (let i = 0; i < inputKeys.length; i++) {

    const inputKey = inputKeys[i];
    const schemaKey = schemaKeys[i];

    const inputType = inputTypes[i];
    const schemaType = (inputType != null ? schemaTypes[i] : null);

    if ((inputKey != schemaKey) ||
        (inputType != schemaType)) {

      validSchema = false;
      break;

    }
    
  }

  return validSchema;

}


app.listen(port, () => {
  
  console.log(`[SERVER] Listening on port: '${port}'`);
  
});


module.exports = pool;