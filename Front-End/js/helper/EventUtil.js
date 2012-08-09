define({
    addEventListener: function( element, type, handler ){
        if ( element.addEventListener ){
            element.addEventListener(type, handler, false)
        } else if ( element.attachEvent ){
            element.attachEvent( "on" + type, handler )
        } else {
            element["on" + type] = handler
        }
    },
    
    removeEventListener: function( element, type, handler ){
        if ( element.removeEventListener ){
            element.removeEventListener(type, handler, false)
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler)
        } else {
            element["on" + type] = null
        }
    },
    
    getClipboardText: function( event ){
        var clipboardData =  ( event.clipboardData || window.clipboardData )
        return clipboardData.getData( "text" )
    },
     
    setClipboardText: function( event, value ){
        if (event.clipboardData){
            event.clipboardData.setData("text/plain", value)
        } else if (window.clipboardData){
            window.clipboardData.setData("text", value)
        }
    },
    
    event: function( event ){
        return event ? event : window.event
    },
    
    target: function( event ){
        return event.target || event.srcElement
    },
    
    getRelatedTarget: function( event ){
        if (event.relatedTarget){
            return event.relatedTarget
        } else if (event.toElement){
            return event.toElement
        } else if (event.fromElement){
            return event.fromElement
        } else {
            return null
        }
    
    },
    
    getWheelDelta: function( event ){
        if (event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta)
        } else {
            return -event.detail * 40
        }
    },
    
    getButton: function( event ){
        if (document.implementation.hasFeature("MouseEvents", "2.0")){
            return event.button
        } else {
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4: return 1;
            }
        }
    },
    
    keyCode: function( event ){
        if ( typeof event.charCode == "number" ){
            return event.charCode
        } else {
            return event.keyCode
        }
    },
    
    preventDefault: function( event ){
        if ( event.preventDefault ){
            event.preventDefault()
        } else {
            event.returnValue = false
        }
    },
  
    stopPropagation: function( event ){
        if ( event.stopPropagation ){
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        }
    },

    caret : function () {
        var saveSelection, restoreSelection;
        if (window.getSelection) {
            // IE 9 and non-IE
            saveSelection = function() {
                var sel = window.getSelection(), ranges = []
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        ranges.push(sel.getRangeAt(i))
                    }
                }
                return ranges
            };

            restoreSelection = function(savedSelection) {
                var sel = window.getSelection()
                sel.removeAllRanges()
                for (var i = 0, len = savedSelection.length; i < len; ++i) {
                    sel.addRange(savedSelection[i])
                }
            };
        } else if (document.selection && document.selection.createRange) {
            // IE <= 8
            saveSelection = function() {
                var sel = document.selection
                return (sel.type != "None") ? sel.createRange() : null
            };

            restoreSelection = function(savedSelection) {
                if (savedSelection) {
                    savedSelection.select()
                }
            };
        }

        return {
            saveSelection: saveSelection,
            restoreSelection: restoreSelection
        }
    },

    // returns true if the browser supports local storage.
    localStorage : function() {    
        try {        
            if ( window.localStorage ) {            
                return true
            }
            else {
                return false
            }
        }
        catch (ex) {            
            return ex
        }
    },

    // hash creator.
    createHash: function ( ) {
        var alphabets = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

        var hash = alphabets[ Math.floor( Math.random() * 26 )].toUpperCase() + Math.floor( Math.random() * 26 ) + alphabets[ Math.floor( Math.random() * 26 )] +  new Date().getTime() + alphabets[ Math.floor( Math.random() * 26 )] +  "" + new Date().getDate() + alphabets[ Math.floor( Math.random() * 26 )] + "" + new Date().getMonth() + alphabets[ Math.floor( Math.random() * 26 )] + alphabets[ Math.floor( Math.random() * 26 )].toUpperCase() + "" + new Date().getFullYear() + alphabets[ Math.floor( Math.random() * 26 )] + alphabets[ Math.floor( Math.random() * 26 )] + "" + Math.floor( Math.random() * 100000 )

        hash += alphabets[ Math.floor( Math.random() * 26 )]

        return hash
    }
})