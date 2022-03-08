var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

var technicalSchema = new Schema({
	question: {type: String, required: true},
	author: {type: String, required: true},
	authorName: {type: String, required: true},
	q_number: {type: Number, required: true},
	admin_rankings: {type: Array, required: true},
	user_rankings: {type: Array, required: true},
	report: {type: Array, required: true}},
	 {collection: 'technicalQuestions'});
technicalSchema.plugin(random);

var technical = mongoose.model('technical', technicalSchema);
module.exports = technical;