// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
var moment =require("moment");

var port = 8000;
//require the Mongoose Module
var mongoose = require('mongoose');


// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quoting_mongoose');
mongoose.Promise = global.Promise;
var QuoteSchema = new mongoose.Schema({
    name : {type:String, required: true, minlength: 1},
    quote : { type: String, required: true, minlength: 6}
}, {timestamps: true });
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote= mongoose.model('Quote'); // We are retrieving this Schema from our Models, named 'User'


// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({
    extended: true
}));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, '/static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, '/views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
});
// Add User Request 
app.post('/quotes', function (req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var new_quote = new Quote({
        name: req.body.name,
        quote: req.body.quote
        
    });
    
    console.log(new_quote.name);
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    new_quote.save(function (err){
        // if there is an error console.log that something went wrong!
        if (err) {
            console.log('something went wrong');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!');
            res.redirect('/quotes');
        }
    });//.sort({_id:-1}) to sort
});
app.get('/quotes',function(req,res){
    Quote.find({}, function(err, quotes) {
    res.render('results',{quote:quotes,moment:moment});
    });
});


// Setting our Server to Listen on Port: 8000
app.listen(port, function () {
    console.log("listening on port 8000");
});