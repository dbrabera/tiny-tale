function Game(width, height) {
    this.map = new Map(width, height);
    this.player = new Player(this, 0, 0);
}

Game.prototype.update = function() {
    this.player.update();
};
