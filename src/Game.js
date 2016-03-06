function Game(node) {
    this.display = new ROT.Display({
        width: 20,
        height: 20,
        fontSize: 18,
        forceSquareRatio: true
    });

    node.appendChild(this.display.getContainer());
    this.input = new Input(this.display);
}

Game.prototype.run = function() {
    this.map = new Map(20, 20);
    this.player = new Player(this, 0, 0);
    this.pointer = new Pointer(this, this.input.mouse.x, this.input.mouse.y);

    window.requestAnimationFrame(this.step.bind(this));
};

Game.prototype.step = function() {
    this.control();
    this.update();
    this.draw();

    window.requestAnimationFrame(this.step.bind(this));
};

Game.prototype.control = function() {
    this.path = this.map.findPath(this.player, this.input.mouse);

    if (this.input.clicked()) {
        this.player.go(this.input.mouse.x, this.input.mouse.y);
    }

    this.pointer.move(this.input.mouse.x, this.input.mouse.y);
};

Game.prototype.update = function() {
    this.player.update();
    this.pointer.update();
};

Game.prototype.draw = function() {
    this.display.clear();

    this.map.draw(this.display);
    this.player.draw(this.display);
    this.pointer.draw(this.display);
};
