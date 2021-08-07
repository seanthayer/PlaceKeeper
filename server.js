/* ------------------------------------------
 *
 *                  SERVER
 * 
 * ------------------------------------------
 */

const path    = require('path');
const dotenv  = require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;

/* ------------------------------------------
 *
 *                 DATABASE
 * 
 * ------------------------------------------
 */

const mysql = require('mysql');
const maxConnections = 10;

const pinSchema = {

  map         : 'string',
  name        : 'string',
  description : 'string',
  lat         : 'number',
  lng         : 'number'

};

const pool = mysql.createPool({

  connectionLimit: maxConnections,

  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_USEDB

});

/* ------------------------------------------
 *
 *                MIDDLEWARE
 * 
 * ------------------------------------------
 */

app.use(express.json());
app.use(express.static( path.join(__dirname, 'build') ));

app.all('*', (req, res, next) => {

  /*  Description:
   *    Log requests to console.
   */
  
  console.log(`[SERVER] REQUEST: '${req.method}' | URL: '${req.url}'`);
  
  next();
  
});

app.get('/API/getMaps', async (req, res) => {

  /*  Description:
   *    Asynchronous function. Queries database for map titles.
   *
   *  Returns:
   *    [
   *      { title: 'MAP_TITLE' },
   *      . . .
   *    ]
   */

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

  /*  Description:
   *    Asynchronous function. Queries database for specified map pins.
   *
   *  Returns:
   *    [
   *      {
   *        name        : 'PIN_NAME',
   *        description : 'PIN_DESC',
   *        lat         : 'PIN_LAT',
   *        lng         : 'PIN_LNG'
   *      },
   *      . . .
   *    ]
   */

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

  /*  Description:
   *    Asynchronous function. Queries database to insert a new map with title and pins.
   *
   *  Expects:
   *    - req.body.title  => 'MAP_TITLE'
   *    - req.body.pins   => 
   *        [
   *          {
   *            map         : 'MAP_TITLE',
   *            name        : 'PIN_NAME',
   *            description : 'PIN_DESC',
   *            lat         : 'PIN_LAT',
   *            lng         : 'PIN_LNG'   
   *          },
   *          . . .
   *        ]
   */

  let mapTitle  = req.body.title;
  let mapPins   = req.body.pins;
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

app.delete('/API/deleteMap/:title', async (req, res) => {

  /*  Description:
   *    Asynchronous function. Queries database to delete a specified map.
   *
   *  Expects:
   *    - req.params.title  => 'MAP_TITLE'
   */

  let title = req.params.title;

  let results = await dropMapIfExists(title).catch((err) => { 

    return err;

  });

  if (results.error) {

    console.error('[ERROR]: ' + results.error);

    res.sendStatus(500);

  } else if (results) {

    res.sendStatus(204);

  } else {

    res.sendStatus(404);

  }

});

app.get('/*', (req, res) => {

  /*  Description:
   *    Renders homepage for all other middleware requests.
   */
  
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

/* ------------------------------------------
 *
 *                  QUERIES
 * 
 * ------------------------------------------
 */

function selectMapTitles() {

  /*  Description:
   *    Query function. Selects and returns a Promised result for map titles.
   */

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

  /*  Description:
   *    Query function. Selects and returns a Promised result for map pins, given a map title.
   */

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

  /*  Description:
   *    Query function. Drops a map given a title (if exists). Cascades on drop to delete corresponding map pins.
   *    Returns a Promised result with deleted row IDs (if any). 
   */

  return new Promise((resolve, reject) => {

    pool.query('DELETE FROM MAPS WHERE Title = ?', title,
    function(err, results) {

      if (err) {

        reject({

          error: err

        });

      } else {

        resolve(results.affectedRows);

      }

    });

  });

}

async function insertNewMap(title, pinSet) {

  /*  Description:
   *    Asynchronous query function. Inserts a new map given a title and set of pins.
   *    Returns a Promised result with an array of the newly inserted row IDs (for the map pins).
   */

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

  /*  Description:
   *    Query function. Escapes and concatenates a set of pins and inserts them as new rows.
   *    Returns a Promised result with an array of the newly inserted row IDs (for the map pins).
   */

  let pinIDs    = [];
  let valueSet  = '(0, ?, ?, ?, ?, ?)';
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

/* ------------------------------------------
 *
 *                  HELPERS
 * 
 * ------------------------------------------
 */

function validateSchema(input, schema) {

  /*  Description:
   *    Validates proper schema given an input and database schema. Validates proper key name and value type.
   *
   *  Expects:
   *    - input  =>
   *        {
   *          key: value,
   *          . . .
   *        }
   * 
   *    - schema =>
   *        {
   *          key: value,
   *          . . .
   *        }
   */

  let inputKeys   = Object.keys(input);
  let schemaKeys  = Object.keys(schema);

  let inputTypes  = Object.values(input).map((e) => { return (e != null ? typeof(e) : null); });
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

/* ------------------------------------------
 *
 *                    MISC.
 * 
 * ------------------------------------------
 */

app.listen(port, () => {
  
  console.log(`[SERVER] Listening on port: '${port}'`);
  
});
