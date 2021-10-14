var mongoose=require("mongoose");

var requestSchema= mongoose.Schema({
	name:String,
	
	 
	  gender:String,
	  age:Number,
	  phone:Number,
	    city:String,
	     blood:String,
	  email:String,
	 month:String,
	 day:String,
	 year:String,
	  detail:String,
	  
	  
});

module.exports=mongoose.model("requests",requestSchema);