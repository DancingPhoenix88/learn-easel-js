function MyDOM() {};

/**
 * Create a new node
 * 
 * @param tagName
 *            {String} Tag of node (div, span, a, ...)
 * @param attAndVal
 *            {Array{String}} Array of attributes and their values, {a[2i],
 *            a[i+1]} is a pair
 * @param innerHTML
 *            {String} Content between openning & closing tags
 * 
 * @returns {DOM Object} New node
 */
MyDOM.create = function(tagName, attAndVal, innerHTML) {
    var newNode = document.createElement(tagName), n = 0, i = 0;
    if (innerHTML != undefined) {
        newNode.innerHTML = innerHTML;
    }
    if (attAndVal == undefined) {
        return newNode;
    }
    n = attAndVal.length;
    while (i < n) {
        newNode.setAttribute(attAndVal[i++], attAndVal[i++]);
    }
    return newNode;
};
// ------------------------------------------------------------------------
/**
 * Append nodes to a parent node
 * 
 * @param parent
 *            {DOM Object} parent node
 * @param children
 *            {Array{DOM Object}} Array of children nodes
 * @param from
 *            {Number} Index of first child node want to append (optional,
 *            default = 0)
 * @param to
 *            {Number} Index of last child node want to append (optional,
 *            default = length-1)
 * 
 * @return void
 */
MyDOM.add = function(parent, children, from, to) {
    if (from == undefined) {
        from = 0;
    }
    if (to == undefined) {
        to = children.length - 1;
    }
    while (from <= to) {
        parent.appendChild(children[from]);
        ++from;
    }
};
//------------------------------------------------------------------------
/**
 * Append new line node (<br/>) to a parent node
 * 
 * @param parent
 *                 {DOM Object} parent node
 */
MyDOM.addNewLine = function (parent) {
    var newLineNode = document.createElement ("br");
    if (parent != undefined) {
        parent.appendChild (newLineNode);
    } else {
        document.body.appendChild(newLineNode);
    }
};
//------------------------------------------------------------------------
/**
 * Get value of a selected radio
 * 
 * @param radioGroup
 *                 E.g: document.frm.radioGroup1
 */
MyDOM.getRadioValue = function (radioGroup) {
    var i = radioGroup.length;
    while (--i >= 0) {
        if (radioGroup[i].checked) {
            return radioGroup[i].value;
        }
    }
    return undefined;
};
//------------------------------------------------------------------------
/**
 * Get value of a selected radio
 * 
 * @param radioGroup
 *                 E.g: document.frm.radioGroup1
 * @param value
 */
MyDOM.setRadioValue = function (radioGroup, value) {
    var i = radioGroup.length;
    while (--i >= 0) {
        if (radioGroup[i].value == value) {
            radioGroup[i].checked = true;
            break;
        }
    }
};
//------------------------------------------------------------------------
/**
 * Set event handler for a DOM Object
 * 
 * @param node
 *            {DOM Object} An element want to handle event
 * @param evt
 *            {String} Event type (click, focus, blur....)
 * @param fnc
 *            {String} Function callback
 * 
 * @return {Boolean} Success or not
 */
MyDOM.addEvent = function(node, evt, fnc) {
    if (node.addEventListener)
        node.addEventListener(evt, fnc, false);
    else if (node.attachEvent)
        node.attachEvent('on' + evt, fnc);
    else
        return false;
    return true;
};
// ------------------------------------------------------------------------
/**
 * Remove event handler for a DOM Object
 * 
 * @param node
 *            {DOM Object} An element want to remove event handler
 * @param evt
 *            {String} Event type (click, focus, blur....)
 * @param fnc
 *            {String} Function callback
 * 
 * @return {Boolean} Success or not
 */
