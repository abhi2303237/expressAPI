var express = require ("express");
var mongo = require("mongoose");
var bodyparser = require("body-parser");
var session = require("express-session");

mongo.connect('mongodb://localhost:27017/local');
var app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({secret: "HGjhJHGUJkijLUgJIJkijJ" }));

app.set('view engine', 'pug');
app.set('views','./view');
var userSchema = mongo.Schema(
    {
        name:String,
        username:String,
        password:String
    }

);

var person = mongo.model("user",userSchema);

app.get('/reg', function(req,res) {
    res.render('Registration');
});

app.get('/login', function(req,res) {
    if(req.session.userid){
        person.find({_id : req.session.userid},function(err,response){
            res.render("profile",{data : response[0]});
        });
    }
    else{
        res.render('login');
    }
});

app.get('/logout', function(req,res) {
    req.session.destroy();
    res.redirect('/login');
});


app.post('/logincontroller', function(req,res) {

    person.find({username : req.body.username, password : req.body.password},function(err,response){
        console.log(req.body);
        if(response[0]){
            req.session.userid = response[0]._id;
            res.render("profile",{data : response[0]});
        }
        else{
            res.send("error username or password");
        }
    })
});

app.post('/person', function(req,res) {
    console.log(req.body);
    var newperson =new person(
        {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
        }
    );
    newperson.save();
    res.send("data recieved");
});

app.get('/retrieve', function(req,res) {
    person.find({name:'sijo'},function(err, response){
        res.send(response);
    })
});

app.use("*", function(request,response){
    response.send("OOPs page not found",404);
})

app.listen(3000);