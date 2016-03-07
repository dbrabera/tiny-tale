function GameScreen(screens) {
    this.screens = screens;

    this.game = new Game(60, 50);
    this.viewport = new Viewport(this.game, 0, 0, 60, 50);
}

GameScreen.prototype.update = function(mouse) {
    // update player position
    if (mouse.clicked && this.viewport.containsPosition(mouse.x, mouse.y)) {
        this.game.player.go(mouse.x, mouse.y);
    }

    this.game.update();

    this.viewport.update(mouse);
};

GameScreen.prototype.draw = function(display) {
    this.viewport.draw(display);
};
