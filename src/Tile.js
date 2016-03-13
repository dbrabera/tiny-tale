var TT = window.TT || {};

TT.Tile = function(type, visible, explored) {
    this.id = type.id;
    this.char = type.char;
    this.fg = type.fg;
    this.bg = type.bg;
    this.description = type.description;
    this.walkable = type.walkable;
    this.transparent = type.transparent;
    this.activable = type.activable;
    this.verb = type.verb;

    this.explored = explored;
    this.visible = visible;
};

TT.Tile.prototype.activate = function(game, actor, x, y) {
    // doors do nothing
    if (this.id === 2) return true;

    // only the player can activate the following tiles
    if (actor !== game.player) return false;

    // dungeon exit only allows to access with the Amulet Of Yendor
    if (this.id === 3) {
        if (actor.slots[2] && actor.slots[2].id === 0) return true;
        game.log.info('You try to open the door, but it\'s magically sealed.');
        return false;
    }

    // a normal chest drops an item when triying to open it
    if (this.id === 4) {
        game.log.info('You open the chest.');
        game.map.tiles[x][y] = new TT.Tile(TT.Content.TILE_TYPES[0], true, true);
        game.map.items[x][y] = TT.Content.ITEM_TYPES[TT.Random.randchoice(game.map._items)];
        return false;
    }

    // the golden chest drops the amulet of yendor
    game.log.info('You open the chest.');
    if (this.id === 5) {
        game.map.tiles[x][y] = new TT.Tile(TT.Content.TILE_TYPES[0], true, true);
        game.map.items[x][y] = TT.Content.ITEM_TYPES[0];
        return false;
    }

    return true;
};
