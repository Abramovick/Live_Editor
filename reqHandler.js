var formidable = require("formidable"), 
	fs 		   = require("fs"),
	io 		   = require("socket.io"),
	path	   = "",
	cType      = null; 

// this html will be outputed on the /upload page.
var text = '<!DOCTYPE html><html><head><title>Live Edit</title><script type="text/javascript" src="/socket.io/socket.io.js" ></script><script type="text/javascript" >var socket = io.connect("http://localhost:8888/upload"); socket.on("message", function(data){ document.querySelector("textarea").value = data;});</script><style>	body {background-color: #eee;}	#wrapper {margin: 50px auto; background-color: #ccc; width: 600px; height: 500px; padding-top: 2px; 	padding-left: 10px; padding-right: 10px; margin: 1px solid #aaa; border-radius: 50px; text-align: center; } h2 {text-align: center;	color: #666;} p {display: inline; font-size: 1.1em; } input {padding: 5px;} .para {position:absolute; top:479px; left: 800px} </style></head><body><div id="wrapper"><h2>Welcome to Live Edit</h2>';

// this is a handler that deals with the home page. all it does it
// it creates a readstream for the index page (home page) and outputs it.
function home(req, res){	
	var hs = fs.createReadStream(__dirname + "/index.htm");
	hs.pipe(res);
	
	res.on("end", function(){
		res.end();
		hs.end();
		hs.destroy();
	});
}

// after selecting a file to upload and having clicked the submit button, a new page
// comes up, which the /upload page.
function upload(req, res){

	// using the formidable API, load the incoming form and check its data.
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files){
		
		// by default formidable puts my uploaded file in a path that hard to find, 
		// and gives it a hashed name, therefore i should rename to a folder i want ("tmp")
		// and leave the filename to be the same.
		fs.renameSync(files.upload.path, "C:/tmp/" + files.upload.filename);		

		// this is needed for loading the files on the fs.readFile().
		path = "C:/tmp/" + files.upload.filename;
		exports.readPath = path;
		
		// the mime type is essential, because using this, i can upload, any file with 
		// any mime type.
		cType = (files.upload.mime).toString();

		// if the file's mime-type starts with image/, then its an image so upload it
		// using <img src="/show" > which will call the show function to load it.
		if (files.upload.mime.match("image")){
			res.write(text);
			res.write("<p>You have successfully loaded the image " + files.upload.filename + ".</p> <br/><img src='/show' />");
			res.end('</div></body></html>');
		} else {			
			// else, meaning that, its not an image, then read it, assuming its a text file.
			// using a text area, load its contents. 
			fs.readFile(path, function(err, file){
				var string = "";
				if(err){
					res.writeHead(500, {"Content-Type":"text/plain"});
					res.end(err.message + "\n");
					string = err.message;
				} 
				string = file.toString();
				
				output(string);
				res.end('<script type="text/javascript">var EventUtil = { addEvent: function(element, type, handler){ if (element.addEventListener){ element.addEventListener(type, handler, false); } else if (element.attachEvent){ element.attachEvent("on" + type, handler); } else { element["on" + type] = handler; }}}; var text = document.getElementById("textarea"); var save = document.getElementById("input"); var wrapper = document.getElementById("wrapper"); var counter = 0; var handle = function(){	socket.emit("new_data", text.value); counter++; if(wrapper.children.length === 5){ var p = document.createElement("p"); p.innerHTML = "- Saved."; p.className = "para"; wrapper.appendChild(p); } else if (wrapper.children.length > 5){ wrapper.removeChild(wrapper.lastChild); var p = document.createElement("p"); 	p.innerHTML = "- Saved #" + counter + "."; p.className = "para"; wrapper.appendChild(p); }}; EventUtil.addEvent(save, "click", handle); </script></body></html>');
			});
			
			function output(value){
				res.write(text);
				res.write('<p>You have successfully loaded the file ' + files.upload.filename + '.</p> <br/><textarea rows="21" cols="65" id="textarea">' + value + '</textarea><input type="button" value="Save Changes" id="input" /></div>');
			}
		}
	});
}

function show(req, res){
	console.log("Request handler 'show' was called.");
	fs.readFile(path, "binary", function(err, file){
		if(err){
			res.writeHead(500, {"Content-Type":"text/plain"});
			res.write(err.message + "\n");
			res.end();
		}
		
		res.writeHead(200, {"Content-Type":cType});
		res.write(file, "binary");
		res.end();
	});
}

exports.home   = home;
exports.upload = upload;
exports.show   = show;