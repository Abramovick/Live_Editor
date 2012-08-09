var formidable = require( "formidable" ), 
	fs 		   = require( "fs" ),
	mime	   = require("mime"),
	path	   = "",
	cType      = null;

//for me to be able to load at once the data required, then i'll have to use this ugly hack.
var text = '<!DOCTYPE html><html lang="en">	<head><title>Algiz</title><meta charset="utf8" /><link type="text/css" rel="stylesheet" href="stylesheets/index.css" /><script type="text/javascript" src="js/require.js" data-main="js/main"></script>	</head>	<body><div id="wrapper"><div id="header"><ul><li id="leftImg"><img src="images/uploadIcon.svg" alt="upload" id="imgUpload"/></li><li id="centerImg"><img src="images/logo.svg" alt="logo" id="imgLogo"/></li><li id="rightImg"><img src="images/saveIcon.svg" alt="save" id="imgSave"/></li></ul></div><div id="content"><div id="nav"><ul><li class="borderRight"><img src="images/nav/hash.svg" alt="n" title="Enable Line Numbers" id="hashIcon"/></li><li class="borderRight"><img src="images/nav/html.svg" alt="code" title="Code" id="codeIcon"/></li><li><img src="images/nav/bold.svg" alt="svg" title="Bold" id="boldIcon"/></li><li><img src="images/nav/italics.svg" alt="italics" title="Italics" id="italicsIcon"/></li><li><img src="images/nav/underline.svg" alt="underline" title="Underline" id="underlineIcon"/></li><li class="borderRight"><img src="images/nav/strike.svg" alt="strike" title="Deleted" id="strikeIcon"/></li><li class="borderRight"><select id="fontStyle"><option value="Arial">Arial</option><option value="Arial Narrow">Arial Narrow</option><option value="Arial Rounded MT Bold">Arial Rounded MT Bold</option><option value="Book Antiqua">Book Antiqua</option><option value="Bookman OldStyle">Bookman OldStyle</option><option value="Bradley Hand ITC">Bradley Hand ITC</option><option value="Cambria">Cambria</option><option value="Century Gothic">Century Gothic</option><option value="Comic Sans MS">Comic Sans MS</option><option value="Courier New">Courier New</option><option value="Franklin Gothic Medium">Franklin Gothic Medium</option><option value="Garamond">Garamond</option><option value="Georgia">Georgia</option><option value="Haettenschweiler">Haettenschweiler</option><option value="Harrington">Harrington</option><option value="Impact">Impact</option><option value="Lucida Bright">Lucida Bright</option><option value="Lucida Calligraphy">Lucida Calligraphy</option><option value="Lucida Console">Lucida Console</option><option value="Lucida Sans">Lucida Sans</option><option value="Lucida Sans Typewriter">Lucida Sans Typewriter</option><option value="Lucida Sans Unicode">Lucida Sans Unicode</option><option value="Mistral">Mistral</option><option value="Monospace">Monospace</option><option value="MS Mincho">MS Mincho</option><option value="Onyx">Onyx</option><option value="Papyrus">Papyrus</option><option value="Perpetua">Perpetua</option><option value="Perpetua Titling MT">Perpetua Titling MT</option><option value="Playbill">Playbill</option><option value="Rockwell">Rockwell</option><option value="Rockwell Extra Bold">Rockwell Extra Bold</option><option value="Stencil">Stencil</option><option value="Tahoma">Tahoma</option><option value="Times">Times New Roman</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Tw Cen MT">Tw Cen MT</option><option value="Verdana">Verdana</option><option value="Wide Latin">Wide Latin</option><option value="Wingdings">Wingdings</option>	</select></li><li class="borderRight"><select id="fontSize"><option value="10">10</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option><option value="20">20</option><option value="24">24</option><option value="28">28</option><option value="36">36</option><option value="42">42</option><option value="48">48</option><option value="56">56</option><option value="64">64</option><option value="72">72</option></select></li><li><img src="images/nav/undo.svg" alt="undo" title="Undo" title="undoIcon" id="undoIcon"/></li><li class="borderRight"><img src="images/nav/redo.svg" alt="redo" title="Redo" id="redoIcon"/></li><li><img src="images/nav/subscript.svg" alt="subscript" title="Subscript" id="subscriptIcon"/></li><li class="borderRight"><img src="images/nav/superscript.svg" alt="superscript" title="Superscript" id="superscriptIcon"/></li><li><img src="images/nav/fontColor.svg" alt="font color" title="Font Color" id="fontcolorIcon"/></li><li><img src="images/nav/colorFill.svg" alt="Backcolor fill" title="Background Color" id="backcolorIcon"/></li><li><img src="images/nav/insertImage2.svg" alt="insert image" title="Insert Image" id="insertimageIcon"/></li><li><img src=" images/nav/insertVideo.svg" alt="Insert Video" title="Insert Video" id="insertvideoIcon"/></li><li class="borderRight"><img src="images/nav/link.svg" alt="link" title="Create Link" id="linkIcon"/></li><li><img src="images/nav/alignLeft.svg" alt="align left"  title="Align Left" id="alignleftIcon"/></li><li><img src="images/nav/alignCenter.svg" alt="align center" title="Align Center" id="aligncenterIcon"/></li><li><img src="images/nav/alignRight.svg" alt="align right" title="Align Right" id="alignrightIcon"/></li><li class="borderRight"><img src="images/nav/alignJustify.svg" alt="Justify text" title="Justify Text" id="justifyIcon"/></li><li class="borderRight"><img src="images/nav/hr.svg" alt="hr" title="Horizontal Line" id="hrIcon"/></li><li><img src="images/nav/unorderedList.svg" alt="OL list" title="Unordered List" id="ulIcon"/></li><li><img src="images/nav/orderedList.svg" alt="ordered list" title="Ordered List" id="olIcon"/></li><li><img src="images/nav/indent.svg" alt="indent list" title="Indent" id="indentIcon"/></li><li><img src="images/nav/outdent.svg" alt="outdent list" title="Outdent" id="outdentIcon"/></li><li><img src="images/nav/lineSpacing.svg" alt="Line Spacing" title="Line Spacing" id="linespacingIcon"/></li><li><img src="images/nav/table.svg" alt="table" title="Draw Table" id="tableIcon"/></li></ul><ul><li><img src="images/nav/settings.svg" alt="settings" title="Settings" id="settingsIcon"/></li></ul></div><div id="edit">';


