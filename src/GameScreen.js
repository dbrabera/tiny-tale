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

    // check if the player exited the dungeon
    var tile = this.game.map.tile(this.game.player.x, this.game.player.y);
    if (tile.id === 3) {
        this.screens.pop();
    }

    // check if the player is dead
    if (this.game.player.health.current <= 0) {
        this.screens.pop();
    }

    viewport(display, mouse, 0, 0, this.game);
    description(display, mouse, 0, 51, this.game);
    log(display, 0, 53, this.game.log);

    hud(display, 60, 0, this.game);
};

function viewport(display, mouse, x, y, game) {
    // draw tiles && items
    for (var i = 0; i < game.map.width; i++) {
        for (var j = 0; j < game.map.height; j++) {
            var tile = game.map.tile(i, j);
            if (!tile.explored) continue;

            var shade = tile.visible ? null : 0.5;

            // draw chess grid on floor tiles
            if (tile.id === 0 && (i + j) % 2 === 0) {
                shade = shade ? shade + 0.1 : 0.1;
            }

            display.write(x + i, y + j, tile.char, tile.fg, tile.bg, shade);

            var item = game.map.item(i, j);
            if (item) display.write(i, j, item.char, item.color, tile.bg, tile.visible ? null : 0.5);
        }
    }

    // draw monsters
    for (i = 0; i < game.map.monsters.length; i++) {
        var monster = game.map.monsters[i];
        tile = game.map.tile(monster.x, monster.y);
        if (!tile.visible) continue;
        display.write(monster.x, monster.y, monster.char, monster.color, grid(monster.x, monster.y, tile.bg));
    }

    // draw player
    var player = game.player;
    tile = game.map.tile(player.x, player.y);
    display.write(player.x, player.y, player.char, player.char.fg, grid(player.x, player.y, tile.bg));

    if (!mouse.game) return;

    // draw pointer
    display.rect(mouse.game.x, mouse.game.y, 1, 1, '#000000', '#ffffff');

    // draw mouse trace
    var path = game.map.findPath(game.player, mouse.game);
    for (i = 1; i < path.length - 1; i++) {
        display.rect(path[i].x, path[i].y, 1, 1, '#000000', grid(path[i].x, path[i].y, '#9badb7'));
    }
}

function description(display, mouse, x, y, game) {
    if (!mouse.game) return;

    var tile = game.map.tile(mouse.game.x, mouse.game.y);
    if (!tile.explored) return;

    if (mouse.game.x === game.player.x && mouse.game.y === game.player.y) {
        display.write(x, y, 'You see ' + game.player.description + '.');
        return;
    }

    if (tile.visible && game.map.monster(mouse.game.x, mouse.game.y)) {
        display.write(x, y, 'Attack ' + game.map.monster(mouse.game.x, mouse.game.y).description + '.');
        return;
    }

    if (game.map.item(mouse.game.x, mouse.game.y)) {
        display.write(x, y, 'Move to ' + game.map.item(mouse.game.x, mouse.game.y).description + '.');
        return;
    }

    if (tile.walkable && (tile.id === 2 || tile.id === 3)) {
        display.write(x, y, 'Open ' + tile.description + '.');
        return;
    }

    if (tile.walkable) {
        display.write(x, y, 'Move to ' + tile.description + '.');
        return;
    }

    display.write(x, y, (tile.visible ? 'You see ' : 'You remember seeing ') + tile.description + '.');
}

function hud(display, x, y, game) {
    display.write(x + 1, y, game.player.char + ': You');
    bar(display, x, y + 1, 'Health', game.player.health.current, game.player.health.max , '#ffffff', '#ac3232');
    inventory(display, x, y + 3, game.player.inventory);
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

function grid(x, y, color) {
    return (x + y) % 2 === 0 ? darken(color, 0.1) : color;
}
