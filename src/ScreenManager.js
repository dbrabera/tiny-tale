function ScreenManager() {
    this.screens = [];
}

ScreenManager.prototype.push = function(screen) {
    this.screens.push(screen);
};

ScreenManager.prototype.pop = function() {
    this.screens.pop;
};

ScreenManager.prototype.update = function(mouse) {
    this.screens[this.screens.length-1].update(mouse);
};

ScreenManager.prototype.draw = function(display) {
    this.screens[this.screens.length-1].draw(display);
};
