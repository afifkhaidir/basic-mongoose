/*===============
  Base Setup
=================*/

/* initialization */
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

/* use es6 promise */
mongoose.Promise = global.Promise

/* import model */
var Todo = require('./app/models/todo')
 
/* create express instance and define port */
const app = express()
const port = process.env.PORT || 8080

/* connection string */
mongoose.connect('mongodb://todoliz:todoliz789@ds139899.mlab.com:39899/todoliz', (err, db) => {
	if(err)
		console.log(err)
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
	.post((req, res) => {
		var newTodo = new Todo()
		newTodo.note = req.body.note
		newTodo.date = req.body.date
		newTodo.done = false

		// create todo
		newTodo.save()
			.then(todo => res.json({ message: 'Todo Added!', todo: todo }))
			.catch(err => res.json({ error: err }))
	})
	.get((req, res) => {
		// retrieve all todos
		Todo.find().exec()
			.then(todos => res.json(todos))
			.catch(err => res.json({ error: err }))
	})

router.route('/todoliz/:todo_id')
	.get((req, res) => {
		// retrieve single todo
		Todo.findById(req.params.todo_id).exec()
			.then(todo => res.json(todo))
			.catch(err => res.json({ error: err }))
	})
	.put((req, res) => {
		// update todo
		Todo.findById(req.params.todo_id).exec()
			.then(todo => {
				todo.note = req.body.note
				todo.date = req.body.date

				return todo.save()
			})
			.then(todo => res.json({ success: true, message: 'Todo Updated!', todo: todo}))
			.catch(err => res.json({ success: false, error: err }))
	})
	.delete((req, res) => {
		// delete todo
		Todo.remove({ _id: req.params.todo_id }).exec()
			.then(status => res.json({ message: 'Todo removed!' }))
			.catch(err => res.json({ error: err }))
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