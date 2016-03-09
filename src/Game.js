function Game(width, height) {
    this.map = new Map(width, height);
    this.player = new Player(this, this.map.entry.x - 1, this.map.entry.y);
    this.log = new Log();
}

Game.prototype.turn = function() {
    if (!this.player.turn()) return;
    this.log.turn();
};
