function MainMenuScreen(screens) {
    this.screens = screens;

    this._titleChars = [
        'd888888P dP                      d888888P          dP         ',
        '   88    88                         88             88         ',
        '   88    88 88d888b. dP    dP       88    .d8888b. 88 .d8888b.',
        '   88    88 88\'  `88 88    88       88    88\'  `88 88 88ooood8',
        '   88    88 88    88 88.  .88       88    88.  .88 88 88.  ...',
        '   dP    dP dP    dP `8888P88       dP    `88888P8 dP `88888P\'',
        '                          .88                                 ',
        '                      d8888P                                  '
    ];

    this._titleColors = [
        '01111110 00                      01111110          00         ',
        '   11    11                         11             11         ',
        '   11    11 11011100 00    00       11    00111100 11 00111100',
        '   22    22 220  022 22    22       22    220  022 22 22000022',
        '   22    22 22    22 220  022       22    220  022 22 220  000',
        '   10    10 10    10 01111111       10    01111110 10 01111110',
        '                          011                                 ',
        '                      111110                                  '
    ];
}

MainMenuScreen.prototype.step = function(display, mouse) {
    var colors = ['#df9726', '#fbf236', '#fffdc0'];
    for (var y = 0; y < this._titleChars.length; y++) {
        for (var x = 0; x < this._titleChars[y].length; x++) {
            display.write(9 + x, 18 + y, this._titleChars[y][x], colors[this._titleColors[y][x]]);
        }
    }

    if (button(display, mouse, 32, 33, 'Start a new game')) {
        this.screens.push(new GameScreen(this.screens));
    }
};

function button(display, mouse, x, y, label) {
    var selected = mouse.x >= x && mouse.x < x + label.length && mouse.y === y;

    if (selected) {
        display.write(x - 1, y, ' ', '#000000', '#ffffff', 0.25);
        display.write(x - 2, y, ' ', '#000000', '#ffffff', 0.5);

        display.write(x, y, label, '#000000', '#ffffff');

        display.write(x + label.length, y, ' ', '#000000', '#ffffff', 0.25);
        display.write(x + label.length + 1, y, ' ', '#000000', '#ffffff', 0.5);
    } else {
        display.write(x, y, label, '#9badb7', '#000000');
    }

    return selected && mouse.clicked;
}
