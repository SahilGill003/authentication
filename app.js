//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.raw());
app.use(bodyParser.json());

app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"]});

const User = new mongoose.model('User', userSchema);

app.get("/", function(req,res){
  res.render('home');
})

app.get("/register", function(req,res){
  res.render('register');
})

app.get("/login", function(req,res){
  res.render('login');
})

app.post("/register", function(req,res) {
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if(!err)
    {
      res.render('secrets');
    }
    else
    {
      res.send(err);
    }
  })
})

app.post("/login", function(req,res) {
  User.findOne({email: req.body.username}, function(err, target){
    if(err)
    {
     res.send(err);
    }
    else
    {
      if(target.password === req.body.password){
        res.render('secrets');
      }
     } 
  })
});

app.listen(3000, function(req,res){
  console.log("Server in running .....");
})
