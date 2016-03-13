var TT = window.TT || {};

TT.TinyTale = function(node) {
    this.display = new TT.Display(80, 60);
    node.appendChild(this.display.node());

    this.input = new TT.InputManager(this.display);

    this.screens = new TT.ScreenManager();
    this.screens.push(new TT.MainMenuScreen(this.screens));
};

TT.TinyTale.prototype.run = function() {
    window.requestAnimationFrame(this.step.bind(this));
};

TT.TinyTale.prototype.step = function() {
    this.display.clear();
    this.screens.step(this.display, this.input.mouse());
    window.requestAnimationFrame(this.step.bind(this));
};
