function Culling (stage) {
    this._root              = stage;
    this._occluders         = [];
    this._occludersCount    = 0;
}
//------------------------------------------------------------------------------
Culling.isCulled = function (node) {
    return (node.culled);
};
//------------------------------------------------------------------------------
Culling.isHiddenManually = function (node) {
    return (node.culled == false && node.visible == false);
};
//------------------------------------------------------------------------------
Culling.prototype = {
    setOccluder : function (obj) {
        if (obj) {
            this._occluders.push(obj);
            ++this._occludersCount;
        }
    },
    //------------------------------------------------------------------------------
    unsetOccluder : function (obj) {
        var i = createjs.indexOf(this._occluders, obj);
        if (i > -1) {
            this._occluders.splice(i, 1);
            --this._occludersCount;
        }
    },
    //------------------------------------------------------------------------------
    clearOccluders : function () {
        this._occluders       = [];
        this._occludersCount  = 0;
    },
    //------------------------------------------------------------------------------
    _isOccluder : function (obj) {
        return (createjs.indexOf(this._occluders, obj) > -1);
    },
    //------------------------------------------------------------------------------
    execute : function () {
        if (this._occludersCount == 0) {
            return;
        }
        //this._cull(this._root);
        var n = this._root.children.length;
        while (--n >= 0) {
            this._cull(this._root.children[n]);
        }
    },
    //------------------------------------------------------------------------------
    _isOccludedBy : function (node, occluder) {
        if (!occluder || occluder.visible == false) {
            return false;
        }
        if (node.isBehind(occluder)) {
            var nodeRect        = node.getBounds(),
                occluderRect    = occluder.getBounds()
            ;
            if (node.spriteSheet) {// If this node is Sprite -> bound must be mapped with registration point
                nodeRect.x += node.x;
                nodeRect.y += node.y;
            }
            if (nodeRect.x >= occluderRect.x && nodeRect.y >= occluderRect.y) {
                if (nodeRect.width <= occluderRect.width && nodeRect.height <= occluderRect.height) {
                    return true;
                }
            }
        }
        return false;
    },
    //------------------------------------------------------------------------------
    _isOccluded : function (node) {
        var n = this._occludersCount;
        while (--n >= 0) {
            if (this._isOccludedBy(node, this._occluders[n])) {
                return true;
            }
        }
        return false;
    },
    //------------------------------------------------------------------------------
    _cull : function (node) {
        if (this._isOccluder(node) || Culling.isHiddenManually(node)) {
            return;
        }
        if (this._isOccluded(node)) { // If this node is occluded completely, so hide it
            node.culled = true;
            node.visible = false;
            //node.alpha = 0.3;
        } else { // Else, try to hide parts of this node
            node.culled = false;
            node.visible = true;
            //node.alpha = 1;
            if (node.children) {
                var n = node.children.length;
                while (--n >= 0) {
                    this._cull(node.children[n]);
                }
            }
        }
    }
};
//------------------------------------------------------------------------------
function CullingManager () {
    this._cullings          = [];
    this._cullingsCount     = 0;
}
//------------------------------------------------------------------------------
CullingManager.ENABLE = true;
//------------------------------------------------------------------------------
CullingManager.prototype = {
    addCulling : function (culling) {
        this._cullings.push(culling);
        ++this._cullingsCount;
    },
    //------------------------------------------------------------------------------
    execute : function () {
        if (!CullingManager.ENABLE) {
            return;
        }
        var n = this._cullingsCount;
        while (--n >= 0) {
            this._cullings[n].execute();
        }
    }
};