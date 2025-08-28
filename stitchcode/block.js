

// Hue slot morph

var HueSlotMorph;

HueSlotMorph.prototype = new ColorSlotMorph();
HueSlotMorph.prototype.constructor = HueSlotMorph;
HueSlotMorph.uber = ColorSlotMorph.prototype;

function HueSlotMorph(clr) {
    this.init(clr);
}

HueSlotMorph.prototype.init = function (clr) {
    HueSlotMorph.uber.init.call(this, null, true); // silently
    this.setColor(clr || new Color(127.5, 0, 0));
};

HueSlotMorph.prototype.getUserColor = function () {
    var myself = this,
        world = this.world(),
        hand = world.hand,
        posInDocument = getDocumentPositionOf(world.worldCanvas),
        mouseMoveBak = hand.processMouseMove,
        mouseDownBak = hand.processMouseDown,
        mouseUpBak = hand.processMouseUp,
        pal = new HueWheelMorph(null, new Point(
            this.fontSize * 12,
            this.fontSize * 12
        ));
    world.add(pal);
    pal.setPosition(this.bottomLeft().add(new Point(0, this.edge)));
    pal.addShadow(new Point(2, 2), 80);

    hand.processMouseMove = function (event) {
        hand.setPosition(new Point(
            event.pageX - posInDocument.x,
            event.pageY - posInDocument.y
        ));
        myself.setColor(world.getGlobalPixelColor(hand.position()));
    };

    hand.processMouseDown = nop;

    hand.processMouseUp = function () {
        pal.destroy();
        hand.processMouseMove = mouseMoveBak;
        hand.processMouseDown = mouseDownBak;
        hand.processMouseUp = mouseUpBak;
    };
};


// labelPart() proxy
SyntaxElementMorph.prototype.originalLabelPart = SyntaxElementMorph.prototype.labelPart;
SyntaxElementMorph.prototype.labelPart = function (spec) {
    var part;
    switch (spec) {
        case '%hsb':
            part = new InputSlotMorph(
                null,
                false,
                {
                    'hue' : ['hue'],
                    'saturation' : ['saturation'],
                    'brightness' : ['brightness'],
                },
                true
                );
            break;
        case '%huewheel':
            part = new HueSlotMorph();
            part.isStatic = true;
            break;
        default:
            part = this.originalLabelPart(spec);
            break;
    }
    return part;
};
