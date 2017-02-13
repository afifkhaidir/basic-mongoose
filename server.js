/*===============
  Base Setup
=================*/

/* initialization */
var express = require('express')
var assert = require('assert')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Todo = require('./app/models/todo')
 
/* create express instance and define port */
var app = express()
var port = process.env.PORT || 8080

/* use es6 promise */
mongoose.Promise = Promise

/* connection string */
mongoose.connect('mongodb://todoliz:todoliz789@ds139899.mlab.com:39899/todoliz', function(err, db) {
	if(err)
		console.log('DB not connected')
})

/* configure app using body-parser */
app.use(bodyParser.urlencoded({ extended: true }))  // allow app to get extended form (POST)
app.use(bodyParser.json())


/*==============
  Routes
================*/

/* create router instance */
var router = express.Router()

/* middleware */
router.use(function (req, res, next) {
	console.log('Request from clients')
	next()
})

/* Route for /todolist */
router.route('/todoliz')
	.post(function (req, res) {
		var todo = new Todo()
		todo.note = req.body.note
		todo.date = req.body.date
		todo.done = false

		// save the todo
		todo.save()
			.then(function(data) {
				res.json({ message: 'Todo Added!' })
			})
			.catch(function(err) {
				res.json({ error: err })
			})

		// query.then(function(data) {
		// 	res.json({ message: 'Todo added!' })
		// })
	})
	.get(function (req, res) {
		Todo.find (function (err, todos) {
			if(err)
				res.send(err)

			res.json(todos)
		})
	})

router.route('/todoliz/:todo_id')
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
app.get('/', function(req, res) {
	res.send('Todoliz REST APIs')
})

app.use('/api', router)

/*================
  Start the server
==================*/
// disable x-powered-by header
app.disable('x-powered-by')

app.listen(port, function() {	
	console.log('Server run on port ' + port)
})