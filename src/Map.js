function Map(game, width, height) {
    this.width = width;
    this.height = height;

    var maze = generator(width, height);
    this.tiles = maze.tiles;
    this._rooms = maze.rooms;

    this.items = matrix(width, height);

    this.monsters = [];

    // select entry position
    this.entry = this._rooms[1].center;

    // place dungeon exit
    this.tiles[this.entry.x][this.entry.y] = new Tile(TILE_TYPES[3]);

    // place the amulet of yendor
    var selected = this._rooms[this._rooms.length - 1];
    this.items[selected.center.x][selected.center.y] = ITEM_TYPES[0];

    // place monsters
    for (var i = 0; i < this._rooms.length; i++) {
        var room = this._rooms[i];
        this.monsters.push(new Monster(MONSTER_TYPE[0], game, room._x1, room._y1));
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

Map.prototype.item = function(x, y, remove) {
    var item = this.items[x][y];
    if (remove) this.items[x][y] = null;
    return item;
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
