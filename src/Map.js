function Map(width, height) {
    this.width = width;
    this.height = height;

    var tiles = [];
    var items = [];

    // populate tiles & items
    for (var x = 0; x < width; x++) {
        tiles.push([]);
        items.push([]);

        for (var y = 0; y < height; y++) {
            tiles[x][y] = new Tile(TILE_TYPES[0]); // floor
            items[x][y] = null;
        }
    }

    var generator = new ROT.Map.Digger(width, height);
    generator.create(function(x, y, what){
        tiles[x][y] = new Tile(TILE_TYPES[what]);
    });

    // place doors
    var rooms = generator.getRooms();
    for (var i = 0; i < rooms.length; i++) {
        rooms[i].getDoors(function(x, y) {
            tiles[x][y] = new Tile(TILE_TYPES[2]); // door
        });
    }

    // select entry position
    var room = rooms[1];
    var center = room.getCenter();
    this.entry = {
        x: center[0],
        y: center[1]
    };

    // place dungeon exit
    tiles[this.entry.x][this.entry.y] = new Tile(TILE_TYPES[3]); // dungeon exit

    // place the amulet of yendor
    room = rooms[rooms.length - 1];
    center = room.getCenter();
    items[center[0]][center[1]] = ITEM_TYPES[0];

    this.tiles = tiles;
    this.items = items;

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

Map.prototype.walkable = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

    return this.tiles[x][y].walkable && this.tiles[x][y].explored;
};

Map.prototype.transparent = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

    return this.tiles[x][y].transparent || (this._fovOrigin.x == x && this._fovOrigin.y == y);
};

Map.prototype.findPath = function(from, to) {
    if (from.x == to.x && from.y == to.y) return [];
    if (!this.walkable(to.x, to.y)) return [];

    var path = [];
    var pathfinder = new ROT.Path.AStar(to.x, to.y, this.walkable.bind(this));
    pathfinder.compute(from.x, from.y, function(x, y) {
        path.push({x: x, y: y});
    });

    return path;
};
