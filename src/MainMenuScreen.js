function MainMenuScreen(screens) {
    this.screens = screens;
}

MainMenuScreen.prototype.step = function(display, mouse) {
    display.drawText(9, 18, 'd888888P dP                      d888888P          dP         ');
    display.drawText(12, 19, '   88    88                         88             88         ');
    display.drawText(12, 20, '   88    88 88d888b. dP    dP       88    .d8888b. 88 .d8888b.');
    display.drawText(12, 21, '   88    88 88\'  `88 88    88       88    88\'  `88 88 88ooood8');
    display.drawText(12, 22, '   88    88 88    88 88.  .88       88    88.  .88 88 88.  ...');
    display.drawText(12, 23, '   dP    dP dP    dP `8888P88       dP    `88888P8 dP `88888P\'');
    display.drawText(35, 24, '                          .88                                 ');
    display.drawText(31, 25, '                      d8888P                                  ');

    if (button(display, mouse, 32, 33, 'Start a new game')) {
        this.screens.push(new GameScreen(this.screens));
    }
};

function button(display, mouse, x, y, label) {
    var selected = mouse.x >= x && mouse.x < x + label.length && mouse.y == y;

    if (selected) {
        display.drawText(32, 33, '%c{black}%b{white}' + label + '%b{}%c{}');
    } else {
        display.drawText(32, 33, label);
    }

    return selected && mouse.clicked;
}
