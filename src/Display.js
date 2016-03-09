function Display(width, height, fontSize) {
    this._display = new ROT.Display({
        width: width,
        height: height,
        fontSize: fontSize,
        forceSquareRatio: true
    });
}

Display.prototype.write = function(x, y, str, fg, bg) {
    for (var i = 0; i < str.length; i++) {
        this._display.draw(x+i, y, str[i], fg, bg);
    }
};

Display.prototype.rect = function(x, y, width, height, fg, bg, clear) {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            if (clear) {
                this._display.draw(x+i, y+j, ' ', fg, bg);
                continue;
            }
            var cell = this._display._data[(x+i) + ',' + (y+j)];
            this._display.draw(x+i, y+j, cell ? cell[2] : ' ', fg, bg);
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
