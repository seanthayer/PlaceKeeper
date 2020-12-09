var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

/*
 *  IMPORTANT:
 *  The GoogleMaps API is specifically restricted to HTTP requests from
 *  'http://localhost:3000/*'. So please let Sean know if the port is changed
 *  for whatever reason, so that the port can be changed in the API dashboard as well.
 */
var port = 3000;
/*
 * ~ ~ ~
 */

// Here we read the 'data' directory to find any previously saved maps (currently there are two example maps).
 var savedMaps = fs.readdirSync('./data/');
 console.log(savedMaps);

 // 'static_import' is to simulate a user triggered 'import' event that will be implemented in the future
 var static_import = require('./data/' + savedMaps[0]);
 console.log(static_import);

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());

app.all("*", function (req, res, next) {
	console.log(`[ REQ ] ${req.method} ${req.url}`);
	next();
  });

app.get('/', function (req, res, next) {
  // Render homepage with 'static_import', populating the 'saved-places-list-container' with data from the import
  res.status(200).render('homepage', { homePage: true, static_import});
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


	fs.writeFile(file, JSON.stringify(obj2,null,4), (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	  });
	res.status(200).send("Success");
	next();
});


app.get('/importMap', function (req, res, next) {
  console.log("== MAP GET REQ RECEIVED");
  res.status(200).send(static_import);
});

// app.post(/*Address*/, function(req, res, next) {
//
// });
app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
