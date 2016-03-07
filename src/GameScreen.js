function GameScreen(screens) {
    this.screens = screens;

    this.game = new Game();
    this.pointer = new Pointer(this.game);
}

GameScreen.prototype.update = function(mouse) {
    if (mouse.clicked) {
        this.game.player.go(mouse.x, mouse.y);
    }

    this.pointer.move(mouse.x, mouse.y);

    this.game.update();
    this.pointer.update();
};

GameScreen.prototype.draw = function(display) {
    this.game.map.draw(display);
    this.game.player.draw(display);
    this.pointer.draw(display);
};
