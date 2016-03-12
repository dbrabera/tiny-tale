var MAP_TYPES = [
    {id: 0, name: 'Ruins', monsters: [0, 1], enemies: 5, chests: 5, items: [1, 2, 5]},
    {id: 1, name: 'Goblin Camp', monsters: [2, 3], enemies: 7, chests: 5, items: [1, 2, 5, 6]},
    {id: 2, name: 'Crypt', monsters: [4, 5], enemies: 10, chests: 2, items: [1, 2, 5, 6]}
];

function Map(game, type, width, height) {
    this.width = width;
    this.height = height;

    this.name = type.name;

    var maze = generator(width, height);
    this.tiles = maze.tiles;
    this._rooms = maze.rooms;

    this.items = matrix(width, height);
    this._items = type.items;

    this.monsters = [];

    // place entry & exit
    this.entry = this._rooms[1].center;
    this.exit = this._rooms[this._rooms.length - 1].center;

    // place the dungeon exit in the first level
    if (type.id === 0) {
        this.tiles[this.entry.x][this.entry.y] = new Tile(TILE_TYPES[3]);
    } else {
        this.tiles[this.entry.x][this.entry.y] = new Tile(TILE_TYPES[7]);
    }

    // place the Amulet of Yendor in the last level
    if (type.id === 2) {
        this.tiles[this.exit.x][this.exit.y] = new Tile(TILE_TYPES[5]);
    } else {
        this.tiles[this.exit.x][this.exit.y] = new Tile(TILE_TYPES[6]);
    }

    // place monsters
    for (var i = 0; i < type.enemies; i++) {
        var room = randchoice(this._rooms);

        // try to find an empty position for the monster
        var position = randpositon(room._x1, room._y1, room._x2, room._y2);
        var tries = 0;
        while (!this.empty(position.x, position.y) && tries < 10) {
            position = randpositon(room._x1, room._y1, room._x2, room._y2);
            tries += 1;
        }

        if (tries >= 10) continue;

        this.monsters.push(new Monster(MONSTER_TYPE[randchoice(type.monsters)], game, position.x, position.y));
    }

    // place chests
    for (i = 0; i < type.chests; i++) {
        room = randchoice(this._rooms);
        position = randpositon(room._x1, room._y1, room._x2, room._y2);
        tries = 0;
        while (!this.empty(position.x, position.y) && tries < 10) {
            position = randpositon(room._x1, room._y1, room._x2, room._y2);
            tries += 1;
        }
        this.tiles[position.x][position.y] = new Tile(TILE_TYPES[4]);
    }


    this._fov = new ROT.FOV.PreciseShadowcasting(this.transparent.bind(this));

    // workaround for FOV not crossing doors when on top of them;
    this._fovOrigin = null;
}

Map.prototype.fov = function(x, y) {
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            this.tiles[i][j].visible = false;
        }
    }

    this._fovOrigin = {x: x, y: y};
    this._fov.compute(x, y, 10, function(x, y) {
        this.tiles[x][y].visible = true;
        this.tiles[x][y].explored = true;
    }.bind(this));
};

Map.prototype.tile = function(x, y) {
    return this.tiles[x][y];
};

Map.prototype.item = function(x, y) {
    return this.items[x][y];
};

Map.prototype.monster = function(x, y) {
    for (var i = 0; i < this.monsters.length; i++) {
        var monster = this.monsters[i];
        if (monster.x === x && monster.y === y) {
            return monster;
        }
    }
};

Map.prototype.kill = function(x, y) {
    var found = null;
    for (var i = 0; i < this.monsters.length; i++) {
        var monster = this.monsters[i];
        if (monster.x === x && monster.y === y) {
            found = i;
            break;
        }
    }
    this.monsters.splice(found, 1);
};

Map.prototype.walkable = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

    return this.tiles[x][y].walkable && this.tiles[x][y].explored;
};

Map.prototype.transparent = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

    return this.tiles[x][y].transparent || (this._fovOrigin.x === x && this._fovOrigin.y === y);
};

Map.prototype.empty = function(x, y) {
    // entry or spawn point
    if ((x === this.entry.x || x === this.entry.x - 1) && y === this.entry.y) return false;

    return !this.item(x, y) && !this.monster(x, y);
};

Map.prototype.findPath = function(from, to) {
    if (from.x === to.x && from.y === to.y) return [];
    if (!this.walkable(to.x, to.y)) return [];

    var path = [];
    var pathfinder = new ROT.Path.AStar(to.x, to.y, this.walkable.bind(this));
    pathfinder.compute(from.x, from.y, function(x, y) {
        path.push({x: x, y: y});
    });

    return path;
};

function matrix(width, height) {
    var rows = new Array(width);
    for (var i = 0; i < width; i++) {
        rows[i] = new Array(height);
    }
    return rows;
}

function generator(width, height) {
    var tiles = matrix(width, height);

    // dig rooms
    var digger = new ROT.Map.Digger(width, height);
    digger.create(function(x, y, what){
        tiles[x][y] = new Tile(TILE_TYPES[what]);
    });

    // place doors
    var rooms = digger.getRooms();
    for (var i = 0; i < rooms.length; i++) {
        rooms[i].getDoors(function(x, y) {
            tiles[x][y] = new Tile(TILE_TYPES[2]); // door
        });

        var center = rooms[i].getCenter();
        rooms[i].center = {x: center[0], y: center[1]};
    }

    return {tiles: tiles, rooms: rooms};
}

function randchoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randpositon(x1, y1, x2, y2) {
    return {x: randint(x1, x2), y: randint(y1, y2)};
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
