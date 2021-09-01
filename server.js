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

/* -----------------------
 *       SEQ MODELS
 * -----------------------
 */

class Maps extends Model {}
class Pins extends Model {}

// Initialize attributes

Maps.init({

  title: {
    type: DataTypes.STRING,
    allowNull:false,
    unique: true
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

// Set relations

Pins.belongsTo(Maps, {

  targetKey: 'title',
  foreignKey: {
    name: 'map',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'

});
Maps.hasMany(Pins, {

  sourceKey: 'title',
  foreignKey: 'map'

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

  try {

    let results = await selectMapsMetadata();

    res.status(200).send(results);
    
  } catch (err) {

    console.error('[ERROR]: ' + err);

    res.sendStatus(500);
    
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
   *        lng         : 'PIN_LNG',
   *        createdAt   : x
   *      },
   *      . . .
   *    ]
   */

  let title = req.params.title;

  try {

    let results = { 

      meta: {
        title: await selectMapMetadata(title)
      }, 
      pins: await selectMapPins(title)
    
    };

    res.status(200).send(results);
    
  } catch (err) {

    console.error('[ERROR]: ' + err);

    res.sendStatus(500);
    
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

    try {

      results = await insertNewMap(mapTitle, mapPins);

      res.status(201).send(results);
      
    } catch (err) {

      console.error('[ERROR]: ' + err);

      res.sendStatus(500);
      
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

  try {

    let results = await deleteMap(title);

    if (results) {

      res.sendStatus(204)
      
    } else {

      console.error('[ERROR]: Map not found');

      res.sendStatus(404);

    }
    
  } catch (err) {

    console.error('[ERROR]: ' + err);

    res.sendStatus(500);
    
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
    
    throw err;

  }

}

async function selectMapsMetadata() {

  /*  Description:
   *    Query function. Selects and returns a Promised result for map titles.
   */

  return await Maps.findAll({

    attributes: ['title', 'createdAt']

  }).catch((err) => {

    throw err;

  });

}

async function selectMapMetadata(title) {

  return await Maps.findOne({

    attributes: ['title', 'createdAt'],
    where: { title: title }

  }).catch((err) => {

    throw err;

  });

}

async function selectMapPins(title) {

  /*  Description:
   *    Query function. Selects and returns a Promised result for map pins, given a map title.
   */

  return await Pins.findAll({

    attributes: ['name', 'description', 'lat', 'lng', 'createdAt'],
    where: { map: title }

  }).catch((err) => {

    throw err;

  });

}

async function deleteMap(title) {

  /*  Description:
   *    Query function. Deletes a map given a title (if exists). Cascades on delete to remove corresponding map pins.
   *    Returns a Promised result with number of deleted rows.
   */

  try {

    if ( await mapExists(title) ) {

      return await Maps.destroy({
  
        where: { title: title }
    
      }).catch((err) => {
    
        throw err;
    
      });
      
    } else {
  
      return 0;
  
    }
    
  } catch (err) {

    throw err;
    
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

    newPinIDs = newPins.map((e) => e.id);
  
    return newPinIDs;
    
  } catch (err) {

    throw err;
    
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
