var server 		= require( __dirname + "/server.js" ),
	router 		= require( __dirname + "/router.js" ),
	reqHandlers = require( __dirname + "/reqHandler.js" ),
	handler 	= {};

handler["/"] 	   = reqHandlers.home;
handler["/home"]   = reqHandlers.home;
handler["/index.htm"]   = reqHandlers.home;
handler["/index.html"]   = reqHandlers.home;
handler["/upload"] = reqHandlers.upload;
handler["/show"]  = reqHandlers.show;

server.start( router.route, handler );