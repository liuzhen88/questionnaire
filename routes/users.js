var express = require('express');
var router = express.Router();
var questionnaire = require('../service/questionnaire');

router.post('/saveQuestionnaire',function(req,res,next){
	questionnaire.saveQuestionnaire(req,res)
	.then(function(data){
		res.send(data);
	})
	.fail(function(err){
		res.send(err);
	});
});

router.get('/countQuestionResult',function(req,res,next){
	questionnaire.countQuestionResult(req,res)
	.then(function(data){
		res.send(data);
	})
	.fail(function(err){
		res.send(err);
	});
});

router.get('/validate',function(req,res){
	questionnaire.validate(req,res)
	.then(function(data){
		res.send(data);
	})
	.fail(function(err){
		res.send(err);
	});
});

module.exports = router;
