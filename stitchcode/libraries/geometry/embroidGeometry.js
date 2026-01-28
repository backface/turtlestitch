function EmbroidGeometry(stage) {
    this.init(stage);    
};

EmbroidGeometry.prototype.init = function (stage) {
	this.stage = stage;
    this.atomLines = [];
    this.strokes = [];
    this.buffer = [];
	this.initX = 0;
	this.initY = 0;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.steps = 0;
    this.stitchCount = 0;
    this.jumpCount = 0;	
	this.colorCount = 0;
};

EmbroidGeometry.prototype.addAtomLine = function (x1,y1,x2,y2) {
	  var line = new EmbroidLine(x1,y1,x2,y2);
    this.atomLines.push(line);   
};

EmbroidGeometry.prototype.lengthOfLine = function(line) {
    if (line.length() < 2) {
    	  return 0;
    } else {
        return Math.sqrt( Math.pow(line.at(1).at(1)-line.at(2).at(1),2) + 
          								Math.pow(line.at(1).at(2)-line.at(2).at(2),2));
    }
};

EmbroidGeometry.prototype.mathMod = function (a, b) {
  return ((a % b) + b) % b;
};

EmbroidGeometry.prototype.convertAngle = function (dir) {
  return this.mathMod(90-dir+360,360);
};

EmbroidGeometry.prototype.headingOfLine = function(line) {
    var relativeX, relativeY, angle;
    
    relativeX = line.at(2).at(1) - line.at(1).at(1);
    relativeY = line.at(2).at(2) - line.at(1).at(2);	
    
    if (relativeX == 0 && relativeY == 0) {
        return 90;
    }
    
    if (relativeX == 0) {
        if (relativeY > 0) {
            return 90;
        } else {
            return 270;
        }
    }
    
    angle = (Math.atan(relativeY/relativeX)/Math.PI)*180;
    if (angle > 0) {
        if (relativeX > 0) {
            return angle;
        } else {
            return 180 + angle;
        }
    } else {
        if (relativeX < 0) {
            return 180 + angle;
        } else {
            return (360 + angle) % 360;
        }    	
    }
};

EmbroidGeometry.prototype.hasCrossPoint = function(line1,line2, noParallel = false) {
    var angle1,angle2,point,direction;
    
    point = line1.at(1);
    angle1 = this.headingOfLine(new List([point,line2.at(1)]));
    angle2 = this.headingOfLine(new List([point,line2.at(2)]));
    direction = this.headingOfLine(line1);
    
    if (noParallel) {
    	  if ((angle1+360) % 360 == (angle2+360) % 360) {
    	  	  return false;
    	  }
    }
        
    if (angle1 > angle2) {
        if ( (angle1-angle2 < 180) && ( (direction > angle1) || (direction < angle2))) {
            return false;
        }
        if ( (angle1-angle2 > 180) &&  (direction < angle1) && (direction > angle2)) {
            return false;
        }        
    } else {
        if ( (angle2-angle1 < 180) && ( (direction > angle2) || (direction < angle1))) {
            return false;
        }
        if ( (angle2-angle1 > 180) &&  (direction < angle2) && (direction > angle1)) {
            return false;
        }          	
    }
    return true;
};

EmbroidGeometry.prototype.side = function(point,line) {
    var diff = Math.round( (this.headingOfLine(line) - this.headingOfLine(new List([line.at(1),point]))) * 1000) / 1000;
    
    if ((diff > 0 && diff < 180) || ( diff < -180 && diff > -360)) {
        return 1;
    } else {
        if ((diff < 0 && diff > -180) || ( diff > 180 && diff < 360)) {
            return -1;
        }  else {
            return 0;
        }
    }	
};