function home( req, res ) {
	var rs = fs.createReadStream( "Front-End/index.htm" );
	rs.pipe( res );

	rs.on( "error", function( err ) {
		console.log( err )
		return;
	});
	
	res.on( "end", function() {
		res.end();
		rs.end();
		rs.destroy();
	});
}

// Handles watever document the user has uploaded.
function upload( req, res ) {

	// using the formidable API, load the incoming form and check its data.
	var form = new formidable.IncomingForm();
	form.parse( req, function ( err, fields, files ) {

		// by default formidable puts my uploaded file in a path that hard to find, 
		// and gives it a hashed name, therefore i should rename to a folder i want ("tmp")
		// and generate a unique hash.
		var hash = new Date().getTime() + "" + new Date().getDate() + "" + new Date().getMonth() + "" + 
				   new Date().getFullYear() + "" + Math.floor(Math.random() * 100000)
		console.log( files )

		// the mime type is essential, with this, i can upload files with any mime type.
		cType = ( files.load.mime ).toString();
		var extension = mime.extension( files.load.type )

		// this is needed for loading the files on the fs.readFile().
		path = "C:/tmp/" + hash + "."+ extension;

		console.log( path )
		fs.renameSync( files.load.path, path );		

		if ( files.load.mime.match( "image" ) ) {
			res.write( text );
			res.write('<div contenteditable="true" id="textArea" class="setTextArea"><img src="/show"/></div></div></div><div id="footer"><a href="index.htm">Home</a><label>|</label><a href="index.htm">About</a><label>|</label><a href="index.htm">Help</a><br /></div></div></body></html>');
			res.end();
		} else {
			// using a text area, load its contents. 
			fs.readFile( path, function( err, file ) {
				var string = "";
				if ( err ) {
					res.writeHead( 500, { "Content-Type" : "text/plain" } );
					res.end( err.message + "\n" );
					string = err.message;
				} 
				string = file.toString();
				output( string );
				res.end();
			});
			
			function output( value ) {
				res.write( text );
				res.write('<div contenteditable="true" id="textArea" class="setTextArea"></div></div></div><div id="footer"><a href="index.htm">Home</a><label>|</label><a href="index.htm">About</a><label>|</label><a href="index.htm">Help</a><br /></div></div>');
				//make an invisible textarea, copy the contents there, then recopy them to the visible one.
				res.write('<textarea id="tmp" style="with:100%; height:100%; display: none">'+ value +'</textarea><script type="text/javascript">if ( ! window.temporalText ) window.temporalText = document.getElementById("tmp")</script></body></html>');
			}
		}
	});	
}

function show( req, res ) {
	console.log( "Request handler 'show' was called." );
	fs.readFile( path, "binary", function( err, file ) {
		if ( err) {
			res.writeHead( 500, { "Content-Type" : "text/plain" } );
			res.write( err.message + "\n" );
			res.end();
		}
		
		res.writeHead( 200, {"Content-Type": cType } );
		res.write( file, "binary" );
		res.end();
	});
}

exports.home   = home;
exports.upload = upload;
exports.show   = show;