var colors = {};

function darken(color, amount) {
    if (colors['darken:' + color + ':' + amount]) return colors['darken:' + color + ':' + amount];

    function pad(n) {
        return n.length === 2 ? n : '0' + n;
    }

    var r = Math.floor(parseInt(color.substring(1, 3), 16) * (1 - amount));
    var g = Math.floor(parseInt(color.substring(3, 5), 16) * (1 - amount));
    var b = Math.floor(parseInt(color.substring(5, 7), 16) * (1 - amount));

    var res = '#' + pad(r.toString(16)) + pad(g.toString(16)) + pad(b.toString(16));
    colors['darken:' + color + ':' + amount] = res;
    return res;
}
