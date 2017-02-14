/*===============
  Initialization
=================*/

/* import package */
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

/* use es6 promise */
mongoose.Promise = global.Promise

/* import model and configuration */
const config = require('./config')
const User = require('./app/models/user')
const Todo = require('./app/models/todo')
 
/* create express instance and define port */
const app = express()
const port = process.env.PORT || 8080


/*===============
  Configuration
=================*/

/* connection string */
mongoose.connect(config.database, (err, db) => {
	if(err)
		console.log(err)
})

/* set secret variable for jwt*/
app.set('todolizSecret', config.secret)

/* configure app using body-parser */
app.use(bodyParser.urlencoded({ extended: false }))  // allow app to get extended form (POST)
app.use(bodyParser.json())
app.use(morgan('dev')) // log every requests

/*==============
  Routes
================*/

/* create router instance */
const router = express.Router()

/* middleware */
router.use(function (req, res, next) {
	console.log('Request from clients')
	next()
})

/* Route for /todolist */
router.route('/setup')
	.get((req, res) => {
		var user = new User()
		user.username = 'Nick Cerminara'
		user.password = 'password'

		user.save()
			.then(nick => res.json({ success: true, message: 'User saved' }))
			.catch(err => res.json({ error: err }))
	})

router.route('/users')
	.get((req, res) => {
		User.find().exec()
			.then(user => res.json(user))
			.catch(err => res.json({ error: err }))
	})

router.route('/authenticate')
	.post((req, res) => {
		const username = req.params.username
		const password = req.params.password

		// find the user
		User.findOne({ 'username': username }).exec()
			.then(user => {
				res.json(user)
				if(!user) {
					res.json({ success: false, message: 'Auth failed. User not found!' })
				} else {
					// check the password
					if(user.password !== password) {
						res.json({ success: false, message: 'Auth failed. Wrong password!' })
					} else {
						var token = jwt.sign(user, app.get('todolizSecret'), {
							expiresInMinutes: 120
						})

						res.json({ success: true, token: token})
					}
				}
			})
			.catch(err => res.json({ error: err }))
	})

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