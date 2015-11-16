// require mongoose and load the model that we are going to use
var mongoose = require('mongoose');
var Loc = mongoose.model('Loc');

// create an object with methods that we are going to export for our routes file to use
var locs = {}

// methods to handle Ajax requests
locs.getLocs = function(req,res){
	Loc.find({}).limit(10000).exec(function(err,data){
		if(err){
			res.send('something went wrong!');
		}	else {
      // console.log(data)
			res.json(data);
			// res.send(JSON.stringify(data));
		}
	});
}

// users.addUser = function(req,res){
// 	var newUser = new User({name:req.body.name});
// 	newUser.save(function(err,resHeader){
// 		if(err){
// 			res.send('something went wrong!');
// 		} else {
// 			res.json({id:resHeader._id});
// 		}
// 	});
// }
// users.removeUser = function(req,res){
// 	User.remove({_id:req.body._id},function(err){
// 		if(err){
// 			res.send('something went wrong!');
// 		} else {
// 			res.json({msg:"successfully deleted user from database!"});
// 		}
// 	});
// }
// users.editUser = function(req,res){
// 	console.log(req.body);
// 	User.update({_id:req.body._id},{name:req.body.name},function(err){
// 		if(err){
// 			res.send('something went wrong!');
// 		} else {
// 			res.json({msg:"successfully edited user in database!"});
// 		}
// 	});
// }

module.exports = locs;