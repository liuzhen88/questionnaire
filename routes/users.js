var express = require('express');
var router = express.Router();
var questionnaire = require('../service/questionnaire');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/saveQuestionnaire',function(req,res){
	questionnaire.saveQuestionnaire(req,res)
	.then(function(data){
		res.send(data);
	})
	.fail(function(err){
		res.send(err);
	});
});

module.exports = router;
