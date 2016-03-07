function Game(width, height) {
    this.map = new Map(width, height);
    this.player = new Player(this, 0, 0);
}

Game.prototype.turn = function() {
    this.player.turn();
};