EmbroidGeometry.prototype.crossPoint = function(line1,line2,check=true,noParallel=false) {
    var angle1,angle2,angle3,angle4,
        includedAngle1,includedAngle2,includedAngle3,
        edgeLength,vDistance,distance,hypotenuse,
        point,resultPoint;
        
    if (check && !this.hasCrossPoint(line1,line2,noParallel)) {
        return new List();
    }
    
    point = line1.at(1);
    angle1 = this.headingOfLine(line2);    
    angle2 = this.headingOfLine(new List([line2.at(1),point]));
    angle3 = this.headingOfLine(new List([point,line2.at(1)]));
    angle4 = this.headingOfLine(new List([point,line1.at(2)]));
    
    includedAngle1 = Math.abs(angle2-angle1);
    includedAngle2 = Math.abs(angle3-angle4);
    includedAngle1 = includedAngle1 > 180? 360 - includedAngle1 : includedAngle1;
    includedAngle2 = includedAngle2 > 180? 360 - includedAngle2 : includedAngle2;
    includedAngle3 = 180 - (includedAngle1 + includedAngle2);
    
    edgeLength = Math.sqrt(Math.pow(point.at(2)-line2.at(1).at(2),2) +
                           Math.pow(point.at(1)-line2.at(1).at(1),2));
    vDistance = edgeLength * Math.sin(includedAngle1*Math.PI/180);
    distance = Math.abs(vDistance/Math.cos((90-includedAngle3)*Math.PI/180));
    hypotenuse = Math.sqrt( Math.pow(distance,2) + Math.pow(edgeLength,2) - 2*edgeLength*distance*Math.cos(includedAngle2*Math.PI/180));
    
    resultPoint = new List([Math.round((line2.at(1).at(1)*1 + hypotenuse*Math.cos(angle1*Math.PI/180))*10000)/10000,
                            Math.round((line2.at(1).at(2)*1 + hypotenuse*Math.sin(angle1*Math.PI/180))*10000)/10000]);
                            
    return resultPoint;
};

EmbroidGeometry.prototype.lineContainsPoint = function(line,point) {
    return Math.round(this.lengthOfLine(line)*10000) == Math.round((this.lengthOfLine(new List([line.at(1),point])) + this.lengthOfLine(new List([line.at(2),point])))*10000);
};

EmbroidGeometry.prototype.lineContainsLine = function(line1,line2) {
    return this.lineContainsPoint(line1,line2.at(1)) && this.lineContainsPoint(line1,line2.at(2));
};

EmbroidGeometry.prototype.extentOfLines = function (lines) {
	points = [];
	xy = [];
	arrLines = lines.asArray();
	arrLines.forEach( line => {
		line.at(2).asArray().forEach( point => {
			points.push(point.asArray());
		});
	});
	points.sort((a,b) => a[0] - b[0]);
	xy.push(points[0][0]);
	xy.push(points[points.length-1][0]);
	points.sort((a,b) => a[1] - b[1]);
	xy.push(points[0][1]);
	xy.push(points[points.length-1][1]);
	return new List(xy);
};

EmbroidGeometry.prototype.edgeCuttingLines = function (lines,direction) {
	xy = this.extentOfLines(lines);
	minX = xy.at(1);
	maxX = xy.at(2);
	minY = xy.at(3);
	maxY = xy.at(4);
	if (direction == 90) {
		return new List([new List([new List([minX,minY]), new List([minX,maxY])]),
						 new List([new List([maxX,minY]), new List([maxX,maxY])])]);
	};	
	points = [];
	arrLines = lines.asArray();
	arrLines.forEach( line => {
		line.at(2).asArray().forEach( point => {
			points.push(point.asArray());
		});
	});
	const seen = new Set();
	const uniquePoints = points.filter(point => {
	  const key = `${point[0]},${point[1]}`;
	  if (seen.has(key)) {
		return false;
	  }
	  seen.add(key);
	  return true;
	});	
	const tanDirection = Math.tan(direction * Math.PI / 180);
	transformedPoints = uniquePoints.map(([x, y]) => {
	  const newX = (minX - x) * tanDirection + y;
	  const newY = (maxX - x) * tanDirection + y;
	  return [newX, newY];
	});	
	transformedPoints.sort((a,b) => a[0] - b[0]);
	return new List([new List([new List([minX,transformedPoints[0][0]]), new List([maxX,transformedPoints[0][1]])]),
					 new List([new List([minX,transformedPoints[transformedPoints.length-1][0]]), new List([maxX,transformedPoints[transformedPoints.length-1][1]])])]);	
};

