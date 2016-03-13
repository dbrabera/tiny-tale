var TT = window.TT || {};

TT.Content = {
    MAP_TYPES: [
        {id: 0, name: 'Ruins', monsters: [0, 1], enemies: 15, chests: 6, items: [1, 2, 5]},
        {id: 1, name: 'Goblin Camp', monsters: [2, 3], enemies: 15, chests: 5, items: [1, 2, 5, 6]},
        {id: 2, name: 'Crypt', monsters: [4, 5], enemies: 30, chests: 2, items: [1, 2, 5, 6]}
    ],

    TILE_TYPES: [
        {id: 0, char: '.', fg: '#002c41', bg: '#005784', description: 'the ground', walkable: true, transparent: true},
        {id: 1, char: '#', fg: '#1d2733', bg: '#2f484d', description: 'a stone wall', walkable: false, transparent: false},
        {id: 2, char: '+', fg: '#df7126', bg: '#8f563b', description: 'the wooden door', walkable: true, transparent: false, activable: true, verb: 'open'},
        {id: 3, char: 'Ω', fg: '#d77bba', bg: '#76428a', description: 'the dungeon exit', walkable: true, transparent: true, activable: true, verb: 'open'},
        {id: 4, char: 'Œ', fg: '#df7126', bg: '#8f563b', description: 'the wooden chest', walkable: true, transparent: true, activable: true, verb: 'open'},
        {id: 5, char: 'Œ', fg: '#df7126', bg: '#fbf236', description: 'the golden chest', walkable: true, transparent: true, activable: true, verb: 'open'},
        {id: 6, char: '<', fg: '#9badb7', bg: '#323c39', description: 'the downward staircase', walkable: true, transparent: true, activable: true, verb: 'use'},
        {id: 7, char: '>', fg: '#9badb7', bg: '#323c39', description: 'the upward staircase', walkable: true, transparent: true, activable: true, verb: 'use'}
    ],

    SURFACE_TYPES: [
        {id: 0, char: '*', color: '#ac3232', description: 'the pool of blood'},
        {id: 1, char: '*', color: '#6abe30', description: 'the pool of green blood'},
        {id: 2, char: '%', color: '#cccccc', description: 'the pile of bones'}
    ],

    MONSTER_TYPE: [
        {id: 0, char: 'r', color: '#31a2f2', name: 'rat', description: 'the rat', verb: 'bites', health: 2, attack: 3, defense: 0, remains: 0},
        {id: 1, char: 'c', color: '#8f563b', name: 'giant cocroatch', description: 'the giant cocroatch', verb: 'bites', health: 6, attack: 3, defense: 2, remains: 1},
        {id: 2, char: 'g', color: '#37946e', name: 'goblin scout', description: 'the goblin scout', verb: 'bashes', health: 3, attack: 4, defense: 1, remains: 0},
        {id: 3, char: 'G', color: '#37946e', name: 'goblin warrior', description: 'the goblin warrior', verb: 'stabs', health: 6, attack: 6, defense: 2, remains: 0},
        {id: 4, char: 's', color: '#cccccc', name: 'skeleton', description: 'the skeleton', verb: 'bashes', health: 1, attack: 6, defense: 0, remains: 2},
        {id: 5, char: 'l', color: '#d77bba', name: 'lich', description: 'the lich', verb: 'stabs', health: 10, attack: 6, defense: 2, remains: 1}
    ],

    ITEM_TYPES: [
        {id: 0, char: '♀', color: '#fbf236', name: 'Amulet Of Yendor', description: 'the Amulet Of Yendor', slot: 2, attack: 0, defense: 0},
        {id: 1, char: '•', color: '#fbf236', name: 'gold coin', description: 'a gold coin', slot: 5, value: 1},
        {id: 2, char: '!', color: '#ac3232', name: 'heal potion', description: 'a heal potion', slot: 4},
        {id: 3, char: '†', color: '#9badb7', name: 'dagger', description: 'a dagger', slot: 0, verb: 'stab', attack: 2, defense: 0},
        {id: 4, char: '[', color: '#d9a066', name: 'leather armor', description: 'a leather armor', slot: 1, attack: 0, defense: 1},
        {id: 5, char: '†', color: '#9badb7', name: 'longsword', description: 'a longsword', slot: 0, verb: 'stab', attack: 4, defense: 0},
        {id: 6, char: '[', color: '#9badb7', name: 'chainmail armor', description: 'a chainmail armor', slot: 1, attack: 0, defense: 2}
    ]
};
