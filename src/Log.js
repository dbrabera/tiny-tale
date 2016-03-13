var TT = window.TT || {};

TT.Log = function() {
    this._entries = new Array(6);
    this.capacity = 6;
    this._turn = 0;
};

TT.Log.prototype.turn = function() {
    this._turn += 1;
};

TT.Log.prototype.entry = function(i) {
    return this._entries[i];
};

TT.Log.prototype._log = function(level, message, initial) {
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

TT.Log.prototype.info = function(message, initial) {
    return this._log('info', message, initial);
};

TT.Log.prototype.danger = function(message, initial) {
    return this._log('danger', message, initial);
};

TT.Log.prototype.success = function(message, initial) {
    return this._log('success', message, initial);
};

TT.Log.prototype.old = function(entry) {
    return entry.initial && this._turn > 0 || entry.turn < this._turn - 1;
};