EmbroidGeometry.prototype.getSvgCommand = function (svgstr) {
	const regex = /([a-zA-Z])([^a-zA-Z]*)/g;
	let cmdList = new List([]);
	let match;
	while ((match = regex.exec(svgstr)) !== null) {
		cmdList.add(new List([match[1],new List(match[2].trim().split(/[ ,]+/))]));
	}
	return cmdList;
};

EmbroidGeometry.prototype.bezierCurvePoints = function (p1,p2,p3,number) {
	let nb = number;
	if (nb < 5) { nb = 5; }
	if (nb > 60) { nb = 60; }
	const gap = 1/(nb -1);
	let t = gap;
	const [x1,y1] = p1.asArray();
	const [x2,y2] = p2.asArray();
	const [x3,y3] = p3.asArray();
	let points = [p1.asArray()];
	while ( t <= 1+gap/2 ) {
		let x = x1*(1-t)**2 + x2*2*t*(1-t) + x3*t**2;
		let y = y1*(1-t)**2 + y2*2*t*(1-t) + y3*t**2;
		points.push([Math.round(x*1000)/1000,Math.round(y*1000)/1000]);
		t += gap;
	};
	return points;
};

EmbroidGeometry.prototype.cubicBezierCurvePoints = function (p1, p2, p3, p4, number) {
    let nb = number;
    if (nb < 5) { nb = 5; }
    if (nb > 60) { nb = 60; }
    
    const gap = 1 / (nb - 1);
    let t = gap;
    
    const [x1, y1] = p1.asArray();
    const [x2, y2] = p2.asArray();
    const [x3, y3] = p3.asArray();
    const [x4, y4] = p4.asArray();
    
    let points = [p1.asArray()];
    
    // B(t) = (1-t)^3 * P1 + 3*(1-t)^2*t * P2 + 3*(1-t)*t^2 * P3 + t^3 * P4
    while (t <= 1 + gap / 2) {
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
		
        let x = mt3 * x1 + 3 * mt2 * t * x2 + 3 * mt * t2 * x3 + t3 * x4;
        let y = mt3 * y1 + 3 * mt2 * t * y2 + 3 * mt * t2 * y3 + t3 * y4;
        
        points.push([Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);
        t += gap;
    }
    
    return points;
};

EmbroidGeometry.prototype.smoothCubicBezierCurvePoints = function (p1, p2, p3, previousCp, number) {
    // 如果前一个曲线是贝塞尔曲线，第一个控制点是前一个控制点关于起点的对称点
    const [x1, y1] = p1.asArray();
    const [prevX, prevY] = previousCp.asArray();
    
    // 计算对称控制点：cp1 = p1 + (p1 - previousCp)
    const cp1x = 2 * x1 - prevX;
    const cp1y = 2 * y1 - prevY;

    const cp1 = new List([cp1x, cp1y]);
    
    return this.cubicBezierCurvePoints(p1, cp1, p2, p3, number);
};

EmbroidGeometry.prototype.pointsToVector = function (pointsList) {
	let points = pointsList.asArray();
	let vector = [];
	let lastPoint,lastDir,thisDir;
	
	if ( points.length < 2 ) {
		return [];
	}
	if ( points[0] == '!' ) {
		lastDir = this.headingOfLine(new List([new List([0,0]),points[1]]));
		vector.push('!');
		vector.push([-lastDir,this.lengthOfLine(new List([new List([0,0]),points[1]]))]);
	} else {
		lastDir = this.headingOfLine(new List([points[0],points[1]]));
		vector.push([-lastDir,this.lengthOfLine(new List([points[0],points[1]]))]);
	};
	lastPoint = points[1];
	if ( points.length > 2 ) {
		for ( i = 2; i < points.length; i++ ) {
			if (points[i] == "!"){
				vector.push("!");
			} else {
				thisDir = this.headingOfLine(new List([lastPoint,points[i]]));
				vector.push([this.convertAngle(this.convertAngle(lastDir-thisDir)),this.lengthOfLine(new List([lastPoint,points[i]]))]);
				lastPoint = points[i];
				lastDir = thisDir;
			}
		}
	}
	let result = vector.map(item => {
		if (item == "!") {
			return "!";
		} else {
			return item.map( c => Math.round(c*100000)/100000 );
		}
	});
	return result;
};

function EmbroidPoint(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

EmbroidPoint.prototype.fromList = function (point) {
    this.x = point.at(1);
    this.y = point.at(2);	  
};

EmbroidPoint.prototype.toList = function () {
	  return new List([this.x, this.y]);
};

function EmbroidLine(x1, y1, x2, y2) {
	  this.start = new EmbroidPoint(x1||0,y1||0);
	  this.end = new EmbroidPoint(x2||0,y2||0);
};

EmbroidLine.prototype.fromList = function (line) {
	  this.start = new EmbroidPoint().fromList(line.at(1));
	  this.end = new EmbroidPoint().fromList(line.at(2));
};

EmbroidLine.prototype.toList = function () {
	  return new List([this.start.toList(), this.end.toList()]);
};

EmbroidLine.prototype.compose = function (startPoint, endPoint) {
    this.start.x = startPoint.x;
    this.start.y = startPoint.y;
    this.end.x = endPoint.x;
    this.end.y = endPoint.y;	
    return this;
};

EmbroidLine.prototype.heading = function () {
    var relativeX, relativeY, angle;
    
    relativeX = this.end.x - this.start.x;
    relativeY = this.end.y - this.start.y;
    
    if (relativeX == 0 && relativeY == 0) {
        return 90;
    }
    
    if (relativeX == 0) {
        if (relativeY > 0) {
            return 90;
        } else {
            return 270;
        }
    }
    
    angle = (Math.atan(relativeY/relativeX)/Math.PI)*180;
    if (angle > 0) {
        if (relativeX > 0) {
            return angle;
        } else {
            return 180 + angle;
        }
    } else {
        if (relativeX < 0) {
            return 180 + angle;
        } else {
            return (360 + angle) % 360;
        }    	
    }	
};

EmbroidLine.prototype.length = function () {
    return Math.sqrt( Math.pow(this.end.x-this.start.x,2) + 
          					  Math.pow(this.end.y-this.start.y,2));	
};

EmbroidLine.prototype.isIntersectedWith = function (line, noParallel = false) {
    var angle1,angle2,point,direction;
    
    point = this.start;
    angle1 = new EmbroidLine().compose(point,line.start).heading();
    angle2 = new EmbroidLine().compose(point,line.end).heading();
    direction = this.heading();
    
    if (noParallel) {
    	  if ((angle1+360) % 360 == (angle2+360) % 360) {
    	  	  return false;
    	  }
    }
    if (angle1 > angle2) {
        if ( (angle1-angle2 < 180) && ( (direction > angle1) || (direction < angle2))) {
            return false;
        }
        if ( (angle1-angle2 > 180) &&  (direction < angle1) && (direction > angle2)) {
            return false;
        }        
    } else {
        if ( (angle2-angle1 < 180) && ( (direction > angle2) || (direction < angle1))) {
            return false;
        }
        if ( (angle2-angle1 > 180) &&  (direction < angle2) && (direction > angle1)) {
            return false;
        }          	
    }
    return true;    
};

EmbroidLine.prototype.intersectionWith = function (line, check = true, noParallel = false) {
    var angle1,angle2,angle3,angle4,
        includedAngle1,includedAngle2,includedAngle3,
        edgeLength,vDistance,distance,hypotenuse,
        point,resultPoint;
        
    if (check && !this.isIntersectedWith(line,noParallel)) {
        return null;
    }
    
    point = this.start;
    angle1 = line.heading();   
    angle2 = new EmbroidLine().compose(line.start,point).heading();
    angle3 = new EmbroidLine().compose(point,line.start).heading();
    angle4 = this.heading();
    
    includedAngle1 = Math.abs(angle2-angle1);
    includedAngle2 = Math.abs(angle3-angle4);
    includedAngle1 = includedAngle1 > 180? 360 - includedAngle1 : includedAngle1;
    includedAngle2 = includedAngle2 > 180? 360 - includedAngle2 : includedAngle2;
    includedAngle3 = 180 - (includedAngle1 + includedAngle2);
    
    edgeLength = Math.sqrt(Math.pow(point.y-line.start.y,2) +
                           Math.pow(point.x-line.start.x,2));
    vDistance = edgeLength * Math.sin(includedAngle1*Math.PI/180);
    distance = Math.abs(vDistance/Math.cos((90-includedAngle3)*Math.PI/180));
    hypotenuse = Math.sqrt( Math.pow(distance,2) + Math.pow(edgeLength,2) - 2*edgeLength*distance*Math.cos(includedAngle2*Math.PI/180));
    
    resultPoint = new EmbroidPoint(Math.round((line.start.x*1 + hypotenuse*Math.cos(angle1*Math.PI/180))*10000)/10000,
                            Math.round((line.start.y*1 + hypotenuse*Math.sin(angle1*Math.PI/180))*10000)/10000);
                            
    return resultPoint;    	
};

EmbroidGeometry.prototype.collectStitchesForEmbroidery = function () {
	var stitches = [],stitchingTurtles,tmpStitches,colorCommands,
	    stage = this.parent;
	if (stage instanceof StageMorph) {
		stitchingTurtles = stage.children.filter(
			child => (child instanceof SpriteMorph) && (child.stitches.length > 0)
		);
		if (stitchingTurtles.length > 0) {
			if (stitchingTurtles.length > 1){
				stitches = stitchingTurtles[0].stitches;
				for (i=1;i<stitchingTurtles.length;i++) {
					if (!stitchingTurtles[i-1].stitchColor.eq(stitchingTurtles[i].firstStitchColor)) {
						stitches = stitches.concat([
							{ 
								"cmd" : "color",
								"color" : stitchingTurtles[i].firstStitchColor
							}
						]);								
					};					
					if (stitches[stitches.length-1].cmd == 'jump' && stitchingTurtles[i].stitches[0].cmd == 'jump') {
						stitches = stitches.concat(stitchingTurtles[i].stitches.slice(1));
					} else if (stitches[stitches.length-1].cmd != 'jump' && stitchingTurtles[i].stitches[0].cmd != 'jump') {
					    stitches.push(
							{ 
								"cmd" : "jump"
							}
						);
						stitches = stitches.concat(stitchingTurtles[i].stitches);
					} else {
						stitches = stitches.concat(stitchingTurtles[i].stitches);
					}
				}
			} else {
				stitches = stitchingTurtles[0].stitches;
			}
		}
		colorCommands = stitches.filter(
		    stitch => (stitch.cmd == 'color')
		);
		this.colorCount = colorCommands.length + 1;
	}
	return stitches;
};

EmbroidGeometry.prototype.toDST = function(name="noname") {
	var dstArr = [],
		stage = this.parent,
		pixels_per_millimeter = stage.pixels_per_millimeter,
		scale = 10 / pixels_per_millimeter,
		count_stitches = 0,
		count_jump = 0;
		
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

        dstArr.push(b1);
        dstArr.push(b2);
        if (jump) {
            dstArr.push(b3 | 0x83);
        } else {
            dstArr.push(b3 | 0x03);
        }
    }

    function writeHeader(str, length, padWithSpace=true) {
		for(var i = 0; i<length-1; i++) {
			if (i < str.length) {
				dstArr.push("0xF1" + str[i].charCodeAt(0).toString(16));
			} else {
				if (padWithSpace) {
					dstArr.push(0x20);
				} else {
					dstArr.push(0x00);
				}
			}
		}
		dstArr.push(0x0d);
	}
	
	function pad(n, width, z) {
		z = z || ' ';
		n = n != 0 ? n + '' : "0";
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	var extx1 = Math.round(this.maxX) - this.initX;
	var exty1 = Math.round(this.maxY) - this.initY;
	var extx2 = Math.round(this.minX) - this.initX;
	var exty2 = Math.round(this.minY) - this.initY;
	
	this.cache = this.collectStitchesForEmbroidery();
	var lastMoveIndex = this.cache.length - 1;
	
	while (this.cache[lastMoveIndex].cmd != 'goto' && lastMoveIndex > -1) {
		lastMoveIndex--;
	}
	if (this.cache[lastMoveIndex].cmd == 'goto') {
		this.lastX = this.cache[lastMoveIndex].x;
		this.lastY = this.cache[lastMoveIndex].y;
	};

	writeHeader("LA:" + name.substr(0, 16), 20, true);
	writeHeader("ST:" + pad(this.steps, 7), 11);
	writeHeader("CO:" + pad(this.colorCount, 3), 7);
	writeHeader("+X:" + pad(Math.round(extx1 / pixels_per_millimeter) * 10, 5), 9); // Math.round(this.getMetricWidth()*10), 9);
	writeHeader("-X:" + pad(Math.abs(Math.round(extx2 / pixels_per_millimeter)) * 10, 5), 9);
	writeHeader("+Y:" + pad(Math.round(exty1 / pixels_per_millimeter) * 10, 5), 9); //Math.round(this.getMetricHeight()*10), 9);
	writeHeader("-Y:" + pad(Math.abs(Math.round(exty2 / pixels_per_millimeter)) * 10, 5), 9);

	var needle_end_x = this.lastX - this.initX;
	var needle_end_y = this.lastY - this.initY;

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
	dstArr.push(0x1a);

    // Print remaining empty header
    for (var i=0; i<387; i++) {
        dstArr.push(0x20);
    }
	
	let jump = false;
	let hasFirst = false;
	let lastStitch = { x:0, y:0};
	let origin = { x:0, y:0};
	for (i=0; i < this.cache.length; i++) {
        if (this.cache[i].cmd == "color"  && !this.ignoreColors) {
			dstArr.push(0x00);
			dstArr.push(0x00);
			dstArr.push(0xC3);
		} else if (this.cache[i].cmd == "goto") {
			if (!hasFirst) {
				if (jump) { 
				    encodeTajimaStitch(0, 0, jump);
				};
				hasFirst = true;
			};
			
			stitch = this.cache[i];
            x1 = Math.round(stitch.x * scale) - origin.x;
            y1 = Math.round(stitch.y * scale) - origin.y;
            x0 = Math.round(lastStitch.x * scale) - origin.x;
            y0 = Math.round(lastStitch.y * scale) - origin.y;

            sum_x = 0;
            sum_y = 0;
            dmax = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
            dsteps = Math.abs(dmax / 121);		
			
            if (dsteps <= 1) {
                encodeTajimaStitch((x1 - x0), (y1 - y0), jump);
                count_stitches++;
            } else {
                for(j=0;j<dsteps;j++) {
                    if (j < dsteps -1) {
                        encodeTajimaStitch(
                            Math.round((x1 - x0)/dsteps),
                            Math.round((y1 - y0)/dsteps),
                            jump
                        );
                        count_stitches++;
                        sum_x += (x1 - x0)/dsteps;
                        sum_y += (y1 - y0)/dsteps;
                    } else {
                        encodeTajimaStitch(
                            Math.round((x1 - x0) - sum_x),
                            Math.round((y1 - y0) - sum_y),
                            jump
                        );
                        count_stitches++;
                    }
                }
            }	
			lastStitch = stitch;
			if (jump) {
				jump = false;
			}
		} else if (this.cache[i].cmd == "jump") {  
			jump = true;
		}
	};
	
	// end pattern
    dstArr.push(0x00);
    dstArr.push(0x00);
    dstArr.push(0xF3);

	// convert
    dstUintArr = new Uint8Array(dstArr.length);
    for (i=0;i<dstArr.length;i++) {
        dstUintArr[i] = Math.round(dstArr[i]);
    }	
	return dstUintArr;
};

EmbroidGeometry.prototype.toDXF = function() {
    var dxfString = '',
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
  
    this.cache = this.collectStitchesForEmbroidery();	
    dxfHead((this.maxX-this.minX)*0.4 > 1000 ? (this.maxX-this.minX)*0.4 : 1000,(this.maxY-this.minY)*0.4 > 1000 ? (this.maxY-this.minY)*0.4 : 1000);
	lastStitch = null;
    for (i=0; i < this.cache.length; i++) {	
  	    if (this.cache[i].cmd == "goto") {
  	        stitch = this.cache[i];
  	        if (lastStitch == null) {
				lastStitch = stitch;
  	        } else {
  	            if (stitch.x != lastStitch.x || stitch.y != lastStitch.y) {
  	                dxfLine(lastStitch,stitch);
					lastStitch = stitch;
  	            }
            }
  	    } else if (this.cache[i].cmd == "jump") {
			lastStitch = null;
		}
    }
    dxfEnd();
    return dxfString;
};

(function() {
    var ide = world.children[0],
        stage = ide.stage;
    if (!stage.embroidGeometry) {
        stage.embroidGeometry = new EmbroidGeometry(stage);
    }
})();

SnapExtensions.primitives.set('eg_get_headingOfLine(line)', function (line) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	return stage.embroidGeometry.headingOfLine(line);
});

SnapExtensions.primitives.set('eg_get_extentOfLines(lines)', function (lines) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	return stage.embroidGeometry.extentOfLines(lines);
});

