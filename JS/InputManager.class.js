function InputManager () {
    this._keyToAction           = [];
    this._actions               = [];
    this._states                = [];
    this.handlers               = [];
    
    Keyboard.capture(this._onKeyDown.bind(this), 'keydown');
    Keyboard.capture(this._onKeyUp.bind(this), 'keyup');
}
//------------------------------------------------------------------------------
InputManager.prototype = {
    bind : function (actionKey, keyCode, onlyOnce, onActivate, onDeactivate) {
        if (this._keyToAction[keyCode]) {
            console.warn('Key "' + InputManager.getKeyName(keyCode) + '" has been assigned to action ' + this._keyToAction[keyCode] + ' already!');
        }
        this._keyToAction[keyCode] = actionKey;
        this._actions.push(actionKey);
        this._states[actionKey] = {
            active              : false,
            firstActive         : false,
            checkedFirstActive  : false,
            notifyDeactivate    : true,
            onlyOnce            : onlyOnce ? true : false,
            onActivate          : onActivate,
            onDeactivate        : onDeactivate
        };
    },
    //------------------------------------------------------------------------------
    _onKeyDown : function (event) {
        var c = Keyboard.getKeyCode(event);
        this._onActivate(c);
    },
    //------------------------------------------------------------------------------
    _onKeyUp : function (event) {
        var c = Keyboard.getKeyCode(event);
        this._onDeactivate(c);
    },
    //------------------------------------------------------------------------------
    _onActivate : function (keyCode) {
        var action = this._keyToAction[keyCode];
        if (action) {
            var s = this._states[action];
            if (s.active == false) {
                //console.log('activate ' + action);
                s.active                = true;
                s.firstActive           = true;
                s.checkedFirstActive    = false;
            }
        }
    },
    //------------------------------------------------------------------------------
    _onDeactivate : function (keyCode) {
        var action = this._keyToAction[keyCode];
        if (action) {
            //console.log('deactivate ' + action);
            var s = this._states[action];
            s.active           = false;
            s.notifyDeactivate = false;
        }
    },
    //------------------------------------------------------------------------------
    onTick : function () {
        var n = this._actions.length;
        while (--n >= 0) {
            // Reset first active
            var a = this._actions[n]
                , s = this._states[a]; 
            if (s.checkedFirstActive) {
                s.firstActive = false;
            }
            
            // Call handlers
            if (s.active) {
                if (s.onlyOnce) {
                    if (this._isFirstActive(a)) {
                        if (s.onActivate) {
                            s.onActivate(a);
                        }
                    }
                } else {
                    if (s.onActivate) {
                        s.onActivate(a, s.firstActive);
                    }
                }
            } else {
                if (!s.notifyDeactivate && s.onDeactivate) {
                    //console.log('notify deactivate ' + a);
                    s.onDeactivate(a);
                    s.notifyDeactivate = true;
                }
            }
        }
    },
    //------------------------------------------------------------------------------
    isActive : function (action) {
        return (this._states[action].active);
    },
    //------------------------------------------------------------------------------
    _isFirstActive : function (action) {
        var s = this._states[action];
        s.checkedFirstActive = true; // This action has been checked in game loop -> can be reset next loop
        return (s.firstActive);
    }
};
//------------------------------------------------------------------------------
InputManager.getKeyName = function (code) {
    switch (code) {
        case 8: return 'Backspace';
        case 9: return 'Tab';
        
        case 12: return 'Numlock';
        case 13: return 'Enter';
        
        case 16 : return 'Shift';
        case 17 : return 'Control (OSX)';
        case 18 : return 'Alt';
        
        case 27 : return 'Esc';
        
        case 32 : return 'Space';
        case 33 : return 'Page Up';
        case 34 : return 'Page Down';
        case 35 : return 'End';
        case 36 : return 'Home';
        case 37 : return 'Left';
        case 38 : return 'Up';
        case 39 : return 'Right';
        case 40 : return 'Down';
        
        case 46 : return 'Delete';
        
        case 48 : return '0';
        case 49 : return '1';
        case 50 : return '2';
        case 51 : return '3';
        case 52 : return '4';
        case 53 : return '5';
        case 54 : return '6';
        case 55 : return '7';
        case 56 : return '8';
        case 57 : return '9';
        
        case 65 : return 'A';
        case 66 : return 'B';
        case 67 : return 'C';
        case 68 : return 'D';
        case 69 : return 'E';
        case 70 : return 'F';
        case 71 : return 'G';
        case 72 : return 'H';
        case 73 : return 'I';
        case 74 : return 'J';
        case 75 : return 'K';
        case 76 : return 'L';
        case 77 : return 'M';
        case 78 : return 'N';
        case 79 : return 'O';
        case 80 : return 'P';
        case 81 : return 'Q';
        case 82 : return 'R';
        case 83 : return 'S';
        case 84 : return 'T';
        case 85 : return 'U';
        case 86 : return 'V';
        case 87 : return 'W';
        case 88 : return 'X';
        case 89 : return 'Y';
        case 90 : return 'Z';
        case 91 : return 'Command (OSX)';
        
        case 96 : return 'Keypad 0';
        case 97 : return 'Keypad 1';
        case 98 : return 'Keypad 2';
        case 99 : return 'Keypad 3';
        case 100 : return 'Keypad 4';
        case 101 : return 'Keypad 5';
        case 102 : return 'Keypad 6';
        case 103 : return 'Keypad 7';
        case 104 : return 'Keypad 8';
        case 105 : return 'Keypad 9';
        case 106 : return 'Keypad *';
        case 107 : return 'Keypad +';
        
        case 109 : return 'Keypad -';
        case 110 : return 'Keypad .';
        case 111 : return 'Keypad /';
        case 112 : return 'F1';
        case 113 : return 'F2';
        case 114 : return 'F3';
        case 115 : return 'F4';
        case 116 : return 'F5';
        case 117 : return 'F6';
        case 118 : return 'F7';
        case 119 : return 'F8';
        case 120 : return 'F9';
        case 121 : return 'F10';
        case 122 : return 'F11';
        case 123 : return 'F12';
        
        case 186 : return '; or :';
        case 187 : return '= or +';
        case 188 : return ', or <';
        case 189 : return '- or _';
        case 190 : return '. or >';
        case 191 : return '/ or ?';
        case 192 : return '` or ~';
        
        case 219 : return '[ or {';
        case 220 : return '\ or |';
        case 221 : return '] or }';
        case 222 : return '\' or "';
        
        default: return '???';
    }
};

