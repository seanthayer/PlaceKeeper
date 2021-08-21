/* ------------------------------------------
 *
 *                  SERVER
 * 
 * ------------------------------------------
 */

const { Sequelize, DataTypes, Model } = require('sequelize');

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

// const mysql = require('mysql'); // *
const maxConnections = 10;

const sequelize = new Sequelize(
  process.env.DB_USEDB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: maxConnections,
      idle: 30000,
      acquire: 60000
    },
    define: {
      freezeTableName: true
    },
    logging: (msg) => { console.log('[SEQ]', msg); }
  }
);

class Maps extends Model {}
class Pins extends Model {}

Maps.init({

  title: {
    type: DataTypes.STRING,
    allowNull:false
  },
},
{
  sequelize,
  tableName: 'MAPS'
});

Pins.init({

  map: {
    type: DataTypes.STRING,
    allowNull: false
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
  },

  lat: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  lng: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
},
{
  sequelize,
  tableName: 'PINS'
});

syncModels();

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

  let results;

  if (mapTitle) {

    results = await insertNewMap(mapTitle, mapPins).catch((err) => {

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

  let results = await deleteMap(title).catch((err) => { 

    return err;

  });

  if (results.error) {

    console.error('[ERROR]: ' + results.error);

    res.sendStatus(500);

  } else if (results) {

    res.sendStatus(204);

  } else {

    console.error('[ERROR]: Map not found');

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

async function mapExists(title) {

  let exists;

  try {

    exists = await Maps.count({ where: { title: title } });

    return exists;
    
  } catch (err) {
    
    return 0;

  }

}

async function selectMapTitles() {

  /*  Description:
   *    Query function. Selects and returns a Promised result for map titles.
   */

  return await Maps.findAll({

    attributes: ['title']

  }).catch((err) => {

    return { error: err };

  });

}

async function selectMapPins(title) {

  /*  Description:
   *    Query function. Selects and returns a Promised result for map pins, given a map title.
   */

  return await Pins.findAll({

    attributes: ['name', 'description', 'lat', 'lng'],
    where: { map: title }

  }).catch((err) => {

    return { error: err };

  });

}

async function deleteMap(title) {

  /*  Description:
   *    Query function. Deletes a map given a title (if exists). Cascades on delete to remove corresponding map pins.
   *    Returns a Promised result with number of deleted rows.
   */

  if ( await mapExists(title) ) {

    return await Maps.destroy({

      where: { title: title }
  
    }).catch((err) => {
  
      return { error: err };
  
    });
    
  } else {

    return 0;

  }

}

async function insertNewMap(title, pinSet) {

  /*  Description:
   *    Query function. Inserts a new map given a title and set of pins.
   *    Returns a Promised result with an array of the newly inserted row IDs (for the map pins).
   */

  let newPins;
  let newPinIDs;

  try {

    // Likely a better way to handle overwriting an existing map instead of completely deleting and recreating it.
    await deleteMap(title);

    await Maps.create({ title: title });

    newPins = await Pins.bulkCreate(pinSet, { validate: true });

    newPinIDs = newPins.map((e) => { return e.id; });
  
    console.log(newPinIDs);
  
    return newPinIDs;
    
  } catch (err) {

    return { error: err };
    
  }

}

/* ------------------------------------------
 *
 *                  HELPERS
 * 
 * ------------------------------------------
 */

async function syncModels() {

  console.log('[SERVER] Syncing Models...');

  try {

    await sequelize.sync();
  
    console.log('[SERVER] Database Models synced!');

    return true;
    
  } catch (err) {
  
    console.error('[ERROR] Database Models not synced: ', err);

    return false;
    
  }

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
