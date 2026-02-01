/*
    TurtleShepherd
    ------------------------------------------------------------------
    turltestich's embroidery intelligence agency
    Embroidery function for Javscript
    ------------------------------------------------------------------
    Copyright (C) 2016-2021 Michael Aschauer
    Copyright (C) 2025 maehw

*/

// TODO: Cleanup TABS!

function TurtleShepherd() {
    this.init();

}

TurtleShepherd.prototype.init = function() {
    this.clear();
    this.pixels_per_millimeter = 5;
    this.metric = true;
	  this.maxLength = 121;
    this.calcTooLong = true;
    this.densityMax = 15;
    this.ignoreColors = false;
    this.ignoreWarning = false;
    this.backgroundColor = {r:0,g:0,b:0,a:1};
    this.defaultColor = {r:0,g:0,b:0,a:1};
    this.oldColor =  this.defaultColor;
};

TurtleShepherd.prototype.clear = function() {
    this.cache = [];
    this.w = 0;
    this.h = 0;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.initX = 0;
    this.initY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.scale = 1;
    this.steps = 0;
    this.stitchCount = 0;
    this.jumpCount = 0;
    this.tooLongCount = 0;
    this.density = {};
    this.densityWarning = false;
    this.colors = [];
    this.newColor = 0;
    this.oldColor =  this.defaultColor;
    this.penSize = 1;
    this.newPenSize = 0;

};

TurtleShepherd.prototype.toggleMetric = function() {
    return this.metric = !this.metric;
};

TurtleShepherd.prototype.setMetric = function(b) {
    this.metric = b;
};

TurtleShepherd.prototype.isMetric = function() {
    return this.metric;
};

TurtleShepherd.prototype.getIgnoreColors = function() {
    return this.ignoreColors;
};

TurtleShepherd.prototype.toggleIgnoreColors = function() {
    this.ignoreColors = !this.ignoreColors;
};

TurtleShepherd.prototype.isEmpty = function() {
    return this.steps < 1;
};

TurtleShepherd.prototype.hasSteps = function() {
    return this.steps > 0;
};

TurtleShepherd.prototype.getStepCount = function() {
    return this.steps;
};

TurtleShepherd.prototype.getJumpCount = function() {
    return this.jumpCount;
};

TurtleShepherd.prototype.getTooLongCount = function() {
    return this.tooLongCount;
};

TurtleShepherd.prototype.getTooLongStr = function() {
    if (this.tooLongCount > 1 && !this.ignoreWarning)
		return this.tooLongCount +  " are too long! (will get clamped)"
	else if (this.tooLongCount == 1 && !this.ignoreWarning)
		return this.tooLongCount +  " is too long! (will get clamped)"
	else
		return "";
};

TurtleShepherd.prototype.getDensityWarningStr = function() {
    if (this.densityWarning && !this.ignoreWarning)
		return "DENSITY WARNING!";
	else
		return "";
};

TurtleShepherd.prototype.getDimensions = function() {

	if (this.metric) {
		//c = 1;
		//unit = "mm";
		c = 0.1
		unit = "cm";
	} else {
		c = 0.03937;
		unit = "in";
	}
    w= ((this.maxX - this.minX)/ this.pixels_per_millimeter * c).toFixed(2).toString();
    h= ((this.maxY - this.minY)/ this.pixels_per_millimeter * c).toFixed(2).toString();
	return w + " x " + h + " " + unit;
};

TurtleShepherd.prototype.getMetricWidth = function() {
	c = 0.1
	return ((this.maxX - this.minX)/ this.pixels_per_millimeter * c).toFixed(2).toString();
};


TurtleShepherd.prototype.getMetricHeight = function() {
	c = 0.1
	return((this.maxY - this.minY)/ this.pixels_per_millimeter * c).toFixed(2).toString();
};


