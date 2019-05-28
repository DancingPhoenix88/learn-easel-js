/**
 * Utility class to capture keyboard events
 */
function Keyboard () {};
//------------------------------------------------------------------------
Keyboard.KEY_ENTER 			= 13;
Keyboard.KEY_ESC 			= 27;
Keyboard.KEY_SPACE 			= 32;
Keyboard.KEY_UP 			= 38;
Keyboard.KEY_DOWN 			= 40;
Keyboard.KEY_LEFT 			= 37;
Keyboard.KEY_RIGHT 			= 39;
Keyboard.KEY_RIGHT_SLASH 	= 191;
Keyboard.KEY_DEL 			= 46;
Keyboard.CAPTURE_GLOBAL 	= document;
//------------------------------------------------------------------------
/**
 * [PUBLIC]
 * Set handing function for keyboard event
 * Usage:
 * Keyboard.capture (function (event) {
 * 	//do something with event
 * });
 * 
 * @param func 		{Function} Handling function which takes 1 parameter as event
 * @param event 	{String} Event want to be handled: 'keyup', 'keydown', 'keypress'...
 * 		Default is 'keypress' on Firefox or 'keydown' on other browser
 * @param element 	{DOM Element} Scope to capture keyboard event
 * 		Default is capture globally (capture on 'document' node)
 */
Keyboard.capture = function (func, event, element) {
	if (event == undefined) {
		event = Browser.isFirefox() ? 'keypress' : 'keydown';
	}
	if (element == undefined) {
		element = Keyboard.CAPTURE_GLOBAL;
	}
	MyDOM.addEvent (element, event, function (e) {func (window.event || e);});
};
//------------------------------------------------------------------------
/**
 * [PUBLIC]
 * Check if 'Ctrl' key is pressed or not
 * 
 * @param evt {Event} Captured event
 * 
 * @return {Boolean} true if 'Ctrl' is pressed, false if not
 */
Keyboard.hasCtrl = function (evt) {
	return evt.ctrlKey;
};
//------------------------------------------------------------------------
/**
 * [PUBLIC]
 * Get key code of pressed/released key
 * 
 * @param evt {Event} Captured event
 * 
 * @return {Number} Key code
 */
Keyboard.getKeyCode = function (evt) {
	//console.log (evt.keyCode + "|" + evt.charCode + " -> key = " + key);
	return (evt.keyCode | evt.charCode);
};
//------------------------------------------------------------------------
/**
 * [PUBLIC]
 * Stop propagating event for other handler, like default behavior of browser.
 * It's useful when you capture special key in special component, 
 * like capturing ENTER in < input >
 * 
 *  @param evt {Event} Captured event
 */
Keyboard.keepEventOnlyForMe = function (evt) {
	MyDOM.keepEventOnlyForMe (evt);
};