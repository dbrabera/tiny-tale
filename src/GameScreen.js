function GameScreen(screens) {
    this.screens = screens;
    this.game = new Game(60, 50);
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
    description(display, mouse, 0, 50, this.game);
    hud(display, 60, 0, this.game);
};

function viewport(display, mouse, x, y, game) {
    // draw map
    for (var i = 0; i < game.map.width; i++) {
        for (var j = 0; j < game.map.height; j++) {
            var tile = game.map.tile(i, j);
            display.draw(i + x, j + y, tile.char, tile.fg, tile.bg);
        }
    }

    // draw player
    display.draw(game.player.x, game.player.y, '@');

    if (!mouse.game) return;

    // draw pointer
    var cell = display._data[mouse.game.x + ',' + mouse.game.y];
    display.draw(cell[0], cell[1], cell[2], '#000000', '#ffffff');

    // draw mouse trace
    var path = game.map.findPath(game.player, mouse.game);
    for (i = 1; i < path.length-1; i++) {
        cell = display._data[path[i].x + ',' + path[i].y];
        display.draw(cell[0], cell[1], cell[2], '#ffffff', '#3f3f74');
    }
}

function description(display, mouse, x, y, game) {
    if (!mouse.game) return;

    var description = '...';
    if (mouse.game.x == game.player.x && mouse.game.y == game.player.y) {
        description = game.player.description;
    } else {
        description = game.map.tile(mouse.game.x, mouse.game.y).description;
    }

    display.drawText(x, y, 'You see ' + description + '.');
}

function hud(display, x, y, game) {
    display.drawText(x, y, game.player.char + ': You');
    bar(display, x, y+1, 'Health', game.player.health, game.player.strength , '#ffffff', '#ac3232');
    bar(display, x, y+2, 'Energy', game.player.energy, game.player.stamina, '#ffffff', '#5fcde4');
}

function bar(display, x, y, label, value, capacity, fg, bg) {
    var filledUntil = Math.floor(20 * value/capacity);
    for (var i = 0; i < filledUntil; i++) {
        display.draw(x + i, y, ' ', fg, bg);
    }

    var labelStart = x + 10 - Math.floor(label.length/2);
    for (i = 0; i < label.length; i++) {
        display.draw(labelStart + i, y, label[i], fg, bg);
    }
}