TurtleShepherd.prototype.moveTo= function(x1, y1, x2, y2, penState) {
    // ignore jump stitches withouth any previous stitches
    //if (this.steps === 0 && !penState)
	//	return

	warn = false

    if (this.steps === 0) {
        this.initX = x1;
        this.initY = y1;
        this.minX = x1;
        this.minY = y1;
        this.maxX = x1;
        this.maxY = y1;
        this.cache.push(
            {
                "cmd":"move",
                "x":x1,
                "y":y1,
                "penDown":penState,
            }
        );
        this.density[Math.round(x1) + "x" + Math.round(y1)] = 1;
        if (this.colors.length < 1) {
			if (this.newColor) {
				this.colors.push(this.newColor);
			} else {
				this.colors.push(this.defaultColor);
			}
		}
    }

    if (this.newColor) {
		this.pushColorChangeNow();
	}

    if (this.newPenSize) {
		this.pushPenSizeNow();
	}

	if (x2 < this.minX) this.minX = x2;
	if (x2 > this.maxX) this.maxX = x2;
	if (y2 < this.minY) this.minY = y2;
	if (y2 > this.maxY) this.maxY = y2;

	var d = Math.round(x2) + "x" + Math.round(y2);
	if (this.density[d]) {
		this.density[d] += 1;
		if (this.density[d] > this.densityMax) {
			this.densityWarning = true;
			if (this.density[d] <= this.densityMax+1)
				warn = true;
		}
	} else  {
		this.density[d] = 1;
	}

	if ( this.calcTooLong && penState) {
    dist = Math.sqrt( (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) );
		if ( (dist / this.pixels_per_millimeter * 10) > this.maxLength)
			this.tooLongCount += 1;
	}

    this.cache.push(
        {
            "cmd":"move",
            "x":x2,
            "y":y2,
            "penDown":penState,
        }
    );

    this.w = this.maxX - this.minX;
    this.h = this.maxY - this.minY;

    if (!penState)
        this.jumpCount++;
    else {
        this.steps++;
    }

    if (warn) {
		warn = false;
		return [x2, y2];
	} else {
		return false;
	}

	this.lastX = x2;
	this.lastY = y2;
};

TurtleShepherd.prototype.setDefaultColor= function(color) {
	var c = {
		r: Math.round(color.r),
		g: Math.round(color.g),
		b: Math.round(color.b),
		a: color.a
	};
	this.defaultColor = c;
};

TurtleShepherd.prototype.getDefaultColorAsHex = function (){
	return new String(
    "#" + (
      (1 << 24)
    + (Math.round(this.defaultColor.r) << 16)
    + (Math.round(this.defaultColor.g) << 8)
	  + Math.round(this.defaultColor.b)
   ).toString(16).slice(1));
};

TurtleShepherd.prototype.setBackgroundColor= function(color) {
	var c = {
		r: Math.round(color.r),
		g: Math.round(color.g),
		b: Math.round(color.b),
		a: color.a
	};
	this.backgroundColor = c;
};

TurtleShepherd.prototype.getBackgroundColorAsHex = function (){
	return new String(
    "#" + (
      (1 << 24)
    + (Math.round(this.backgroundColor.r) << 16)
    + (Math.round(this.backgroundColor.g) << 8)
	  + Math.round(this.backgroundColor.b)
   ).toString(16).slice(1));
}

TurtleShepherd.prototype.addColorChange= function(color) {
	var c = {
		r: Math.round(color.r),
		g: Math.round(color.g),
		b: Math.round(color.b),
		a: color.a
	};
	this.newColor = c;
};

TurtleShepherd.prototype.pushColorChangeNow = function() {

	c = this.newColor;
	o = this.oldColor;

	if (c.r == o.r && c.g == o.g && c.b == o.b && c.a == o.a) {
		this.newColor = false;
		return;
	}

	index = this.colors.findIndex(x => (x.r == c.r && x.b == x.b && x.g == c.g && x.a == c.a) );

	if (index < 0) {
		index = this.colors.push(this.newColor)-1;
	}

    this.cache.push(
        {
            "cmd":"color",
            "color": this.newColor,
            "thread": index
        }
    );
	this.oldColor = this.newColor;
    this.newColor = false;
};

TurtleShepherd.prototype.setPenSize = function(s) {
	this.newPenSize = s;
};

TurtleShepherd.prototype.pushPenSizeNow = function() {
	n = this.newPenSize;
	o = this.penSize;

	if (n == o) {
		this.newPenSize = false;
		return;
	}
    this.cache.push(
        {
            "cmd":"pensize",
            "pensize": n
        }
    );
	this.penSize = this.newPenSize;
    this.newPenSize = false;
};

TurtleShepherd.prototype.undoStep = function() {
	var last = this.cache.pop();
	if (last.cmd == "move") {
		if (last.penDown) {
			this.steps--;
		} else {
			this.jumpCount--;
		}
	}
};

