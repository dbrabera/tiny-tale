function Descriptor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
}

Descriptor.prototype.step = function(display, mouse) {
    if (!mouse.game) return;

    var description = '...';
    if (mouse.game.x == this.game.player.x && mouse.game.y == this.game.player.y) {
        description = this.game.player.description;
    } else {
        description = this.game.map.tile(mouse.game.x, mouse.game.y).description;
    }

    display.drawText(this.x, this.y, 'You see ' + description + '.');
};
