const express = require("express");
const app     = express();
const path = require('path');
const mongoose=require('mongoose');
const bodyParser=require("body-parser");
const passport =require('passport');
const passportLocal=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const session=require("express-session");
var reg=require("./models/donor.js");
var reqw=require("./models/request.js");
var contact=require("./models/contactus.js");
var User =require("./models/user.js");

const flash=require("connect-flash");
const cookieParser = require('cookie-parser');



require('./config/passport')(passport);
app.use(require("express-session")
	({
		secret:"qwert asdfg zxcvb loikjh bghjk ",
		resave: false,
		saveUninitalized:false
		
	})
	);



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// require('./config/passport')(passport);
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

var db="mongodb://praveen:praveen123@ds261430.mlab.com:61430/bloodbank";
mongoose.connect(db,{useNewUrlParser:true},(err)=>{
	if(!err){
		console.log("Connected");
	}
});


app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));


// var userSchema= mongoose.Schema({
// 	  username:String,
// 	  email:String,
// 	  password:String

// });

// userSchema.plugin(passportLocalMongoose);


let sess;
app.get("/",function(req,res)
{
	sess = req.session;

     if(sess.passport!=undefined){

     	 let userId = sess.passport.user;
       User.findById(userId,(err,user)=>{

       	if(!err){
       		res.render('home.ejs',{sess:sess});

       	}else{
               res.status(400).send('error from mongo');
       	}
    })

     }else{
      res.render("home",{sess:sess});
     	
     	}
});



app.get("/check",isLoggedIn,function(req,res){
	res.render("result");
});

app.get("/login",function(req,res){
    res.render("login");
});



app.post('/login', passport.authenticate('local-login', {

		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));




// app.post('/login',(req,res)=>{

// 	User.findOne({email:req.body.email,
// 		password:req.body.password},(us,err)=>{
// 			if(!err){
// 				res.render('home');
// 			}else{
// 				console.log("hello");
// 				res.send("no email find");
// 			}
// 		})
// })





 app.get("/about",(req,res)=>{
 	res.render("about");
 })
 app.get("/view",(req,res)=>{
 		reqw.find({},(err,userrs)=>{
		if(err)
			console.log(err);
		else{
			res.render("view",{userrs:userrs})
		}
	})
 	
 });

 app.get("/requests",(req,res)=>{
 	res.render("requests");
 });


 app.post("/requests",(req,res)=>{
	reqw.create(req.body.det,(err,userr)=>{
		if(err)
			res.render("signup");
		else
			res.redirect("/");
	})
})

 app.get("/contact",(req,res)=>{
 	res.render("contact");
 })
  app.post("/contact",(req,res)=>{
	contact.create(req.body.det,(err,userr)=>{
		if(err)
			res.render("signup");
		else
			res.redirect("/");
			
	})
})

 app.get("/signup",function(req,res){
	res.render("signup");
});

 app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/donor', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



app.get("/logout",function(req,res){
	req.logout();
	 req.flash("success", "LOGGED YOU OUT!");
	res.redirect("/");
});



app.get("/donor",function(req,res){
	res.render("donoreg");
});


app.post("/donor",(req,res)=>{
	reg.create(req.body.det,(err,userr)=>{
		if(err)
			res.render("signup");
		else
			res.redirect("/");
	})
})



app.get("/find",isLoggedIn,(req,res)=>{
	res.render("search");
});

app.post("/find",(req,res)=>{
	console.log("hello");
	reg.find({blood:req.body.blood, city:req.body.city},(err,userrs)=>{
		if(err)
			console.log(err);
		else{
			console.log(userrs);
			res.render("result",{userrs:userrs})
		}
	})
})


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
		

	}
	req.flash("error","You need to be Logged In");
	res.redirect("/login");
}
app.listen(5555,function(err){
    if(!err)
    console.log("Connected");
});
