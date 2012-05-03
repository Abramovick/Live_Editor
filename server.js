// this module just creates a server and exports 
// a function called start. this function has 2 
// arguments, "route" and "handler". "route" is a
// function that deals with routing requests to 
// its specific handler. "handler" is an object that
// contains all the pathnames an their handlers. 

var http = require("http"),
	fs   = require("fs"),
	url  = require("url"),
	io   = require("socket.io");

function start(route, handler){
	function onRequest(req, res){
		res.writeHead(200, {"content-type":"text/html"});
		
		// path is needed to check for a path a user 
		// requests for, and serve it if its 
		// available or say 404 not found if not.
		var path = url.parse(req.url).pathname;
		
		// this function is used to connect each 
		// path with its specified handler.
		route(handler, path, req, res);
	}
	
	var svr = http.createServer(onRequest);
	
	// make socket.io listen to the same http server.
	var socket = io.listen(svr);
	console.log("server started!");	

	// listening for any messages from the 
	// client on the home page
	socket.on("connection", function(client){
		client.on("message", function(data){
			console.log(data);
		});
	});

	// create a handler to listen for
	// any messages on the /upload page.
	var upload = socket.of('/upload');
	upload.on("connection", function(client){
		var path = require(__dirname + "/reqHandler.js").readPath;
		var ws = fs.createWriteStream(path, {flags: "w"});            
		
		client.on("message", function(data){
			console.log(data);
		});
		
		client.on("new_data", function(data){
			ws.write(data);
			console.log("Finished writing to stream!");
		});
	});	
	svr.listen(8888);
}

exports.start = start;