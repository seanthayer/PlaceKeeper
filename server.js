const dotenv = require('dotenv').config({ path: `${__dirname}/PRIVATE_ENV_VARS.env` });
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

  res.status(200).render('homepage', { homePage: true, API_KEY: API_KEY });

});

app.post('/exportFile', function (req, res) {

	let entryData = {

		fileName: req.body.fileName,
		data: req.body.data

	}

	let filePath = './data/' + entryData.fileName + '.json';

	fs.writeFile(filePath, JSON.stringify(entryData.data, null, 2), (err) => {

		if (err) {

			res.status(500).send('POST ERROR');

			throw err;

		} else {

			res.status(200).send();

		}

	});

});

app.get('/getMapsDirectory', function (req, res, next) {

	if (req.header('Referer')) {

		let map_data_dir = fs.readdirSync('./data/');

		if (map_data_dir) {

			res.status(200).send(map_data_dir);

		} else {

			res.sendStatus(404);

		}

	} else {

		next();

	}

});

app.get('/importMap/:map_name', function (req, res, next) {

	if (req.header('Referer')) {

		let map_data_dir = fs.readdirSync('./data/');
		let map_file_name = req.params.map_name + '.json';

		let match_index = map_data_dir.indexOf(map_file_name);

		if (match_index != -1) {

			let importMap = require('./data/' + map_data_dir[match_index]);

			res.status(200).send(importMap);

		} else {

			res.sendStatus(404);

		}

	} else {

		next();

	}

});

app.get('*', function (req, res) {

  res.status(404).render('404');

});

app.listen(port, function () {

  console.log(`[SERVER] Listening on port: '${port}'`);

});
