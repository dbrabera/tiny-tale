function Display(width, height) {
    this._display = new ROT.Display({
        width: width,
        height: height,
        fontSize: calcFontSize(window.innerWidth, window.innerHeight),
        forceSquareRatio: true
    });
}

Display.prototype.write = function(x, y, str, fg, bg, alpha) {
    for (var i = 0; i < str.length; i++) {
        if (alpha) {
            this._display.draw(x + i, y, str[i], fg ? darken(fg, alpha) : null, bg ? darken(bg, alpha) : null);
            continue;
        }
        this._display.draw(x + i, y, str[i], fg, bg);
    }
};

Display.prototype.rect = function(x, y, width, height, fg, bg, alpha) {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var cell = this._display._data[(x + i) + ',' + (y + j)];
            this.write(x + i, y + j, cell ? cell[2] : ' ', fg, bg, alpha);
        }
    }
};

Display.prototype.clear = function() {
    this._display.clear();
};

Display.prototype.node = function() {
    return this._display.getContainer();
};

Display.prototype.eventToPosition = function(event) {
    return this._display.eventToPosition(event);
};

function calcFontSize(width, height) {
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
