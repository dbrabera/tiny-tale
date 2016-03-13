var TT = window.TT || {};

TT.GameScreen = function(screens) {
    this.screens = screens;
    this.game = new TT.Game();

    this.game.log.info('Find the Amulet of Yendor and escape with it alive.', true);
    this.game.log.info('Welcome, adventurer!', true);

    this._isOver = false;
};

TT.GameScreen.prototype.step = function(display, mouse) {
    if (this._isOver && mouse.clicked) {
        this.screens.pop();
    }

    if (mouse.x >= 0 && mouse.x < 60 && mouse.y >= 0 && mouse.y < 50) {
        mouse.game = {x: mouse.x, y: mouse.y};
    }

    if (mouse.clicked && mouse.game) {
        this.game.player.go(mouse.game.x, mouse.game.y);
    }

    this.game.turn();

    // check if the player is dead
    if (this.game.player.health.current <= 0) {
        this._isOver = true;
    }

    // check if the player has the Amulet of Yendor
    if (this.game.player.amulet() && this.game.player.amulet().id === 0 && this.game._level !== 0) {
        this.game.log.success('You are teleported by the power of the amulet.');
        this.game.teleport(0); // teleport to the first level
    }

    var tile = this.game.map.tile(this.game.player.x, this.game.player.y);

    // check if the player exited the dungeon
    if (!this._isOver && tile.id === 3) {
        this.game.log.success('Congratulations! You escaped the dungeon alive.');
        this._isOver = true;
    } else if (!this._isOver && tile.id === 6) {
        this.game.down(); // next level
    } else if (!this._isOver && tile.id === 7) {
        this.game.up(); // previous level
    }

    this._viewport(display, mouse, 0, 0, this.game);
    this._description(display, mouse, 0, 51, this.game);
    this._log(display, 0, 53, this.game.log);

    this._hud(display, mouse, 60, 0, this.game);
};

TT.GameScreen.prototype._viewport = function(display, mouse, x, y, game) {
    function grid(x, y, color) {
        return (x + y) % 2 === 0 ? TT.Color.darken(color, 0.1) : color;
    }

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

            var item = game.map.item(i, j);
            if (item) {
                display.write(i, j, item.char, item.color, tile.bg, tile.visible ? null : 0.5);
                continue;
            }

            var char = (!tile.surface || tile.activable) ? tile.char : tile.surface.char;
            var fg = (!tile.surface || tile.activable) ? tile.fg : tile.surface.color;

            display.write(x + i, y + j, char, fg, tile.bg, shade);
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
};

TT.GameScreen.prototype._description = function(display, mouse, x, y, game) {
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
        display.write(x, y, 'Pick ' + game.map.item(mouse.game.x, mouse.game.y).description + '.');
        return;
    }

    if (tile.activable) {
        display.write(x, y, this._capitalize(tile.verb) + ' ' + tile.description + '.');
        return;
    }

    if (tile.walkable) {
        display.write(x, y, 'Move to ' + (!tile.surface ? tile.description : tile.surface.description) + '.');
        return;
    }

    display.write(x, y, (tile.visible ? 'You see ' : 'You remember seeing ') + tile.description + '.');
};

TT.GameScreen.prototype._hud = function(display, mouse, x, y, game) {
    display.write(x + 1, y, game.player.char + ': You', '#ffffff');
    this._bar(display, x, y + 1, 'Health', game.player.health.current, game.player.health.max , '#ffffff', '#ac3232');
    this._stats(display, x, y + 3, game.player);
    this._score(display, x, y + 5, game);
    this._inventory(display, mouse, x, y + 9, game.player);
    this._level(display, x, y + 25, game);
};

TT.GameScreen.prototype._score = function(display, x, y, game) {
    function pad(n) {
        return n >= 10 ? '' + n : '0' + n;
    }

    var elapsed = (Date.now() - game.started) / 1000;
    var minutes = Math.round(elapsed / 60 % 60);
    var hours = Math.round(elapsed / 60 / 60 % 60);

    display.write(x + 1, y + 1, 'Time: ' + pad(hours) + ':' + pad(minutes));
    display.write(x + 1, y + 2, 'Gold: ' + game.player.gold);
};

