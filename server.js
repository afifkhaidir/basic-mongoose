/*===============
  Base Setup
=================*/

/* initialization */
var express = require('express');
var assert = require('assert');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Todo = require('./app/models/todo');
 
/* create express instance and define port */
var app = express();
var port = process.env.PORT || 8080;

/* connection string */
mongoose.connect('mongodb://localhost:27017/todolist', function(err, db) {
	if(err)
		console.log('DB not connected');
});


/* use es6 promise */
mongoose.Promise = global.Promise;

/* configure app using body-parser */
app.use(bodyParser.urlencoded({ extended: true }));  // allow app to get extended form (POST)
app.use(bodyParser.json());


/*==============
  Routes
================*/

/* create router instance */
var router = express.Router();

/* middleware */
router.use(function (req, res, next) {
	console.log('Request from client');
	next();
});

/* Route for /todolist */
router.route('/todolist')
	.post(function (req, res) {
		var todo = new Todo();
		todo.note = req.body.note;
		todo.date = req.body.date;
		todo.done = false;

		// save the todo
		var query = todo.save();

		query.then(function(data) {
			res.json({ message: 'Todo added!' });
		});
	})
	.get(function (req, res) {
		Todo.find (function (err, todos) {
			if(err)
				res.send(err);

			res.json(todos);
		});
	});

router.route('/todolist/:todo_id')
	.get(function(req, res) {
		// Get single todo
	})
	.put(function(req, res) {
		// update
	})
	.delete(function(req, res) {
		// delete
	})

/*===============
  Register routes
=================*/
app.use('/api', router);

/*================
  Start the server
==================*/
app.listen(port);
console.log('Server started on port: ' + port);