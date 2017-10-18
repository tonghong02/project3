var express = require('express');

var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: '../public/uploads/'});


router.post('/profile', upload.any(), function(req, res){
		// console.log("qrerewrw");
	  	res.send(req.files);
	});



module.exports = router;
