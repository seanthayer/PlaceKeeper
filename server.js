var dotenv = require('dotenv').config({ path: `${__dirname}/PRIVATE_ENV_VARS.env` });
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

const API_KEY = process.env.G_MAPS_API_KEY;

var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());

app.all("*", function (req, res, next) {
	console.log(`[ REQ ] ${req.method} ${req.url}`);
	next();
});

app.get('/', function (req, res, next) {

  res.status(200).render('homepage', { homePage: true, API_KEY: API_KEY });

});

app.get('/about', function (req, res, next) {
  res.status(200).render('about');
});

app.post('/addPin', function(req, res, next) {
	if (req.body && req.body.lat && req.body.long && req.body.name) {
		console.log("Added following information");
		console.log("Name: ", req.body.name);
		console.log("Lat: ", req.body.lat);
		console.log("Long: ", req.body.long);

		//Add post data to data file
		res.status(200).send("Success");
		next();
	} else {
		res.status(400).send("ERROR");
	}
});

app.get('/getMapsDirectory', function (req, res, next) {

  var map_data_dir = fs.readdirSync('./data/');

  if (map_data_dir) {

    res.status(200).send(map_data_dir);

  } else {

    res.status(404).send();

  }

});

app.post('/exportFile', function (req, res, next) {
	let obj = req.body;
	var obj2;
	var file;
	for (let i in obj){
		if (i == 'data'){

			obj2 = obj['data']
		}
		else {
			file = obj['file']
		}
	}

	fs.writeFile(file, JSON.stringify(obj2,null,2), (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	  });
	res.status(200).send("Success");
	next();
});

app.get('/importMap/:map_name', function (req, res, next) {

  var map_data_dir = fs.readdirSync('./data/');
  var map_file_name = req.params.map_name + '.json';

  var match_index = map_data_dir.indexOf(map_file_name);

  if (match_index != -1) {

    var importMap = require('./data/' + map_data_dir[match_index]);

    res.status(200).send(importMap);

  } else {

    res.status(404).send('File not found!');

  }

});

app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
