function Input(display) {
    this.display = display;
    this.mouse = {
        x: -1,
        y: -1,
        clicked: false
    };

    window.addEventListener('click', this.handleClick.bind(this));
    window.addEventListener('mousemove', this.handleMousemove.bind(this));
}

Input.prototype.handleClick = function(event) {
    if (event.button != 0) return;
    this.mouse.clicked = true;
};

Input.prototype.handleMousemove = function(event) {
    var position = this.display.eventToPosition(event);
    this.mouse.x = position[0];
    this.mouse.y = position[1];
};

Input.prototype.clicked = function() {
    var cliked = this.mouse.clicked;
    this.mouse.clicked = false;
    return cliked;
};
