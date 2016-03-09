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
            tiles[x][y] = TILE_TYPES[0]; // floor
            items[x][y] = null;
        }
    }

    var generator = new ROT.Map.Digger(width, height);
    generator.create(function(x, y, what){
        tiles[x][y] = TILE_TYPES[what];
    });

    // place doors
    var rooms = generator.getRooms();
    for (var i = 0; i < rooms.length; i++) {
        rooms[i].getDoors(function(x, y) {
            tiles[x][y] = TILE_TYPES[2]; // door
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
    tiles[this.entry.x][this.entry.y] = TILE_TYPES[3]; // dungeon exit

    // place the amulet of yendor
    room = rooms[rooms.length-1];
    center = room.getCenter();
    items[center[0]][center[1]] = ITEM_TYPES[0];

    this.tiles = tiles;
    this.items = items;
}

Map.prototype.tile = function(x, y) {
    return this.tiles[x][y];
};

Map.prototype.item = function(x, y, remove) {
    var item = this.items[x][y];
    if (remove) this.items[x][y] = null;
    return item;
};

Map.prototype.isWalkable = function(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height && this.tile(x, y).walkable;
};

Map.prototype.findPath = function(from, to) {
    if (from.x == to.x && from.y == to.y) return [];
    if (!this.isWalkable(to.x, to.y)) return [];

    var path = [];
    var pathfinder = new ROT.Path.AStar(to.x, to.y, this.isWalkable.bind(this));
    pathfinder.compute(from.x, from.y, function(x, y) {
        path.push({x: x, y: y});
    });

    return path;
};
