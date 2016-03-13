var TT = window.TT || {};

TT.Color = {
    _cache: {},

    darken: function(color, amount) {
        if (this._cache['darken:' + color + ':' + amount]) {
            return this._cache['darken:' + color + ':' + amount];
        }

        function pad(n) {
            return n.length === 2 ? n : '0' + n;
        }

        var r = Math.floor(parseInt(color.substring(1, 3), 16) * (1 - amount));
        var g = Math.floor(parseInt(color.substring(3, 5), 16) * (1 - amount));
        var b = Math.floor(parseInt(color.substring(5, 7), 16) * (1 - amount));

        var res = '#' + pad(r.toString(16)) + pad(g.toString(16)) + pad(b.toString(16));
        this._cache['darken:' + color + ':' + amount] = res;
        return res;
    }
};
