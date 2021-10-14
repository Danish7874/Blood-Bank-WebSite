var mongoose=require("mongoose");

var donorSchema= mongoose.Schema({
	name:String,
	
	 
	  gender:String,
	  age:Number,
	  phone:Number,
	    city:String,
	     blood:String,
	  email:String,
	  password:String,
	  
	  
	  
});

module.exports=mongoose.model("donor",donorSchema);