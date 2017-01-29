/* Credit Scotch.io */

/*===============
  Base setup
=================*/

// call packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to use body parser
// this config will allow us to get the data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


/*=================
  Routes for API
===================*/
var router = express.Router();

// test route
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the family '});
});


/*==================
  Register our routes
====================*/
app.use('/api', router);


/*==================
  Start the server
====================*/
app.listen(port);
console.log('Server run on port ' + port);