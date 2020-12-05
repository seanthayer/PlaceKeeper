var path = require('path')
var express = require('express');
var exphbs = require('express-handlebars');
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

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homepage');
});

app.get('/about', function (req, res, next) {
  res.status(200).render('about');
});

app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
