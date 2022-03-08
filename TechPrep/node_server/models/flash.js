var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

var flashSchema = new Schema({
	question: {type: String, required: true},
	answer: {type: String, required: true},
	author: {type: String, required: true},
	authorName: {type: String, required: true},
	q_number: {type: Number, required: true},
	admin_rankings: {type: Array, required: true},
	user_rankings: {type: Array, required: true},
	report: {type: Array, required: true}},
	{collection: 'flashQuestions'});
flashSchema.plugin(random);


var flash = mongoose.model('flash', flashSchema);
module.exports = flash;