MyDOM.removeEvent = function(node, evt, fnc) {
    if (node.removeEventListener)
        node.removeEventListener(evt, fnc, false);
    else if (node.detachEvent)
        node.detachEvent('on' + evt, fnc);
    else
        return false;
    return true;
};
//------------------------------------------------------------------------
/**
 * Set 'Scroll' event handler for a DOM Object
 * 
 * @param node
 *            {DOM Object} An element want to handle event
 * @param fnc
 *            {String} Function callback
 *            
 * @param keepForOnlyMe
 *               {Boolean} Stop propagtion & prevent default behavior
 * 
 * @return {Boolean} Success or not
 */
MyDOM.addScrollEvent = function (node, fnc, keepForOnlyMe) {
    return MyDOM.addEvent (
        node, 
        Browser.isFirefox() ? 'DOMMouseScroll' : 'mousewheel', 
        function (evt) {
            fnc (evt.detail ? evt.detail : evt.wheelDelta / -120, evt);
            if (keepForOnlyMe) {
                MyDOM.keepEventOnlyForMe (evt);
            }
        }
    );
};
//------------------------------------------------------------------------
MyDOM.keepEventOnlyForMe = function (evt) {
    if (evt.stopPropagation) {
        evt.stopPropagation ();
    } else {
        evt.cancelBubble = true;
    }
    if (evt.preventDefault) {
        evt.preventDefault ();
    } else {
        evt.returnValue = false;
    }
};
//------------------------------------------------------------------------
MyDOM.getSelectedOption = function (selectNode) {
    var options = selectNode.options, i = 0, n = options.length, selected = [];
    while (i < n) {
        if (options[i].selected) {
            selected.push (options[i]);
        }
        ++i;
    }
    return selected;
};
//------------------------------------------------------------------------
MyDOM.batchTransitionProperty = function (property) {
    return [Browser.prefix, "transition-property:", property, ";"].join("");
};
//------------------------------------------------------------------------
MyDOM.batchTransitionDuration  = function (duration) {
    return [Browser.prefix, "transition-duration:", duration, ";"].join("");
};
//------------------------------------------------------------------------
MyDOM.batchTransform = function (func) {
    return [Browser.prefix, "transform:", func, ";"].join("");
};
//------------------------------------------------------------------------
MyDOM.batchOpacity = function (opacity) {
    return "opacity:" + opacity + ";";
};
//------------------------------------------------------------------------
MyDOM.setTransitionProperty = function (element, property) {
    element.style.MozTransitionProperty     = 
    element.style.WebkitTransitionProperty     =
    element.style.OTransitionProperty         =
    element.style.msTransitionProperty         = 
    //element.style.transitionProperty         = 
        property;
};
//------------------------------------------------------------------------
MyDOM.setTransitionDuration  = function (element, duration) {
    element.style.MozTransitionDuration     = 
    element.style.WebkitTransitionDuration     =
    element.style.OTransitionDuration         =
    element.style.msTransitionDuration         = 
    //element.style.transitionDuration         = 
        duration;
};
//------------------------------------------------------------------------
MyDOM.setTransform = function (element, func) {
    element.style.MozTransform         =  
    element.style.WebkitTransform     =
    element.style.OTransform         =
    element.style.msTransform         = 
    //element.style.transform         = 
        func;
};
//------------------------------------------------------------------------
MyDOM.setOpacity = function (element, opacity) {
    element.style.opacity             = opacity;
};
//------------------------------------------------------------------------
MyDOM.onTransitionEnd = function (element, fnc) {
    element.addEventListener('transitionend', fnc, false);//Firefox (Gecko)
    element.addEventListener('webkitTransitionEnd', fnc, false);//Chrome
    element.addEventListener('oTransitionEnd', fnc, false);//Opera
    element.addEventListener('webkitTransitionEnd', fnc, false);//Safari (WebKit)
    element.addEventListener('MSTransitionEnd', fnc, false);//Internet Explorer
};
//------------------------------------------------------------------------
MyDOM.where = function (element) {
    var x = 0, y = 0;
    while (element){
        x += element.offsetLeft;
        y += element.offsetTop;
        //console.log ("\ty = " + y + ", top of " + element.id);
        element = element.offsetParent;
    }
    return {x:x, y:y};
};
//------------------------------------------------------------------------
MyDOM.getMousePosition = function (event, element) {
    event = event || window.event;
    var pos = MyDOM.where(element);
    //console.log (event);
    return { x: event.clientX  - pos.x, y: event.clientY - pos.y };
};
//------------------------------------------------------------------------
MyDOM.get = function (elementID) {
    return document.getElementById(elementID);
};
//------------------------------------------------------------------------
MyDOM.isLeftMouseButton = function (event) {
    return (event.which == 1);
};
//------------------------------------------------------------------------
MyDOM.isRightMouseButton = function (event) {
    return (event.which == 3);
};
//------------------------------------------------------------------------
MyDOM.isMiddleMouseButton = function (event) {
    return (event.which == 2);
};
//------------------------------------------------------------------------
MyDOM.isNoneMouseButton = function (event) {
    return (event.which == 0);
};
//------------------------------------------------------------------------
MyDOM.clamp = function (num, min, max) {
    if (num < min) {
        return min;
    } else if (num > max) {
        return max;
    } else {
        return num;
    }
};
//------------------------------------------------------------------------
MyDOM.replaceAll = function (subject, search, replace) {
    return subject.replace (new RegExp(search, "g"), replace);
};
//------------------------------------------------------------------------
MyDOM._TAGS_MAP = {'Q':'q','W':'w','E':'e','\u00c9':'e','\u1eba':'e','\u00c8':'e','\u1eb8':'e','\u1ebc':'e','\u00ca':'e','\u1ebe':'e','\u1ec2':'e','\u1ec0':'e','\u1ec6':'e','\u1ec4':'e','\u00e9':'e','\u1ebb':'e','\u00e8':'e','\u1eb9':'e','\u1ebd':'e','\u00ea':'e','\u1ebf':'e','\u1ec3':'e','\u1ec1':'e','\u1ec7':'e','\u1ec5':'e','R':'r','T':'t','Y':'y','\u1ef6':'y','\u00dd':'y','\u1ef2':'y','\u1ef4':'y','\u1ef8':'y','\u1ef7':'y','\u00fd':'y','\u1ef3':'y','\u1ef5':'y','\u1ef9':'y','U':'u','\u1ee6':'u','\u00da':'u','\u00d9':'u','\u1ee4':'u','\u0168':'u','\u01af':'u','\u1eec':'u','\u1ee8':'u','\u1eea':'u','\u1ef0':'u','\u1eee':'u','\u1ee7':'u','\u00fa':'u','\u00f9':'u','\u1ee5':'u','\u0169':'u','\u01b0':'u','\u1eed':'u','\u1ee9':'u','\u1eeb':'u','\u1ef1':'u','\u1eef':'u','I':'i','\u1ec8':'i','\u00cd':'i','\u00cc':'i','\u1eca':'i','\u0128':'i','\u1ec9':'i','\u00ed':'i','\u00ec':'i','\u1ecb':'i','\u0129':'i','O':'o','\u00d3':'o','\u1ece':'o','\u00d2':'o','\u1ecc':'o','\u00d5':'o','\u00d4':'o','\u1ed0':'o','\u1ed4':'o','\u1ed2':'o','\u1ed8':'o','\u1ed6':'o','\u01a0':'o','\u1eda':'o','\u1ede':'o','\u1edc':'o','\u1ee2':'o','\u1ee0':'o','\u00f3':'o','\u1ecf':'o','\u00f2':'o','\u1ecd':'o','\u00f5':'o','\u00f4':'o','\u1ed1':'o','\u1ed5':'o','\u1ed3':'o','\u1ed7':'o','\u1ed9':'o','\u01a1':'o','\u1edb':'o','\u1edf':'o','\u1edd':'o','\u1ee3':'o','\u1ee1':'o','P':'p','A':'a','\u00c1':'a','\u1ea2':'a','\u00c0':'a','\u1ea0':'a','\u00c3':'a','\u0102':'a','\u1eb2':'a','\u1eb0':'a','\u1eae':'a','\u1eb6':'a','\u1eb4':'a','\u00c2':'a','\u1ea8':'a','\u1ea4':'a','\u1ea6':'a','\u1eac':'a','\u1eaa':'a','\u00e1':'a','\u1ea3':'a','\u00e0':'a','\u1ea1':'a','\u00e3':'a','\u0103':'a','\u1eb3':'a','\u1eaf':'a','\u1eb1':'a','\u1eb7':'a','\u1eb5':'a','\u00e2':'a','\u1ea9':'a','\u1ea5':'a','\u1ea7':'a','\u1ead':'a','\u1eab':'a','S':'s','D':'d','\u0110':'d','\u0111':'d','F':'f','G':'g','H':'h','J':'j','K':'k','L':'l','Z':'z','X':'x','C':'c','V':'v','B':'b','N':'n','M':'m'};
MyDOM.convertUtf8ToAscii = function (utf8String, spaceSubstitute) {
    for (var keyChar in MyDOM._TAGS_MAP) {
        utf8String = MyDOM.replaceAll (utf8String, keyChar, MyDOM._TAGS_MAP[keyChar]);
    }
    if (spaceSubstitute != undefined && spaceSubstitute != ' ') {
        return MyDOM.replaceAll (utf8String, ' ', spaceSubstitute);
    } else {
        return utf8String;
    }
};
//------------------------------------------------------------------------
MyDOM.getFileName = function (filePath) {
    return new RegExp(/[^\\\/:\*"<>|]+$/).exec(filePath)[0];
};
//------------------------------------------------------------------------
MyDOM.reload = function () {
    document.location.reload (true);
};
//------------------------------------------------------------------------
MyDOM.formatMoney = function (input, decimal, separator) {
    if (decimal == undefined) {
        decimal = 0;
    }
    if (separator == undefined) {
        separator = ",";
    }
    var intNumber = Math.floor(input), s = "" + intNumber, n = s.length, dec = 0;
    while (n > 3) {
        n -= 3;
        s = s.substring(0, n) + separator + s.substr(n);
    }
    if (decimal > 0) {
        dec = Math.round((input - intNumber) * Math.pow(10, decimal));
        if (dec > 0) {
            s += "." + dec;
        }
    }
    return s;
};
//------------------------------------------------------------------------
MyDOM.getUrlVars = function (url) {
    if (url == undefined) {
        url = window.location.href;
    }
    var vars = [];
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};
//------------------------------------------------------------------------
MyDOM.replaceMissingImage = function (node, replacedImg, timeOut) {
    if (timeOut == undefined) {
        timeOut = 5000;
    }
    var timeOutId = setTimeout (function () {MyDOM._onMissingImage(node, replacedImg);}, timeOut);
    node.setAttribute ("onload", "MyDOM._onLoadedImage("+timeOutId+");");
};
//------------------------------------------------------------------------
MyDOM._onLoadedImage = function (timeOutId) {
    clearTimeout (timeOutId);
};
//------------------------------------------------------------------------
MyDOM._onMissingImage = function (node, replacedImg) {
    if (replacedImg == undefined) {
        replacedImg = "Images/missing.png";
    }
    node.style.backgroundImage = 'url("'+replacedImg+'")';
};
//------------------------------------------------------------------------
MyDOM.loadJS = function (files) {
    var n = files.length, s = [document.body.innerHTML];
    while (--n >= 0) {
        s[s.length] = '<script type="text/javascript" src="JS/';
        s[s.length] = files[n];
        s[s.length] = '.js"></script>';
    }
    document.body.innerHTML = s.join("");
};
//------------------------------------------------------------------------
MyDOM.ellipsis = function (input) {
    var end = input.lastIndexOf(' ' ),
        temp = input.lastIndexOf( ',');
    if (end < temp) {
        end = temp;
    }
    temp = input.lastIndexOf( '.');
    if (end < temp) {
        end = temp;
    }
    if (end > - 1) {
         return input.substring(0, end) + "..." ;   
    } else {
         return input;
    }
};
//------------------------------------------------------------------------
MyDOM.displayImageFile = function (img, file) {
    var reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};
//------------------------------------------------------------------------
/**
 * Get selected text value from a combo box
 * 
 * @param selectElement
 *            {DOM Object} A combo-box (or "select" tag)
 * 
 * @return void
 */
function getSelectedTextFromSelect(selectElement) {
    return selectElement.options[selectElement.selectedIndex].text;
}
// ------------------------------------------------------------------------
/**
 * Show an element by change style.display to "block"
 * 
 * @param node
 *            {DOM Object} A node want to show
 * 
 * @return void
 */
function show(node) {
    if (isHiding(node)) {
        node.style.display = "block";
    }
}
// ------------------------------------------------------------------------
/**
 * Hide an element by change style.display to "none"
 * 
 * @param node
 *            {DOM Object} A node want to hide
 * 
 * @return void
 */
function hide(node) {
    node.style.display = "none";
}
// ------------------------------------------------------------------------
/**
 * Check if an element is invisible (style.display = none) or not
 * 
 * @param node
 *            {DOM Object} A node want to check
 * 
 * @return {Boolean} Invisible (true) or not
 */
function isHiding(node) {
    return (node.style.display == "none");
}
//------------------------------------------------------------------------
/**
 * Reset display property of an element
 * 
 * @param node
 *                 {DOM Object} A note want to reset
 */
function resetDisplay (node) {
    node.style.display = "";
}
//------------------------------------------------------------------------
function setVisible (node) {
    node.style.visibility = "visible";
}
//------------------------------------------------------------------------
function unsetVisible (node) {
    node.style.visibility = "hidden";
}
//CLASSES========================================================================
function Browser () {};
Browser.FIREFOX                 = 0;
Browser.CHROME                     = 1;
Browser.INTERNET_EXPLORER         = 2;
Browser.OPERA                     = 3;
Browser.SAFARI                     = 4;
Browser.OTHERS                     = 5;
Browser.getType = function () {
    var browser = navigator.userAgent;
    if (/Firefox/i.test(browser)) {
        return Browser.FIREFOX;
    } else if (/Chrome/i.test(browser)) {
        return Browser.CHROME;
    } else if (/MSIE/i.test(browser)) {
        return Browser.INTERNET_EXPLORER;
    } else if (/Opera/i.test(browser)) {
        return Browser.OPERA;
    } else if (/Safari/i.test(browser)) {
        return Browser.SAFARI;
    } else {
        return Browser.OTHERS;
    }
};
Browser.type     = Browser.getType ();

Browser.PREFIXES                             = [];
Browser.PREFIXES[Browser.FIREFOX]             = "-moz-";
Browser.PREFIXES[Browser.CHROME]             = "-webkit-";
Browser.PREFIXES[Browser.INTERNET_EXPLORER] = "-ms-";
Browser.PREFIXES[Browser.OPERA]             = "-o-";
Browser.PREFIXES[Browser.SAFARI]             = "-webkit-";
Browser.PREFIXES[Browser.OTHERS]             = "";
Browser.prefix     = Browser.PREFIXES[Browser.type];
//------------------------------------------------------------------------
Browser.isFirefox = function () {
    return Browser.type == Browser.FIREFOX;
};
//------------------------------------------------------------------------
Browser.isChrome = function () {
    return Browser.type == Browser.CHROME;
};
//------------------------------------------------------------------------
Browser.isIE = function () {
    return Browser.type == Browser.INTERNET_EXPLORER;
};
//------------------------------------------------------------------------
Browser.isOpera = function () {
    return Browser.type == Browser.OPERA;
};
//------------------------------------------------------------------------
Browser.isSafari = function () {
    return Browser.type == Browser.SAFARI;
};
//------------------------------------------------------------------------
Browser.SCROLL_FACTOR = Browser.isFirefox () ? 15 : 45;