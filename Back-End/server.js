//Load modules
/*
	filecache module will gzip my files aswell as put them on cache.
*/
var http = require('http'), 
	url = require('url'), 
	fs = require("fs"),
	io   = require("socket.io"),
	filecache = require('filecache');

function createHash ( ) {
   var alphabets = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

   var hash = alphabets[ Math.floor( Math.random() * 26 )].toUpperCase() + Math.floor( Math.random() * 26 ) + alphabets[ Math.floor( Math.random() * 26 )] +  new Date().getTime() + alphabets[ Math.floor( Math.random() * 26 )] +  "" + new Date().getDate() + alphabets[ Math.floor( Math.random() * 26 )] + "" + new Date().getMonth() + alphabets[ Math.floor( Math.random() * 26 )] + alphabets[ Math.floor( Math.random() * 26 )].toUpperCase() + "" + new Date().getFullYear() + alphabets[ Math.floor( Math.random() * 26 )] + alphabets[ Math.floor( Math.random() * 26 )] + "" + Math.floor( Math.random() * 100000 )
   hash += alphabets[ Math.floor( Math.random() * 26 )]

   return hash
}

var startText = '<!DOCTYPE html><html lang="en"><head><title>Algiz</title><meta charset="utf8" /><link type="text/css" rel="stylesheet" href="stylesheets/index.css" /><script type="text/javascript" src="js/require.js" data-main="js/main"></script></head><body><div id="wrapper"><div id="header"><ul><li><img src="images/logo.svg" alt="logo" id="imgLogo"/></li><li style="float: right"><img src="images/newDocIcon.svg" alt="new Doc" id="imgNewDoc" title="Create a New Document"/></li></ul></div><div id="pubContent"><div id="textArea" class="pubTextArea">'

var endText = '</div></div><div id="footer"><a href="index.htm">Home</a><label>|</label><a href="index.htm">About</a><label>|</label><a href="index.htm">Help</a><br /></div></div></body></html>';


var options = { 
	port: 8888, 
	host: false, 
	filecache: { 
		watchDirectoryChange: true, 
		watchFileChange: false, 
		hashAlgo: 'sha1', 
		gzip: true, 
		deflate: true
    }, 
    httpHandler: { 
    	etag: true, 
    	lastmod: true, 
    	expires: 3600000, 
    	maxAge: 3600 // seconds
    }
}

// Create a new filecache
var fc = filecache( options.filecache )

// Print some debug output on change-event
fc.on( 'change', function( d ) {
  	console.log(' %s', new Array(11).join('='))
 	console.log('      file: %s', d.k)
  	console.log('     mtime: %s', d.mtime.toUTCString())
 	console.log(' mime-type: %s', d.mime_type)
  	console.log('      hash: %s', d.hash ? d.hash : 'N/A')
  	console.log('    length: %s bytes', d.length)
  	console.log('            %s bytes (gzip)', d.gzip ? d.gzip.length : 'N/A')
  	console.log('            %s bytes (deflate)', d.deflate ? d.deflate.length : 'N/A')
  	console.log(' full path: %s', d.p)
})

// Load all Front-End files of a directory into the cache
fc.load( process.cwd() + '/Front-End' )

function start ( route, handler ) {
	// Waits for the ready-event
	fc.on( 'ready', function() {
	  	// Creates the http request handler
	  	var httpHandler = fc.httpHandler( options.httpHandler )

		function onRequest ( req, res ) {
			// path is needed to check for a path a user 
			// requests for, and serve it if its 
			// available or say 404 not found if not.
			var path = url.parse(req.url).pathname;			

		  	httpHandler( req, res, function( next ) {
		        if( next === false ) {
		          	return
		        }
				// this function is used to connect each 
				// path with its specified handler.
				route( handler, path, req, res )
		    })
		}

		var svr = http.createServer( onRequest )


		//socket.io code goes here.
		var socket = io.listen( svr )

		exports.socket = socket
		
		// listening for any messages from the 
		// client on the home page
		socket.sockets.on( "connection", function( client ) {
			client.on( "textareaContent", function ( contents ) {
				console.log("TextArea's HTML: " + contents.innerHTML )
				console.log("TextArea's Text: " + contents.innerText )
			})

			// on the client, an event to save a page is emmited.
			// after receiving that event, make a public readonly version of that document.
			client.on ( "requestToSavePage", function( obj ) {
				// this document is to be displayed in straight away.
				var pathToWrite = process.cwd() + "/Front-End/publicUserSavedDocsURLs/" + obj.hash + ".htm"

				fs.writeFile ( pathToWrite, startText + obj.textAreaContent + endText, function( err ) {
  					if ( err ) throw err;

					client.emit( "finishedSavingPage", { state: true, path: obj.hash + ".htm" } )
				})
			})
		})

		// the /upload page contains contents of new inserted documents
		var upload = socket.of( '/upload' );
		upload.on( "connection", function( client ) {
			// on the client, an event to save a page is emmited.
			// after receiving that event, make a public readonly version of that document.
			client.on ( "requestToSavePage", function( obj ) {
				// this document is to be displayed in straight away.
				var pathToWrite = process.cwd() + "/Front-End/publicUserSavedDocsURLs/" + obj.hash + ".htm"

				fs.writeFile ( pathToWrite, startText + obj.textAreaContent + endText, function( err ) {
  					if ( err ) throw err;

					client.emit( "finishedSavingPage", { state: true, path: obj.hash + ".htm" } )
				})
			})
		})

		svr.listen( options.port )
	})
}

exports.start = start;