/*===================
  Todolist Data Model
=====================*/

/* init */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* define schema */
const todoSchema = new Schema({
	note: String,
	done: Boolean,
	date: Date,
	lastModified: { type: Date, default: Date.now }
})

/* export model */
module.exports = mongoose.model('Todo', todoSchema)
