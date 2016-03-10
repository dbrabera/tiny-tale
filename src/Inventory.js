function Inventory() {
    this._items = [];
    this.capacity = 10;
    this.length = 0;
}

Inventory.prototype.full = function() {
    return this._items.length >= this.capacity;
};

Inventory.prototype.add = function(item) {
    if (this.length === this.capacity) return;
    this._items.push(item);
    this.length += 1;
};

Inventory.prototype.item = function(i) {
    return this._items[i];
};

Inventory.prototype.remove = function(i) {
    var item = this._items[i];
    this._items = this._items.splice(i, 1);
    this.length -= 1;
    return item;
};

Inventory.prototype.contains = function(id) {
    for (var i = 0; i < this._items.length; i++) {
        if (this._items[i].id === id) return true;
    }
    return false;
};
