var TT = window.TT || {};

TT.Random = {
    randchoice: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    randpositon: function(x1, y1, x2, y2) {
        return {x: this.randint(x1, x2), y: this.randint(y1, y2)};
    },

    randint: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
