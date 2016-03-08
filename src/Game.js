function Game(width, height) {
    this.map = new Map(width, height);
    this.player = new Player(this, this.map.entry.x - 1, this.map.entry.y);
}

Game.prototype.turn = function() {
    this.player.turn();
};
