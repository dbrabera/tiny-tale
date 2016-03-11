var MONSTER_TYPE = [
    {id: 0, char: 'r', color: '#31a2f2', name: 'rat', description: 'the rat', verb: 'bites', health: 4, attack: 4, defense: 0, remains: 0},
    {id: 1, char: 'c', color: '#8f563b', name: 'giant cocroatch', description: 'the giant cocroatch', verb: 'bites', health: 6, attack: 5, defense: 2, remains: 1}
];

function Monster(type, game, x, y) {
    this.id = type.id;

    this.char = type.char;
    this.color = type.color;

    this.name = type.name;
    this.description = type.description;
    this.verb = type.verb;

    this.health = {
        current: type.health,
        max: type.health
    };

    this.attack = type.attack;
    this.defense = type.defense;

    this.remains = type.remains;

    this.game = game;
    this.x = x;
    this.y = y;
}

Monster.prototype.turn = function() {
    // check if the player is visible
    if (!this.game.map.tile(this.x, this.y).visible) return true;

    // check if there is a path to the player
    var path = this.game.map.findPath(this, this.game.player);
    if (!path || path.length === 0) return true;

    var next = path[1];

    // check if there is a monster
    var monster = this.game.map.monster(next.x, next.y);
    if (monster) return true;

    // check if the player is in the next position
    if (this.game.player.x === next.x && this.game.player.y === next.y) {
        this.game.player.defend(this.name, this.verb, this.attack);
        return true;
    }

    // move to the next position
    this.x = next.x;
    this.y = next.y;
};

Monster.prototype.defend = function(attacker, verb, attack) {
    var damage = attack - this.defense;
    if (damage <= 0) {
        this.game.log.info(attacker + ' missed ' + this.description + '.');
        return;
    }

    this.health.current -= damage;
    this.game.map.tiles[this.x][this.y].surface = SURFACE_TYPES[this.remains];

    if(this.health.current > 0) {
        this.game.log.success(attacker + ' ' + verb + ' ' + this.description + '.');
        return;
    }

    this.game.log.success(attacker + ' killed ' + this.description + '.');
    this.game.map.kill(this.x, this.y);
};
