var mongoose=require("mongoose");

var contactSchema= mongoose.Schema({
	name:String,
	 email:String,
	 
	  phone:Number,
	    subject:String,
	  
	  
});

module.exports=mongoose.model("contact",contactSchema);