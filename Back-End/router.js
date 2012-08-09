var fs = require( "fs" ),
	publicUserSavedDocsURLs = process.cwd() + "/Front-End/publicUserSavedDocsURLs";

function route( handle, pathname, req, res ) {
	console.log( "About to route a request for " + pathname );
	if ( typeof handle[ pathname ] === "function" ) {
		handle[ pathname ]( req, res );
	} else if ( fs.existsSync( publicUserSavedDocsURLs + pathname ) ) {
		var readStream = fs.createReadStream( publicUserSavedDocsURLs + pathname )
		readStream.pipe( res )

		readStream.on( "error", function( err ) {
			res.writeHead( 400, { "Content-Type" : "text/plain" } );
			res.end( err.message );
			return
		})

		res.on( "end", function() {
			res.end()
			readStream.end()
			readStream.destroy()
		})
	} else {	
		console.log( "No request handler found for " + pathname );
		res.writeHead( 404, { "Content-Type" : "text/plain" } );
		res.end( "404 Not Found!" );
	}
}

exports.route = route;