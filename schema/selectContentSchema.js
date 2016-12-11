var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
	name:String,
	data:{
		title:String,
		answer:String
	},
	time:String
});

var questionModel = mongoose.model('selectcontents',questionSchema);

module.exports = questionModel;