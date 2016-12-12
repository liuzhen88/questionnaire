var express = require('express');
var router = express.Router();
var questionnaire = require('../service/questionnaire');

router.get('/result', function(req, res, next) {
	questionnaire.countQuestionResult(req,res).then(function(data){
		res.render('index',{data:data.data})
	}).fail(function(err){
  		res.render('index', {});
	});
});

module.exports = router;
