var q = require('q');
var config = require('../config/config');
var selectManySchema = require('../schema/selectManySchema');
var selectSingleSchema = require('../schema/selectSingleSchema');
var selectContentSchema = require('../schema/selectContentSchema');
var _ = require('underscore');

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
					title:value.title,
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
					title:value.title,
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
					title:value.title,
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
	},
	getSelectManyData:function(req, res){
		var deferred = q.defer();
		selectManySchema.find({}).exec(function(err,docs){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve(docs);
			}
		});

		return deferred.promise;
	},
	getSelectSingleData:function(req, selectManyData){
		var deferred = q.defer();
		selectSingleSchema.find({}).exec(function(err,docs){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve({
					selectManyData:selectManyData,
					selectSingleData:docs
				});
			}
		});

		return deferred.promise;
	},
	getSelectContentData:function(req, data){
		var deferred = q.defer();
		selectContentSchema.find({}).exec(function(err,docs){
			if(err){
				deferred.reject(err);
			}else{
				data.selectContentData = docs;
				deferred.resolve(data);
			}
		});

		return deferred.promise;
	},
	countQuestionResult:function(req, res){
		var deferred = q.defer();
		var that = this;
		that.getSelectManyData(req,res)
		.then(function(selectManyData){
			return that.getSelectSingleData(req, selectManyData);
		})
		.then(function(data){
			return that.getSelectContentData(req,data);
		})
		.then(function(data){
			return that.count(req,data);
		})
		.then(function(result){
			var context = config.data.success;
			context.data = result;
			deferred.resolve(result);
		})
		.fail(function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	},
	count:function(req, data){
		var deferred = q.defer();
		var selectMany = data.selectManyData;
		var selectSingle = data.selectSingleData;
		var selectContent = data.selectContentData;
		var selectManyTitle = [];
		var selectSingleTitle = [];
		var selectContentTitle = [];
		selectMany.forEach(function(value,index){
			selectManyTitle.push(value.data.title);
		});
		selectManyTitle = _.uniq(selectManyTitle);

		selectSingle.forEach(function(value,index){
			selectSingleTitle.push(value.data.title);
		});
		selectSingleTitle = _.uniq(selectSingleTitle);

		selectContent.forEach(function(value,index){
			selectContentTitle.push(value.data.title);
		});
		selectContentTitle = _.uniq(selectContentTitle);

		var result = {};
		var smArr = [];
		selectManyTitle.forEach(function(value,index){
			var obj = {
				title:value,
				options:[]
			};
			selectMany.forEach(function(values,indexs){
				if(obj.title == values.data.title){
					values.data.answer.forEach(function(vv,ii){
						var thatIndex = vv.index;
						var state = true;
						obj.options.forEach(function(v,i){
							if(v.index == thatIndex){
								obj.options[i].num = Number(obj.options[i].num) + 1;
								state = false;
							}
						});
						if(state == true){
							obj.options.push({
								index:thatIndex,
								num:1,
								answer:vv.text
							})
						}
					});
				}
			});
			smArr.push(obj);
		});
		deferred.resolve(smArr);

		return deferred.promise;
	}
}