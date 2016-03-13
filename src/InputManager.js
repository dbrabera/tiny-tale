var TT = window.TT || {};

TT.InputManager = function(display) {
    this.display = display;
    this._mouse = {
        x: -1,
        y: -1,
        clicked: false
    };

    window.addEventListener('click', this.handleClick.bind(this));
    window.addEventListener('mousemove', this.handleMousemove.bind(this));
};

TT.InputManager.prototype.handleClick = function(event) {
    if (event.button !== 0) return;
    this._mouse.clicked = true;
};

TT.InputManager.prototype.handleMousemove = function(event) {
    var position = this.display.eventToPosition(event);
    this._mouse.x = position[0];
    this._mouse.y = position[1];
};

TT.InputManager.prototype.mouse = function() {
    var mouse = {
        x: this._mouse.x,
        y: this._mouse.y,
        clicked: this._mouse.clicked
    };

    this._mouse.clicked = false;

    return mouse;
};
