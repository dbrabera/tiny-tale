function Viewport(game, x, y, width, height) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Viewport.prototype.step = function(display, mouse) {
    // draw map
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            display.draw(x + this.x, y + this.y, '.');
        }
    }

    // draw player
    display.draw(this.game.player.x, this.game.player.y, '@');

    if (!mouse.game) return;

    // draw pointer
    var tile = display._data[mouse.game.x + ',' + mouse.game.y];
    display.draw(tile[0], tile[1], tile[2], '#000000', '#ffffff');

    // draw mouse trace
    var path = this.game.map.findPath(this.game.player, mouse.game);
    for (var i = 1; i < path.length-1; i++) {
        tile = display._data[path[i].x + ',' + path[i].y];
        display.draw(tile[0], tile[1], tile[2], '#ffffff', '#45283c');
    }
};

Viewport.prototype.containsPosition = function(x, y) {
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
};