TT.GameScreen.prototype._level = function(display, x, y, game) {
    display.write(x + 1, y, 'Location', '#ffffff');
    display.write(x + 1, y + 1, game._level + ' - ' + game.map.name);
};

TT.GameScreen.prototype._stats = function(display, x, y, player) {
    var label = 'Attack: ' + player.attack.base;
    display.write(x + 1, y, label);
    if (player.attack.current !== player.attack.base) {
        display.write(x + 1 + label.length, y, '+' + (player.attack.current - player.attack.base), '#6abe30');
    }

    label = 'Defense: ' + player.defense.base;
    display.write(x + 1, y + 1, label);
    if (player.defense.current !== player.defense.base) {
        display.write(x + 1 + label.length, y + 1, '+' + (player.defense.current - player.defense.base), '#6abe30');
    }
};

TT.GameScreen.prototype._inventory = function(display, mouse, x, y, player) {
    var mouseover = mouse.x >= x && mouse.x < x + 20 && mouse.y >= y && mouse.y < y + 14;

    var names = ['Weapon', 'Armor', 'Amulet', 'Ring'];
    for (var i = 0; i < names.length; i++) {
        var item = player.slots[i];

        display.write(x + 1, y + (i * 3), names[i], '#ffffff');

        if (!item) {
            display.write(x + 1, y + (i * 3) + 1, 'Nothing', '#ffffff', null, 0.5);
            continue;
        }

        if (mouseover && mouse.y === y + (i * 3) + 1) {
            if (mouse.clicked) player.drop(i);

            display.rect(x, y + (i * 3) + 1, 20, 1, null, '#ffffff');
            display.write(x + 1, y + (i * 3) + 1, item.char + ' ' + this._capitalize(item.name), '#000000', '#ffffff');
            continue;
        }

        display.write(x + 1, y + (i * 3) + 1, item.char, item.color);
        display.write(x + 3, y + (i * 3) + 1, this._capitalize(item.name));
    }

    display.write(x + 1, y + 12, 'Potions', '#ffffff');

    if (player.potions === 0) {
        display.write(x + 1, y + 13, 'No health potions', '#ffffff', null, 0.5);
        return;
    }

    var label = player.potions === 1 ? 'Health potion' : 'Health potions x' + player.potions;

    if (mouseover && mouse.y === y + 13) {
        if (mouse.clicked) player.heal();

        display.rect(x, y + 13, 20, 1, null, '#ffffff');

        display.write(x + 1, y + 13, TT.Content.ITEM_TYPES[2].char, '#000000', '#ffffff');
        display.write(x + 3, y + 13, label, '#000000', '#ffffff');
    } else {
        display.write(x + 1, y + 13, TT.Content.ITEM_TYPES[2].char, TT.Content.ITEM_TYPES[2].color);
        display.write(x + 3, y + 13, label);
    }
};

TT.GameScreen.prototype._bar = function(display, x, y, label, value, capacity, fg, bg) {
    var filledUntil = Math.floor(20 * value / capacity);
    display.write(x + 1, y, label + ' ' + value + '/' + capacity, fg, bg);
    display.rect(x, y, filledUntil, 1, fg, bg);
    display.rect(x + filledUntil, y, capacity, 1, fg, TT.Color.darken(bg, 0.5));
};

TT.GameScreen.prototype._log = function(display, x, y, log) {
    for (var i = 0; i < log.capacity; i++) {
        var entry = log.entry(i);
        if (!entry) return;

        var color = '#ffffff';
        if (entry.level === 'danger') {
            color = '#ac3232';
        } else if (entry.level === 'success') {
            color = '#5b6ee1';
        }

        var message = entry.message + (entry.count > 1 ? ' x' + entry.count : '');
        display.write(x, y + i, message, color, null, log.old(entry) ? 0.5 : null);
    }
};

TT.GameScreen.prototype._capitalize = function (s) {
    return s[0].toUpperCase() + s.slice(1);
};
