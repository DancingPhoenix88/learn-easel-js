function BasePreload () {
    this._imagesCount       = 0;
    this._loadedImagesCount = 0;
    this._onFinish           = undefined;
}
//------------------------------------------------------------------------------
BasePreload.prototype = {
    _check : function () {
        if (this._loadedImagesCount >= this._imagesCount) {
            if (this._onFinish) {
                this._onFinish();
            }
        }
    },
    //------------------------------------------------------------------------------
    _onLoad : function () {
        ++this._loadedImagesCount;
        this._check();
    },
    //------------------------------------------------------------------------------
    load : function (img, src) {
        ++this._imagesCount;
        if (src) {
            img.onload = this._onLoad.bind(this);
            img.src = src;
        } else { // createJS.SpriteSheet
            if (img.complete) {
                this._onLoad();
            } else {
                img.addEventListener('complete', this._onLoad.bind(this));
            }
        }
    },
    //------------------------------------------------------------------------------
    onFinish : function (callback) {
        this._onFinish = callback;
        this._check();
    }
};
/*
USAGE:
var bp = new BasePreload();
bp.load(imageInstance, 'Images/sample.png');
bp.load(spriteSheetInstance);
bp.onFinish(myOnFinish);
*/