TurtleShepherd.prototype.toSVG = function() {

    var svgStr = "<?xml version=\"1.0\" standalone=\"no\"?>\n";
    svgStr += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \n\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";
    svgStr += '<svg width="' + (this.w) + '" height="' + (this.h) + '"' +
        ' viewBox="0 0 ' + (this.w) + ' ' + (this.h) + '" style="background-color:' + this.getBackgroundColorAsHex() + '"';
    svgStr += ' xmlns="http://www.w3.org/2000/svg" version="1.1">\n';
    svgStr += '<title>Embroidery export</title>\n';

    hasFirst = false;
    tagOpen = false;
    colorChanged = false;
    penSizeChanged = false;
    penSize = 1;
    lastStitch = null;
    color = this.defaultColor;

    for (var i=0; i < this.cache.length; i++) {
        if (this.cache[i].cmd == "color" && !this.ignoreColors) {
    			color = this.cache[i].color;
    			if (hasFirst) colorChanged = true;
    			if (tagOpen) svgStr += '" />\n';
    			tagOpen = false;
        } else if (this.cache[i].cmd == "pensize") {
			penSize = this.cache[i].pensize;
			if (hasFirst) penSizeChanged = true;
			if (tagOpen) svgStr += '" />\n';
			tagOpen = false;
        } else if (this.cache[i].cmd == "move") {
            stitch = this.cache[i];
            if (!hasFirst) {
                if (stitch.penDown) {
                    svgStr += '<path fill="none" style="' +
						'stroke:rgb('+ color.r + ',' + color.g + ',' + color.b +  '); ' +
						'stroke-width:' + penSize + ';' +
						'stroke-linecap:round;' +
						'stroke-opacity:' + color.a + ';' +
						'"' +
                        ' d="M ' +
						   (this.initX - this.minX) +
                           ' ' +
                           (this.maxY - this.initY) ;
                    hasFirst = true;
                    tagOpen = true;
                } else {
					// do nothing
                }
            } else {
                if (stitch.penDown ) {
                    if (!lastStich.penDown || colorChanged || penSizeChanged) {
						svgStr += '<path fill="none" style="' +
							'stroke:rgb('+ color.r + ',' + color.g + ',' + color.b +'); ' +
							'stroke-width:' + penSize + ';' +
							'stroke-linecap:round;' +
							'stroke-opacity:' + color.a + ';' +
							'"' +
							' d="M ' +
                            (lastStich.x - this.minX) +
                            ' ' +
                            (this.maxY - lastStich.y) +
                            ' L ' +
                            (stitch.x - this.minX) +
                            ' ' +
                            (this.maxY -  stitch.y);
                    }
                    svgStr += ' L ' +
                        (stitch.x- this.minX) +
                        ' ' +
                        (this.maxY - stitch.y);
                    tagOpen = true;
                    colorChanged = false;
                    penSizeChanged = false;
                } else {
                    if (tagOpen) svgStr += '" />\n';
                    tagOpen = false;
                }
            }
            lastStich = stitch;
        }
    }
    if (tagOpen) svgStr += '" />\n';
    svgStr += '</svg>\n';
    return svgStr;
};


TurtleShepherd.prototype.toPNG = function() {
		var color = this.defaultColor;
		var hasFirst = false;
		var colorChanged = false;
		var cnv = document.createElement('canvas');
		cnv.width = Math.round(this.w);
		cnv.height = Math.round(this.h);
        ctx = cnv.getContext('2d');
		ctx.strokeStyle = "rgb(" + color.r + ","  + color.g + ","  + color.b + ")";
		ctx.lineWidth = 1.0;
		ctx.beginPath();

		for (var i=0; i < this.cache.length; i++) {
			if (this.cache[i].cmd == "color" && !this.ignoreColors) {
				if (hasFirst) {
					ctx.stroke();
					ctx.beginPath();
					colorChanged = true;
				}
				color = this.cache[i].color;
				ctx.strokeStyle = "rgb(" + color.r + ","  + color.g + ","  + color.b + ")";
			} else if (this.cache[i].cmd == "pensize") {
				if (hasFirst) {
					ctx.stroke();
					ctx.beginPath();
					colorChanged = true;
				}
				ctx.lineWidth = this.cache[i].pensize;
			} else if (this.cache[i].cmd == "move") {
				stitch = this.cache[i];
				if (stitch.penDown) {
					if (colorChanged) {
						ctx.moveTo(lastStitch.x - this.minX, this.maxY -  lastStitch.y);
						colorChanged = false;
					}
					ctx.lineTo( stitch.x - this.minX, this.maxY -  stitch.y);
					hasFirst = true;
				} else {
					ctx.moveTo(stitch.x - this.minX, this.maxY -  stitch.y);
					hasFirst = true;
					lastJumped = true;
				}
				lastStitch = stitch;
			}
		}
		ctx.stroke();

		console.log(cnv);
		return cnv.toDataURL();
}


