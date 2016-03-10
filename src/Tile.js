var TILE_TYPES = [
    {id: 0, char: '.', fg: '#002c41', bg: '#005784', description: 'the ground', walkable: true, transparent: true},
    {id: 1, char: '#', fg: '#1d2733', bg: '#2f484d', description: 'a stone wall', walkable: false, transparent: false},
    {id: 2, char: '+', fg: '#df7126', bg: '#8f563b', description: 'the wooden door', walkable: true, transparent: false},
    {id: 3, char: 'Ω', fg: '#d77bba', bg: '#76428a', description: 'the dungeon exit', walkable: true, transparent: true}
];

var SURFACE_TYPES = [
    {id: 0, char: '.', color: '#ac3232', description: 'the pool of blood'}
];

function Tile(type) {
    this.id = type.id;
    this.char = type.char;
    this.fg = type.fg;
    this.bg = type.bg;
    this.description = type.description;
    this.walkable = type.walkable;
    this.transparent = type.transparent;

    this.explored = false;
    this.visible = false;
}
