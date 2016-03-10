function Log() {
    this._entries = new Array(6);
    this.capacity = 6;
    this._turn = 0;
}

Log.prototype.turn = function() {
    this._turn += 1;
};

Log.prototype.entry = function(i) {
    return this._entries[i];
};

Log.prototype._log = function(level, message, initial) {
    if (this._entries[0] && this._entries[0].message === message) {
        this._entries[0].count += 1;
        this._entries[0].turn = this._turn;
        return;
    }

    for (var i = this._entries.length - 1; i > 0 ; i--) {
        this._entries[i] = this._entries[i - 1];
    }

    this._entries[0] = {level: level, message: message, count: 1, turn: this._turn, initial: initial};

};

Log.prototype.info = function(message, initial) {
    return this._log('info', message, initial);
};

Log.prototype.danger = function(message, initial) {
    return this._log('danger', message, initial);
};

Log.prototype.success = function(message, initial) {
    return this._log('success', message, initial);
};

Log.prototype.old = function(entry) {
    return entry.initial && this._turn > 0 || entry.turn < this._turn - 1;
};
