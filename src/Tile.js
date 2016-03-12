var TILE_TYPES = [
    {id: 0, char: '.', fg: '#002c41', bg: '#005784', description: 'the ground', walkable: true, transparent: true},
    {id: 1, char: '#', fg: '#1d2733', bg: '#2f484d', description: 'a stone wall', walkable: false, transparent: false},
    {id: 2, char: '+', fg: '#df7126', bg: '#8f563b', description: 'the wooden door', walkable: true, transparent: false, activable: true, verb: 'open'},
    {id: 3, char: 'Ω', fg: '#d77bba', bg: '#76428a', description: 'the dungeon exit', walkable: true, transparent: true, activable: true, verb: 'open'},
    {id: 4, char: 'Œ', fg: '#df7126', bg: '#8f563b', description: 'the wooden chest', walkable: true, transparent: true, activable: true, verb: 'open'},
    {id: 5, char: 'Œ', fg: '#df7126', bg: '#fbf236', description: 'the golden chest', walkable: true, transparent: true, activable: true, verb: 'open'},
    {id: 6, char: '<', fg: '#9badb7', bg: '#323c39', description: 'the downward staircase', walkable: true, transparent: true, activable: true, verb: 'use'},
    {id: 7, char: '>', fg: '#9badb7', bg: '#323c39', description: 'the upward staircase', walkable: true, transparent: true, activable: true, verb: 'use'}
];

var SURFACE_TYPES = [
    {id: 0, char: '*', color: '#ac3232', description: 'the pool of blood'},
    {id: 1, char: '*', color: '#6abe30', description: 'the pool of green blood'}
];

function Tile(type, visible, explored) {
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
}

Tile.prototype.activate = function(game, actor, x, y) {
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
        game.map.tiles[x][y] = new Tile(TILE_TYPES[0], true, true);
        game.map.items[x][y] = ITEM_TYPES[randchoice(game.map._items)];
        return false;
    }

    // the golden chest drops the amulet of yendor
    game.log.info('You open the chest.');
    if (this.id === 5) {
        game.map.tiles[x][y] = new Tile(TILE_TYPES[0], true, true);
        game.map.items[x][y] = ITEM_TYPES[0];
        return false;
    }

    return true;
};
