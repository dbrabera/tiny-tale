var TT = window.TT || {};

TT.Display = function(width, height) {
    function fontsize(width, height) {
        if (width >= 1440 && height >= 1080) {
            return 20;
        }

        if (width >= 1280 && height >= 1024) {
            return 18;
        }

        if (width >= 1280 && height >= 900) {
            return 16;
        }

        if (width >= 1280 && height >= 768) {
            return 14;
        }

        return 12;
    }

    this._display = new ROT.Display({
        width: width,
        height: height,
        fontSize: fontsize(window.innerWidth, window.innerHeight),
        forceSquareRatio: true
    });
};

TT.Display.prototype.write = function(x, y, str, fg, bg, alpha) {
    if (alpha) {
        fg = fg ? TT.Color.darken(fg, alpha) : null;
        bg = bg ? TT.Color.darken(bg, alpha) : null;
    }

    for (var i = 0; i < str.length; i++) {
        this._display.draw(x + i, y, str[i], fg, bg);
    }
};

TT.Display.prototype.rect = function(x, y, width, height, fg, bg, alpha) {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var cell = this._display._data[(x + i) + ',' + (y + j)];
            this.write(x + i, y + j, cell ? cell[2] : ' ', fg, bg, alpha);
        }
    }
};

TT.Display.prototype.clear = function() {
    this._display.clear();
};

TT.Display.prototype.node = function() {
    return this._display.getContainer();
};

TT.Display.prototype.eventToPosition = function(event) {
    return this._display.eventToPosition(event);
};
