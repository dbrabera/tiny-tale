function GameScreen(screens) {
    this.screens = screens;

    this.game = new Game(60, 50);
    this.viewport = new Viewport(this.game, 0, 0, 60, 50);
    this.descriptor = new Descriptor(this.game, 0, 50, 1, 50);
}

GameScreen.prototype.step = function(display, mouse) {
    if (this.viewport.containsPosition(mouse.x, mouse.y)) {
        mouse.game = {x: mouse.x, y: mouse.y};
    }

    if (mouse.clicked && mouse.game) {
        this.game.player.go(mouse.game.x, mouse.game.y);
    }

    this.game.turn();

    this.viewport.step(display, mouse);
    this.descriptor.step(display, mouse);
};
