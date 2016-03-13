var TT = window.TT || {};

TT.Game = function() {
    this._maps = [
        new TT.Map(this, TT.Content.MAP_TYPES[0], 60, 50),
        new TT.Map(this, TT.Content.MAP_TYPES[1], 60, 50),
        new TT.Map(this, TT.Content.MAP_TYPES[2], 60, 50)
    ];

    this._level = 0;
    this.map = this._maps[this._level];

    this.player = new TT.Player(this);

    this.player.x = this.map.entry.x - 1;
    this.player.y = this.map.entry.y;
    this.map.fov(this.player.x, this.player.y);

    this.log = new TT.Log();

    this.started = Date.now();
};

TT.Game.prototype.turn = function() {
    if (!this.player.turn()) return;

    for (var i = 0; i < this.map.monsters.length; i++) {
        this.map.monsters[i].turn();
    }

    this.log.turn();
};

TT.Game.prototype.down = function() {
    this._level += 1;
    this.map = this._maps[this._level];

    this.player.x = this.map.entry.x - 1;
    this.player.y = this.map.entry.y;

    this.map.fov(this.player.x, this.player.y);
};

TT.Game.prototype.up = function() {
    this._level -= 1;
    this.map = this._maps[this._level];

    this.player.x = this.map.exit.x - 1;
    this.player.y = this.map.exit.y;

    this.map.fov(this.player.x, this.player.y);
};

TT.Game.prototype.teleport = function(level) {
    this._level = level;
    this.map = this._maps[level];

    var room = TT.Random.randchoice(this.map._rooms);

    this.player.x = room.center.x - 1;
    this.player.y = room.center.y;

    this.map.fov(this.player.x, this.player.y);
};
