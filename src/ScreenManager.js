function ScreenManager() {
    this.screens = [];
}

ScreenManager.prototype.push = function(screen) {
    this.screens.push(screen);
};

ScreenManager.prototype.pop = function() {
    this.screens.pop();
};

ScreenManager.prototype.step = function(display, mouse) {
    this.screens[this.screens.length-1].step(display, mouse);
};
