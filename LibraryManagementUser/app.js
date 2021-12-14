//jshint esversion:6
//package decleration
const express=require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const md5 = require('md5');
var _ = require('lodash');//upper case,lower case function
const { concat } = require("lodash");

const app = express();
app.set('view engine', 'ejs');//set ejs in view engine
app.use(bodyParser.urlencoded({extended: true}));//use bodyParser using app
app.use(express.static(__dirname + "/public"));//to access the public folder
var Auth="";
var Auth_name="";
//connect to mongodb server
mongoose.connect('mongodb+srv://admin-sukanto:CSE334@cluster0.ymxb0.mongodb.net/sample_supplies?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> app.listen(3000, ()=> console.log('server running on port: 3000')))
.catch((error)=> console.log(error.message ));
//user schema
const userSchema=new mongoose.Schema({
    firstname : String,
    lastname : String,
    registration_number : String,
    department : String,
    email : String,
    password : String
});
const User=new mongoose.model('User', userSchema);
var com={
    id:String,
    rivew:String,
}
//book schema
const bookSchema={
    title:String,
    author:String,
    total_rating:Number,
    category:String,
    comments:[{type:String}]
}
const Book=new mongoose.model('Book', bookSchema);
//request book
const rbookSchema={
    title:String,
    author:String,
    isbn_number:Number,
}
const Apply_Book=new mongoose.model('requested_book', rbookSchema);

app.get("/",function(req,res){
    res.render("index");
}); 
app.post("/login",(req,res)=>{
    const username=req.body.loginUsername;
    const password=md5(req.body.loginPassword);
    User.findOne({email : username},function(err,findUser){
        if(err){
            console.log(err);
        }else{
            if(findUser){
                if(findUser.password==password){
                    Auth=findUser._id;
                    // console.log(findUser.firstname);
                    Auth_name=findUser.firstname;
                    //console.log(string(Auth));
                    res.redirect("/home");
                }else{
                    res.redirect("/");
                }
            }else{
                res.redirect("/");
            }
        }
    });
    
})
app.post("/signUp",function(req,res){
    // console.log(req.body.lastname);
    // console.log(req.body.reg_num);
    const newUser = new User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        registration_number : req.body.reg_num,
        department : req.body.department,
        email : req.body.email,
        password : md5(req.body.password)
    });
    Auth=req.body.email;
    Auth_name=req.body.firstname;

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/home");
        }
    });
    
});
app.get("/about",function(req,res){
    res.render("about");
});
 
//Home routing
app.get("/home",function(req,res){
    if(Auth==""){
        res.redirect("/")
    }else{
        // console.log("home");
        Book.find({},function(err,books){
            console.log(books.length);
            res.render("home",{Books:books});
        });
    }
    // res.render("home");
});
app.get("/category/:c",function(req,res){
    // console.log(req.params.c);
    Book.find({category:req.params.c},function(err,books){
        // console.log(books.length);
        res.render("home_category",{Books:books,cat:req.params.c});
    });
});
app.get("/search",function(req,res){
    Book.find({title:"FUNDAMENTAL OF ELECTRICAL CIRCUITS"},function(err,books){
        // console.log(books.length);
        res.render("search",{Books:books});
    });
});
app.get("/profile",function(req,res){
    // console.log("Hellow");
    res.render("profile");
    User.findById({_id:"61b0c58857c8c597463f8d70"},function(err,user){
        if(err){
            console.log(err);
        }else{
            console.log(user.firstname);
            res.render("profile");
        }
    });
});
//LOG OUT
app.post("/logout",function(req,res){
    Auth="";
    res.redirect("/");
});
app.post("/request_book",function(req,res){
    const apply_Book=new Apply_Book({
        title:req.body.r_name,
        author:req.body.r_author_name,
        isbn_number:req.body.isbn_num
    });
    apply_Book.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Success");
        }
    });
    res.redirect("/home");
});
app.get("/book/:id",function(req,res){
    // console.log(req.params.id);
    const id=req.params.id;
    Book.findById({_id:id},function(err,book){
        if(err){
            console.log(err);
        }else{
            // console.log(book.comments.length);
            // console.log("Success");
            res.render("book",{Book:book});
        }
    });
})
app.post("/comment/:id",function(req,res){
    // console.log("Commenting");
    const b_id=req.params.id;
    const str1=Auth_name;
    const str2=req.body.rivew;
    // console.log(str1);
    // console.log(str2);
    Book.findOneAndUpdate({_id:b_id},{$push:{comments:str1}},function(err){
        if(err){
            console.log(err);
        }else{
            // console.log("success");
            Book.findOneAndUpdate({_id:b_id},{$push:{comments:str2}},function(err){
                if(err){
                    console.log(err);
                }else{
                    // console.log("success");
                    res.redirect(("/book/"+b_id));
                }
            });
        }
    });
    
    // res.redirect(("/book/"+b_id));
});


 
