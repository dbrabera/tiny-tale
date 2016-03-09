function GameScreen(screens) {
    this.screens = screens;
    this.game = new Game(60, 50);

    this.game.log.info('Find the Amulet of Yendor and escape with it alive.', true);
    this.game.log.info('Welcome, adventurer!', true);
}

GameScreen.prototype.step = function(display, mouse) {
    if (mouse.x >= 0 && mouse.x < 60 && mouse.y >= 0 && mouse.y < 50) {
        mouse.game = {x: mouse.x, y: mouse.y};
    }

    if (mouse.clicked && mouse.game) {
        this.game.player.go(mouse.game.x, mouse.game.y);
    }

    this.game.turn();

    viewport(display, mouse, 0, 0, this.game);
    description(display, mouse, 0, 51, this.game);
    log(display, 0, 53, this.game.log);

    hud(display, 60, 0, this.game);

    // check if the game is over
    var tile = this.game.map.tile(this.game.player.x, this.game.player.y);
    if (tile.id === 3) {
        this.screens.pop();
    }
};

function viewport(display, mouse, x, y, game) {
    // draw tiles && items
    for (var i = 0; i < game.map.width; i++) {
        for (var j = 0; j < game.map.height; j++) {
            var tile = game.map.tile(i, j);
            if (!tile.explored) continue;

            display.write(x + i, y + j, tile.char, tile.fg, tile.bg, tile.visible ? null : 0.7);

            var item = game.map.item(i, j);
            if (item) display.write(i, j, item.char, item.color, tile.bg, tile.visible ? null : 0.7);
        }
    }

    // draw player
    tile = game.map.tile(game.player.x, game.player.y);
    display.write(game.player.x, game.player.y, game.player.char, game.player.char.fg, tile.bg);

    if (!mouse.game) return;

    // draw pointer
    display.rect(mouse.game.x, mouse.game.y, 1, 1, '#000000', '#ffffff');

    // draw mouse trace
    var path = game.map.findPath(game.player, mouse.game);
    for (i = 1; i < path.length - 1; i++) {
        display.rect(path[i].x, path[i].y, 1, 1, '#ffffff', '#3f3f74');
    }
}

function description(display, mouse, x, y, game) {
    if (!mouse.game) return;

    var tile = game.map.tile(mouse.game.x, mouse.game.y);
    if (!tile.explored) return;

    var description = tile.description;
    if (mouse.game.x == game.player.x && mouse.game.y == game.player.y) {
        description = game.player.description;
    } else if (game.map.item(mouse.game.x, mouse.game.y)) {
        description = game.map.item(mouse.game.x, mouse.game.y).description;
    }

    display.write(x, y, (tile.visible ? 'You see ' : 'You remember ') + description + '.');
}

function hud(display, x, y, game) {
    display.write(x + 1, y, game.player.char + ': You');
    bar(display, x, y + 1, 'Health', game.player.health, game.player.strength , '#ffffff', '#ac3232');
    bar(display, x, y + 2, 'Energy', game.player.energy, game.player.stamina, '#ffffff', '#5fcde4');
    inventory(display, x, y + 4, game.player.inventory);
}

function inventory(display, x, y, inventory) {
    display.write(x + 1, y, 'Inventory');
    for (var i = 0; i < inventory.capacity; i++) {
        var item = inventory.item(i);
        if (!item) {
            display.write(x + 1, y + i + 1, '..................', '#5d6468');
            continue;
        }

        display.write(x + 1, y + i + 1, item.char, item.color);
        display.write(x + 3, y + i + 1, item.name, '#ffffff');
    }
}

function bar(display, x, y, label, value, capacity, fg, bg) {
    var filledUntil = Math.floor(20 * value / capacity);
    display.write(x + 1, y, label + ' ' + value + '/' + capacity, fg, bg);
    display.rect(x, y, filledUntil, 1, fg, bg);
}

function log(display, x, y, log) {
    for (var i = 0; i < log.capacity; i++) {
        var entry = log.entry(i);
        if (!entry) return;

        var message = entry.message + (entry.count > 1 ? ' x' + entry.count : '');
        display.write(x, y + i, message, log.old(entry) ? '#5d6468' : '#ffffff');
    }
}
