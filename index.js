/* Credit Scotch.io */

/*===============
  Base setup
=================*/

// call packages
var assert = require('assert');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

// connect to database
mongoose.connect('mongodb://todoliz:todoliz789@ds139899.mlab.com:39899/todoliz');

// configure app to use body parser
// this config will allow us to get the data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


/*=================
  Routes for API
===================*/
var router = express.Router();

// middleware
router.use(function(req, res, next){
	console.log('Request detected');
	next();
});

// test route
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the family '});
});

// localhost:8080/api/bears
router.route('/bears')
	// Create
	.post(function(req, res) {
		var bear = new Bear();		// Create new instance of Bear Schema
		bear.name = req.body.name;	// set bear name to name from request body
	
		// save the bear and check for errors
		var promise = bear.save();

		// define promises
		assert.ok(promise instanceof require('mpromise'));

		// callback
		promise.then(function(data) {
			// check error
			assert.equal(data.name, req.body.name);
			res.json({ message: 'Bear Created!' });
		});
	})

	// Retrieve
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if(err)
				res.send(err);

			res.json(bears);
		});
	});

// localhost:8080/api/bears/:id
router.route('/bears/:bear_id')
	// Retrieve single bear
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if(err)
				res.send(err);

			res.json(bear);
		});
	})

	// Update
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if(err)
				res.send(err);

			bear.name = req.body.name;

			bear.save(function(err) {
				if(err)
					res.send(err);

				res.json({ message: 'Bear Updated'});
			});
		});
	})

	// Delete
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
			if(err)
				res.send(err);

			res.json({ message: 'Bear Deleted' });
		});
	});

/*==================
  Register our routes
====================*/
app.use('/api', router);


/*==================
  Start the server
====================*/
app.listen(port, function() {	
	console.log('Server run on port ' + port);
});