function MainMenuScreen(screens) {
    this.screens = screens;
}

MainMenuScreen.prototype.step = function(display, mouse) {
    display.write(9, 18, 'd888888P dP                      d888888P          dP         ');
    display.write(9, 19, '   88    88                         88             88         ');
    display.write(9, 20, '   88    88 88d888b. dP    dP       88    .d8888b. 88 .d8888b.');
    display.write(9, 21, '   88    88 88\'  `88 88    88       88    88\'  `88 88 88ooood8');
    display.write(9, 22, '   88    88 88    88 88.  .88       88    88.  .88 88 88.  ...');
    display.write(9, 23, '   dP    dP dP    dP `8888P88       dP    `88888P8 dP `88888P\'');
    display.write(9, 24, '                          .88                                 ');
    display.write(9, 25, '                      d8888P                                  ');

    if (button(display, mouse, 32, 33, 'Start a new game')) {
        this.screens.push(new GameScreen(this.screens));
    }
};

function button(display, mouse, x, y, label) {
    var selected = mouse.x >= x && mouse.x < x + label.length && mouse.y == y;

    if (selected) {
        display.write(32, 33, label, '#000000', '#ffffff');
    } else {
        display.write(32, 33, label, '#ffffff', '#000000');
    }

    return selected && mouse.clicked;
}
