function MainMenuScreen(screens) {
    this.screens = screens;
}

MainMenuScreen.prototype.step = function(display, mouse) {
    if (mouse.clicked && (mouse.x >= 32 || mouse.y < 58) && mouse.y == 33) {
        this.screens.push(new GameScreen(this.screens));
    }

    display.drawText(9, 18, 'd888888P dP                      d888888P          dP         ');
    display.drawText(12, 19, '   88    88                         88             88         ');
    display.drawText(12, 20, '   88    88 88d888b. dP    dP       88    .d8888b. 88 .d8888b.');
    display.drawText(12, 21, '   88    88 88\'  `88 88    88       88    88\'  `88 88 88ooood8');
    display.drawText(12, 22, '   88    88 88    88 88.  .88       88    88.  .88 88 88.  ...');
    display.drawText(12, 23, '   dP    dP dP    dP `8888P88       dP    `88888P8 dP `88888P\'');
    display.drawText(35, 24, '                          .88                                 ');
    display.drawText(31, 25, '                      d8888P                                  ');

    if ((mouse.x >= 32 || mouse.y < 58) && mouse.y == 33) {
        display.drawText(32, 33, '%c{black}%b{white}Start a new game%b{}%c{}');
    } else {
        display.drawText(32, 33, 'Start a new game');
    }
};
