var TT = window.TT || {};

TT.ScreenManager = function() {
    this.screens = [];
};

TT.ScreenManager.prototype.push = function(screen) {
    this.screens.push(screen);
};

TT.ScreenManager.prototype.pop = function() {
    this.screens.pop();
};

TT.ScreenManager.prototype.step = function(display, mouse) {
    this.screens[this.screens.length - 1].step(display, mouse);
};
