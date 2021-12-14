//jshint esversion:6
//package decleration
const express=require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const md5 = require('md5');
var _ = require('lodash');//upper case,lower case function
const { concat, find } = require("lodash");

const app = express();
app.set('view engine', 'ejs');//set ejs in view engine
app.use(bodyParser.urlencoded({extended: true}));//use bodyParser using app
app.use(express.static("public"));//to access the public folder
var Auth="";
//connect to mongodb server
mongoose.connect('mongodb+srv://admin-sukanto:CSE334@cluster0.ymxb0.mongodb.net/sample_supplies?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> app.listen(5000, ()=> console.log('server running on port: 5000')))
.catch((error)=> console.log(error.message ));
//admin schema
const adminSchema=new mongoose.Schema({
    email : String,
    password : String
});
const Admin=new mongoose.model('Admin', adminSchema);
//user schema
const userSchema=new mongoose.Schema({
    firstname : String,
    lastname : String,
    department : String,
    email : String,
    password : String
});
const User=new mongoose.model('User', userSchema);
//book schema
const bookSchema={
    title : String,
    author : String,
    stock : Number,
    lend : Number,
    total_rating : Number,
    vote : Number,
    serial_number : Number,
    category : String
    //comments:[{type:String}]
}
const Book=new mongoose.model('Book', bookSchema);
//request book
const rbookSchema={
    title : String,
    author : String,
    isbn_number : Number
}
const Apply_Book=new mongoose.model('requested_book', rbookSchema);
var si_num;
app.get("/",function(req,res){
    res.render("index");
});
app.post("/login",function(req,res){
    res.redirect("/home");
    // const email=req.body.loginUsername;
    // const password=md5(req.body.loginPassword);
    // Admin.findOne({email : email},function(err,findAdmin){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(findAdmin){
    //             if(findAdmin.password==password){
    //                 console.log("Log In Success");
    //                 //res.redirect("/home");
    //             }else{
    //                 console.log("Wrong Password");
    //                 res.redirect("/");
    //             }
    //         }else{
    //             console.log("Wrong Email");
    //         }
    //     }
    // })
});
app.get("/logout",function(req,res){
    res.redirect("/");
});
app.get("/home",function(req,res){
    Book.find({},function(err,books){
        si_num=books.length;
        res.render("home",{Books:books});
    });
    //res.render("admin/home");
})
app.get("/requestBookList",function(req,res){
    Apply_Book.find({},function(err,books){
        if(err){
            console.log(err);
        }else{
            books.forEach(function(book){
                console.log(book.title);
            })
            res.render("requestBookList",{Books:books});
        }
    })
    // res.render("requestBookList");
});
app.get("/AddNewBook",function(req,res){
    res.render("addNewBook");
})
app.post("/addBook",function(req,res){
    console.log("/addBook");
    const title=req.body.title;
    const author=req.body.author;
    const stock=req.body.stock;
    const category=req.body.category;
    const serial_number=10;
    console.log(title);
    console.log(author);
    console.log(stock);
    console.log(category);
    const newBook = new Book({
        title : req.body.title,
        author : req.body.author,
        stock : req.body.stock,
        lend : 0,
        total_rating : 0,
        vote : 0,
        serial_number : si_num+1,
        category : req.body.category
    });
    newBook.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Success");
            res.redirect("/home");
        }
    })
});
app.get("/userList",function(req,res){
    User.find({},function(err,users){
        if(err){
            console.log(err);
        }else{
            users.forEach(function(user){
                console.log(user.email);
            })
            res.render("userList",{Users:users});
        }
    })
})