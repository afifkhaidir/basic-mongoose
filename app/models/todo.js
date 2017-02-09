/*===================
  Todolist Data Model
=====================*/

/* init */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* define schema */
var todoSchema = new Schema ({
	note: String,
	done: Boolean,
	date: Date,
	lastModified: { type: Date, default: Date.now }
});

/* export model */
module.exports = mongoose.model ('Todo', todoSchema);
