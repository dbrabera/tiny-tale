function Game() {
    this.map = new Map(80, 60);
    this.player = new Player(this, 0, 0);
}

Game.prototype.update = function() {
    this.player.update();
};
