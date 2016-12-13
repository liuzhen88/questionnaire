var q = require('q');
var config = require('../config/config');
var selectManySchema = require('../schema/selectManySchema');
var selectSingleSchema = require('../schema/selectSingleSchema');
var selectContentSchema = require('../schema/selectContentSchema');
var _ = require('underscore');
var userSchema = require('../schema/user');

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
					answer:value.answer,
					total:value.total,
					selects:value.selects
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
					answer:value.answer,
					total:value.total,
					selects:value.selects
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
			deferred.resolve(context);
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

		var result = {
			selectMany:[],
			selectSingle:[],
			selectContent:[]
		};

		var smTitle = [];
		selectMany.forEach(function(v){
			smTitle.push(v.data.title);
		});	
		smTitle = _.uniq(smTitle);

		var sm = [];
		smTitle.forEach(function(value){
			var obj = {
				title:value,
				selects:[],
				data:[]
			}
			for(var i=0;i<selectMany.length;i++){
				if(value == selectMany[i].data.title){
					obj.selects = selectMany[i].data.selects;
					obj.selects.forEach(function(vv){
						obj.data.push({
							name:vv,
							value:0
						});
					});
					sm.push(obj);
					break;
				}
			}
		});

		sm.forEach(function(value,index){
			selectMany.forEach(function(values,indexs){
				if(value.title == values.data.title){
					sm[index].data.forEach(function(vv,ii){
						values.data.answer.forEach(function(aa,bb){
							if(vv.name == aa.text){
								sm[index].data[ii].value = Number(sm[index].data[ii].value) + 1;
							}
						});
					});
				}
			});
		});

		var ssTitle = [];
		selectSingle.forEach(function(v){
			ssTitle.push(v.data.title);
		});
		ssTitle = _.uniq(ssTitle);

		var ss = [];
		ssTitle.forEach(function(value){
			var obj = {
				title:value,
				selects:[],
				data:[]
			}
			for(var i=0;i<selectSingle.length;i++){
				if(value == selectSingle[i].data.title){
					obj.selects = selectSingle[i].data.selects;
					obj.selects.forEach(function(vv){
						obj.data.push({
							name:vv,
							value:0
						});
					});
					ss.push(obj);
					break;
				}
			}
		});
		ss.forEach(function(value,index){
			selectSingle.forEach(function(values,indexs){
				if(value.title == values.data.title){
					ss[index].data.forEach(function(vv,ii){
						if(vv.name == values.data.answer.text){
							ss[index].data[ii].value = Number(ss[index].data[ii].value) + 1;
						} 
					});
				}
			});
		});

		var scTitle = [];
		selectContent.forEach(function(vv){
			scTitle.push(vv.data.title);
		});
		scTitle = _.uniq(scTitle);

		var sc = [];
		scTitle.forEach(function(value,index){
			var obj = {
				title:value,
				data:[]
			};
			selectContent.forEach(function(values,indexs){
				if(obj.title == values.data.title){
					obj.data.push(values.data.answer);
				}
			});
			sc.push(obj);
		});

		result.selectMany = sm;
		result.selectSingle = ss;
		result.selectContent = sc;

		deferred.resolve(result);
		return deferred.promise;
	},
	validate:function(req, res){
		var deferred = q.defer();
		var userInfoId = req.query.userInfoId;
		userSchema.findOne({
			'username':userInfoId
		},function(err,docs){
			if(err){
				deferred.reject(err);
			}else{
				if(docs){
					var context = config.data.error;
					deferred.resolve(context);
				}else{
					var userModel = new userSchema({
						username:userInfoId,
						time:new Date().getTime()
					});
					userModel.save(function(err){
						if(err){
							deferred.reject(err);
						}else{
							var cont = config.data.success;
							deferred.resolve(cont);
						}
					});
				}
			}
		});

		return deferred.promise;
	}
}