var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
	name:String,
	data:{
		title:String,
		answer:{
			index:Number,
			text:String
		}
	},
	time:String
});

var questionModel = mongoose.model('selectsingles',questionSchema);

module.exports = questionModel;