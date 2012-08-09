/*
	ALL Events are handled here.
*/

define([
'EventUtil', 'id', 'lib/modalDialogue', 'lib/util', '../../socket.io/socket.io'
],  function ( EventUtil, ID, modal , util ) {
		var num = 0,
			socket = io.connect('http://localhost:8888')

		return function ( event ) {
			var e = EventUtil.event( event )
			var target = EventUtil.target( e )

			function execute ( cmd, value ) {
				document.execCommand( cmd, null, value )
			}

			function toggleClicked ( node, check ) {
				var range = document.getSelection().getRangeAt(0)
				if ( check == true ) {
					var chek = true;
				} else {
					var chek = !( range.toString().length > 0 )
				}

				if ( chek ) {
					if ( node.className == "" ) {
						node.className = "clicked"
					} else if ( node.className == "clicked" ) {
						node.className = ""
					}
				}

				ID.textArea.focus()
			}

			switch ( target.id ) {
				case "codeIcon" : {
					if ( num == 0 || num == 1 ) {
						ID.textArea.className = "expandTextArea"
						num++
					} 

					if ( num == 2 ) {
						ID.textArea.className = "setTextArea"
						num = 0;
					}

					toggleClicked( ID.codeIcon, true)		
				}
				break;

				case "boldIcon" : {
					execute( "bold", null )

					//toggle clicked or unclicked					
					toggleClicked( ID.boldIcon )
				}
				break;

				case "italicsIcon" : {
					execute( "italic", null )

					toggleClicked ( ID.italicsIcon )
				}
				break;

				case "underlineIcon" : {
					execute( "underline", null )
					toggleClicked ( ID.underlineIcon )
				}
				break;

				case "strikeIcon" : {
					execute( "strikethrough", null )
					toggleClicked ( ID.strikeIcon )
				}
				break;

				case "cutIcon" : {
					execute( "cut", null )
					toggleClicked ( ID.cutIcon )
				}
				break;

				case "copyIcon" : {
					execute( "copy", null )
					toggleClicked ( ID.copyIcon )
				}
				break;

				case "pasteIcon" : {
					execute( "paste", null )
					toggleClicked ( ID.pasteIcon )
				}
				break;

				case "undoIcon" : {
					execute( "undo", null )
				}
				break;

				case "redoIcon" : {
					execute( "redo", null )
				}
				break;

				case "superscriptIcon" : {
					execute( "superscript", null )
					toggleClicked ( ID.superscriptIcon )
				}
				break;

				case "subscriptIcon" : {
					execute( "subscript", null )
					toggleClicked ( ID.subscriptIcon )
				}
				break;

				case "alignleftIcon" : {
					execute( "justifyleft", null )
				}
				break;

				case "alignrightIcon" : {
					execute( "justifyright", null )
				}
				break;

				case "aligncenterIcon" : {
					execute( "justifycenter", null )
				}
				break;

				case "justifyIcon" : {
					execute( "justifyfull", null )
				}
				break;

				case "ulIcon" : {
					execute( "insertunorderedlist", null )
					toggleClicked ( ID.ulIcon )
				}
				break;

				case "olIcon" : {
					execute( "insertorderedlist", null )
					toggleClicked ( ID.olIcon )
				}
				break;

				case "indentIcon" : {
					execute( "indent", null )
				}
				break;

				case "outdentIcon" : {
					execute( "outdent", null )
				}
				break;

				case "fontStyle" : {
					(function () {
						function getVal ( elem, callback ) {
							var res = null
							if ( typeof elem.value == "string" && elem.value != "" ) {
								res = elem.options[elem.selectedIndex].value
								console.log( elem.options[elem.selectedIndex].value )
								console.log( elem.selectedIndex )
								console.log( res )

								if ( res ) {							
									callback ( res )
								} else {
									console.log("Failed")
								}
							}
						}

						getVal ( ID.fontStyle, function ( value ) {
							execute( "fontname", value )
							ID.textArea.focus()
						})
					})()
					
					ID.textArea.focus()
				}
				break;
				
				case "fontSize" : {		
					function getVal ( elem, callback ) {
						var res = null
						if ( typeof elem.value == "string" && elem.value != "" ) {
							res = parseInt( elem.value - 9 )
							console.log( res )

							if ( res && typeof res == "number" ) {					
								callback ( res )
							} else {
								console.log("Failed")
							}
						}
					}

					getVal ( ID.fontSize, function ( value ) {
						execute( "inserthtml", value )
						ID.textArea.focus()
					})
				}
				break;

				case "fontcolorIcon" : {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection()

					modal.createMultiView({
						title : "Font Colour",
						"views" : [{
							"title" : "Color Name / Hex Code",
							"body" : "- Set Font Color by entering a color name (e.g. blue) Or<br/>" +
										"- Set Font Color by entering a Hexadecimal code (e.g. #ddd)",
							"form" : {
								"name" : "color",
								"inputs" : [{
									"title" : "Color Name / Hex Code:",
									"name" : "colorCode",
									"placeholder" : "#0000"
								}]
							}
						}],
						buttons : {
							'Apply' : function () {
								var retValue = document.color.colorCode.value

								//execute if there is a value set.
								if ( typeof retValue == "string" && retValue.length > 0 && retValue != "" ) {
									// restore where the caret was.
									EventUtil.caret().restoreSelection( sel )
									execute( 'forecolor', retValue )
									ID.textArea.focus()
								}
								//close the dialogue
								this.close()
							},
							'Cancel' : function () {
								this.close()
							}
						}
					})
				}
				break;

				case "backcolorIcon" : {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection();

					modal.createMultiView({
						title : "Background Colour",
						"views" : [{
							"title" : "Color Name / Hex Code",
							"body" : "- Set Background Color by entering a color name (e.g. blue) Or<br/>" +
										"- Set Background Color by entering a Hexadecimal code (e.g. #ddd)",
							"form" : {
								"name" : "color",
								"inputs" : [{
									"title" : "Color Name / Hex Code:",
									"name" : "colorCode",
									"placeholder" : "#0000"
								}]
							}
						}],
						buttons : {
							'Apply' : function () {
								var retValue = document.color.colorCode.value

								//execute if there is a value set.
								if ( typeof retValue == "string" && retValue.length > 0 && retValue != "" ) {
									// restore where the caret was.
									EventUtil.caret().restoreSelection( sel );
									execute( 'backcolor', retValue )
									ID.textArea.focus()
								}
								//close the dialogue
								this.close()
							},	
							'Cancel' : function () {
								this.close()
							}
						}
					})			
				}
				break;

				case "insertimageIcon" : {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection();

					modal.createMultiView({
						title : "Insert Image",
						"views" : [{
							"title" : "Upload Local Image",
							"body" : "Choose image from your computer to upload.",
							"form" : {
								"name" : "ImageUploadImage",
								"inputs" : [{
									"title" : "Upload Image: ",
									"type": "file",
									"name" : "localLink"
								}]
							}
						}, {
							"title" : "Image Web Link",
							"body" : "Enter image web URL/Link",
							"form" : {
								"name" : "imageLink",
								"inputs" : [{
									"type"  : "textarea",
									"name" : "link"
								}]
							}
						}],
						buttons : {
							'Apply' : function () {
								(function () {									
									if ( document.imageLink ) {
										var retValue = document.imageLink.link.value

										//execute if there is a value set.
										if ( typeof retValue == "string" && retValue.length > 0 && retValue != "" ) {
											// restore where the caret was.
											EventUtil.caret().restoreSelection( sel );
											execute( "insertimage", retValue )
											ID.textArea.focus()
										}
									}
								})()

								//close the dialogue
								this.close()
							},
							'Cancel' : function () {
								this.close()
							}
						}
					})
				}
				break;

				case "insertvideoIcon" : {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection();

					modal.createMultiView({
						title : "Insert Video",
						"views" : [{
							"title" : "Upload Video file",
							"body" : "Choose Video from your computer to upload. Maximum Size: 1GB",
							"form" : {
								"name" : "VideoUploadFile",
								"inputs" : [{
									"title" : "Upload Video File: ",
									"type": "file",
									"name" : "localLink"
								}]
							}
						}, {
							"title" : "Embeded Code",
							"body" : "Enter video Embeded Code",
							"form" : {
								"name" : "videoLink",
								"inputs" : [{
									"type" : "textarea",
									"name" : "link"
								}]
							}
						}],
						buttons : {
							'Apply' : function () {
								(function () {									
									if ( document.videoLink ) {
										var retValue = document.videoLink.link.value

										//execute if there is a value set.
										if ( typeof retValue == "string" && retValue.length > 0 && retValue != "" ) {
											// restore where the caret was.
											EventUtil.caret().restoreSelection( sel );
											execute( "inserthtml", retValue )
											ID.textArea.focus()
										}
									}
								})()

								//close the dialogue
								this.close()
							},
							'Cancel' : function () {
								this.close()
							}
						}
					})
				}
				break;

				case "linkIcon" : {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection();

					modal.createMultiView({
						title : "Links",
						"views" : [{
							"title" : "Create Link",
							"body" : "To create a link, Enter a URL of the link and the appearing text. <br/>If text is highlighted, Enter the URL ONLY and ignore the link text option.",
							"form" : {
								"name" : "createLink",
								"inputs" : [{
									"title" : "Link URL: ",
									"name" : "url",
									"placeholder": "Example: http://www.google.com",
									"style": "width: 250px"
								},{
									"title" : "Link Text: ",
									"name" : "linkText",
									"placeholder": "E.g. Google **Ignore this option if text is highlighted**",
									"style": "width: 300px"
								}]
							}
						}, {
							"title" : "Remove Link",
							"body" : "Removes a link. *** Only works on highlighted text. ****",
							"form" : {
								"name" : "unlink",
								"inputs" : [{
									"title" : "To Unlink/Remove Link, Click the Apply button",
									"name" : "url",
									"placeholder": "To Unlink, just click the Apply button",
									"style": "width: 250px; display: none;"
								}]
							}
						}],
						buttons : {
							'Apply' : function () {
								(function () {									
									if ( document.createLink ) {
										var url = document.createLink.url.value
										var linkText = document.createLink.linkText.value

										//execute if there is a value set.
										if ( ( typeof url == "string" && url.length > 0 && url != "" ) &&  ( typeof linkText == "string" && linkText.length > 0 && linkText != "") ) {

											// restore where the caret was.
											EventUtil.caret().restoreSelection( sel );
											execute( "inserthtml", "<a style='font-family: inherit; font-size: inherit;' href="+ url + ">"+ linkText + "</a>" )
											ID.textArea.focus()
										} else if ( typeof url == "string" && url.length > 0 && url != "" ) {

											// restore where the caret was.
											EventUtil.caret().restoreSelection( sel );
											execute( "createlink", url )
											ID.textArea.focus()
										}										
									}

									if ( document.unlink ) {									
										// restore where the caret was.
										console.log("was here.")
										EventUtil.caret().restoreSelection( sel );
										execute( "unlink", null )
										ID.textArea.focus()
									}
								})()

								//close the dialogue
								this.close()
							},
							'Cancel' : function () {
								this.close()
							}
						}
					})
				}
				break;

				case "tableIcon" : {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection();

					function makeTable ( rows, columns ) {
						var bigString = "<table class='table'>"

						function give ( num, value ) {
							var res = ""
							for ( var i = 1; i <= num; i++ ) {
								res += value
							}
							return res
						}

						bigString += give( rows, "<tr>" + give( columns, "<td class='tableTD'></td>" ) +"</tr>" ) + "</table>"
						return bigString;
					}

					modal.createSingle({
						title : "Create Table",
						body : "Set the table's properties",
						"form" : {
							"name": "tableOpts",
							"inputs": [{
								"title": "Table Rows:",
								"name": "rows",
								"placeholder": "3"
							}, {
								"title": "Table Columns:",
								"name": "columns",
								"placeholder": "6"
							}, {
								"title": "Table Cell Width:",
								"name": "tableWidth",
								"placeholder": "50"
							}, {
								"title": "Table Cell Height:",
								"name": "tableHeight",
								"placeholder": "50"
							}]
						},
						buttons : {
							'Apply' : function () {						
								if ( document.tableOpts ) {
									var rows = parseInt(document.tableOpts.rows.value)
									var columns = parseInt(document.tableOpts.columns.value)

									//execute if there is a value set.
									if ( (typeof rows == "number" && rows > 0) && (typeof columns == "number" && columns > 0) ) {
										// restore where the caret was.
										EventUtil.caret().restoreSelection( sel );
										console.log("rows: " + rows + "\ncolumns: " + columns)
										console.log( makeTable( rows, columns) )										
										execute( "inserthtml", makeTable( rows, columns) )
										ID.textArea.focus()
									}
								}

								this.close()
							},
							'Cancel' : function () {
								this.close()
							}
						}
					})
				}
				break;

				case "hrIcon" : {
					execute( "inserthtml", "<hr style='border: 1px solid #888; color: #ddd' />" )
				}
				break;

				case "hashIcon" : {
					ID.textArea.style.lineHeight = 1.5
					toggleClicked ( ID.hashIcon )
				}
				break;

				case "settingsIcon": {
					// save where the caret was left.
					var sel = EventUtil.caret().saveSelection();

					modal.createMultiView({
						title : "Settings",
						"views" : [{
							"title" : "Server Name",
							"body" : "Enter a Server Name to upload files to",
							"form" : {
								"name" : "serverName",
								"inputs" : [{
									"title" : "Server Name:",
									"name" : "server",
									"placeholder": "itule.me"
								}]
							}
						}, {
							"title" : "Default Font",
							"body" : "Set Default Font",
							"form" : {
								"name" : "defaultFont",
								"inputs" : [{
									"title" : "Font Name:",
									"name" : "fontName",
									"placeholder": "Arial"
								}, {
									"title" : "Font Size:",
									"name" : "fontSize",
									"placeholder": "12"
								}]
							}
						}],
						buttons : {
							'Apply' : function () {						
								if ( document.serverName ) {
									var retValue = document.serverName.server.value

									//execute if there is a value set.
									if ( typeof retValue == "string" && retValue.length > 0 && retValue != "" ) {
										// restore where the caret was.
										EventUtil.caret().restoreSelection( sel );
										
										// Implement details to the server to upload to here.

										ID.textArea.focus()
									}
								} 

								if ( document.defaultFont ) {
									var fontName = document.defaultFont.fontName.value
									var fontSize = parseInt(document.defaultFont.fontSize.value)

									//execute if there is a value set.
									if ( (typeof fontName == "string" && fontName.length > 0 && fontName != "") && 
										  (typeof fontSize == "number" && fontSize > 0)) {
										// restore where the caret was.
										EventUtil.caret().restoreSelection( sel );
										execute( "fontname", fontName )
										execute( "fontsize", fontSize )
										ID.textArea.focus()
									}
								}

								//close the dialogue
								this.close()
							}, 
							'Cancel': function () {
								this.close()
							}
						}
					})
				}
				break;

				/*
					Event handler for the Upload Icon on the top left corner.
					The idea is that, when the user clicks upload, they can load a file
					from their computer into the browser. That files content will then 
					appear on the page, and be editable.
				*/
				case "imgUpload": {
					modal.createSingle({
						title: "Upload Document",						
						body : "Load a document from your computer. Only text documents and Images supported.",
						"form" : {
							"name": "loadDoc",
							"action": "/upload",
							"method": "POST",
							"enctype": "multipart/form-data",
							"inputs": [{
								"title": "Load Document: ",
								"type": "file",
								"name": "load",
								"multiple" : "multiple"
							}]
						},
						buttons : {
							'Load' : function () {				
								if ( document.loadDoc ) {
									var retValue = document.loadDoc.load.value
								
									//execute if there is a value set.
									if ( typeof retValue == "string" && retValue.length > 0 && retValue != "" ) {
										/*
											If the user has entered a value, first save watever the user had in the 
											textArea. 
											Then post that document so as it can be loaded at the server.
									 	*/

									 	// Save using local storage, store watever the user left.
									 	if ( EventUtil.localStorage() ) {
									 		localStorage["prevTextareaInnerHTML"] = ID.textArea.innerHTML
									 		localStorage["prevTextareaInnerText"] = ID.textArea.innerText
									 	}

									 	//Implement an error check for invalid files.

									 	//submit document
										document.loadDoc.submit()
									}
								}

								this.close()
							}, 
							'Cancel': function () {
								this.close()
							}
						}
					})
				}
				break;

				// Event handler for the Save button at the top right corner.
				case "imgNewDoc": {
					document.location.href = "http://localhost:8888/"
				}
				break;

				// Event handler for the Save button at the top right corner.
				case "imgSave": {
					//craete a unique hash key.
					var hash = EventUtil.createHash()

					// using socket.io submit the innerHTML of the textarea and the hash key.
				   socket.emit( "requestToSavePage" , { hash: hash, textAreaContent: ID.textArea.innerHTML } )
				}
				break;
			}
		}
	})