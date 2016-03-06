function Map(width, height) {
    this.width = width;
    this.height = height;
}

Map.prototype.draw = function(display) {
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            display.draw(x, y, '.');
        }
    }
};

Map.prototype.isWalkable = function(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
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
