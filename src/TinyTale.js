function TinyTale(node) {
    this.display = new ROT.Display({
        width: 80,
        height: 60,
        fontSize: 16,
        forceSquareRatio: true
    });
    node.appendChild(this.display.getContainer());

    this.input = new InputManager(this.display);

    this.screens = new ScreenManager();
    this.screens.push(new MainMenuScreen(this.screens));
}

TinyTale.prototype.run = function() {
    window.requestAnimationFrame(this.step.bind(this));
};

TinyTale.prototype.step = function() {
    this.screens.update(this.input.mouse());

    this.display.clear();
    this.screens.draw(this.display);

    window.requestAnimationFrame(this.step.bind(this));
};