SnapExtensions.primitives.set('eg_get_edgeCuttingLines(lines,direction)', function (lines,direction) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	return stage.embroidGeometry.edgeCuttingLines(lines,direction);
});

SnapExtensions.primitives.set('eg_get_svgCommand(svgstr)', function (svgstr) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	return stage.embroidGeometry.getSvgCommand(svgstr);
});

SnapExtensions.primitives.set('eg_get_bezierCurvePoints(p1,p2,p3,number)', function (p1,p2,p3,number) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	let points = stage.embroidGeometry.bezierCurvePoints(p1,p2,p3,number);
	return new List(points.map(point => new List(point)));
});

SnapExtensions.primitives.set('eg_get_cubicBezierCurvePoints(p1,p2,p3,p4,number)', function (p1,p2,p3,p4,number) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	let points = stage.embroidGeometry.cubicBezierCurvePoints(p1,p2,p3,p4,number);
	return new List(points.map(point => new List(point)));
});

SnapExtensions.primitives.set('eg_get_smoothCubicBezierCurvePoints(p1,p2,p3, previousCp,number)', function (p1,p2,p3, previousCp,number) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	let points = stage.embroidGeometry.smoothCubicBezierCurvePoints(p1,p2,p3,previousCp,number);
	return new List(points.map(point => new List(point)));
});

SnapExtensions.primitives.set('eg_get_pointsToVector(points)', function (points) {
    var stage = this.parentThatIsA(StageMorph);
    if (!stage.embroidGeometry) { return; }
	let vector = stage.embroidGeometry.pointsToVector(points);
	return new List(vector.map(v => {
		if (v == "!") {
			return "!";
		} else {
			return new List(v);
		}
	}));
});
