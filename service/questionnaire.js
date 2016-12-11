var q = require('q');
var config = require('../config/config');
var selectManySchema = require('../schema/selectManySchema');
var selectSingleSchema = require('../schema/selectSingleSchema');
var selectContentSchema = require('../schema/selectContentSchema');

module.exports = {
	saveQuestionnaire:function(req, res){
		var deferred = q.defer();
		var _this = this;
		var data = req.body.sendData;
		data = JSON.parse(data);
		var selectMany = data.selectMany;
		var selectSingle = data.selectSingle;
		var selectContent = data.selectContent;
		_this.handleSelectMany(req,selectMany)
		.then(function(result){
			return _this.handleSelectSingle(req,selectSingle);
		})
		.then(function(result){
			return _this.handleSelectContent(req,selectContent);
		})
		.then(function(result){
			var context = config.data.success;
			deferred.resolve(context);
		})
		.fail(function(err){
			deferred.reject(err);
		});
		return deferred.promise;
	},
	handleSelectMany:function(req, data){
		var deferred = q.defer();
		var insertData = [];
		data.forEach(function(value,index){
			insertData.push({
				name:'select_many',
				data:{
					title:data.title,
					answer:value.answer
				},
				time:new Date().getTime()
			});
		});
		selectManySchema.insertMany(insertData,function(err){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve();
			}
		}); 

		return deferred.promise;
	},
	handleSelectSingle:function(req, data){
		var deferred = q.defer();
		var insertData = [];
		data.forEach(function(value,index){
			insertData.push({
				name:'select_single',
				data:{
					title:data.title,
					answer:value.answer
				},
				time:new Date().getTime()
			});
		});
		selectSingleSchema.insertMany(insertData,function(err){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve();
			}
		}); 

		return deferred.promise;
	},
	handleSelectContent:function(req, data){
		var deferred = q.defer();
		var insertData = [];
		data.forEach(function(value,index){
			insertData.push({
				name:'select_content',
				data:{
					title:data.title,
					answer:value.answer
				},
				time:new Date().getTime()
			});
		});
		selectContentSchema.insertMany(insertData,function(err){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve();
			}
		}); 

		return deferred.promise;
	}
}