TurtleShepherd.prototype.toEXP = function() {
    var expArr = [];
    pixels_per_millimeter = this.pixels_per_millimeter;
    scale = 10 / pixels_per_millimeter;
    lastStitch = null;
    hasFirst = false;
    weJustChangedColors = false;
    origin = {}

    function move(x, y) {
        y *= -1;
        if (x<0) x = x + 256;
        expArr.push(Math.round(x));
        if (y<0) y = y + 256;
        expArr.push(Math.round(y));
    }

    for (var i=0; i < this.cache.length; i++) {
        if (this.cache[i].cmd == "color" && !this.ignoreColors) {
            expArr.push(0x80);
            expArr.push(0x01);
            expArr.push(0x00);
            expArr.push(0x00);
            weJustChangedColors = true;
        } else if (this.cache[i].cmd == "move") {
            stitch = this.cache[i];
            if (!hasFirst) {
                origin.x = Math.round(stitch.x * scale);
                origin.y = Math.round(stitch.y * scale);
                
                // remove zero stitch - why is it here?
                //if (!stitch.penDown) {
                //  expArr.push(0x80);
                //  expArr.push(0x04);
                //}
                //move(0,0);         

                lastStitch = {cmd: "move", x: 0, y: -0, penDown: stitch.penDown}                
                hasFirst = true;
            } else if (hasFirst) {
                x1 = Math.round(stitch.x * scale)  - origin.x;
                y1 = -Math.round(stitch.y * scale)  - origin.y;
                x0 = Math.round(lastStitch.x * scale) - origin.x;
                y0 = -Math.round(lastStitch.y * scale) - origin.y;

                sum_x = 0;
                sum_y = 0;
                dmax = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
                dsteps = Math.abs(dmax / 127);

                // remove zero stitch - why is it here?
                //if (!lastStitch.penDown)
                //	move(0,0);

                if (weJustChangedColors) {                  
                  // remove zero stitch - why is it here?
                  //	if (!stitch.penDown) {
                  //               expArr.push(0x80);
                  //                expArr.push(0x04);
                  //            }
                  //	move(0,0);
                  weJustChangedColors = false;
                }

                if (dsteps <= 1) {
                    if (!stitch.penDown) {
                        expArr.push(0x80);
                        expArr.push(0x04);
                    }
                    move(Math.round(x1 - x0), Math.round(y1 - y0));
                } else {
                    for(j=0;j<dsteps;j++) {
                        if (!stitch.penDown) {
                            expArr.push(0x80);
                            expArr.push(0x04);
                        }
                        if (j < dsteps -1) {
                            move((x1 - x0)/dsteps, (y1 - y0)/dsteps);
                            sum_x += (x1 - x0)/dsteps;
                            sum_y += (y1 - y0)/dsteps;
                        } else {
                            move(Math.round((x1 - x0) - sum_x), Math.round((y1 - y0) - sum_y));
                        }
                    }
                }
            } 
            lastStitch = stitch;
            hasFirst = true;
        }
    }

    expUintArr = new Uint8Array(expArr.length);
    for (i=0;i<expArr.length;i++) {
        expUintArr[i] = Math.round(expArr[i]);
    }
    return expUintArr;
};


