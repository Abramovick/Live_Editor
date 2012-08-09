requirejs.config({
	baseUrl: "js/helper",
	paths: {
		lib: "modalDialogue"
	}
});

requirejs([
	'EventUtil', 'id', 'Navigation', 'lib/modalDialogue', 'lib/util', '../../socket.io/socket.io'
	], function ( EventUtil, ID, handler, modal, util ) {
		EventUtil.addEventListener( document, "click", handler )
		EventUtil.addEventListener( document, "keydown", handler )
		ID.textArea.focus()

		var socket = io.connect('http://localhost:8888');
		socket.on( "finishedSavingPage", function( state ) {
			console.log("done!")
			console.log( "http://localhost:8888/" + state.path )
			//document.location.href = "http://localhost:8888/" + state.path
		})

	   // if the path is '/upload', then that means the user had uploaded something.
	   // But because before uploading anything, the current document is saved on localStorage,
	   // Then you want to first load EVERYTHING back from the localStorage.
	   if ( document.location.pathname == "/upload" && localStorage.prevTextareaInnerHTML ) {
	   	ID.textArea.innerHTML += localStorage.prevTextareaInnerHTML
	   }

	   // There is a hidden textarea. So load its contents to the main Div.
	   if ( window.temporalText && typeof window.temporalText != "undefined" ) {
	   	( document.body.innerHTML ) ? ID.textArea.innerHTML += temporalText.value : ID.textArea.innerHTML += temporalText.value   	
	   }

	   // Export my main functions to window
	   if ( ! window.Algiz && typeof window.Algiz == "undefined" ) {
			window.Algiz = {
				EventUtil: EventUtil,
				ID: ID,
				handler: handler,
				util: util
			}
		}
	}
)