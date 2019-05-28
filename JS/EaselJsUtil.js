createjs.Sprite.TRIGGER_EVENT               = 'trigger'; // STATIC
createjs.Sprite.prototype.extraData         = undefined;
createjs.Sprite.prototype.triggerFuncs      = [];
//------------------------------------------------------------------------------
createjs.Sprite.prototype._lastFrame        = -1;
createjs.Sprite.prototype._catchTrigger     = false;
createjs.Sprite.prototype._currentExtraData = undefined;
createjs.Sprite.prototype._onTickListener   = undefined;
//------------------------------------------------------------------------------
createjs.Sprite.getFramesCount = function (animation) { // STATIC
    return (animation.frames.length);
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.getTotalFrames = function (animationName) {
    if (this.extraData && this.extraData[animationName]) {
        return this.extraData[animationName].framesCount;
    }
    return createjs.Sprite.getFramesCount( this.spriteSheet.getAnimation(animationName) );
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.getCurrentTotalFrames = function () {
    return this.getTotalFrames(this.currentAnimation);
};
//------------------------------------------------------------------------------
createjs.Sprite.getDuration = function (framesCount, speed, frameRate) { // STATIC
    if (!frameRate) {
        frameRate = createjs.Ticker.getFPS();
    }
    return (framesCount * 1000 / frameRate / speed);
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype._estimateDuration = function (animationName, frameRate) {
    var anim = this.spriteSheet.getAnimation(animationName);
    return createjs.Sprite.getDuration(
        createjs.Sprite.getFramesCount(anim), 
        anim.speed, 
        frameRate
    );
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.getElapsedTime = function (animationName, frameRate) {
    if (this.extraData && this.extraData[animationName]) {
        var d = this.extraData[animationName].durations;
        if (d[frameRate] == undefined) {
            d[frameRate] = this._estimateDuration(animationName, frameRate);
        }
        return (d[frameRate]);
    }
    
    return (this._estimateDuration(animationName, frameRate));
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.getCurrentElapsedTime = function (frameRate) {
    return this.getElapsedTime(this.currentAnimation, frameRate);
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype._onTick = function () {
    if (this.paused) {
        return;
    }
    var curFrame = Math.round(this.currentAnimationFrame);
    if (this._lastFrame != curFrame) {
        var triggerNames = this._currentExtraData.triggers[curFrame];
        if (triggerNames) {
            var e = new createjs.Event(createjs.Sprite.TRIGGER_EVENT, false, true);
            e.triggers = triggerNames;
            this.dispatchEvent(e);
        }
        this._lastFrame = curFrame;
    }
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.animate = function (animationName) {
    var newAnimData = this.extraData[animationName];
    if (newAnimData) {
        if (newAnimData.hasTrigger) { // new animation has trigger
            if (!this._currentExtraData || !this._currentExtraData.hasTrigger) { // but old animation doesn't have trigger
                this._currentExtraData = newAnimData;
                this._lastFrame = -1;
                this._catchTrigger = true;
                this._onTickListener = this.on('tick', this._onTick);
                this.gotoAndPlay(animationName);
                //console.log('Start catching trigger', this._currentExtraData);
                return;
            }
        }
    }
    if (this._catchTrigger) {
        this.off('tick', this._onTickListener);
        this._catchTrigger = false;
        this._currentExtraData = undefined;
        this._lastFrame = -1;
        //console.log('Stop catching trigger');
    }
    this.gotoAndPlay(animationName);
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.catchTriggers = function (onTrigger) {
    this.addEventListener(
        createjs.Sprite.TRIGGER_EVENT, 
        onTrigger ? onTrigger : (this._onTrigger.bind(this))
    );
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype.uncatchTriggers = function () {
    this.removeAllEventListeners(createjs.Sprite.TRIGGER_EVENT);
};
//------------------------------------------------------------------------------
createjs.Sprite.prototype._onTrigger = function (e) {
    var triggers = e.triggers 
        , n = triggers.length;
    for (var i = 0 ; i < n ; ++i) {
        console.log('On trigger : ' + triggers[i]);
        var tf = this.triggerFuncs[triggers[i]];
        if (tf) {
            tf();
        }
    }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.moveToAboveLayer = function () {
    var container = this.parent;
    if (container) {
        var objIndex = container.getChildIndex(this);
        if (objIndex > -1) {
            if (objIndex < container.getNumChildren() - 1) {
                container.swapChildrenAt(objIndex, objIndex + 1);
            }
        }
    }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.moveToBelowLayer = function () {
    var container = this.parent;
    if (container) {
        var objIndex = container.getChildIndex(this);
        if (objIndex > -1) {
            if (objIndex > 0) {
                container.swapChildrenAt(objIndex, objIndex - 1);
            }
        }
    }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.moveToTopLayer = function () {
    var container = this.parent;
    if (container) {
        container.addChild(this);
    }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.moveToBottomLayer = function () {
    var container = this.parent;
    if (container) {
        container.setChildIndex(this, 0);
    }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.setInFrontOf = function (obj2) {//this object will be in front of obj2
    var container = this.parent;
    if (container == obj2.parent) {
        var objIndex1 = container.getChildIndex(this),
            objIndex2 = container.getChildIndex(obj2)
        ;
        if ((objIndex1 > -1) && (objIndex2 > -1) && (objIndex1 < objIndex2)) {
            if (objIndex2 == container.getNumChildren() - 1) { // if obj2 is last child
                container.addChild(this); // move to top layer
            } else {
                container.setChildIndex(this, objIndex2);
                //it should be objIndex2 + 1
                //but container has to remove this object first, so all follow indices is decreased 1
                //that means, objIndex2 + 1 -> objIndex2
            }
        }
    }
    else { console.warn('Moving entire layer to change z-order of an element is not supported'); }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.setBehind = function (obj2) {//this object will be behind obj2
    var container = this.parent;
    if (container == obj2.parent) {
        var objIndex1 = container.getChildIndex(this),
            objIndex2 = container.getChildIndex(obj2)
        ;
        if ((objIndex1 > -1) && (objIndex2 > -1) && (objIndex1 > objIndex2)) {
            container.setChildIndex(this, objIndex2);
            //Although the container has to remove this object first
            //But indices which are before this object aren't affected by this action
            //So we can use objIndex2 normally (unlike setInFrontOf)
        }
    }
    else { console.warn('Moving entire layer to change z-order of an element is not supported'); }
};
//------------------------------------------------------------------------------
createjs.DisplayObject.prototype.isBehind = function (obj2) {//is this object behind obj2
    var container = this.parent;
    if (container == obj2.parent) {
        return (container.getChildIndex(this) < container.getChildIndex(obj2));
    }
    else { console.warn('It\'s hard to determine which is behind'); }
    /*
    // If you have 'level' property in each node
    var node1 = this, node2 = obj2;
    if (node1.level == node2.level) {
        while (node1.parent != node2.parent) {
            node1 = node1.parent;
            node2 = node2.parent;
        }
        return (node1.parent.getChildIndex(node1) < node2.parent.getChildIndex(node2));
    } else {
        while (node1.level < node2.level) {
            node1 = node1.parent;
        }
        while (node1.level > node2.level) {
            node2 = node2.parent;
        }
        //here: node1.level == node2.level
        return node1.isBehind(node2);
    }
    */
};
//------------------------------------------------------------------------------
//interval < 0          = Only update if needed
//interval < 1000 / 60  = Update every ticks
//else                  = Update after interval
createjs.Stage.prototype.setInterval = function (interval) {
    this._interval = interval;
    if (interval < 0) {//usually -1
        this.needUpdate  = true;
        this._updateFunc = this._updateManually;
    } else if (interval * 60 < 1000) {//usually 0
        this._updateFunc = this._updateNormal;
    } else {
        this._lastUpdate = 0;
        this._updateFunc = this._updateInterval;
    }
    console.log('switch to update ', this.getMode());
};
//------------------------------------------------------------------------------
createjs.Stage.prototype.onTick = function () {
    this._updateFunc();
};
//------------------------------------------------------------------------------
createjs.Stage.prototype._updateNormal = function () {
    this.update();
};
//------------------------------------------------------------------------------
createjs.Stage.prototype._updateInterval = function () {
    var now = new Date().getTime();
    if (now - this._lastUpdate >= this._interval) {
        this.update();
        this._lastUpdate = now;
    }
};
//------------------------------------------------------------------------------
createjs.Stage.prototype._updateManually = function () {
    if (this.needUpdate) {
        this.update();
        this.needUpdate = false;
    }
};
//------------------------------------------------------------------------------
createjs.Stage.prototype.getMode = function () {
    if (this._interval < 0) {//usually -1
        return 'Manually';
    } else if (this._interval * 60 < 1000) {//usually 0
        return 'Normal';
    } else {
        return 'Interval';
    }
};
//------------------------------------------------------------------------------
createjs.Stage.prototype._updateFunc = createjs.Stage.prototype._updateNormal;