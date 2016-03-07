//===== server.js ======

// set up //
var express = require('express');
var app 	= express();
var mongoose = require('mongoose');//for mongodb
var morgan = require('morgan');//log to console
var bodyParser = require('body-parser');//get HTML POST info
var methodOverride = require('method-override');//simulate DELETE and PUT

// configuration //
mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); //use morgan to log to console
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// model //
var Todo = mongoose.model('Todo', {
	text : String
});



// ====== routes =======

//get all todos
app.get('/api/todos', function(req, res) {

	//use mongoose to get all todos in db
	Todo.find(function(err, todos){
		if (err) res.send(err);

		res.json(todos);
	});
});

//create todo and send back all todos 
app.post('/api/todos', function(req, res) {
	//create todo, info comes from AJAX angular request
	Todo.create({
		text :req.body.text,
		done : false
	}, function(err, todo){
		if (err) res.send(err);

		//get and return todos after creation
		Todo.find(function(err, todos){
			if (err) res.send(err);
			res.json(todos);
		});
	});
});

//delete a todo
app.delete('/api/todos/:todo_id', function(req,res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err) res.send(err);

		//get and return all todos after deletion
		Todo.find(function(err, todos) {
			if (err) res.send(err);
			res.json(todos);
		});
	});
});

// application
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

// listen //
app.listen(8080);
console.log("listening on port 8080");






