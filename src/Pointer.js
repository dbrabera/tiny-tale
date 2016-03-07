function Pointer(game) {
    this.game = game;
    this.x = -1;
    this.y = -1;
}

Pointer.prototype.update = function() {
    this.trace = this.game.map.findPath(this.game.player, this);
};

Pointer.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

Pointer.prototype.draw = function(display) {
    if (this.x == -1 || this.y == -1) return;

    var tile = display._data[this.x + ',' + this.y];
    display.draw(tile[0], tile[1], tile[2], '#000000', '#ffffff');

    for (var i = 1; i < this.trace.length-1; i++) {
        tile = display._data[this.trace[i].x + ',' + this.trace[i].y];
        display.draw(tile[0], tile[1], tile[2], '#ffffff', '#45283c');
    }
};
