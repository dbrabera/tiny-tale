function Player(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;

    this.action = null;
}

Player.prototype.go = function(x, y) {
    this.action = function() {
        var path = this.game.map.findPath(this, {x: x, y: y});
        if (path.length > 1) {
            var next = path[1];
            this.x = next.x;
            this.y = next.y;
        } else {
            this.action = null;
        }
    };
};

Player.prototype.update = function() {
    if (this.action == null) return;
    this.action();
};
