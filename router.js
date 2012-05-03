// this module connects a path, to a specified handler
// and call it. as shown on line 7 - handler[path]();
// if its not found then "404 not found" is shown.
function route(handler, path, req, res){
	console.log(path);
	if(typeof handler[path] === "function"){
		handler[path](req, res);
	} else {
		console.log("No request handler found for " + path);
		res.writeHead(404, {"Content-Type":"text/plain"});
		res.end("404 Not Found!");
	}
}

exports.route = route;