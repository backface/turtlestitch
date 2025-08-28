/*

cache =
 [
     {  "cmd":"move", "x":x1, "y":y1, "penDown":penState }
     {  "cmd":"color", "color": color, "thread": colorIndex }
     {  "cmd":"pensize", "pensize": pensize }
 ]
colors = 
 [
     {r:0,g:0,b:0,a:1};
 ]

  blob = new Blob([expUintArr], {type: 'application/octet-stream'});
  saveAs(blob, name + '.dst');

 */


exportToDST = function(
    name = "noname",
    cache = [], // array of command (see above)
    initX = 0, // initial x postion (normally 0 )
    initY = 0, // initial y postion (normally 0 )
    lastX = 0, // last position x
    lastY = 0, // last position y
    minX = 0, // minmal x position (boudning box)
    maxX = 0, // maximum x position (boudning box)
    minY = 0, // minmal y position (boudning box)
    maxY = 0, // maximum y position (boudning box)
    steps = 0, // total number of steps
    colors = [], // array of colors
    ignoreColors = true, // if true, ignore colors
    pixels_per_millimeter = 5
) {
    /* 
    exports cache to DST embroidery format
    returns UintArray suitable for Blob 
    */

    var expArr = [];
    lastStitch = null;
    hasFirst = false;
    // pixels_per_millimeter = 5; //this.pixels_per_millimeter;
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

    function writeHeader(str, length, padWithSpace = true) {
        for (var i = 0; i < length - 1; i++) {
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

    var extx1 = Math.round(maxX) - initX;
    var exty1 = Math.round(maxY) - initY;
    var extx2 = Math.round(minX) - initX;
    var exty2 = Math.round(minY) - initY;

    writeHeader("LA:" + name.substr(0, 16), 20, true);
    writeHeader("ST:" + pad(steps, 7), 11);
    writeHeader("CO:" + pad(colors.length, 3), 7);
    writeHeader("+X:" + pad(Math.round(extx1 / pixels_per_millimeter) * 10, 5), 9); // Math.round(this.getMetricWidth()*10), 9);
    writeHeader("-X:" + pad(Math.abs(Math.round(extx2 / pixels_per_millimeter)) * 10, 5), 9);
    writeHeader("+Y:" + pad(Math.round(exty1 / pixels_per_millimeter) * 10, 5), 9); //Math.round(this.getMetricHeight()*10), 9);
    writeHeader("-Y:" + pad(Math.abs(Math.round(exty2 / pixels_per_millimeter)) * 10, 5), 9);

    var needle_end_x = lastX - initX;
    var needle_end_y = lastY - initY;

    writeHeader("AX:" + pad(Math.round(needle_end_x / pixels_per_millimeter) * 10, 6), 10);
    writeHeader("AY:" + pad(Math.round(needle_end_y / pixels_per_millimeter) * 10, 6), 10);
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
    for (var i = 0; i < 387; i++) {
        expArr.push(0x20);
    }

    origin = {}
    hasFirst = false;
    weJustChangedColors = false;

    for (i = 0; i < cache.length; i++) {
        if (cache[i].cmd == "color" && !ignoreColors) {
            expArr.push(0x00);
            expArr.push(0x00);
            expArr.push(0xC3);
            weJustChangedColors = true;
        } else if (cache[i].cmd == "move") {

            stitch = cache[i];

            if (!hasFirst) { //  create a stitch at origin
                origin.x = Math.round(stitch.x * scale);
                origin.y = Math.round(stitch.y * scale);

                // zero stitch: Why is it here
                encodeTajimaStitch(0, 0, !stitch.penDown);
                lastStitch = {
                    cmd: "move",
                    x: 0,
                    y: 0,
                    penDown: stitch.penDown
                }
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
                    encodeTajimaStitch(0, 0, false);

                if (weJustChangedColors) {
                    // zero stitch: Why is it here
                    encodeTajimaStitch(0, 0, !stitch.penDown);
                    weJustChangedColors = false;
                }

                if (dsteps <= 1) {
                    encodeTajimaStitch((x1 - x0), (y1 - y0), !stitch.penDown);
                    count_stitches++;
                } else {
                    for (j = 0; j < dsteps; j++) {
                        if (j < dsteps - 1) {
                            encodeTajimaStitch(
                                Math.round((x1 - x0) / dsteps),
                                Math.round((y1 - y0) / dsteps), !stitch.penDown
                            );
                            count_stitches++;
                            sum_x += (x1 - x0) / dsteps;
                            sum_y += (y1 - y0) / dsteps;
                        } else {
                            encodeTajimaStitch(
                                Math.round((x1 - x0) - sum_x),
                                Math.round((y1 - y0) - sum_y), !stitch.penDown
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
    for (i = 0; i < expArr.length; i++) {
        expUintArr[i] = Math.round(expArr[i]);
    }
    return expUintArr;
}



exportToEXP = function(cache, pixels_per_millimeter = 5) {
    /* 
    exports cache to DST embroidery format
    returns UintArray suitable for Blob 
    */

    var expArr = [];
    //pixels_per_millimeter = 5; //this.pixels_per_millimeter;
    scale = 10 / pixels_per_millimeter;
    lastStitch = null;
    hasFirst = false;
    weJustChangedColors = false;
    origin = {}

    function move(x, y) {
        y *= -1;
        if (x < 0) x = x + 256;
        expArr.push(Math.round(x));
        if (y < 0) y = y + 256;
        expArr.push(Math.round(y));
    }

    for (var i = 0; i < cache.length; i++) {

        if (cache[i].cmd == "color" && !ignoreColors) {
            expArr.push(0x80);
            expArr.push(0x01);
            expArr.push(0x00);
            expArr.push(0x00);
            weJustChangedColors = true;

        } else if (cache[i].cmd == "move") {

            stitch = cache[i];

            if (!hasFirst) {
                origin.x = Math.round(stitch.x * scale);
                origin.y = Math.round(stitch.y * scale);

                // remove zero stitch - why is it here?
                //if (!stitch.penDown) {
                //  expArr.push(0x80);
                //  expArr.push(0x04);
                //}
                //move(0,0);         

                lastStitch = {
                    cmd: "move",
                    x: 0,
                    y: -0,
                    penDown: stitch.penDown
                }
                hasFirst = true;

            } else if (hasFirst) {
                x1 = Math.round(stitch.x * scale) - origin.x;
                y1 = -Math.round(stitch.y * scale) - origin.y;
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
                    for (j = 0; j < dsteps; j++) {
                        if (!stitch.penDown) {
                            expArr.push(0x80);
                            expArr.push(0x04);
                        }
                        if (j < dsteps - 1) {
                            move((x1 - x0) / dsteps, (y1 - y0) / dsteps);
                            sum_x += (x1 - x0) / dsteps;
                            sum_y += (y1 - y0) / dsteps;
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
    for (i = 0; i < expArr.length; i++) {
        expUintArr[i] = Math.round(expArr[i]);
    }
    return expUintArr;
};



exportToSVG = function(
      cache = [], // array of command (see above)
      initX = 0, // initial x postion (normally 0 )
      initY = 0, // initial y postion (normally 0 )
      minX = 0, // minmal x position (boudning box)
      maxX = 0, // maximum x position (boudning box)
      minY = 0, // minmal y position (boudning box)
      maxY = 0, // maximum y position (boudning box)
      backgroundColor = {r: 255, g:255, b:255, a:1};
    ) {
    var w = maxX - minX;
    var h = maxY - minY;    
    var defaultColor = {r:0,g:0,b:0,a:1};
    
    var svgStr = "<?xml version=\"1.0\" standalone=\"no\"?>\n";
    svgStr += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \n\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";
    svgStr += '<svg width="' + (w) + '" height="' + (h) + '"' +
        ' viewBox="0 0 ' + (w) + ' ' + (h) + '" style="background-color: rgb('+ backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b +  '); ' + + '"';
    svgStr += ' xmlns="http://www.w3.org/2000/svg" version="1.1">\n';
    svgStr += '<title>Embroidery export</title>\n';

    hasFirst = false;
    tagOpen = false;
    colorChanged = false;
    penSizeChanged = false;
    penSize = 1;
    lastStitch = null;
    color = defaultColor;

    for (var i=0; i < cache.length; i++) {
        if (cache[i].cmd == "color" && !this.ignoreColors) {
    			color = cache[i].color;
    			if (hasFirst) colorChanged = true;
    			if (tagOpen) svgStr += '" />\n';
    			tagOpen = false;
        } else if (cache[i].cmd == "pensize") {
			penSize = cache[i].pensize;
			if (hasFirst) penSizeChanged = true;
			if (tagOpen) svgStr += '" />\n';
			tagOpen = false;
        } else if (cache[i].cmd == "move") {
            stitch = cache[i];
            if (!hasFirst) {
                if (stitch.penDown) {
                    svgStr += '<path fill="none" style="' +
						'stroke:rgb('+ color.r + ',' + color.g + ',' + color.b +  '); ' +
						'stroke-width:' + penSize + ';' +
						'stroke-linecap:round;' +
						'stroke-opacity:' + color.a + ';' +
						'"' +
                        ' d="M ' +
						   (initX- minX) +
                           ' ' +
                           (maxY - initY) ;
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
                            (lastStich.x - minX) +
                            ' ' +
                            (maxY - lastStich.y) +
                            ' L ' +
                            (stitch.x - minX) +
                            ' ' +
                            (maxY -  stitch.y);
                    }
                    svgStr += ' L ' +
                        (stitch.x- minX) +
                        ' ' +
                        (maxY - stitch.y);
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


exportToPNG = function(
      cache = [], // array of command (see above)
      initX = 0, // initial x postion (normally 0 )
      initY = 0, // initial y postion (normally 0 )
      minX = 0, // minmal x position (boudning box)
      maxX = 0, // maximum x position (boudning box)
      minY = 0, // minmal y position (boudning box)
      maxY = 0, // maximum y position (boudning box)
    ) {
    var w = maxX - minX;
    var h = maxY - minY;      
		var color = this.defaultColor;
		var hasFirst = false;
		var colorChanged = false;
		var cnv = document.createElement('canvas');
		cnv.width = Math.round(w);
		cnv.height = Math.round(h);
        ctx = cnv.getContext('2d');
		ctx.strokeStyle = "rgb(" + color.r + ","  + color.g + ","  + color.b + ")";
		ctx.lineWidth = 1.0;
		ctx.beginPath();

		for (var i=0; i < cache.length; i++) {
			if (cache[i].cmd == "color" && !this.ignoreColors) {
				if (hasFirst) {
					ctx.stroke();
					ctx.beginPath();
					colorChanged = true;
				}
				color = cache[i].color;
				ctx.strokeStyle = "rgb(" + color.r + ","  + color.g + ","  + color.b + ")";
			} else if (cache[i].cmd == "pensize") {
				if (hasFirst) {
					ctx.stroke();
					ctx.beginPath();
					colorChanged = true;
				}
				ctx.lineWidth = cache[i].pensize;
			} else if (cache[i].cmd == "move") {
				stitch = cache[i];
				if (stitch.penDown) {
					if (colorChanged) {
						ctx.moveTo(lastStitch.x - minX, maxY -  lastStitch.y);
						colorChanged = false;
					}
					ctx.lineTo( stitch.x - minX, maxY -  stitch.y);
					hasFirst = true;
				} else {
					ctx.moveTo(stitch.x - minX, maxY -  stitch.y);
					hasFirst = true;
					lastJumped = true;
				}
				lastStitch = stitch;
			}
		}
		ctx.stroke();

		console.log(cnv);
		return cnv.toDataURL();
