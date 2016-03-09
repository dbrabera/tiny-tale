function Player(game, x, y) {
    this.char = '@';
    this.description = 'yourself';
    this.fg = '#000000';

    this.strength = 15;
    this.stamina = 10;
    this.health = 15;
    this.energy = 10;

    this.game = game;
    this.x = x;
    this.y = y;

    this.action = null;

    this.inventory = new Inventory();
    this.foundAmulet = false;
}

Player.prototype.go = function(x, y) {
    this.action = function() {
        var path = this.game.map.findPath(this, {x: x, y: y});
        // check if there is no path to the position
        if (!path || path.length == 0) {
            this.action = null;
            return;
        }

        var next = path[1];
        // check if the next position it's the dungeon exit and we have the amulet
        var tile = this.game.map.tile(next.x, next.y);
        if (tile.id == 3 && !this.inventory.contains(0)) {
            this.action = null;
            return;
        }

        this.x = next.x;
        this.y = next.y;

        // pick an item if there is one
        if (!this.inventory.full()) {
            var item = this.game.map.item(this.x, next.y, true);
            if (item) this.inventory.add(item);
        }
    };
};

Player.prototype.turn = function() {
    if (this.action == null) return;
    this.action();
};