//Numbers
InputManager.KEY_1              = 49;
InputManager.KEY_2              = 50;
InputManager.KEY_3              = 51;
InputManager.KEY_4              = 52;
InputManager.KEY_5              = 53;
InputManager.KEY_6              = 54;
InputManager.KEY_7              = 55;
InputManager.KEY_8              = 56;
InputManager.KEY_9              = 57;
InputManager.KEY_0              = 48;

//Letters
InputManager.KEY_Q              = 81;
InputManager.KEY_W              = 87;
InputManager.KEY_E              = 69;
InputManager.KEY_R              = 82;
InputManager.KEY_T              = 84;
InputManager.KEY_Y              = 89;
InputManager.KEY_U              = 85;
InputManager.KEY_I              = 73;
InputManager.KEY_O              = 79;
InputManager.KEY_P              = 80;
InputManager.KEY_A              = 65;
InputManager.KEY_S              = 83;
InputManager.KEY_D              = 68;
InputManager.KEY_F              = 70;
InputManager.KEY_G              = 71;
InputManager.KEY_H              = 72;
InputManager.KEY_J              = 74;
InputManager.KEY_K              = 75;
InputManager.KEY_L              = 76;
InputManager.KEY_Z              = 90;
InputManager.KEY_X              = 88;
InputManager.KEY_C              = 67;
InputManager.KEY_V              = 86;
InputManager.KEY_B              = 66;
InputManager.KEY_N              = 78;
InputManager.KEY_M              = 77;

//Accents
InputManager.KEY_LEFT_QUOTE     = 192; // ` | ~
InputManager.KEY_SCORE          = 189; // - | _
InputManager.KEY_EQUAL          = 187; // = | +
InputManager.KEY_LEFT_BRACKET   = 219; // [ | {
InputManager.KEY_RIGHT_BRACKET  = 221; // ] | }
InputManager.KEY_RIGHT_SLASH    = 220; // \ | |
InputManager.KEY_SEMI_COLON     = 186; // ; | :
InputManager.KEY_QUOTE          = 222; // ' | "
InputManager.KEY_COMMA          = 188; // , | <
InputManager.KEY_DOT            = 190; // . | >
InputManager.KEY_LEFT_SLASH     = 191; // / | ?

//Special
InputManager.KEY_UP             = 38;
InputManager.KEY_DOWN           = 40;
InputManager.KEY_LEFT           = 37;
InputManager.KEY_RIGHT          = 39;
InputManager.KEY_SPACE          = 32;
InputManager.KEY_TAB            = 9;
InputManager.KEY_SHIFT          = 16;
InputManager.KEY_BACKSPACE      = 8;
InputManager.KEY_ENTER          = 13;
InputManager.KEY_COMMAND_OSX    = 91;
InputManager.KEY_CONTROL_OSX    = 17;
InputManager.KEY_ALT            = 18;
InputManager.KEY_ESC            = 27;
InputManager.KEY_HOME           = 36;
InputManager.KEY_PAGE_UP        = 33;
InputManager.KEY_DELETE         = 46;
InputManager.KEY_END            = 35;
InputManager.KEY_PAGE_DOWN      = 34;

//Keypad
InputManager.KEY_NUM_LOCK       = 12;
InputManager.KEY_DIVIDE         = 111;
InputManager.KEY_MULTIPLY       = 106;
InputManager.KEY_MINUS          = 109;
InputManager.KEY_PLUS           = 107;
InputManager.KEY_PAD_7          = 103;
InputManager.KEY_PAD_8          = 104;
InputManager.KEY_PAD_9          = 105;
InputManager.KEY_PAD_4          = 100;
InputManager.KEY_PAD_5          = 101;
InputManager.KEY_PAD_6          = 102;
InputManager.KEY_PAD_1          = 97;
InputManager.KEY_PAD_2          = 98;
InputManager.KEY_PAD_3          = 99;
InputManager.KEY_PAD_0          = 96;
InputManager.KEY_PAD_DOT        = 110;

//Function
InputManager.KEY_F1             = 112;
InputManager.KEY_F2             = 113;
InputManager.KEY_F3             = 114;
InputManager.KEY_F4             = 115;
InputManager.KEY_F5             = 116;
InputManager.KEY_F6             = 117;
InputManager.KEY_F7             = 118;
InputManager.KEY_F8             = 119;
InputManager.KEY_F9             = 120;
InputManager.KEY_F10            = 121;
InputManager.KEY_F11            = 122;
InputManager.KEY_F12            = 123;