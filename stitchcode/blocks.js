

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

BlockDialogMorph.prototype.fixCategoriesLayout = function () {
    var buttonWidth = this.categories.children[0].width(), // all the same
        buttonHeight = this.categories.children[0].height(), // all the same
        more = SpriteMorph.prototype.customCategories.size,
        xPadding = 15,
        yPadding = 2,
        border = 10, // this.categories.border,
        l = this.categories.left(),
        t = this.categories.top(),
        scroller,
        row,
        col,
        i;

    this.categories.setWidth(
        3 * xPadding + 2 * buttonWidth
    );

    this.categories.children.forEach((button, i) => {
        if (i < 8) {
            row = i % 4;
            col = Math.ceil((i + 1) / 4);
        } else if (i < 10) {
            row = 4;
            col = 3 - (10 - i);
        } else {
            row = i - 5;
            col = 1;
        }
        button.setPosition(new Point(
            l + (col * xPadding + ((col - 1) * buttonWidth)),
            t + ((row + 1) * yPadding + (row * buttonHeight) + border) +
                (i > 9 ? border / 2 : 0)
        ));
    });

    if (MorphicPreferences.isFlat) {
        this.categories.corner = 0;
        this.categories.border = 0;
        this.categories.edge = 0;
    }

    if (more > 6) {
        scroller = new ScrollFrameMorph(
            null,
            null,
            SpriteMorph.prototype.sliderColor.lighter()
        );
        scroller.setColor(this.categories.color);
        scroller.acceptsDrops = false;
        scroller.contents.acceptsDrops = false;
        scroller.setPosition(
            new Point(
                this.categories.left() + this.categories.border,
                this.categories.children[10].top()
            )
        );
        scroller.setWidth(this.categories.width() - this.categories.border * 2);
        scroller.setHeight(buttonHeight * 6 + yPadding * 5);

        for (i = 0; i < more; i += 1) {
            scroller.addContents(this.categories.children[10]);
        }
        this.categories.add(scroller);
        this.categories.setHeight(
            (5 + 1) * yPadding
                + 6 * buttonHeight
                + 6 * (yPadding + buttonHeight) + border + 2
                + 2 * border
        );
    } else {
        this.categories.setHeight(
            (5 + 1) * yPadding
                + 6 * buttonHeight
                + (more ? (more * (yPadding + buttonHeight) + border / 2) : 0)
                + 2 * border
        );
    }
};
