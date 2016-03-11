function Player(game, x, y) {
    this.char = '@';
    this.name = 'You';
    this.description = 'yourself';
    this.fg = '#000000';

    this.health = {
        base: 20,
        current: 20,
        max: 20
    };

    this.strength = {
        base: 4,
        current: 4,
        max: 4
    };

    this.game = game;
    this.x = x;
    this.y = y;

    this.action = null;

    this.slots = [
        ITEM_TYPES[3],
        ITEM_TYPES[4],
        null,
        null
    ];

    this.potions = 1;
}

Player.prototype.go = function(x, y) {
    this.action = function() {
        var path = this.game.map.findPath(this, {x: x, y: y});
        // check if there is no path to the position
        if (!path || path.length === 0) {
            this.action = null;
            return false;
        }

        var next = path[1];

        // check if there is a monster there
        var monster = this.game.map.monster(next.x, next.y);
        if (monster) {
            monster.defend(this.name, 'hit', this.strength.current);
            this.action = null;
            return true;
        }

        // check if the next position it's activable
        var tile = this.game.map.tile(next.x, next.y);
        if (tile.activable && !tile.activate(this.game, this, next.x, next.y)) {
            this.action = null;
            return true;
        }

        // pick an item if there is one
        var item = this.game.map.item(next.x, next.y);
        if (item) this.pick(item, next.x, next.y);

        this.x = next.x;
        this.y = next.y;

        // recalculate FOV
        this.game.map.fov(this.x, this.y);

        return true;
    };
};

Player.prototype.turn = function() {
    if (this.action == null) return false;
    return this.action();
};

Player.prototype.defend = function(attacker, attack, damage) {
    this.health.current -= damage;
    this.game.map.tiles[this.x][this.y].surface = SURFACE_TYPES[0]; // pile of blood

    if(this.health.current > 0) {
        this.game.log.danger('The ' + attacker + ' ' + attack + ' you.');
        return;
    }

    this.health.current = 0;
    this.game.log.danger('The ' + attacker + ' killed you.');
};

Player.prototype.pick = function(item, x, y) {
    // check if its a potion
    if (item.slot === 4) {
        if (this.potions === 9) {
            this.game.log('You have too many health potions');
            return false;
        }

        this.potions += 1;
        this.game.map.items[x][y] = null;

        this.game.log.info('You picked ' + item.description + '.');
        return true;
    }

    // check if the slot is available
    if (this.slots[item.slot]) {
        this.game.log.info('You already have a ' + this.slots[item.slot].name + ' equiped. Drop it.');
        return false;
    }

    // equip it
    this.slots[item.slot] = item;
    this.game.map.items[x][y] = null;

    this.game.log.info('You picked ' + item.description + '.');

    return true;
};

Player.prototype.drop = function(slot) {
    this.action = function() {
        if (!this.slots[slot]) {
            this.action = null;
            return false;
        }

        if (this.game.map.items[this.x][this.y]) {
            this.game.log.info('You try to drop the ' + this.slots[slot].name + ', but there is no space on the floor.');
            this.action = null;
            return true;
        }

        var item = this.slots[slot];
        this.game.map.items[this.x][this.y] = item;
        this.slots[slot] = null;
        this.game.log.info('You drop the ' + item.name + '.');
        this.action = null;
        return true;
    };
};

Player.prototype.heal = function() {
    this.action = function() {
        if (this.potions === 0) {
            this.action = null;
            return false;
        }

        if (this.health.current === this.health.max) {
            this.game.log.info('You feel good and don\'t need health potion right now.');
            this.action = null;
            return true;
        }

        this.potions -= 1;
        this.health.current += 5;
        if (this.health.current > this.health.max) this.health.current = this.health.max;

        this.game.log.success('You use a health potion and feel better.');

        this.action = null;
        return true;
    };
};
