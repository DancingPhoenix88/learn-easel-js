/*---------------------------------------------------------------------------
container:
    controls    : map of variables for controlling container's behavior
    checkFuncs  : map of functions for checking if a condition is satisfied
    execFuncs   : map of functions for executing action commands
---------------------------------------------------------------------------*/
var StateMachine = {};
//---------------------------------------------------------------------------
StateMachine.Condition = function (type, controlVar, value, funcName, id) {
    this.id             = ++StateMachine.Condition._ID;
    this.type           = type;
    this.controlVar     = controlVar;
    this.value          = value;
    this.funcName       = funcName;
    switch (type) {
        case StateMachine.Condition.TYPE_EQUAL : {
            this._func = this._satisfyEqual;
            break;
        }
        case StateMachine.Condition.TYPE_LESS_THAN : {
            this._func = this._satisfyLessThan;
            break;
        }
        case StateMachine.Condition.TYPE_GREATER_THAN : {
            this._func = this._satisfyGreaterThan;
            break;
        }
        case StateMachine.Condition.TYPE_LESS_THAN_OR_EQUAL : {
            this._func = this._satisfyLessThanOrEqual;
            break;
        }
        case StateMachine.Condition.TYPE_GREATER_THAN_OR_EQUAL : {
            this._func = this._satisfyGreaterOrEqual;
            break;
        }
        case StateMachine.Condition.TYPE_NOT_EQUAL : {
            this._func = this._satisfyNotEqual;
            break;
        }
        default : {
            this._func = this._satisfyCustom;
            break;
        }
    }
    

    if (id) {
        this.id = id;
    }
};
//---------------------------------------------------------------------------
StateMachine.Condition._ID = 0;
StateMachine.Condition.TYPE_EQUAL                   = 0;
StateMachine.Condition.TYPE_LESS_THAN               = 1;
StateMachine.Condition.TYPE_GREATER_THAN            = 2;
StateMachine.Condition.TYPE_LESS_THAN_OR_EQUAL      = 3;
StateMachine.Condition.TYPE_GREATER_THAN_OR_EQUAL   = 4;
StateMachine.Condition.TYPE_NOT_EQUAL               = 5;
StateMachine.Condition.TYPE_CUSTOM                  = 6;
//---------------------------------------------------------------------------
StateMachine.Condition.prototype = {
    satisfy : function (container) {
        return this._func(container);
    },
    //---------------------------------------------------------------------------
    _satisfyEqual : function (container) { 
        return (container.controls[this.controlVar] == this.value);
    },
    //---------------------------------------------------------------------------
    _satisfyLessThan : function (container) {
        return (container.controls[this.controlVar] < this.value);
    },
    //---------------------------------------------------------------------------
    _satisfyGreaterThan : function (container) {
        return (container.controls[this.controlVar] > this.value);
    },
    //---------------------------------------------------------------------------
    _satisfyLessThanOrEqual : function (container) {
        return (container.controls[this.controlVar] <= this.value);
    },
    //---------------------------------------------------------------------------
    _satisfyGreaterOrEqual : function (container) {
        return (container.controls[this.controlVar] >= this.value);
    },
    //---------------------------------------------------------------------------
    _satisfyNotEqual : function (container) {
        return (container.controls[this.controlVar] != this.value);
    },
    //---------------------------------------------------------------------------
    _satisfyCustom : function (container) {
        return ((container.checkFuncs[this.funcName])(this.controlVar, this.value));
    },
    //---------------------------------------------------------------------------
    exportData : function () {
        return {
            id          : this.id,
            type        : this.type,
            controlVar  : this.controlVar,
            value       : this.value,
            funcName    : this.funcName
        };
    },
    //---------------------------------------------------------------------------
    explain : function () {
        switch (this.type) {
            case StateMachine.Condition.TYPE_EQUAL : {
                return ('            ' + this.controlVar + ' == ' + this.value + '\n');
            }
            case StateMachine.Condition.TYPE_LESS_THAN : {
                return ('            ' + this.controlVar + ' < ' + this.value + '\n');
            }
            case StateMachine.Condition.TYPE_GREATER_THAN : {
                return '            ' + (this.controlVar + ' > ' + this.value + '\n');
            }
            case StateMachine.Condition.TYPE_LESS_THAN_OR_EQUAL : {
                return ('            ' + this.controlVar + ' <= ' + this.value + '\n');
            }
            case StateMachine.Condition.TYPE_GREATER_THAN_OR_EQUAL : {
                return ('            ' + this.controlVar + ' >= ' + this.value + '\n');
            }
            case StateMachine.Condition.TYPE_NOT_EQUAL : {
                return ('            ' + this.controlVar + ' != ' + this.value + '\n');
            }
            case StateMachine.Condition.TYPE_CUSTOM : {
                return ('            ' + this.funcName + '( ' + this.controlVar + ', ' + this.value + ' ) == true\n');
            }
            default : {
                return ('            ???\n');
            }
        }
    }
};
//---------------------------------------------------------------------------
StateMachine.Action = function (controlVar, value, funcName, id) {
    var v = parseFloat(value);
    if (isNaN(v)) {
        v = value;
    }
    this.id         = ++StateMachine.Action._ID;
    this.controlVar = controlVar;
    this.value      = v;
    this.funcName   = funcName;
    this._func      = funcName ? this._executeCustom : this._execute;
    
    if (id) {
        this.id = id;
    }
};
//---------------------------------------------------------------------------
StateMachine.Action._ID = 0;
//---------------------------------------------------------------------------
StateMachine.Action.prototype = {
    execute : function (container) {
        this._func(container);
    },
    //---------------------------------------------------------------------------
    _execute : function (container) {
        //console.log ('set control var ' + this.controlVar + ' = ' + this.value);
        container.controls[this.controlVar] = this.value;
    },
    //---------------------------------------------------------------------------
    _executeCustom : function (container) {
        (container.execFuncs[this.funcName])(this.controlVar, this.value);
    },
    //---------------------------------------------------------------------------
    exportData : function () {
        return {
            id          : this.id,
            controlVar  : this.controlVar,
            value       : this.value,
            funcName    : this.funcName
        };
    },
    //---------------------------------------------------------------------------
    explain : function () {
        if (this.funcName) {
            return ('            execute: ' + this.funcName + '( ' + this.controlVar + ', ' + this.value + ' )\n');
        } else {
            return ('            set: ' + this.controlVar + ' = ' + this.value + '\n');
        }
    }
};
//---------------------------------------------------------------------------
StateMachine.Transition = function (toState, data) {
    this.id         = ++StateMachine.Transition._ID;
    this.toState    = toState;
    this._conditions = [];
    this._actions    = [];
    
    if (data) {
        this._import(data);
    }
};
//---------------------------------------------------------------------------
StateMachine.Transition._ID = 0;
//---------------------------------------------------------------------------
StateMachine.Transition.prototype = {
    addCondition : function (c) {
        this._conditions.push(c);
    },
    //---------------------------------------------------------------------------
    removeCondition : function (cid) {
        var n = this._conditions.length;
        while (--n >= 0) {
            if (this._conditions[n].id == cid) {
                this._conditions.splice(n, 1);
                return;
            }
        }
    },
    //---------------------------------------------------------------------------
    isSatisfied : function (container) {
        var n = this._conditions.length;
        while (--n >= 0) {
            if (!this._conditions[n].satisfy(container)) {
                return false;
            }
        }
        return true;
    },
    //---------------------------------------------------------------------------
    addAction : function (c) {
        this._actions.push(c);
    },
    //---------------------------------------------------------------------------
    removeAction : function (aid) {
        var n = this._actions.length;
        while (--n >= 0) {
            if (this._actions[n].id == aid) {
                this._actions.splice(n, 1);
                return;
            }
        }
    },
    //---------------------------------------------------------------------------
    executeActions : function (container) {
        var n = this._actions.length;
        for (var i = 0 ; i < n ; ++i) {
            this._actions[i].execute(container);
        }
    },
    //---------------------------------------------------------------------------
    _import : function (transitionData) {
        var n = transitionData.conditions.length;
        this.id = transitionData.id;
        for (var i = 0 ; i < n ; ++i) {
            var cData = transitionData.conditions[i],
                c = new StateMachine.Condition(
                    cData.type, cData.controlVar, cData.value, cData.funcName, cData.id
                );
            this.addCondition(c);
        }
        
        n = transitionData.actions.length;
        for (var i = 0 ; i < n ; ++i) {
            var aData = transitionData.actions[i],
                a = new StateMachine.Action(
                    aData.controlVar, aData.value, aData.funcName, aData.id
                );
            this.addAction(a);
        }
    },
    //---------------------------------------------------------------------------
    exportData : function () {
        var t = {
                id          : this.id,
                toState     : this.toState,
                conditions  : [],
                actions     : []
            },
            n = this._conditions.length;
        for (var i = 0 ; i < n ; ++i) {
            t.conditions.push(this._conditions[i].exportData());
        }
        
        n = this._actions.length;
        for (var i = 0 ; i < n ; ++i) {
            t.actions.push(this._actions[i].exportData());
        }
        
        return t;
    },
    //---------------------------------------------------------------------------
    explain : function (toStateName) {
        var s = '    -> "' + toStateName + '"\n';
        
        s += '        Conditions:\n';
        var n = this._conditions.length;
        for (var i = 0 ; i < n ; ++i) {
            s += this._conditions[i].explain();
        }
        
        n = this._actions.length;
        if (n) {
            s += '        Actions:\n';
            for (var i = 0 ; i < n ; ++i) {
                s += this._actions[i].explain();
            }
        }
        
        return s;
    }
};
//---------------------------------------------------------------------------
StateMachine.State = function (name, animation, data) {
    this.id             = ++StateMachine.State._ID;
    this.name           = name ? name : ('State_' + this.id);
    this.animation      = animation;
    this._transitions   = [];
    
    if (data) {
        this._import(data);
    }
};
//---------------------------------------------------------------------------
StateMachine.State._ID = 0;
//---------------------------------------------------------------------------
StateMachine.State.prototype = {
    addTransition : function (t) {
        this._transitions.push(t);
    },
    //---------------------------------------------------------------------------
    removeTransition : function (tid) {
        var n = this._transitions.length;
        while (--n >= 0) {
            if (this._transitions[n].id == tid) {
                this._transitions.splice(n, 1);
                return;
            }
        }
    },
    //---------------------------------------------------------------------------
    increaseTransitionPriority : function (tid) {
        var n = this._transitions.length;
        while (--n >= 0) {
            if (this._transitions[n].id == tid) {
                if (n > 0) {
                    var t = this._transitions.splice(n, 1);
                    this._transitions.splice(n - 1, 0, t);
                }
                return;
            }
        }
    },
    //---------------------------------------------------------------------------
    decreaseTransitionPriority : function (tid) {
        var n = this._transitions.length - 1;
        while (--n >= 0) {
            if (this._transitions[n].id == tid) {
                if (n > 0) {
                    var t = this._transitions.splice(n, 1);
                    this._transitions.splice(n + 1, 0, t);
                }
                return;
            }
        }
    },
    //---------------------------------------------------------------------------
    findSatisfiedTransition : function (container) {
        var n = this._transitions.length;
        for (var i = 0 ; i < n ; ++i) {
            if (this._transitions[i].isSatisfied(container)) {
                return this._transitions[i];
            }
        }
        return undefined;
    },
    //---------------------------------------------------------------------------
    onUpdateContainer : function (container) {
        return this.findSatisfiedTransition(container);
    },
    //---------------------------------------------------------------------------
    _import : function (stateData) {
        var n = stateData.transitions.length;
        this.id = stateData.id;
        for (var i = 0 ; i < n ; ++i) {
            this.addTransition(
                new StateMachine.Transition(
                    stateData.transitions[i].toState, 
                    stateData.transitions[i])
            );
        }
    },
    //---------------------------------------------------------------------------
    exportData : function () {
        var s = {
                id          : this.id,
                name        : this.name,
                animation   : this.animation,
                transitions : []
            },
            n = this._transitions.length;
        for (var i = 0 ; i < n ; ++i) {
            s.transitions.push(this._transitions[i].exportData());
        }
        return s;
    },
    //---------------------------------------------------------------------------
    explain : function (stateNames) {
        var s = 'State "' + this.name + '" (animation = "' + this.animation + '"):\n';
        var n = this._transitions.length;
        for (var i = 0 ; i < n ; ++i) {
            var t = this._transitions[i];
            s += t.explain(stateNames[t.toState]);
        }
        return s;
    }
};
//---------------------------------------------------------------------------
StateMachine.Machine = function (data) {
    this._states            = [];
    this._currentStateIndex = 0;
    
    if (data) {
        this._import(data);
    }
};
//---------------------------------------------------------------------------
StateMachine.Machine.prototype = {
    addState : function (s) {
        this._states.push(s);
    },
    //---------------------------------------------------------------------------
    removeState : function (sid) {
        var n = this._states.length;
        while (--n >= 0) {
            if (this._states[n].id == sid) {
                this._states.splice(n, 1);
                return;
            }
        }
    },
    //---------------------------------------------------------------------------
    findStateIndex : function (sid) {
        var n = this._states.length;
        while (--n >= 0) {
            if (this._states[n].id == sid) {
                return n;
            }
        }
        return -1;
    },
    //---------------------------------------------------------------------------
    findStateByName : function (name) {
        var n = this._states.length;
        while (--n >= 0) {
            if (this._states[n].name == name) {
                return this._states[n];
            }
        }
        return undefined;
    },
    //---------------------------------------------------------------------------
    onUpdateContainer : function (container, callback) {
        var currentState = this._states[this._currentStateIndex];
        //assert(currentState)
        var satisfiedTransition = currentState.onUpdateContainer(container);
        if (satisfiedTransition) {
            if (currentState.id != satisfiedTransition.toState) {
                this.transitBy(satisfiedTransition, container, callback);
                return true;
            }
        }
        return false;
    },
    //---------------------------------------------------------------------------
    transitBy : function (transition, container, callback) {
        this._currentStateIndex = this.findStateIndex(transition.toState);
        if (callback) {
            callback(this._states[this._currentStateIndex], transition);
        }
        transition.executeActions(container);
    },
    //---------------------------------------------------------------------------
    _import : function (statesData) {
        var n = statesData.length;
        for (var i = 0 ; i < n ; ++i) {
            this.addState(
                new StateMachine.State(
                    statesData[i].name, 
                    statesData[i].animation, 
                    statesData[i]
                )
            );
        }
    },
    //---------------------------------------------------------------------------
    exportData : function () {
        var s = [],
            n = this._states.length;
        for (var i = 0 ; i < n ; ++i) {
            s.push(this._states[i].exportData());
        }
        return s;
    },
    //---------------------------------------------------------------------------
    toString : function () {
        return JSON.stringify(this.exportData());
    },
    //---------------------------------------------------------------------------
    makeStateNameMap : function () {
        var names = [], 
            n = this._states.length;
        while (--n >= 0) {
            names[''+this._states[n].id] = this._states[n].name;
        }
        return names;
    },
    //---------------------------------------------------------------------------
    explain : function () {
        var s = '',
            n = this._states.length,
            stateNames = this.makeStateNameMap();
        
        for (var i = 0 ; i < n ; ++i) {
            s += this._states[i].explain(stateNames);
        }
        
        return s;
    },
    //---------------------------------------------------------------------------
    clear : function () {
        this._states            = [];
        this._currentStateIndex = 0;
    },
    //---------------------------------------------------------------------------
    setStateByName : function (stateName) {
        var s = this.findStateByName(stateName);
        if (s) {
            this.setState(s.id);
        }
    },
    //---------------------------------------------------------------------------
    setState : function (stateId) {
        var id = this.findStateIndex(stateId);
        if (id > -1) {
            this._currentStateIndex = id;
        }
    },
    //---------------------------------------------------------------------------
    getCurrentState : function () {
        return this._states[this._currentStateIndex];
    },
    //---------------------------------------------------------------------------
    getCurrentStateName : function () {
        return this.getCurrentState().name;
    },
    //---------------------------------------------------------------------------
    install : function (container, onChangeState) {
        container.controls      = [];
        container.checkFuncs    = [];
        container.execFuncs     = [];
        //---------------------------------
        container.setControlSilent = function (controlVar, value) {
            this.controls[controlVar] = value;
        };
        //---------------------------------
        container.getControl = function (controlVar) {
            return this.controls[controlVar];
        };
        //---------------------------------
        container.toogleControl = function (controlVar, noRevert) {
            this.setControl(controlVar, !this.controls[controlVar], noRevert);
        };
        //---------------------------------
        container.adjustControl = function (controlVar, value, noRevert) {
            this.setControl(controlVar, this.controls[controlVar] + (value ? value : 1), noRevert);
        };
        //---------------------------------
        var sm = this;
        container.setControl = function (controlVar, value, noRevert) {
            if (this.controls[controlVar] == value) {
                return;
            }
            //if (controlVar != 'animEnd') { console.log ('set control var ' + controlVar + ' = ' + value); }
            var oldValue = this.controls[controlVar];
            this.controls[controlVar] = value;
            if (!sm.onUpdateContainer(this, onChangeState) && !noRevert) {
                //if (controlVar != 'animEnd') { console.log ('reset control var ' + controlVar + ' = ' + oldValue); }
                this.controls[controlVar] = oldValue;
            }
        };
    }
};
//---------------------------------------------------------------------------
StateMachine.reset = function () {
    StateMachine.Condition._ID = 0;
    StateMachine.Action._ID = 0;
    StateMachine.Transition._ID = 0;
    StateMachine.State._ID = 0;
};