TurtleShepherd.prototype.toDST = function(name="noname") {
    var expArr = [];
    lastStitch = null;
    hasFirst = false;
    pixels_per_millimeter = this.pixels_per_millimeter;
    scale = 10 / pixels_per_millimeter;
	count_stitches = 0;
	count_jumps = 0;

    function encodeTajimaStitch(dx, dy, jump) {
        b1 = 0;
        b2 = 0;
        b3 = 0;

        if (dx > 40) {
                b3 |= 0x04;
                dx -= 81;
        }

        if (dx < -40) {
                b3 |= 0x08;
                dx += 81;
        }

        if (dy > 40) {
                b3 |= 0x20;
                dy -= 81;
        }

        if (dy < -40) {
                b3 |= 0x10;
                dy += 81;
        }

        if (dx > 13) {
                b2 |= 0x04;
                dx -= 27;
        }

        if (dx < -13) {
                b2 |= 0x08;
                dx += 27;
        }

        if (dy > 13) {
                b2 |= 0x20;
                dy -= 27;
        }

        if (dy < -13) {
                b2 |= 0x10;
                dy += 27;
        }

        if (dx > 4) {
                b1 |= 0x04;
                dx -= 9;
        }

        if (dx < -4) {
                b1 |= 0x08;
                dx += 9;
        }

        if (dy > 4) {
                b1 |= 0x20;
                dy -= 9;
        }

        if (dy < -4) {
                b1 |= 0x10;
                dy += 9;
        }

        if (dx > 1) {
                b2 |= 0x01;
                dx -= 3;
        }

        if (dx < -1) {
                b2 |= 0x02;
                dx += 3;
        }

        if (dy > 1) {
                b2 |= 0x80;
                dy -= 3;
        }

        if (dy < -1) {
                b2 |= 0x40;
                dy += 3;
        }

        if (dx > 0) {
                b1 |= 0x01;
                dx -= 1;
        }

        if (dx < 0) {
                b1 |= 0x02;
                dx += 1;
        }

        if (dy > 0) {
                b1 |= 0x80;
                dy -= 1;
        }

        if (dy < 0) {
                b1 |= 0x40;
                dy += 1;
        }

        expArr.push(b1);
        expArr.push(b2);
        if (jump) {
            expArr.push(b3 | 0x83);
        } else {
            expArr.push(b3 | 0x03);
        }
    }

    function writeHeader(str, length, padWithSpace=true) {
		for(var i = 0; i<length-1; i++) {
			if (i < str.length) {
				expArr.push("0xF1" + str[i].charCodeAt(0).toString(16));
			} else {
				if (padWithSpace) {
					expArr.push(0x20);
				} else {
					expArr.push(0x00);
				}
			}
		}
		expArr.push(0x0d);
	}

	function pad(n, width, z) {
		z = z || ' ';
		n = n != 0 ? n + '' : "0";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	var extx1 = Math.round(this.maxX) - this.initX;
	var exty1 = Math.round(this.maxY) - this.initY;
	var extx2 = Math.round(this.minX) - this.initX;
	var exty2 = Math.round(this.maxY) - this.initY;
	writeHeader("LA:" + name.substr(0, 16), 20, true);
	writeHeader("ST:" + pad(this.steps, 7), 11);
	writeHeader("CO:" + pad(this.colors.length, 3), 7);
	writeHeader("+X:" + pad(Math.round(extx1 / this.pixels_per_millimeter) * 10, 5), 9); // Math.round(this.getMetricWidth()*10), 9);
	writeHeader("-X:" + pad(Math.abs(Math.round(extx2 / this.pixels_per_millimeter)) * 10, 5), 9);
	writeHeader("+Y:" + pad(Math.round(exty1 / this.pixels_per_millimeter) * 10, 5), 9); //Math.round(this.getMetricHeight()*10), 9);
	writeHeader("-Y:" + pad(Math.abs(Math.round(exty2 / this.pixels_per_millimeter)) * 10, 5), 9);

	var needle_end_x = this.lastX - this.initX;
	var needle_end_y = this.lastY - this.initY;

	writeHeader("AX:" + pad(Math.round(needle_end_x / this.pixels_per_millimeter) * 10, 6), 10);
	writeHeader("AY:" + pad(Math.round(needle_end_y / this.pixels_per_millimeter) * 10, 6), 10);
	writeHeader("MX:", 10);
	writeHeader("MY:", 10);
	writeHeader("PD:", 10);

	// extented header would go here
	// "AU:%s\r" % author)
    // "CP:%s\r" % meta_copyright)
    // "TC:%s,%s,%s\r" % (thread.hex_color(), thread.description, thread.catalog_number))

	// end of header data
	expArr.push(0x1a);

    // Print remaining empty header
    for (var i=0; i<387; i++) {
        expArr.push(0x20);
    }

	origin = {}
	hasFirst = false;
	weJustChangedColors = false;

    for (i=0; i < this.cache.length; i++) {

        if (this.cache[i].cmd == "color"  && !this.ignoreColors) {
			expArr.push(0x00);
			expArr.push(0x00);
			expArr.push(0xC3);
			weJustChangedColors = true;
        } else if (this.cache[i].cmd == "move") {
            stitch = this.cache[i];

            if (!hasFirst) { //  create a stitch at origin
                origin.x = Math.round(stitch.x * scale);
                origin.y = Math.round(stitch.y * scale);
                
                // zero stitch: Why is it here
                encodeTajimaStitch(0, 0, !stitch.penDown);
                lastStitch = {cmd: "move", x: 0, y:0, penDown: stitch.penDown}
              hasFirst = true;
            } else {
                x1 = Math.round(stitch.x * scale) - origin.x;
                y1 = Math.round(stitch.y * scale) - origin.y;
                x0 = Math.round(lastStitch.x * scale) - origin.x;
                y0 = Math.round(lastStitch.y * scale) - origin.y;

                sum_x = 0;
                sum_y = 0;
                dmax = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
                dsteps = Math.abs(dmax / 121);

                if (!lastStitch.penDown)
                  // zero stitch: Why is it here
                  encodeTajimaStitch(0,0, false);

                if (weJustChangedColors) {
                  // zero stitch: Why is it here
                  encodeTajimaStitch(0, 0, !stitch.penDown);
                  weJustChangedColors = false;
                }

                if (dsteps <= 1) {
                    encodeTajimaStitch((x1 - x0), (y1 - y0), !stitch.penDown);
                    count_stitches++;
                } else {
                    for(j=0;j<dsteps;j++) {
                        if (j < dsteps -1) {
                            encodeTajimaStitch(
                                Math.round((x1 - x0)/dsteps),
                                Math.round((y1 - y0)/dsteps),
                                !stitch.penDown
                            );
                            count_stitches++;
                            sum_x += (x1 - x0)/dsteps;
                            sum_y += (y1 - y0)/dsteps;
                        } else {
                            encodeTajimaStitch(
                                Math.round((x1 - x0) - sum_x),
                                Math.round((y1 - y0) - sum_y),
                                !stitch.penDown
                            );
                            count_stitches++;
                        }
                    }
                }
            }
            lastStitch = stitch;
            hasFirst = true;
        }
    }

	// end pattern
    expArr.push(0x00);
    expArr.push(0x00);
    expArr.push(0xF3);

	// convert
    expUintArr = new Uint8Array(expArr.length);
    for (i=0;i<expArr.length;i++) {
        expUintArr[i] = Math.round(expArr[i]);
    }
    return expUintArr;
};

TurtleShepherd.prototype.toPES = function(name="noname") {
    var expArr = [];

    function writeString(str, length=null, padWithSpace=true) {
        if(length === null) {
            length = str.length;
        }
		for(var i = 0; i<length; i++) {
			if (i < str.length) {
				expArr.push(str[i].charCodeAt(0));
			} else {
				if (padWithSpace) {
					expArr.push(0x20);
				} else {
					expArr.push(0x00);
				}
			}
		}
	}

    function writeInt16Le(value) {
        expArr.push((value >> 0) & 0xFF);
        expArr.push((value >> 8) & 0xFF);
    }

    function writeInt24Le(value) {
        expArr.push((value >> 0) & 0xFF);
        expArr.push((value >> 8) & 0xFF);
        expArr.push((value >> 16) & 0xFF);
    }

    function writeInt32Le(value) {
        expArr.push((value >> 0) & 0xFF);
        expArr.push((value >> 8) & 0xFF);
        expArr.push((value >> 16) & 0xFF);
        expArr.push((value >> 24) & 0xFF);
    }

    function updateInt24Le(value, pos) {
        expArr[pos] = (value >> 0) & 0xFF;
        expArr[pos+1] = (value >> 8) & 0xFF;
        expArr[pos+2] = (value >> 16) & 0xFF;
    }

    // identification and version
	writeString("#PES0001");
	
	// remaining PES v1 header section
	writeInt32Le(0x16); // location of PEC block
	
	writeInt16Le(0);
	writeInt16Le(0);
	writeInt16Le(0);
	expArr.push(0xFF, 0xFF, 0, 0); // end of the header
	// from here on, it's all PEC

	// PEC header
	const iconWidth = 48;
	const iconWidthBytes = iconWidth/8; // icon width in bytes: icon width in pixels divided by 8 pixels per byte
	const iconHeight = 38; // icon height (in pixels)
	writeString("LA:" + name.substr(0, 8), 19, true); // 20 bytes name, typically truncated at 8 chars, padded with spaces
	expArr.push(0x0D); // carriage return
	writeString("", 12, true);
	expArr.push(0xFF, 0x00);
	expArr.push(iconWidthBytes); 
	expArr.push(iconHeight);
	writeString("", 12, true);
    // number of thread colors minus one, 0xFF means 0 colors;
    // assume thread color and therefore write value 0 here
    expArr.push(0);
    // color index of that one thread color    
    expArr.push(1);
    // fill the remaining space reserved for colors
	writeString("", 462, true);

    // PEC block
    stitchBlockStartPos = expArr.length;
    expArr.push(0, 0);
    stitchBlockLenPos = expArr.length; // recall byte position where we place the spaceholder
    writeInt24Le(0); // spaceholder for stitch block length
    expArr.push(0x31, 0xFF, 0xF0);
    width = 1000; // FIXME (is this in multiple of 0.1mm?)
    height = 1000; // FIXME (is this in multiple of 0.1mm?)
    writeInt16Le(width);
    writeInt16Le(height);
    writeInt16Le(0x1E0);
    writeInt16Le(0x1B0);

    // Perform actual encoding of PEC stitch list subsection
    lastStitch = null;
    hasFirst = false;
    scale = this.scale;
    // TODO: implement proper functionality
	for (var i=0; i < this.cache.length; i++) {
		if (this.cache[i].cmd == "color") {
		} else if (this.cache[i].cmd == "move") {
            stitch = this.cache[i];
            if (!hasFirst) {
                x0 = Math.round(stitch.x * scale);
                y0 = -Math.round(stitch.y * scale);

                dx = x0;
                dy = y0;
                lastStitch = {cmd: "move", x: x0, y: y0, penDown: stitch.penDown}             
                hasFirst = true;
            } else if (hasFirst) {
                x1 = Math.round(stitch.x * scale);
                y1 = -Math.round(stitch.y * scale);
                x0 = Math.round(lastStitch.x * scale);
                y0 = -Math.round(lastStitch.y * scale);

                dx = x1 - x0
                dy = y1 - y0
            }
            
            // check whether to encode in short or long form;
            // jump and trim stitches are probably not handled correctly at the moment (FIXME!)
            dmax = Math.max(Math.abs(dx), Math.abs(dy));

            if(stitch.penDown && dmax < 127) {
                // short form (1 byte) indicated by MSBit=0; 7 bit for delta
                expArr.push(dx & 0x7F, dy & 0x7F);
                
            } else if(dmax < 2047) {
                // long form (2 bytes) indicated by MSBit=1; 12 bit for delta
                let msBits = 0x80;
                //if(!stitch.penDown) {
                //    msBits |= 0x10; // make it a jump stitch (FIXME: doesn't work as expected)
                //}
                expArr.push(msBits | ((dx >> 8) & 0x0F));
                expArr.push(dx & 0xFF);
                expArr.push(msBits | ((dy >> 8) & 0x0F));
                expArr.push(dy & 0xFF);
            } else {
            
                // TODO: cannot encode; break this down into multiple stitches?!
                //       are there other ways of communicating errors to the user?
                console.log("PES/PEC export: cannot encode stitch!");
            }

            lastStitch = stitch;
		}
	}
    // Mockery with dx and dy coordinates (in short form)
    // delta of 0x0A represents 10 units of 0.1 mm each, i.e. 1 mm
    // delta of 0x76 represents -10 units (MSBit 0; then 7 bit two's complement) of 0.1 mm each, i.e. 1 mm
    /*
    for (var i=0; i<20; i++) {
        expArr.push(0x0A, 0x0A); // go diagonally
    }
    for (var i=0; i<20; i++) {
        expArr.push(0x0A, 0x00); // go x only
    }
    for (var i=0; i<20; i++) {
        expArr.push(0x00, 0x0A); // go y only
    }
    for (var i=0; i<20; i++) {
        expArr.push(0x76, 0x00); // go -x only
    }
    for (var i=0; i<20; i++) {
        expArr.push(0x00, 0x76); // go -y only
    }
    */
    expArr.push(0xFF); // file end

    // calculate stitch block length value and update in the binary data
    stitchBlockLen = expArr.length - stitchBlockStartPos;
    updateInt24Le(stitchBlockLen, stitchBlockLenPos);

    // PEC thumbnail images for every color (use chessboard alike pattern for now)
    patternByte = 0xAA;
    for (i=0;i<iconWidthBytes*iconHeight*2;i++) {
        if(i % 6 == 0) {
            // swap pattern bytes
            patternByte = (patternByte == 0xAA) ? 0x55 : 0xAA;
        }
        expArr.push(patternByte);
    }

    expUintArr = new Uint8Array(expArr.length);
    for (i=0;i<expArr.length;i++) {
        expUintArr[i] = expArr[i];
    }
    return expUintArr;
}

TurtleShepherd.prototype.getStitchesAsArr = function () {
  stitches = [];
  lastX = 0; lastY = 0;
  hasFirst = false;
  color = this.defaultColor;
  for(i=0;i<this.cache.length;i++) {
    if (this.cache[i].cmd == "color") {
      color = this.cache[i].color;
    }
    if (this.cache[i].cmd == "move") {
        if (!hasFirst) {
          lastY = this.cache[i].y;
          lastX = this.cache[i].x;
          hasFirst = true;
        } else {
          stitches.push( [
            [lastX, lastY],
            [this.cache[i].x, this.cache[i].y ],
            color
          ]);
          lastY = this.cache[i].y;
          lastX = this.cache[i].x;
        }
    }
  }
  return stitches;
}

TurtleShepherd.prototype.debug_msg = function (st, clear) {
	o = "";
	if (!clear) {
		o = document.getElementById("debug").innerHTML;
	} else {
		o = "";
	}
	o = st + "<br />" + o;
	document.getElementById("debug").innerHTML = o;
};

TurtleShepherd.prototype.toDXF = function() {
  var dxfString = '',
      isFirst = false,
      myself = this,
      i,
      stitch,
      lastStitch;
  
  function dxfHead(maxX=1000,maxY=1000) {
		dxfString += '  0\nSECTION\n  2\nHEADER\n  9\n$ACADVER\n  1\nAC1009\n  9\n$EXTMIN\n 10\n0.0\n 20\n0.0\n 30\n0.0\n  9\n$EXTMAX\n';	
		dxfString += ' 10\n';
		dxfString += maxX.toFixed(1).toString();
		dxfString += '\n 20\n';
		dxfString += maxY.toFixed(1).toString();
		dxfString += '\n 30\n0.0\n  9\n$FILLMODE\n 70\n 0\n  9\n$SPLFRAME\n 70\n 1\n  0\nENDSEC\n';
		dxfString += '  0\nSECTION\n  2\nTABLES\n  0\nTABLE\n  2\nLAYER\n 70\n1\n  0\nLAYER\n  2\n0\n 70\n     0\n 62\n     7\n  6\nCONTINUOUS\n  0\nENDTAB\n  0\nENDSEC\n';
		dxfString += '  0\nSECTION\n  2\nENTITIES\n';
  }
	
  function dxfLine(start,end) {
		dxfString += '  0\nLINE\n  8\n0\n  62\n     150\n';
		dxfString += ' 10\n';
		dxfString += ((start.x - myself.minX)*0.2).toFixed(3).toString();
		dxfString += '\n 20\n';
		dxfString += ((start.y - myself.minY)*0.2).toFixed(3).toString(); 
		dxfString += '\n 30\n0.0\n 11\n';
		dxfString += ((end.x - myself.minX)*0.2).toFixed(3).toString();
		dxfString += '\n 21\n';
		dxfString += ((end.y - myself.minY)*0.2).toFixed(3).toString(); 
		dxfString += '\n 31\n0.0\n';		
  }
	
  function dxfEnd() {
		dxfString += '  0\nENDSEC\n  0\nEOF\n';
  }
	
  dxfHead((this.maxX-this.minX)*0.4 > 1000 ? (this.maxX-this.minX)*0.4 : 1000,(this.maxY-this.minY)*0.4 > 1000 ? (this.maxY-this.minY)*0.4 : 1000);
  for (i=0; i < this.cache.length; i++) {	
  	if (this.cache[i].cmd == "move") {
  	  stitch = this.cache[i];
  	  if (!isFirst) {
              isFirst = true;
  	  } else {
  	      if (stitch.penDown && (stitch.x != lastStitch.x || stitch.y != lastStitch.y)) {
  	          dxfLine(lastStitch,stitch);
  	      }
          }
          lastStitch = stitch;
  	}
  }
  dxfEnd();
  return dxfString;
};
