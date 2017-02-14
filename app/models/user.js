/*===================
  User Data Model
=====================*/

/* init */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* define schema */
const userSchema = new Schema({
	username: String,
	password: String
})

/* export model */
module.exports = mongoose.model('User', userSchema)
