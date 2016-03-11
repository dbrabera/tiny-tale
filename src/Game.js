function Game(width, height) {
    this.map = new Map(this, MAP_TYPES[0], width, height);

    this.player = new Player(this, this.map.entry.x - 1, this.map.entry.y);
    this.map.fov(this.player.x, this.player.y);

    this.log = new Log();
    
    this.started = Date.now();
}

Game.prototype.turn = function() {
    if (!this.player.turn()) return;

    for (var i = 0; i < this.map.monsters.length; i++) {
        this.map.monsters[i].turn();
    }

    this.log.turn();
};
