/* Sprite */
// modified SpriteMorph turtlestitch functions


SpriteMorph.prototype.categories =
    [
        'motion',
        'control',
        'sensing',
        'operators',
        'pen',
        'variables',
        'embroidery',
        'lists',
        'colors',
        'other',
    ];

SpriteMorph.prototype.categories =
    [
        'motion',
        'sensing',
        'pen',
        'embroidery',   
        'control',
        'operators',
        'variables',
        'colors',
        'other',        
        'lists',        
    ];
    

SpriteMorph.prototype.blockColor = {
    motion : new Color(74, 108, 212),
    pen : new Color(0, 161, 120),
    looks : new Color(143, 86, 227),
    sound : new Color(207, 74, 217),
    embroidery : new Color(0,120,0),
    control : new Color(230, 168, 34),
    sensing : new Color(4, 148, 220),
    operators : new Color(98, 194, 19),
    variables : new Color(243, 118, 29),
    lists : new Color(217, 77, 17),
    other: new Color(150, 150, 150),
    colors : new Color(207, 74, 217),
};


SpriteMorph.prototype.origInit = SpriteMorph.prototype.init;
SpriteMorph.prototype.init = function(globals) {
    this.origInit(globals);
    this.scale = 0.1;
    this.hide();
    this.lastJumped = false;
    this.turtle = null;
    this.isDown = true;
    this.cache = new Cache;
    this.color = StageMorph.prototype.defaultPenColor;
    this.stitchtype = 0;
    this.isRunning = false;
    this.stitchoptions = {};
    this.costumes = new List();
    this.costumes.type = 'costume';
    this.costume = null;
};

SpriteMorph.prototype.addStitch = function(x1, y1, x2, y2, angle=false ) {
  var stage = this.parentThatIsA(StageMorph);

  if (this.stitchLines === null) {
    this.stitchLines = new THREE.Group();
  }
	color = new THREE.Color("rgb("+
    Math.round(this.color.r) + "," +
    Math.round(this.color.g) + "," +
    Math.round(this.color.b)  + ")" );
  opacity = this.color.a;

  if (stage.isXRay) {
    color = new THREE.Color("rgb(255,255,255)");
    opacity = 0.25;
  }

	var material = this.cache.findMaterial(color,opacity);
	if (!material) {
		material = new THREE.MeshBasicMaterial({
			color: color,
			side:THREE.DoubleSide,
			opacity: opacity
		});
		material.transparent = true;
		this.cache.addMaterial(material);
	}

	// render as line mesh
	/*
	if (false) {
		var geometry = this.cache.findGeometry('meshline', [x1,y1,x2,y2, color, this.color.a]);
		if (!geometry) {
			geometry = new THREE.Geometry();
			geometry.vertices = [
				new THREE.Vector3(x1, y1, 0.0),
				new THREE.Vector3(x2, y2, 0.0),
			];
			var g = new MeshLine();
			g.setGeometry( geometry );

			this.cache.addGeometry('meshline', g,  [x1,y1,x2,y2, color, this.color.a]);
		}

		var material = new MeshLineMaterial( {
				useMap: false,
				color: new THREE.Color( color ),
				opacity: this.color.a * 1,
				resolution: new THREE.Vector2( stage.width(), stage.height() ),
				sizeAttenuation: true,
				lineWidth: stage.penSize/200,
		});
		material.transparent = true;
		var mesh = new THREE.Mesh( g.geometry, material );
		stage.myStitchLines.add(mesh);
	} */

	// render as plain lines - OLD version
	/*
	if (false) {

		var geometry = this.cache.findGeometry('stitch', [x1,y1,x2,y2]);
		if (!geometry) {
			geometry = new THREE.Geometry();
			geometry.vertices = [
				new THREE.Vector3(x1, y1, 0.0),
				new THREE.Vector3(x2, y2, 0.0),
			];
			this.cache.addGeometry('stitch', geometry, [x1,y1,x2,y2]);
		}
		line = new THREE.Line(geometry, material);
		stage.myStitchLines.add(line);
	} */

	// render as quads
	if (true) {
		var geometry = new THREE.Geometry();
		var s = 2;

		var w = Math.sqrt((x2-x1) * (x2-x1) +(y2-y1) * (y2-y1));
		w = Math.round((w + 0.00001) * 100) / 100;
		h = stage.penSize;
		if (stage.penSize <= 1)
			w = w; //- s;

		var geometry = this.cache.findGeometry('plane', [w, h]);
		if (!geometry) {
			geometry = new THREE.PlaneGeometry( w, stage.penSize, 1, 1);
			this.cache.addGeometry('plane', geometry, [w, h]);
		}

		line = new THREE.Mesh(geometry, material);
		line.translateX(x1 + (x2 - x1)/2);
		line.translateY(y1 + (y2 - y1)/2);
    //if (!angle) angle = this.heading;
		line.rotation.z = (90 - angle) * Math.PI / 180;
		stage.myStitchLines.add(line);
	}
	this.reRender();
};



SpriteMorph.prototype.addJumpLine = function(x1, y1, x2, y2) {
    var stage = this.parentThatIsA(StageMorph);

    if (this.jumpLines === null) {
        this.jumpLines = new THREE.Group();
    }

	// just draw as basic lines - OLD Version
	if (false) {
		var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
		var geometry = new THREE.Geometry();
		geometry.vertices = [
			new THREE.Vector3(x1, y1, 0.0),
			new THREE.Vector3(x2, y2, 0.0),
		];
		line = new THREE.Line(geometry, material);
		stage.myJumpLines.add(line);
    }

	// draw as dashed smeshline
    if (true) {
		color = new THREE.Color("rgb(255,0,0)");
		var geometry = this.cache.findGeometry('meshline', [x1,y1,x2,y2, color, 0.8]);
		if (!geometry) {
			geometry = new THREE.Geometry();
			geometry.vertices = [
				new THREE.Vector3(x1, y1, 0.0),
				new THREE.Vector3(x2, y2, 0.0),
			];
			var g = new MeshLine();
			g.setGeometry( geometry );
			this.cache.addGeometry('meshline', g,  [x1,y1,x2,y2, color, this.color.a]);
		}

		var material = new MeshLineMaterial( {
				useMap: false,
				color: new THREE.Color( color ),
				opacity: 0.8,
				resolution: new THREE.Vector2( stage.width(), stage.height() ),
				sizeAttenuation: true,
				lineWidth: .003,
				dashArray: 0.06,
				dashOffset: 0,
				dashRatio: 0.35
		});
		material.transparent = true;
		var mesh = new THREE.Mesh( g.geometry, material );
		mesh.visible = !StageMorph.prototype.hideJumps;
		stage.myJumpLines.add(mesh);
	}

    this.reRender();
};

SpriteMorph.prototype.addStitchPoint = function(x2, y2) {
    var stage = this.parentThatIsA(StageMorph);

	color = new THREE.Color("rgb(0,0,255)");
	var material = this.cache.findMaterial( color, 1);
    if (!material) {
      material = new THREE.MeshBasicMaterial(
        { color: color, side:THREE.DoubleSide, opacity: 1  } );
      material.transparent = true;
      this.cache.addMaterial(material);
    }

    if (this.myStitchPoints === null) {
        this.myStitchPoints = new THREE.Group();
    }

    //normal = new THREE.Vector3( -(y2-y1), (x2-x1), 0);
    //normal = normal.normalize();

	var d = 2;
	var geometry = this.cache.findGeometry('plane', [d, d]);
	if (!geometry) {
		geometry = new THREE.PlaneGeometry( d, d, 1, 1);
		this.cache.addGeometry('plane', geometry, [d, d]);
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(0, 2, 3));
	}

    line = new THREE.Mesh(geometry, material);
    line.rotation.z = (45 - this.heading) * Math.PI / 180;
    line.position.set(x2,y2,0.01);
    line.visible = !StageMorph.prototype.hideStitches;
    //if (stage.penSize <= 1)
    stage.myStitchPoints.add(line);
    this.reRender();

};

SpriteMorph.prototype.addDensityPoint = function(x1, y1) {
    var stage = this.parentThatIsA(StageMorph);

	var geometry = this.cache.findGeometry('densityPoint', [3, 6,]);
	if (!geometry) {
		geometry = new THREE.CircleGeometry( 3, 6 );
		geometry.vertices.shift();
		this.cache.addGeometry('densityPoint', geometry, [3, 6,]);
	}

	var material = this.cache.findMaterial( 0xff0000, 1);
	if (!material) {
		material = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity:1} );
		this.cache.addMaterial(material);
	}

    var circle = new THREE.Mesh( geometry, material );
    circle.translateX(x1);
    circle.translateY(y1);
    circle.translateZ(0.03);
    circle.visible = !StageMorph.prototype.ignoreWarnings;
    stage.myDensityPoints.add(circle);
    this.reRender();
};

// STITCH settings

SpriteMorph.prototype.stopRunning = function () {
	this.stitchtype = 0;
  this.isRunning = false;
	this.stitchoptions = {};
}

SpriteMorph.prototype.runningStitch = function (length, autoadjust=true) {
  if (!isFinite(length)) {
    throw new Error('length must not be Infinity');
  }
	if (length > 0) {
		this.isRunning = true;
		this.stitchoptions = {
      length: length,
      autoadjust: autoadjust,
    }
    this.stitchtype = 0;
	} else {
		throw new Error('length must be larger than zero');
	}
}

SpriteMorph.prototype.beanStitch = function (length, autoadjust=true) {
  if (!isFinite(length)) {
    throw new Error('length must not be Infinity');
  }
	if (length > 0) {
    this.stitchtype = "bean";
		this.isRunning = true;
		this.stitchoptions = {
      length: length,
      autoadjust: autoadjust
    }
	} else {
		throw new Error('length must be larger than zero');
	}
}

SpriteMorph.prototype.crossStitch = function (length, width=10, center=true, autoadjust=true) {
  if (!isFinite(length)) {
    throw new Error('length must not be Infinity');
  }
  if (!isFinite(width)) {
    throw new Error('width must not be Infinity');
  }
	if (length > 0 && width > 0) {
    this.stitchtype = "cross";
		this.isRunning = true;
		this.stitchoptions = {
      length: length,
      autoadjust: autoadjust,
      width: width,
      center: center,
    }
	} else {
    throw new Error('length and width must be larger than zero');
  }
}

SpriteMorph.prototype.zigzagStitch = function (density, width=10, center=true, autoadjust=true) {
  if (!isFinite(density)) {
    throw new Error('length must not be Infinity');
  }
  if (!isFinite(width)) {
    throw new Error('width must not be Infinity');
  }
	if (density > 0 && width > 0) {
    this.stitchtype = "zigzag";
		this.isRunning = true;
		this.stitchoptions = {
      center: center,
      autoadjust: autoadjust,
      width: width,
      length: density,
    }
	} else {
    throw new Error('density and width must be larger than zero');
  }
}

SpriteMorph.prototype.ZStitch = function (density, width=10, center=true, autoadjust=true) {
  if (!isFinite(density)) {
    throw new Error('length must not be Infinity');
  }
  if (!isFinite(width)) {
    throw new Error('width must not be Infinity');
  }
	if (density > 0 && width > 0) {
    this.stitchtype = "Z";
		this.isRunning = true;
		this.stitchoptions = {
      center: center,
      autoadjust: autoadjust,
      width: width,
      length: density,
    }
	} else {
    throw new Error('density and width must be larger than zero');
  }
}

SpriteMorph.prototype.satinStitch = function (width=10, center=true, autoadjust=true) {
  if (!isFinite(width)) {
    throw new Error('width must not be Infinity');
  }
	if (width > 0) {
    this.stitchtype = "zigzag";
		this.isRunning = true;
		this.stitchoptions = {
      autoadjust: true,
      width: width,
      length: 2,
      center: center,
    }
	} else {
    throw new Error('width must be larger than zero');
  }
}

SpriteMorph.prototype.tatamiStitch = function (width=100, interval=30, center=false, offset=0) {
  if (!isFinite(width)) {
    throw new Error('width must not be Infinity');
  }
  if (!isFinite(interval)) {
    throw new Error('interval must not be Infinity');
  }
  if (!isFinite(offset)) {
    throw new Error('offset must not be Infinity');
  }
	if (width > 0) {
    this.stitchtype = "tatami";
		this.isRunning = true;
		this.stitchoptions = {
      autoadjust: true,
      width: width,
      length: 4,
      center: center,
      interval:  Math.max(10, interval),
      offset: Math.min(offset,interval),
      segment_count: 0,
    }
	} else {
    throw new Error('width must be larger than zero');
  }
}

SpriteMorph.prototype.trimStitch = function (on = true) {
  var myself = this;
	var penState = myself.isDown;
  var runState = myself.isRunning;
  var stitchState = myself.stitchtype;
  myself.stitchtype = 0;
	myself.isDown = false;
  myself.isRunning = false;
	myself.forward(2);
	myself.forward(-4);
	myself.forward(2);
  myself.stitchtype = stitchState;
	myself.isDown = penState;
  myself.isRunning = runState;
}

SpriteMorph.prototype.jumpStitch = function (on = true) {
	var stage = this.parentThatIsA(StageMorph);
	this.isDown = !on;
	if (on) {
		stage.turtle.material.color = new THREE.Color("rgb(255,0,0)");
		stage.turtle.material.opacity = 0.3;
	} else {
		stage.turtle.material.color = new THREE.Color("rgb("+this.color.r + "," + this.color.g + "," + this.color.b + ")");
		stage.turtle.material.opacity = 0.7;
	}
    this.reRender();
}

SpriteMorph.prototype.tieStitch = function () {
  var myself = this;
  var penState = myself.isDown;
  var runState = myself.isRunning;
  var stitchState = myself.stitchtype;
  myself.stitchtype = 0;
	myself.isDown = true;
  myself.isRunning = false;
	myself.forward(2);
	myself.forward(-4);
	myself.forward(2);
  myself.stitchtype = stitchState;
  myself.isDown = penState;
  myself.isRunning = runState;
}

SpriteMorph.prototype.origForward = SpriteMorph.prototype.forward;
SpriteMorph.prototype.forward = function (steps) {
    if (!isFinite(steps)) {
      throw new Error('can\'t move to Infinity');
    }
    var dest,
        dist = steps; //* this.parent.scale || 0;
        stage = this.parentThatIsA(StageMorph);
        warn = false;

    oldx = this.xPosition();
    oldy = this.yPosition();

    if (dist >= 0) {
        dest = this.position().distanceAngle(dist, this.heading);
    } else {
        dest = this.position().distanceAngle(Math.abs(dist),  (this.heading - 180));
    }

    if (dist != 0) {

  		if (dist < 0) {
    		this.sign = -1;									//this.sign is used to indicate whether the turtle would go forward or backward
    		dist = Math.abs(dist);
    	} else {
    		this.sign = 1;
    	}

  		if ( this.isRunning  && this.isDown) {
  			if (this.stitchoptions.autoadjust) {
  				var real_length = dist / Math.round(dist / this.stitchoptions.length);
          if (dist < this.stitchoptions.length)
            real_length = dist;
  				this.forwardBy(dist, real_length);
  			} else {
  				this.forwardBy(dist, this.stitchoptions.length);
  			}
  		} else {
  			this.doMoveForward(steps);     // when not in running mode or pen is not down just go a straight line
  		}
    }
};


SpriteMorph.prototype.forwardByNr = function (totalsteps, steps) {
    stepsize = totalsteps / steps;
    this.forwardSegemensWithEndCheck(steps, stepsize)
};

SpriteMorph.prototype.forwardBy = function (totalsteps, stepsize) {
    steps = Math.floor(totalsteps / stepsize);
    rest = totalsteps - (steps * stepsize);
    this.forwardSegemensWithEndCheck(steps, stepsize)

  	if (rest > 0) {
  		this.moveforward(rest);
  	}
};


SpriteMorph.prototype.arcRight = function (radius, degrees) {
    //radius = !isFinite(+radius) ? 0 : radius;
    if (!isFinite(degrees)) {
      throw new Error('degrees must not be Infinity');
    }
    if (!isFinite(radius)) {
      throw new Error('radius must not be Infinity');
    }
    if (degrees > 0) {    
      for (let n=0; n < Math.floor(degrees / 10.0); n++) {
          this.turn(5);
          this.forward(radius * 0.174532)
          this.turn(5)
      }
      if (degrees % 10 !== 0) {
          this.turn((degrees % 10)/2.0);
          this.forward((radius * 0.174532) / (10.0 / (degrees % 10)))
          this.turn((degrees % 10)/2.0 ) 
      }
    } else if (degrees < 0) {      
      this.arcLeft(radius, Math.abs(degrees))
    }
};


SpriteMorph.prototype.arcLeft = function (radius, degrees) {
    //radius = !isFinite(+radius) ? 0 : radius;
    if (!isFinite(degrees)) {
      throw new Error('degrees must not be Infinity');
    }
    if (!isFinite(radius)) {
      throw new Error('radius must not be Infinity');
    }
    if (degrees > 0) {
      for (let n=0; n < Math.floor(degrees / 10.0); n++) {
          this.turn(-5);
          this.forward(radius * 0.174532)
          this.turn(-5)
      }
      if (degrees % 10 !== 0) {
          this.turn(-((degrees % 10)/2.0));
          this.forward((radius * 0.174532) / (10.0 / (degrees % 10)))
          this.turn(-((degrees % 10)/2.0)) 
      }
    } else if (degrees < 0) {  
      this.arcRight(radius, Math.abs(degrees))
    }
};

SpriteMorph.prototype.forwardSegemensWithEndCheck = function(steps, stepsize) {
  for(i=0;i<steps;i++) {
    if (this.stitchtype == "tatami" && i == 0 && this.stitchoptions.center)
        this.tatamiForwardStart(stepsize, this.stitchoptions.width)

    if (this.stitchtype == "cross" && i == 0 && this.stitchoptions.center)
        this.crossStitchForwardStart(stepsize, this.stitchoptions.width)

    if (this.stitchtype == "zigzag" && i == 0 && this.stitchoptions.center)
      this.zigzagForwardStart(stepsize, this.stitchoptions.width)
    else if (this.stitchtype == "Z" && i == 0 && this.stitchoptions.center)
      this.ZForwardStart(stepsize, this.stitchoptions.width)
    else
      this.moveforward(stepsize);

    if (this.stitchtype == "zigzag" && i == steps - 1 && this.stitchoptions.center)
      this.zigzagForwardEnd(stepsize, this.stitchoptions.width)
    if (this.stitchtype == "Z" && i == steps - 1 && this.stitchoptions.center)
        this.ZForwardEnd(stepsize, this.stitchoptions.width)
    if (this.stitchtype == "cross" && i == steps - 1 && this.stitchoptions.center)
        this.crossStitchForwardStop(stepsize, this.stitchoptions.width)
    if (this.stitchtype == "tatami" && i == steps - 1 && this.stitchoptions.center)
        this.tatamiForwardEnd(stepsize, this.stitchoptions.width)
  }
}

SpriteMorph.prototype.beanStitchForward = function (steps) {
    this.doMoveForward(steps*this.sign);
    this.doMoveForward(-steps*this.sign);
    this.doMoveForward(steps*this.sign);
}

SpriteMorph.prototype.crossStitchForward = function (steps, width=10) {
  var c = Math.sqrt(steps*steps + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(alpha*this.sign);
  this.doMoveForward(c*this.sign);
  this.turn((180 - alpha)*this.sign);
  this.doMoveForward(steps*this.sign);
  this.turn((180 - alpha)*this.sign);
  this.doMoveForward(c*this.sign);
  this.turn(alpha*this.sign);
}

SpriteMorph.prototype.crossStitchForwardStart = function (steps, width=10) {
  this.turn(-90*this.sign);
  this.doMoveForward(this.sign*(width/2));
  this.turn(90*this.sign);
}

SpriteMorph.prototype.crossStitchForwardStop = function (steps, width=10) {
  this.turn(90*this.sign);
  this.doMoveForward(this.sign*(width/2));
  this.turn(-90*this.sign);
}


SpriteMorph.prototype.zigzagForward = function (steps, width=10) {
  var c = Math.sqrt(steps/2*steps/2 + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(alpha*(this.stitchoptions.center? 1 : this.sign));
  this.doMoveForward(c*this.sign);
  this.turnLeft(2 *alpha*(this.stitchoptions.center? 1 : this.sign));
  this.doMoveForward(c*this.sign);
  this.turn(alpha*(this.stitchoptions.center? 1 : this.sign));
}


SpriteMorph.prototype.zigzagForwardStart = function (steps, width=10) {
  var c = Math.sqrt(steps/2*steps/2 + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turnLeft(alpha);
  this.doMoveForward((c/2)*this.sign);
  this.turn(alpha);
}

SpriteMorph.prototype.zigzagForwardEnd = function (steps, width=10) {
  var c = Math.sqrt(steps/2*steps/2 + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(alpha);
  this.doMoveForward(c*this.sign);
  this.turnLeft(2 *alpha);
  this.doMoveForward((c/2)*this.sign);
  this.turn(alpha);
}

SpriteMorph.prototype.ZForward = function (steps, width=10) {
  var c = Math.sqrt(steps*steps + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(alpha*(this.stitchoptions.center? 1 : this.sign));
  this.doMoveForward(c*this.sign);
  this.turnLeft((90 + alpha)*(this.stitchoptions.center? 1 : this.sign));
  this.doMoveForward(width*this.sign);
  this.turn(90*(this.stitchoptions.center? 1 : this.sign));
}

SpriteMorph.prototype.ZForwardStart = function (steps, width=10) {
  var c = Math.sqrt(steps*steps + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(alpha);
  this.doMoveForward((c/2)*this.sign);
  this.turnLeft(90 + alpha);
  this.doMoveForward(width*this.sign);
  this.turn(90);
}

SpriteMorph.prototype.ZForwardEnd = function (steps, width=10) {
  var c = Math.sqrt(steps*steps + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(alpha);
  this.doMoveForward((c/2)*this.sign);
  this.turnLeft(alpha);
}

SpriteMorph.prototype.tatamiForward = function (steps, width=100) {

  // just for move to the next line in 2 bz 10

  var offset = (
        ( this.stitchoptions.segment_count *
          (this.stitchoptions.offset + this.stitchoptions.interval)
        ) % this.stitchoptions.interval
      );

  var c = Math.sqrt(steps/2*steps/2);
  var alpha = degrees(Math.asin((steps/2)/c));

  var distance = width - offset;
  var interval = this.stitchoptions.interval;
  var count = Math.floor(distance / interval);
  var rest = distance - (count * interval);

  this.turn((90 - alpha)*(this.stitchoptions.center? 1 : this.sign));
  this.doMoveForward(c*this.sign);
  this.turn(alpha*(this.stitchoptions.center? 1 : this.sign));

  if (offset > 0)
      this.doMoveForward(offset*this.sign);

  for(var i=0;i<count;i++) {
    this.doMoveForward(interval*this.sign);
  }
  if (rest) {
    this.doMoveForward(rest*this.sign);
  }

  this.stitchoptions.segment_count+=1;

  var offset = (
        ( this.stitchoptions.segment_count *
          (this.stitchoptions.offset + this.stitchoptions.interval)
        ) % this.stitchoptions.interval
      );

  c = Math.sqrt(steps/2*steps/2);
  alpha = degrees(Math.asin((steps/2)/c));

  distance = width - offset;
  interval = this.stitchoptions.interval;
  count = Math.floor(distance / interval);
  rest = distance - (count * interval);


  this.turnLeft((180 - alpha)*(this.stitchoptions.center? 1 : this.sign));
  this.doMoveForward(c*this.sign);
  this.turnLeft(alpha*(this.stitchoptions.center? 1 : this.sign));

  if (offset > 0)
      this.doMoveForward(offset*this.sign);

  for(var i=0;i<count;i++) {
    this.doMoveForward(interval*this.sign);
  }
  if (rest) {
    this.doMoveForward(rest*this.sign);
  }
  this.turn(90*(this.stitchoptions.center? 1 : this.sign));

  this.stitchoptions.segment_count+=1;

}

SpriteMorph.prototype.tatamiForwardStart = function (steps, width=10) {
  var c = Math.sqrt(steps*steps + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(-90);
  this.doMoveForward((width/2)*this.sign);
  this.turn(90);
}

SpriteMorph.prototype.tatamiForwardEnd = function (steps, width=10) {
  var c = Math.sqrt(steps*steps + width * width);
  var alpha = degrees(Math.asin(width/c));

  this.turn(90);
  this.doMoveForward((width/2)*this.sign);
  this.turn(-90);
}



SpriteMorph.prototype.moveforward = function (steps) {
  if ( this.stitchtype == "bean") {
    this.beanStitchForward(steps);
  } else if ( this.stitchtype == "cross") {
    this.crossStitchForward(steps, this.stitchoptions.width)
  } else if ( this.stitchtype == "zigzag") {
    this.zigzagForward(steps, this.stitchoptions.width)
  } else if ( this.stitchtype == "Z") {
    this.ZForward(steps, this.stitchoptions.width)
  } else if ( this.stitchtype == "tatami") {
    this.tatamiForward(steps, this.stitchoptions.width)
  } else {
    this.doMoveForward(steps*this.sign)
  }
}


SpriteMorph.prototype.doMoveForward = function (steps) {
	var dest,
		dist = steps * this.parent.scale || 0;
		stage = this.parentThatIsA(StageMorph);
		warn = false;

	oldx = this.xPosition();
	oldy = this.yPosition();

	if (dist >= 0) {
		dest = this.position().distanceAngle(dist, this.heading);
	} else {
		dest = this.position().distanceAngle(Math.abs(dist),  (this.heading - 180));
	}

	if (dist != 0) {
		this.setPosition(dest);

    // this is a quick hack but delaying the rerender seems to get rid of the
    // grey square that shows as a rendering error (still don't know where it
    // comes from )
    // setTimeout(() => stage.reRender(), 10)

    var isFirst = this.parentThatIsA(StageMorph).turtleShepherd.isEmpty();
		warn = stage.turtleShepherd.moveTo(
			oldx, oldy,
			this.xPosition(), this.yPosition(),
			this.isDown );

		if (this.isDown) {
			this.addStitch(oldx, oldy, this.xPosition(), this.yPosition(), this.heading);
			this.addStitchPoint(this.xPosition(), this.yPosition());
      if (warn && !stage.turtleShepherd.ignoreWarning) {
				this.addDensityPoint(this.xPosition(), this.yPosition());
			}
			if (isFirst || this.lastJumped ) {
				this.addStitchPoint(oldx,oldy);
			}
      this.lastJumped = false;
		} else {
			this.addJumpLine(oldx, oldy, this.xPosition(), this.yPosition());
      this.lastJumped = true;
		}
		stage.moveTurtle(this.xPosition(), this.yPosition());
	}
}

SpriteMorph.prototype.origGotoXY = SpriteMorph.prototype.gotoXY;
SpriteMorph.prototype.gotoXY = function (x, y, justMe, noShadow) {
    var stage = this.parentThatIsA(StageMorph);
    var dest;
    var oldx = this.xPosition();
    var oldy = this.yPosition();
    var oldheading = this.heading;
    var warn = false;

    if (!stage) {return; }

    if (!isFinite(x)) {
      throw new Error('x must not by Infinity');
    }
    if (!isFinite(y)) {
      throw new Error('y must not by Infinity');
    }
    //x = !isFinite(+x) ? 0 : +x;
    //y = !isFinite(+y) ? 0 : +y;

    var dest = new Point(x, y).subtract(new Point(this.xPosition(), this.yPosition()));
    var a = (x - this.xPosition());
    var b = (y - this.yPosition());
    var dist = Math.sqrt(a*a + b*b);
    if (a == 0 && b == 0) dist = 0;

    var deltaX = (x - this.xPosition()) * this.parent.scale;
    var deltaY = (y - this.yPosition()) * this.parent.scale;
    var angle = Math.abs(deltaX) < 0.0001 ? (deltaY < 0 ? 90 : 270)
          : Math.round( (deltaX >= 0 ? 0 : 180)  - (Math.atan(deltaY / deltaX) * 57.2957795131),8
        );
    angle = angle + 90;
    //if (angle==-90) angle = 270;

    if ( Math.round(dist,5) <= 0.0001) {
		  // jump in place - don't add / ignore
		  //console.log("jump in place - don't add / ignore",  this.isDown,this.xPosition(), this.yPosition(), dist);
    } else {
		if (this.stitchoptions.autoadjust) {
			real_length = 0;
			if ( Math.round(dist / this.stitchoptions.length) > 0)
				real_length = dist / Math.round(dist / this.stitchoptions.length);
			else
				real_length = dist

			if (dist < this.stitchoptions.length )
			  stepsize = dist;
			else
			  stepsize = real_length;

		} else {
			stepsize = this.stitchoptions.length;
		}

		var steps = Math.floor(dist / stepsize);
		var rest = dist - (steps * stepsize);


		if ( this.isRunning  && this.isDown && steps > 0 ) {
			rest = Math.round(rest,8);

			//stepsize =  Math.round(stepsize,8);
			this.setHeading(angle);
			this.sign = 1;
			this.forwardSegemensWithEndCheck(steps, stepsize);

			if (steps == 0 && rest > 0 || x != this.xPosition() || y != this.yPosition()) {
				this.gotoXY(x,y);
			}
		} else {
			this.origGotoXY(x, y, justMe);

      // dont' stitch if is zero value length
      // - shoud we filter out all noShadows?
      // if (!noShadow && dist > 1) {
      if (dist > 1) {
        warn = this.parentThatIsA(StageMorph).turtleShepherd.moveTo(
          oldx, oldy,
          this.xPosition(), this.yPosition(),
          this.isDown );
      }

			if (this.isDown) {
				this.addStitch(oldx, oldy, this.xPosition(), this.yPosition(), angle);
				this.addStitchPoint(this.xPosition(), this.yPosition());
				if (warn && !stage.turtleShepherd.ignoreWarning) {
					this.addDensityPoint(this.xPosition(), this.yPosition());
				}

				if (this.parentThatIsA(StageMorph).turtleShepherd.isEmpty() || this.lastJumped)
					this.addStitchPoint(oldx, oldy);
				this.lastJumped = false;
			} else {
				this.addJumpLine(oldx, oldy, this.xPosition(), this.yPosition());
				this.lastJumped = true;
			}
			stage.moveTurtle(this.xPosition(), this.yPosition());
		}

		this.setHeading(oldheading);
	}
};

SpriteMorph.prototype.gotoXYBy = function (x, y, stepsize) {
  // this block is deprecated but keep it for compatibility
  stitchState = this.stitchtype;
  stitchLength = this.stitchoptions.length;
  runState = this.isRunning;
  this.isRunning = true;
  this.stitchtype = "";
  this.stitchoptions.length = stepsize;
  this.autoadjust = false;
  this.gotoXY(x,y);
  this.stitchtype = stitchState;
  this.autoadjust = false;
  this.stitchoptions.length = stitchLength;
  this.isRunning = runState;
};

SpriteMorph.prototype.gotoXYIn = function (x, y, steps) {
    var stage = this.parentThatIsA(StageMorph);
    var dest;

    if (!stage) {return; }

    if (!isFinite(x)) {
      throw new Error('x must not by Infinity');
    }
    if (!isFinite(y)) {
      throw new Error('y must not by Infinity');
    }
    //x = !isFinite(+x) ? 0 : +x;
    //y = !isFinite(+y) ? 0 : +y;

    var dest = new Point(x, y).subtract(
                  new Point(this.xPosition(), this.yPosition()));

    var a = (x - this.xPosition());
    var b = (y - this.yPosition());
    var dist = Math.sqrt(a*a + b*b);
    if (a == 0 && b == 0)
      dist = 0;

	var deltaX = (x - this.xPosition()) * this.parent.scale;
	var deltaY = (y - this.yPosition()) * this.parent.scale;
	var angle = Math.abs(deltaX) < 0.001 ? (deltaY < 0 ? 90 : 270)
			  : Math.round(
			  (deltaX >= 0 ? 0 : 180)
				  - (Math.atan(deltaY / deltaX) * 57.2957795131)
		  );
	this.setHeading(angle + 90);

  if (dist > 0) {
		var stepsize =  dist / steps;
		this.sign = 1;
		this.forwardSegemensWithEndCheck(steps,stepsize);
  }
};


SpriteMorph.prototype.pointTowards = function (x, y) {
  var stage = this.parentThatIsA(StageMorph);
  var dest;

  if (!stage) {return; }

  if (!isFinite(x)) {
    throw new Error('x must not by Infinity');
  }
  if (!isFinite(y)) {
    throw new Error('y must not by Infinity');
  }
  //x = !isFinite(+x) ? 0 : +x;
  //y = !isFinite(+y) ? 0 : +y;

	var deltaX = (x - this.xPosition()) * this.parent.scale;
	var deltaY = (y - this.yPosition()) * this.parent.scale;
	var angle = Math.abs(deltaX) < 0.001 ? (deltaY < 0 ? 90 : 270)
			  : Math.round(
			  (deltaX >= 0 ? 0 : 180)
				  - (Math.atan(deltaY / deltaX) * 57.2957795131)
	);
	this.setHeading(angle + 90);
};

SpriteMorph.prototype.drawText = function (text, size) {
  if (!isFinite(size)) {
    throw new Error('size must not by Infinity');
  }
  size = Math.max(21, size);
  return this.drawTextScale(text, size/21.0, false);
}

SpriteMorph.prototype.drawTextDev = function (text, size, trim) {
  if (!isFinite(size)) {
    throw new Error('size must not by Infinity');
  }
  size = Math.max(21, size);
  return this.drawTextScale(text, size/21.0, trim);
}

SpriteMorph.prototype.drawTextScale = function (text, scale, trim) {
  var stage = this.parentThatIsA(StageMorph);
  var dest;
  var myself = this;

  if (!stage) {return; }
  if (!isFinite(scale)) {
    throw new Error('scale must not by Infinity');
  }

	function doAJump(x, y) {
		var penState = myself.isDown;
		myself.isDown = false;
    if (trim) {
      myself.gotoXY(x+2, y+2);
      myself.gotoXY(x-2, y-2);
      myself.gotoXY(x, y);
    } else {
      myself.gotoXY(x, y);
    }

		//lf.gotoXY(x+2, y+2);
		//myself.gotoXY(x, y);
		myself.isDown = penState;
	}

	if (stage.fonts) {
    heading = this.heading;
    vx = Math.cos(radians(this.heading - 90));
    vy = Math.sin(radians(this.heading - 90));
    nx = Math.cos(radians(this.heading ));
    ny = Math.sin(radians(this.heading ));

    if (!isNaN(text)) {
      text = text.toString()
    }

		for(var i in text) {
			var index = text.charCodeAt(i) - 33;
			var x = this.xPosition();
			var y = this.yPosition();
			var maxx = 0, maxy = 0;
			var nextIsPenUp = false;

			if (stage.fonts[text[i]]){
				if (this.isRunning)
          coords = stage.fonts[text[i]]["stitch"];
        else {
          lines = stage.fonts[text[i]]["orig"];
          coords = [];
          for (var j=0; j<lines.length; j++) {
            coords.push("jump");
            for (var k=0; k<lines[j].length; k++) {
              coords.push(lines[j][k])
              if (k==0)
                coords.push("move");
            }
          }
        }

				for (var j=0; j<coords.length; j++) {
					if (coords[j] == "jump") {
						nextIsPenUp = true;
            nextIsStitch = false;
					} else if (coords[j] == "move") {
						nextIsStitch = false;
            nextIsPenUp = false;
          } else if (coords[j] == "stitch") {
						nextIsStitch = true;
            nextIsPenUp = false;
					} else {
            maxx = Math.max(maxx, coords[j][0]);
            dx = coords[j][0] * scale * vx - coords[j][1] * scale * vy;
            dy = coords[j][1] * scale * ny - coords[j][0] * scale * nx;
						if (nextIsPenUp || j == 0  ) {
							doAJump(
                x + dx,
                y - dy
              )
						} else if (nextIsStitch)	{
							this.gotoXY(
                x + dx,
                y - dy
              )
						} else {
              var runState = this.isRunning;
              this.isRunning = false;
              this.gotoXYBy(
                x + dx,
                y - dy,
                  40 );
              this.isRunning = runState;
            }
					}
				}
        if (i == text.length - 1) {
          dx = (maxx) * scale * vx;
          dy = 0 - (maxx) * scale * nx;
        } else {
          dx = (maxx+5) * scale * vx;
          dy = 0 - (maxx+5) * scale * nx;
        }
        doAJump(x + dx, y - dy);
			} else {
        dx = 10 * scale * vx;
        dy = 0 - 10 * scale * nx;
				doAJump(x + dx, y - dy);
			}
	  }
    this.setHeading(heading);
  } else {
		console.log("no fonts loaded");
	}
};

SpriteMorph.prototype.getTextLength = function (text, size) {
  if (!isFinite(size)) {
    throw new Error('size must not by Infinity');
  }
  scale = size/21.0;
  var stage = this.parentThatIsA(StageMorph);
  var dest;
  var myself = this;

  if (!stage) {return; }

	if (stage.fonts) {
    var x = 0;

		for(var i in text) {
			var index = text.charCodeAt(i) - 33;
			var maxx = 0, maxy = 0;
      var charwidth = 0;

			if (stage.fonts[text[i]]){
        if (this.isRunning)
          coords = stage.fonts[text[i]]["stitch"];
        else {
          lines = stage.fonts[text[i]]["orig"];
          coords = [];
          for (var j=0; j<lines.length; j++) {
            coords.push("jump");
            for (var k=0; k<lines[j].length; k++) {
              coords.push(lines[j][k])
              if (k==0)
                coords.push("move");
            }
          }
        }

				for (var j=0; j<coords.length; j++) {
          if (coords[j] != "jump" && coords[j] != "move" && coords[j] != "stitch") {
            maxx = Math.max(maxx, coords[j][0]);
          }
				}
        x = x + maxx * scale;
        if (i < text.length - 1)
          x = x + 5 * scale;
			} else {
        x = x + 10 * scale;
			}
	  }
    return x;
  } else {
		return 0;
	}
};


SpriteMorph.prototype.origSetHeading = SpriteMorph.prototype.setHeading;
SpriteMorph.prototype.setHeading = function (degrees) {
  if (!isFinite(degrees)) {
    throw new Error('degrees must not by Infinity');
  }
  var stage = this.parentThatIsA(StageMorph);
  this.origSetHeading(degrees);
  stage.rotateTurtle(this.heading);
};


// COLORS
// ####################################################################

SpriteMorph.prototype.setColor = function (aColor) {
    var stage = this.parentThatIsA(StageMorph);
    this.color = aColor;
    stage.turtleShepherd.addColorChange(this.color);
    stage.turtle.material.color = new THREE.Color("rgb("+this.color.r + "," + this.color.g + "," + this.color.b + ")");
    this.reRender();
};


SpriteMorph.prototype.setColorRGB = function (r,g,b) {
  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    throw new Error('value must not by Infinity');
  }
	var a = this.color.a;
	r = Math.max(Math.min(r, 255), 0);
	b = Math.max(Math.min(b, 255), 0);
	g = Math.max(Math.min(g, 255), 0);
    this.setColor(new Color(r, g, b, a));
};

SpriteMorph.prototype.setColorHSV = function (h, s, v) {
  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    throw new Error('value must not by Infinity');
  }
	var col = new Color();
	h = Math.max(Math.min(h, 1), 0);
	s = Math.max(Math.min(s, 1), 0);
	v = Math.max(Math.min(v, 1), 0);
	col.set_hsv(h, s, v);
	col.a = this.color.a;
	this.setColor(col);
}

SpriteMorph.prototype.pickHue = function (value) {
    this.setColor(value);
};

SpriteMorph.prototype.getHue = function () {
    return this.color.hsv()[0] * 360;
};

SpriteMorph.prototype.setHue = function (num) {
 if (!isFinite(num)) {
    throw new Error('value must not by Infinity');
  }
  var hsv = this.color.hsv(),
      n = +num;
  if (n < 0 || n > 360) { // wrap the hue
      n = (n < 0 ? 360 : 0) + n % 360;
  }
  hsv[0] = n / 360;
  this.setColorHSV(hsv[0],hsv[1],hsv[2]);
};

SpriteMorph.prototype.changeHue = function (delta) {
 if (!isFinite(delta)) {
    throw new Error('value must not by Infinity');
  }
  this.setHue(this.getHue() + (+delta || 0));
};

SpriteMorph.prototype.getBrightness = function () {
    return this.color.hsv()[2] * 100;
};

SpriteMorph.prototype.setBrightness = function (num) {
 if (!isFinite(num)) {
    throw new Error('value must not by Infinity');
  }
  var hsv = this.color.hsv();
  hsv[2] = Math.max(Math.min(+num || 0, 100), 0) / 100; // shade doesn't wrap
  this.setColorHSV(hsv[0],hsv[1],hsv[2]);
};

SpriteMorph.prototype.changeBrightness = function (delta) {
    this.setBrightness(this.getBrightness() +  (delta || 0));
};

SpriteMorph.prototype.setSaturation = function (num) {
 if (!isFinite(num)) {
    throw new Error('value must not by Infinity');
  }
  var hsv = this.color.hsv();
  hsv[1] = Math.max(Math.min(+num || 0, 100), 0) / 100; // shade doesn't wrap
  this.setColorHSV(hsv[0],hsv[1],hsv[2]);
};

SpriteMorph.prototype.getSaturation = function () {
    return this.color.hsv()[1] * 100;
};

SpriteMorph.prototype.changeSaturation= function (delta) {
    this.setSaturation(this.getSaturation() + (delta || 0));
};

SpriteMorph.prototype.setHSB = function (channel, value) {
	// Hue is cyclic, while saturation, brightness and opacity are clipped between 0 and 100
    if (channel == 'hue') {
        this.setHue(Math.abs(value + 360) % 360);
    } else if (channel == 'saturation') {
        this.setSaturation(Math.max(Math.min(value, 100), 0));
    } else if (channel == 'brightness') {
        this.setBrightness(Math.max(Math.min(value, 100), 0));
	}
};

SpriteMorph.prototype.getHSB = function (channel, value) {
    if (channel == 'hue') {
        return this.getHue();
    }
    if (channel == 'saturation') {
        return this.getSaturation();
    }
    if (channel == 'brightness') {
       return this.getBrightness();
    }
};

SpriteMorph.prototype.changeHSB = function (channel, value) {
    if (channel == 'hue') {
        return this.changeHue(value);
    } else if (channel == 'saturation') {
       return this.changeSaturation(value);
    } else if (channel == 'brightness') {
        return this.changeBrightness(value);
    }
};

SpriteMorph.prototype.setOpacity = function (value) {
  if (!isFinite(value)) {
    throw new Error('value must not by Infinity');
  }
	value = Math.max(Math.min(value, 100), 0);
	this.color.a = value / 100;
    this.setColor(this.color);
};

SpriteMorph.prototype.getOpacity = function (value) {
	return this.color.a * 100;
};

SpriteMorph.prototype.changeOpacity= function (delta) {
  if (!isFinite(delta)) {
    throw new Error('value must not by Infinity');
  }
  this.setOpacity(this.getOpacity() + (+delta || 0));
};

SpriteMorph.prototype.setColorHex = function (hex) {
	var a = this.color.a;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		r = parseInt(result[1], 16);
		g = parseInt(result[2], 16);
		b = parseInt(result[3], 16);
		this.setColor(new Color(r, g, b, a));
	} else {
	  // silently ignore
	}
};

SpriteMorph.prototype.getColorRGB = function (){
	return new List([this.color.r, this.color.g, this.color.b]);
}

SpriteMorph.prototype.getColorHex = function (){
	return new String("#" + ((1 << 24) + (Math.round(this.color.r) << 16) + (Math.round(this.color.g) << 8)
	+ Math.round(this.color.b)).toString(16).slice(1));
}

SpriteMorph.prototype.getColorHSV = function (){
	return new List(this.color.hsv());
}


// PEN UP DOWN
//
SpriteMorph.prototype.isPenDown = function (){
	return this.isDown;
}

SpriteMorph.prototype.getPenSize = function (){
	return this.penSize();
}

SpriteMorph.prototype.setSize = function (size) {
  if (!isFinite(size)) {
    throw new Error('value must not by Infinity');
  }
  var stage = this.parentThatIsA(StageMorph);
  if (!isNaN(size)) {
      this.size = Math.min(Math.max(+size, 0.0001), 1000);
  }
  stage.setPenSize(this.size);
  stage.turtleShepherd.setPenSize(this.size);
};


SpriteMorph.prototype.drawLine = function (start, dest) {};

SpriteMorph.prototype.origSilentGotoXY = SpriteMorph.prototype.silentGotoXY;
SpriteMorph.prototype.silentGotoXY = function (x, y, justMe) {
    this.origSilentGotoXY(x,y,justMe);
};

SpriteMorph.prototype.origClear = SpriteMorph.prototype.clear;
SpriteMorph.prototype.clear = function () {
    this.origClear();
    this.parentThatIsA(StageMorph).clearAll();
    this.parentThatIsA(StageMorph).turtleShepherd.clear();
    this.parentThatIsA(StageMorph).renderer.changed = true  ;
};

SpriteMorph.prototype.reRender = function () {
    this.parentThatIsA(StageMorph).renderer.changed = true  ;
    //this.hide();
    this.changed();
};

// Single Sprite mode

SpriteMorph.prototype.origDrawNew = SpriteMorph.prototype.drawNew;
SpriteMorph.prototype.drawNew = function () {
    this.origDrawNew();
};


SpriteMorph.prototype.wait = function(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}


//SpriteMorph.prototype.thumbnail = function (extentPoint) {};
//SpriteMorph.prototype.drawNew = function () { this.hide() }

// THREE additions

THREE.Object3D.prototype.addLineToPointWithColor = function (point, color, thickness) {
    return this.addLineFromPointToPointWithColor(new THREE.Vector3(), point, color, thickness)
};

THREE.Object3D.prototype.addLineFromPointToPointWithColor = function (originPoint, destinationPoint, color, thickness) {
    geometry = new THREE.Geometry();
    geometry.vertices.push(originPoint);
    geometry.vertices.push(destinationPoint);
    var lineMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: (thickness ? thickness : 1) });
    var line = new THREE.Line(geometry, lineMaterial);
    this.add(line);
    return line;
};

SpriteMorph.prototype.resetAll = function () {
	var myself = this;
	myself.stitchtype = 0;
	myself.stitchoptions = {};
	myself.isRunning = false;
	myself.setColor(StageMorph.prototype.defaultPenColor);
	myself.parentThatIsA(StageMorph).setPenSize(1);
	myself.scale = 0.1;
	myself.gotoXY(0,0);
	myself.setHeading(90);
	myself.clear();
  myself.rerender();
	myself.isDown = true;
}

SpriteMorph.prototype.resetStitchSettings = function () {
	var myself = this;
	myself.stitchoptions = {}
	myself.stitchtype = 0;
	myself.isRunning = false;
}

// Block specs

SpriteMorph.prototype.originalInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {

    var myself = this;
    this.originalInitBlocks();

    this.blocks.reportProxiedURL = {
		type: 'reporter',
        spec: 'proxied URL %s',
        category: 'sensing',
        defaults: ["snap.berkley.edu"]
	}

	// sprite movements

    this.blocks.resetAll =
    {
		only: SpriteMorph,
        type: 'command',
        spec: 'reset',
        category: 'control'
    };
    this.blocks.forwardBy =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'move %n steps by %n steps',
        defaults: [100,10]
    };

    this.blocks.forwardByNr =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'move %n steps in %n',
        defaults: [100,10]
    };
    this.blocks.gotoXYBy =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'go to x: %n y: %n by %n',
        defaults: [0, 0, 10]
    };
    this.blocks.gotoXYIn =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'go to x: %n y: %n in %n',
        defaults: [0, 0, 10]
    };
    this.blocks.arcRight =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'arc $turnRight radius: %n degrees: %n ',
        defaults: [50, 30]
    };
    this.blocks.arcLeft =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'arc $turnLeft radius: %n degrees: %n ',
        defaults: [50, 30]
    };
    this.blocks.pointTowards =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'point towards x: %n y: %n',
        defaults: [0, 0]
    };
    this.blocks.drawTextScale =
    {
		    only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'draw text: %s scale: %n',
        defaults: ["hello", 2]
    };
    this.blocks.drawText =
    {
		    only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'draw text %s with size %n',
        defaults: ["hello", 21]
    };
    this.blocks.drawTextDev =
    {
		    only: SpriteMorph,
        type: 'command',
        category: 'motion',
        spec: 'draw text %s with size %n trim %b',
        defaults: ["hello", 2, true]
    };
    this.blocks.getTextLength =
    {
		    only: SpriteMorph,
        type: 'reporter',
        category: 'motion',
        spec: 'text length of %s with size %n',
        defaults: ["hello", 21]
    };
    this.blocks.reportRandomPosition =
    {
		    only: SpriteMorph,
        type: 'reporter',
        category: 'motion',
        spec: 'random position',
    };

    // pen blocks

    this.blocks.isPenDown =
    {
		only: SpriteMorph,
        type: 'predicate',
        category: 'pen',
        spec: 'pen down?',
    };

    this.blocks.getPenSize  =
    {
		only: SpriteMorph,
        type: 'reporter',
        category: 'pen',
        spec: 'pen size',
    };

	// pen color blocks

	this.blocks.setColor = {
		only: SpriteMorph,
		type: 'command',
		category: 'colors',
		spec: 'set color to %clr'
	};

    this.blocks.setColorRGB =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'colors',
        spec: 'set color to RGB %n %n %n',
        defaults: [0, 255, 0]
    };

    this.blocks.setColorHex =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'colors',
        spec: 'set color to hex %s',
        defaults: ['#ff0000']
    };

    this.blocks.setColorHSV =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'colors',
        spec: 'set color to HSV %n %n %n',
        defaults: [0.3, 0.7, 0.6]
    };

    this.blocks.setOpacity =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'pen',
        spec: 'set opacity to %n',
        defaults: [100]
    };

    this.blocks.changeOpacity =
    {
		only: SpriteMorph,
        type: 'command',
        category: 'pen',
        spec: 'change opacity by %n',
        defaults: [10]
    };

    this.blocks.getOpacity =
    {
		only: SpriteMorph,
        type: 'reporter',
        category: 'pen',
        spec: 'opacity',
    };

	this.blocks.getColorRGB =
    {
		only: SpriteMorph,
        type: 'reporter',
        category: 'colors',
        spec: 'RGB color',
    };

	this.blocks.getColorHSV =
    {
		only: SpriteMorph,
        type: 'reporter',
        category: 'colors',
        spec: 'HSV color',
    };

	this.blocks.getColorHex =
    {
		only: SpriteMorph,
        type: 'reporter',
        category: 'colors',
        spec: 'hex color',
    };

	// color
    this.blocks.pickHue =
    {
		only: SpriteMorph,
        type: 'command',
        spec: 'set color by hue %huewheel',
        category: 'colors'
    };
    this.blocks.setHSB =
    {
		only: SpriteMorph,
        type: 'command',
        spec: 'set %hsb to %n',
        category: 'colors',
        defaults: ['hue', 50]
    };
    this.blocks.changeHSB =
    {
		only: SpriteMorph,
        type: 'command',
        spec: 'change %hsb by %n',
        category: 'colors',
        defaults: ['hue', 10]
    };
    this.blocks.getHSB =
    {
		only: SpriteMorph,
        type: 'reporter',
        spec: 'color: %hsb',
        category: 'colors'
    };

    // Embroidery blocks

    this.blocks.stopRunning =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'stop running',
        category: 'embroidery',
    };

    this.blocks.runningStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'running stitch by %n steps',
        category: 'embroidery',
        defaults: [10]
    };

    this.blocks.beanStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'triple run by %n',
        category: 'embroidery',
        defaults: [10]
    };

    this.blocks.crossStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'cross stitch in %n by %n center %b',
        category: 'embroidery',
        defaults: [10, 10, true]
    };

    this.blocks.zigzagStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'zigzag with density %n width %n center %b',
        category: 'embroidery',
        defaults: [20, 20, true]
    };

    this.blocks.ZStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'Z-stitch with density %n width %n center %b',
        category: 'embroidery',
        defaults: [20, 10, true]
    };

    this.blocks.satinStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'satin stitch with width %n center %b',
        category: 'embroidery',
        defaults: [20, true]
    };

    this.blocks.tatamiStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'tatami stitch width %n interval %n center %b',
        category: 'embroidery',
        defaults: [100, 40, true]
    };

    this.blocks.tieStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'tie stitch',
        category: 'embroidery',
    };

    this.blocks.jumpStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'jump stitch %b',
        category: 'embroidery',
        defaults: [true]
    };

    this.blocks.trimStitch =
    {
		    only: SpriteMorph,
        type: 'command',
        spec: 'trim',
        category: 'embroidery',
    };

	// more blocks

    this.blocks.zoomToFit =
    {
        type: 'command',
        spec: 'zoom to fit',
        category: 'other'
    };

  	this.blocks.reportPi = {
  		type: 'reporter',
  		category: 'operators',
  		spec: 'PI',
  	};
};

SpriteMorph.prototype.initBlocks();

// SpriteMorph block templates

SpriteMorph.prototype.blockTemplates = function (category) {
    var blocks = [], myself = this, varNames, button,
        cat = category || 'motion', txt,
        inheritedVars = this.inheritedVariableNames();

    function block(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    function variableBlock(varName) {
        var newBlock = SpriteMorph.prototype.variableBlock(varName);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        if (contains(inheritedVars, varName)) {
            newBlock.ghost();
        }
        return newBlock;
    }

    function watcherToggle(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var info = SpriteMorph.prototype.blocks[selector];
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleWatcher(
                    selector,
                    localize(info.spec),
                    myself.blockColor[info.category]
                );
            },
            null,
            function () {
                return myself.showingWatcher(selector);
            },
            null
        );
    }

    function variableWatcherToggle(varName) {
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleVariableWatcher(varName);
            },
            null,
            function () {
                return myself.showingVariableWatcher(varName);
            },
            null
        );
    }

    function helpMenu() {
        var menu = new MenuMorph(this);
        menu.addItem('help...', 'showHelp');
        return menu;
    }

    function addVar(pair) {
        var ide;
        if (pair) {
            if (myself.isVariableNameInUse(pair[0], pair[1])) {
                myself.inform('that name is already in use');
            } else {
                ide = myself.parentThatIsA(IDE_Morph);
                myself.addVariable(pair[0], pair[1]);
                if (!myself.showingVariableWatcher(pair[0])) {
                    myself.toggleVariableWatcher(pair[0], pair[1]);
                }
                ide.flushBlocksCache('variables'); // b/c of inheritance
                ide.refreshPalette();
            }
        }
    }

    if (cat === 'motion') {

        blocks.push(block('forward'));
        //blocks.push(block('forwardByNr'));
        //blocks.push(block('forwardBy'));
        blocks.push('-');
        blocks.push(block('turn'));
        blocks.push(block('turnLeft'));
        blocks.push('-');
        blocks.push(block('setHeading'));
        blocks.push(block('doFaceTowards'));
        blocks.push(block('pointTowards'));
        blocks.push('-');
        blocks.push(block('gotoXY'));
        //blocks.push(block('gotoXYIn'));
        //blocks.push(block('gotoXYBy'));
        blocks.push(block('doGotoObject'));
        blocks.push(block('reportRandomPosition'));
        blocks.push('-');
        blocks.push(block('arcRight'));
        blocks.push(block('arcLeft'));
        blocks.push('-');
        blocks.push(block('changeXPosition'));
        blocks.push(block('setXPosition'));
        blocks.push(block('changeYPosition'));
        blocks.push(block('setYPosition'));
        blocks.push('-');
        blocks.push(block('drawText'));
        blocks.push(block('getTextLength'))
        blocks.push('-');
        blocks.push(block('bounceOffEdge'));
        blocks.push('-');
        blocks.push(watcherToggle('xPosition'));
        blocks.push(block('xPosition'));
        blocks.push(watcherToggle('yPosition'));
        blocks.push(block('yPosition'));
        blocks.push(watcherToggle('direction'));
        blocks.push(block('direction'));

    } else if (cat === 'looks') {

        blocks.push(block('doSwitchToCostume'));
        blocks.push(block('doWearNextCostume'));
        blocks.push(watcherToggle('getCostumeIdx'));
        blocks.push(block('getCostumeIdx'));
        blocks.push('-');
        blocks.push(block('doSayFor'));
        blocks.push(block('bubble'));
        blocks.push(block('doThinkFor'));
        blocks.push(block('doThink'));
        blocks.push('-');
        blocks.push(block('changeEffect'));
        blocks.push(block('setEffect'));
        blocks.push(block('clearEffects'));
        blocks.push('-');
        blocks.push(block('changeScale'));
        blocks.push(block('setScale'));
        blocks.push(watcherToggle('getScale'));
        blocks.push(block('getScale'));
        blocks.push('-');
        blocks.push(block('show'));
        blocks.push(block('hide'));
        blocks.push('-');
        blocks.push(block('comeToFront'));
        blocks.push(block('goBack'));

        // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportCostumes'));
            blocks.push('-');
            blocks.push(block('log'));
            blocks.push(block('alert'));
            blocks.push('-');
            blocks.push(block('doScreenshot'));
        }

    /////////////////////////////////

    } else if (cat === 'sound') {

        blocks.push(block('playSound'));
        blocks.push(block('doPlaySoundUntilDone'));
        blocks.push(block('doStopAllSounds'));
        blocks.push('-');
        blocks.push(block('doRest'));
        blocks.push('-');
        blocks.push(block('doPlayNote'));
        blocks.push('-');
        blocks.push(block('doChangeTempo'));
        blocks.push(block('doSetTempo'));
        blocks.push(watcherToggle('getTempo'));
        blocks.push(block('getTempo'));

    // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportSounds'));
        }

    } else if (cat === 'pen') {

        blocks.push(block('clear'));
        blocks.push('-');
        blocks.push(block('down'));
        blocks.push(block('up'));
        blocks.push(block('isPenDown'));
        blocks.push('-');
        blocks.push(block('setSize'));
        blocks.push(block('changeSize'));
        blocks.push(block('getPenSize'));
        blocks.push('-');
        blocks.push(block('setOpacity'));
        blocks.push(block('changeOpacity'));
        blocks.push(block('getOpacity'));

	} else if (cat === 'embroidery') {

        blocks.push(block('clear'));
        blocks.push(block('stopRunning'));
        blocks.push('-');
        blocks.push(block('runningStitch'));
        blocks.push(block('beanStitch'));
        blocks.push(block('crossStitch'));
        blocks.push('-');
        blocks.push(block('zigzagStitch'));
        blocks.push(block('ZStitch'));
        blocks.push(block('satinStitch'));
        blocks.push(block('tatamiStitch'));
        blocks.push('-');
        blocks.push('-');
        blocks.push(block('jumpStitch'));
        blocks.push(block('tieStitch'));
        blocks.push(block('trimStitch'));

  } else if (cat === 'other') {
        blocks.push(block('zoomToFit'));

	} else if (cat === 'colors') {
        blocks.push(block('setColor'));
        blocks.push('-');
        blocks.push(block('setColorRGB'));
        blocks.push(block('setColorHSV'));
        blocks.push(block('setColorHex'));
        blocks.push(block('getColorRGB'));
        blocks.push(block('getColorHSV'));
        blocks.push(block('getColorHex'));
        blocks.push('-');
        // disable (does not work after upgrade to Snap 7)
        // blocks.push(block('pickHue'));
        blocks.push(block('setHSB'));
        blocks.push(block('changeHSB'));
		    blocks.push(block('getHSB'));

    } else if (cat === 'control') {
        blocks.push(block('resetAll'));
		    blocks.push('-');
        blocks.push(block('receiveGo'));
        blocks.push(block('receiveKey'));
        blocks.push(block('receiveInteraction'));
        blocks.push(block('receiveCondition'));
        blocks.push(block('receiveMessage'));
        blocks.push('-');
        blocks.push(block('doBroadcast'));
        blocks.push(block('doBroadcastAndWait'));
        blocks.push(block('doSend'));
        blocks.push(watcherToggle('getLastMessage'));
        blocks.push(block('getLastMessage'));
        blocks.push('-');
        blocks.push(block('doWarp'));
        blocks.push('-');
        blocks.push(block('doWait'));
        blocks.push(block('doWaitUntil'));
        blocks.push('-');
        blocks.push(block('doForever'));
        blocks.push(block('doRepeat'));
        blocks.push(block('doUntil'));
        blocks.push(block('doFor'));
        blocks.push('-');
        blocks.push(block('doIf'));
        blocks.push(block('doIfElse'));
        blocks.push(block('reportIfElse'));
        blocks.push('-');
        blocks.push(block('doReport'));
        blocks.push(block('doStopThis'));
        blocks.push('-');
        blocks.push(block('doRun'));
        blocks.push(block('fork'));
        blocks.push(block('evaluate'));
        blocks.push('-');
        blocks.push(block('doTellTo'));
        blocks.push(block('reportAskFor'));
        blocks.push('-');
        blocks.push(block('doCallCC'));
        blocks.push(block('reportCallCC'));
        blocks.push('-');
        blocks.push(block('receiveOnClone'));
        blocks.push(block('createClone'));
        blocks.push(block('newClone'));
        blocks.push(block('removeClone'));
        blocks.push('-');
        blocks.push(block('doPauseAll'));

    } else if (cat === 'sensing') {

        blocks.push(block('reportTouchingObject'));
        blocks.push(block('reportTouchingColor'));
        blocks.push(block('reportColorIsTouchingColor'));
        blocks.push('-');
        blocks.push(block('doAsk'));
        blocks.push(watcherToggle('getLastAnswer'));
        blocks.push(block('getLastAnswer'));
        blocks.push('-');
        blocks.push(watcherToggle('reportMouseX'));
        blocks.push(block('reportMouseX'));
        blocks.push(watcherToggle('reportMouseY'));
        blocks.push(block('reportMouseY'));
        blocks.push(block('reportMouseDown'));
        blocks.push('-');
        blocks.push(block('reportKeyPressed'));
        blocks.push('-');
        blocks.push(block('reportDistanceTo'));
        blocks.push('-');
        blocks.push(block('doResetTimer'));
        blocks.push(watcherToggle('getTimer'));
        blocks.push(block('getTimer'));
        blocks.push('-');

        if (SpriteMorph.prototype.enableFirstClass) {
            blocks.push(block('reportGet'));
        }
        blocks.push('-');

        blocks.push(block('reportURL'));
        blocks.push(block('reportProxiedURL'));
        blocks.push('-');
        blocks.push(block('reportIsFastTracking'));
        blocks.push(block('doSetFastTracking'));
        blocks.push('-');
        blocks.push(block('reportDate'));
        blocks.push('-');


        // for debugging: ///////////////

        if (this.world().isDevMode) {

            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(watcherToggle('reportThreadCount'));
            blocks.push(block('reportThreadCount'));
            blocks.push(block('colorFiltered'));
            blocks.push(block('reportStackSize'));
            blocks.push(block('reportFrameCount'));
        }

    } else if (cat === 'operators') {

        blocks.push(block('reifyScript'));
        blocks.push(block('reifyReporter'));
        blocks.push(block('reifyPredicate'));
        blocks.push('#');
        blocks.push('-');
        blocks.push(block('reportSum'));
        blocks.push(block('reportDifference'));
        blocks.push(block('reportProduct'));
        blocks.push(block('reportQuotient'));
        blocks.push(block('reportPower'));
        blocks.push('-');
        blocks.push(block('reportModulus'));
        blocks.push(block('reportRound'));
        blocks.push(block('reportMonadic'));
        blocks.push(block('reportPi'));
        blocks.push(block('reportRandom'));
        blocks.push('-');
        blocks.push(block('reportLessThan'));
        blocks.push(block('reportEquals'));
        blocks.push(block('reportGreaterThan'));
        blocks.push('-');
        blocks.push(block('reportAnd'));
        blocks.push(block('reportOr'));
        blocks.push(block('reportNot'));
        blocks.push(block('reportBoolean'));
        blocks.push('-');
        blocks.push(block('reportJoinWords'));
        blocks.push(block('reportTextSplit'));
        blocks.push(block('reportLetter'));
        blocks.push(block('reportStringSize'));
        blocks.push('-');
        blocks.push(block('reportUnicode'));
        blocks.push(block('reportUnicodeAsLetter'));
        blocks.push('-');
        blocks.push(block('reportIsA'));
        blocks.push(block('reportIsIdentical'));

        if (Process.prototype.enableJS) {
            blocks.push('-');
            blocks.push(block('reportJSFunction'));
            if (Process.prototype.enableCompiling) {
	            blocks.push(block('reportCompiled'));
            }
        }

        // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportTypeOf'));
            blocks.push(block('reportTextFunction'));
        }
    /////////////////////////////////

     } else if (cat === 'variables') {

        button = new PushButtonMorph(
            null,
            function () {
                new VariableDialogMorph(
                    null,
                    addVar,
                    myself
                ).prompt(
                    'Variable name',
                    null,
                    myself.world()
                );
            },
            'Make a variable'
        );
        button.userMenu = helpMenu;
        button.selector = 'addVariable';
        button.showHelp = BlockMorph.prototype.showHelp;
        blocks.push(button);

        if (this.deletableVariableNames().length > 0) {
            button = new PushButtonMorph(
                null,
                function () {
                    var menu = new MenuMorph(
                        myself.deleteVariable,
                        null,
                        myself
                    );
                    myself.deletableVariableNames().forEach(name =>
                        menu.addItem(
                            name,
                            name,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            true // verbatim - don't translate
                        )
                    );
                    menu.popUpAtHand(myself.world());
                },
                'Delete a variable'
            );
            button.userMenu = helpMenu;
            button.selector = 'deleteVariable';
            button.showHelp = BlockMorph.prototype.showHelp;
            blocks.push(button);
        }

        blocks.push('-');

        varNames = this.reachableGlobalVariableNames(true);
        if (varNames.length > 0) {
            varNames.forEach(name => {
                blocks.push(variableWatcherToggle(name));
                blocks.push(variableBlock(name));
            });
            blocks.push('-');
        }

        varNames = this.allLocalVariableNames(true);
        if (varNames.length > 0) {
            varNames.forEach(name => {
                blocks.push(variableWatcherToggle(name));
                blocks.push(variableBlock(name, true));
            });
            blocks.push('-');
        }

        blocks.push(block('doSetVar'));
        blocks.push(block('doChangeVar'));
        blocks.push(block('doShowVar'));
        blocks.push(block('doHideVar'));
        blocks.push(block('doDeclareVariables'));

        // inheritance:

        if (StageMorph.prototype.enableInheritance) {
            blocks.push('-');
            blocks.push(block('doDeleteAttr'));
        }

        ///////////////////////////////

        blocks.push('=');

        blocks.push(block('reportNewList'));
        blocks.push(block('reportNumbers'));
        blocks.push('-');
        blocks.push(block('reportCONS'));
        blocks.push(block('reportListItem'));
        blocks.push(block('reportCDR'));
        blocks.push('-');
        blocks.push(block('reportListAttribute'));
        blocks.push(block('reportListIndex'));
        blocks.push(block('reportListContainsItem'));
        blocks.push(block('reportListIsEmpty'));
        blocks.push('-');
        blocks.push(block('reportMap'));
        blocks.push(block('reportKeep'));
        blocks.push(block('reportFindFirst'));
        blocks.push(block('reportCombine'));
        blocks.push('-');
        blocks.push(block('doForEach'));
        blocks.push('-');
        blocks.push(block('reportConcatenatedLists'));
        blocks.push(block('reportReshape'));
        blocks.push('-');
        blocks.push(block('doAddToList'));
        blocks.push(block('doDeleteFromList'));
        blocks.push(block('doInsertInList'));
        blocks.push(block('doReplaceInList'));

        // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('doShowTable'));
        }

    /////////////////////////////////
    
        if (StageMorph.prototype.enableCodeMapping) {
            blocks.push(block('doMapCodeOrHeader'));
            blocks.push(block('doMapValueCode'));
            blocks.push(block('doMapListCode'));
            blocks.push('-');
            blocks.push(block('reportMappedCode'));
        }

 	}
    return blocks;
};

SpriteMorph.prototype.bounceOffEdge = function () {
    // taking nested parts into account
    var stage = this.parentThatIsA(StageMorph),
        dirX,
        dirY;

    if (!stage) {return null; }

    dirX = Math.cos(radians(this.heading - 90));
    dirY = -(Math.sin(radians(this.heading - 90)));

    if (this.xPosition() < stage.reportX(stage.left())) {
        dirX = Math.abs(dirX);
    }
    if (this.xPosition() > stage.reportX(stage.right())) {
        dirX = -(Math.abs(dirX));
    }
    if (this.yPosition() > stage.reportY(stage.top())) {
        dirY = -(Math.abs(dirY));
    }
    if (this.yPosition() < stage.reportY(stage.bottom())) {
        dirY = Math.abs(dirY);
    }
    this.setHeading(degrees(Math.atan2(-dirY, dirX)) + 90);

};



// ########################################################################
/* STAGE */
// ########################################################################

// StageMorph

StageMorph.prototype.originalDestroy = StageMorph.prototype.destroy;
StageMorph.prototype.destroy = function () {
    var myself = this;
    this.clearAll();
    this.children.forEach(function (eachSprite) {
        myself.removeChild(eachSprite);
    });
    this.originalDestroy();
};

StageMorph.prototype.originalInit = StageMorph.prototype.init;
StageMorph.prototype.init = function (globals) {
    var myself = this;

    console.log("init stage");
    this.turtleShepherd = new TurtleShepherd();
    this.turtleShepherd.ignoreWarning = StageMorph.prototype.ignoreWarnings;
    this.turtleShepherd.setDefaultColor(StageMorph.prototype.defaultPenColor);

    this.originalInit(globals);
    this.initScene();
    this.initRenderer();
    this.initCamera();
    this.fonts = null;
    this.stepcounter = 0;
    this.isXRay = false;
    this.hasBackgroundImage = false

  	// load customized fonts based on Hershey's fonts.
    /*
  	function loadFont(callback) {
  		var xobj = new XMLHttpRequest();
  		xobj.overrideMimeType("application/json");
  		xobj.open('GET', 'stitchcode/fonts/simplex.json', true);
  		xobj.onreadystatechange = function () {
  			  if (xobj.readyState == 4 && xobj.status == "200") {
  				callback(xobj.responseText);
  			  }
  		};
  		xobj.send(null);
  	}

      if (!this.fonts) {
  		loadFont(function(response) {
  			myself.fonts = JSON.parse(response);
  		});
  	}
    */
    myself.fonts = font_simplex;

    this.scene.grid.draw();
    this.myObjects = new THREE.Object3D();
    this.myStitchPoints = new THREE.Object3D();
    this.myDensityPoints = new THREE.Object3D();
    this.myStitchLines = new THREE.Object3D();
    this.myJumpLines = new THREE.Object3D();
    this.scene.add(this.myObjects);
    this.scene.add(this.myStitchPoints);
    this.scene.add(this.myDensityPoints);
    this.scene.add(this.myStitchLines);
    this.scene.add(this.myJumpLines);

    this.initTurtle();
};

StageMorph.prototype.initScene = function () {
    var myself = this;
    this.scene = new THREE.Scene();
    this.scene.grid = {};
    this.scene.grid.defaultColor = 0xe0e0e0;
    this.scene.grid.interval = new Point(5, 5);
    console.log("init scene");

    // Grid
    this.scene.grid.draw = function () {
      console.log("draw grid");

        //var color = this.lines ? this.lines[0].material.color : this.defaultColor;
        var color = 0xf6f6f6;
        var color2 = 0xe0e0e0;

        if (this.lines) {
            this.lines.forEach(function (eachLine){
                myself.scene.remove(eachLine);
            });
        }

        this.lines = [];

		c = 2.54;
		if (myself.turtleShepherd.isMetric()) {
			this.interval = new Point(5, 5);
			limit = this.interval.x * 50;
		} else {
			this.interval = new Point(Math.round(5 * c), Math.round(5 * c));
			limit = Math.round(this.interval.x * 50 * c);
		}
        for (x = -limit / this.interval.x; x <= limit / this.interval.x; x++) {
            p1 = new THREE.Vector3(x * this.interval.x, -limit, 0);
            p2 = new THREE.Vector3(x * this.interval.x, limit, 0);
            l = myself.scene.addLineFromPointToPointWithColor(p1, p2, color);
            l.visible = !StageMorph.prototype.hideGrid;
            this.lines.push(l);
        }

        for (y = -limit / this.interval.y; y <= limit / this.interval.y; y++) {
            p1 = new THREE.Vector3(-limit, y * this.interval.y, 0);
            p2 = new THREE.Vector3(limit, y * this.interval.y, 0);
            l = myself.scene.addLineFromPointToPointWithColor(p1, p2, color);
            l.visible = !StageMorph.prototype.hideGrid;
            this.lines.push(l);
        }

		if (myself.turtleShepherd.isMetric())
			limit = this.interval.x * 200;
		else
			limit = Math.round(this.interval.x * 200 * c);


        for (x = -limit/10 / this.interval.x; x <= limit/10 / this.interval.x; x++) {
            p1 = new THREE.Vector3(x * this.interval.x * 10, -limit,0);
            p2 = new THREE.Vector3(x * this.interval.x* 10, limit,0);
            l = myself.scene.addLineFromPointToPointWithColor(p1, p2, color2);
            l.visible = !StageMorph.prototype.hideGrid;
            this.lines.push(l);
        }

        for (y = -limit/10 / this.interval.y; y <= limit/10 / this.interval.y ; y++) {
            p1 = new THREE.Vector3(-limit, y * this.interval.y * 10, 0);
            p2 = new THREE.Vector3(limit, y * this.interval.y * 10, 0);
            l = myself.scene.addLineFromPointToPointWithColor(p1, p2, color2);
            l.visible = !StageMorph.prototype.hideGrid;
            this.lines.push(l);
        }

        myself.reRender();
    };

    this.scene.grid.setInterval = function (aPoint) {
        this.interval = aPoint;
        this.draw();
    };

    this.scene.grid.setColor = function (color) {
        this.lines.forEach(function (eachLine) {
            eachLine.material.color.setHex(color);
        });
    };

    this.scene.grid.toggle = function () {
        StageMorph.prototype.hideGrid = !StageMorph.prototype.hideGrid;
        this.lines.forEach(function (line){
          line.visible = !StageMorph.prototype.hideGrid;
        });
        myself.reRender();
    };

};

StageMorph.prototype.clearAll = function () {
    /*for (var i = this.myObjects.children.length - 1; i >= 0; i--) {
        this.myObjects.remove(this.myObjects.children[i]);
    }*/
    for (i = this.myStitchPoints.children.length - 1; i >= 0; i--) {
        this.myStitchPoints.remove(this.myStitchPoints.children[i]);
    }
    for (i = this.myDensityPoints.children.length - 1; i >= 0; i--) {
        this.myDensityPoints.remove(this.myDensityPoints.children[i]);
    }
    for (i = this.myStitchLines.children.length - 1; i >= 0; i--) {
        this.myStitchLines.remove(this.myStitchLines.children[i]);
    }
    for (i = this.myJumpLines.children.length - 1; i >= 0; i--) {
        this.myJumpLines.remove(this.myJumpLines.children[i]);
    }

    this.renderer.clear();
};

StageMorph.prototype.initRenderer = function () {
    var myself = this;

    console.log("set up renderer");

    if(!this.renderer) {
      if (Detector.webgl) {
          this.renderer = new THREE.WebGLRenderer({
              antialias: true,
              alpha: true,
              canvas: this.penTrails()
          });
          console.log("webgl enabled");
          this.renderer_status_msg = "webgl enabled";

      } else {
        console.log("webgl unavailable. fallback to canvas (SLOW!)");
        this.renderer_status_msg = "webgl unavailable. fallback to canvas (SLOW!)";
          this.renderer = new THREE.CanvasRenderer(
              {canvas: this.penTrails()});
      }

      this.renderer.setBackgroundColor = function(color) {
        StageMorph.prototype.backgroundColor  = color;
        myself.turtleShepherd.setBackgroundColor(color);
        myself.renderer.setClearColor(
            new THREE.Color("rgba("+color.r + "," + color.g + "," + color.b + ")"),
        myself.hasBackgroundImage ? 0.0 : 1);
        myself.reRender();
      }

      this.renderer.setBackgroundColor(StageMorph.prototype.backgroundColor);

      this.renderer.changed = false;
      this.renderer.showingAxes = true;
      this.renderer.isParallelProjection = true;
    }

    this.renderer.toggleJumpLines = function () {
        StageMorph.prototype.hideJumps = !StageMorph.prototype.hideJumps;
        myself.myJumpLines.children.forEach(function (eachObject) {
            eachObject.visible = !StageMorph.prototype.hideJumps
        });
        myself.reRender();
    };

    this.renderer.toggleStitchPoints = function () {
        StageMorph.prototype.hideStitches = !StageMorph.prototype.hideStitches;
        myself.myStitchPoints.children.forEach(function (eachObject) {
            eachObject.visible = !StageMorph.prototype.hideStitches;
        });
        myself.reRender();
    };

    this.renderer.toggleTurtle = function () {
        StageMorph.prototype.hideTurtle = !StageMorph.prototype.hideTurtle;
        myself.turtle.visible = !StageMorph.prototype.hideTurtle;
        myself.reRender();
    };


    this.renderer.setBackgroundColorHex = function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    		return r + r + g + g + b + b;
    	});

    	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    	if (result) {
    		r = parseInt(result[1], 16);
    		g = parseInt(result[2], 16);
    		b = parseInt(result[3], 16);
        StageMorph.prototype.backgroundColor = new Color(r, g, b);
        myself.turtleShepherd.setBackgroundColor(StageMorph.prototype.backgroundColor);
    		myself.renderer.setBackgroundColor(StageMorph.prototype.backgroundColor);
      }
      myself.reRender();
    }

    this.renderer.setDefaultPenColorHex = function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);
        StageMorph.prototype.defaultPenColor = new Color(r, g, b);
        myself.turtleShepherd.setDefaultColor(StageMorph.prototype.defaultPenColor);
      }
      myself.reRender();
    }

};


StageMorph.prototype.render = function (ctx) {
    if (this.costume) {
      ctx.save();
      ctx.fillStyle = this.color.toString();
      ctx.fillRect(0, 0, this.width(), this.height());
      ctx.scale(this.scale, this.scale);
      ctx.drawImage(
          this.costume.contents,
          (this.width() / this.scale - this.costume.width()) / 2,
          (this.height() / this.scale - this.costume.height()) / 2
      );
      this.cachedImage = this.applyGraphicsEffects(this.cachedImage);
      ctx.restore();
      this.version = Date.now(); // for observer optimization
    }
    this.renderThree()
};

StageMorph.prototype.renderThree = function () {
    this.renderer.render(this.scene, this.camera);
};

StageMorph.prototype.renderCycle = function () {
    if (this.renderer.changed) {
        this.renderThree();
        this.changed();
        this.parentThatIsA(IDE_Morph).statusDisplay.refresh();
        this.renderer.changed = false;

        // this is a hack but it seems to be need for a clear render!
        // setTimeout(()=> this.changed(), 5)
    }
    // this.render();
    // this.changed();
}

StageMorph.prototype.reRender = function () {
    this.renderer.changed = true;
    this.rerender()
};

StageMorph.prototype.initCamera = function () {
    var myself = this,
        threeLayer;

    if (this.scene.camera) { this.scene.remove(this.camera); }

    var createCamera = function () {
        threeLayer = document.createElement('div');

        if (myself.renderer.isParallelProjection) {
            var zoom = myself.camera ? myself.camera.zoomFactor : 82,
                width = Math.max(myself.width(), 480),
                height = Math.max(myself.height(), 360);

            myself.camera = new THREE.OrthographicCamera(
                    width / - zoom,
                    width / zoom,
                    height / zoom,
                    height / - zoom,
                    0.1,
                    10000);
        } else {
            myself.camera = new THREE.PerspectiveCamera(60, 480/360);
        }

        // We need to implement zooming ourselves for parallel projection

        myself.camera.zoomIn = function () {
            this.zoomFactor /= 1.1;
            this.applyZoom();
        };
        myself.camera.zoomOut = function () {
            this.zoomFactor *= 1.1;
            this.applyZoom();
        };

        myself.camera.getZoom = function () {
            return this.zoomFactor;
        };

        myself.camera.applyZoom = function () {
            var zoom = myself.camera ? myself.camera.zoomFactor : 2;
            let width = Math.max(myself.width(), 480);
            let height = Math.max(myself.height(), 360);

            this.left = width /myself.scale/ - zoom;
            this.right = width/myself.scale / zoom;
            this.top = height /myself.scale/ zoom;
            this.bottom = height /myself.scale/ - zoom;
            this.updateProjectionMatrix();
        };

        myself.camera.reset = function () {

            myself.controls = new THREE.OrbitControls(this, threeLayer);
            myself.controls.addEventListener('change', function (event) { myself.renderThree(); });

            if (myself.renderer.isParallelProjection) {
                this.zoomFactor = 1.7;
                this.applyZoom();
                this.position.set(0,0,10);
            } else {
                this.position.set(0,0,10);
            }

            myself.controls.update();
            myself.reRender();
        };

        myself.camera.fitScene = function () {

          var boundingBox = new THREE.Box3().setFromObject(myself.myStitchLines),
              boundingSphere = boundingBox.getBoundingSphere(),
              center = boundingSphere.center,
              distance = boundingSphere.radius;

          if(distance > 0) {
            var width = Math.max(myself.width(), 480),
                height = Math.max(myself.height(), 360);

            this.zoomFactor = Math.max(width / distance, height / distance) * 0.90;
            this.applyZoom();

            this.position.set(center.x, center.y, 10);
            myself.controls.center.set(center.x, center.y, 10);

            myself.controls.update();
            myself.reRender();
          }
        };
    };

    createCamera();
    this.scene.add(this.camera);
    this.camera.reset();
};

StageMorph.prototype.initTurtle = function() {
    var myself = this;
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity:0.7,side:THREE.DoubleSide, transparent:true } );
	this.turtle = new THREE.Mesh(new THREE.Geometry(), material);

    if (typeof this.turtle.loaded === 'undefined') {

		var loader = new THREE.JSONLoader();
    //var loader = new THREE.LegacyJSONLoader(); // for new version!
    /*
		loader.load('stitchcode/assets/turtle.json',
			function ( geometry, materials ) {
				//var material = materials[ 0 ];
				this.turtle = new THREE.Mesh(geometry,material);
				this.turtle.scale.set(4, 4, 4);
				this.turtle.position.z = 0.02;
				this.turtle.rotation.x = 90 * Math.PI / 180;
				this.turtle.rotation.y = 270 * Math.PI / 180;
				//this.turtle.material.color = new THREE.Color("rgb(1,0,0)" );

				myself.turtle = this.turtle;
				myself.turtle.visible = !StageMorph.prototype.hideTurtle;
				myself.renderer.changed = true;
				myself.myObjects.add(this.turtle);
				this.turtle.loaded = true;
			},

			// onProgress callback
			function ( xhr ) {
				//console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},

			// onError callback
			function( err ) {
				console.log( 'error loading turtle shape' );
			}
      */
      var model = loader.parse( turtle_model );
      this.turtle = new THREE.Mesh(model.geometry, model.materials[0]);
      this.turtle.scale.set(4, 4, 4);
      this.turtle.position.z = 0.02;
      this.turtle.rotation.x = 90 * Math.PI / 180;
      this.turtle.rotation.y = 270 * Math.PI / 180;
      //this.turtle.material.color = new THREE.Color("rgb(1,0,0)" );

      myself.turtle = this.turtle;
      myself.turtle.visible = !StageMorph.prototype.hideTurtle;
      myself.renderer.changed = true;
      myself.myObjects.add(this.turtle);
      this.turtle.loaded = true;

    }
    this.penSize = 1;
};

StageMorph.prototype.moveTurtle = function(x, y) {
    this.turtle.position.x = x;
    this.turtle.position.y = y;
};

StageMorph.prototype.setPenSize = function(s) {
    this.penSize = s;
};

StageMorph.prototype.rotateTurtle = function(h) {
    this.turtle.rotation.y = (-h) * Math.PI / 180;
    this.renderer.changed = true;
};

StageMorph.prototype.originalStep = StageMorph.prototype.step;
StageMorph.prototype.step = function () {
    this.originalStep();

    if (!(this.isFastTracked && this.threads.processes.length)) {
		this.renderCycle();
	} else {
		if (this.stepcounter % 12 == 0) {
			this.renderCycle();
		}
	};
	this.stepcounter++;
};

StageMorph.prototype.referencePos = null;

StageMorph.prototype.mouseScroll = function (y, x) {
    if (this.renderer.isParallelProjection) {
        if (y > 0) {
            this.camera.zoomOut();
        } else if (y < 0) {
            this.camera.zoomIn();
        }
    } else {
        if (y > 0) {
            this.controls.dollyOut();
        } else if (y < 0) {
            this.controls.dollyIn();
        }
        this.controls.update();
    }
    this.renderer.changed = true;
};

StageMorph.prototype.mouseDownLeft = function (pos) {
    this.referencePos = pos;
};

StageMorph.prototype.mouseDownRight = function (pos) {
    this.referencePos = pos;
};

StageMorph.prototype.mouseMove = function (pos, button) {

    if (this.referencePos === null) { return };

    var factor = this.renderer.isParallelProjection ? 65 / this.camera.zoomFactor : this.controls.object.position.length() / 10,
        deltaX = (pos.x - this.referencePos.x),
        deltaY = (pos.y - this.referencePos.y);

    this.referencePos = pos;

    if (button === 'right' || this.world().currentKey === 16 || button === 'left') { // shiftClicked
        this.controls.panLeft(deltaX / this.dimensions.x / this.scale * 15 * factor);
        this.controls.panUp(deltaY / this.dimensions.y / this.scale * 10 * factor);
    } else {
        var horzAngle = deltaX / (this.dimensions.x * this.scale) * 360;
        var vertAngle = deltaY / (this.dimensions.y * this.scale) * 360;
        this.controls.rotateLeft(radians(horzAngle));
        this.controls.rotateUp(radians(vertAngle));
    }

    this.controls.update();
    this.reRender();
};

StageMorph.prototype.mouseLeave = function () {
    this.referencePos = null;
};

// StageMorph Mouse Coordinates

StageMorph.prototype.reportMouseX = function () {
    var world = this.world();
    if (world) {
        return ((world.hand.position().x - this.center().x) / this.scale)  / this.camera.zoomFactor * 2 + this.controls.center.x;
    }
    return 0;
};

StageMorph.prototype.reportMouseY = function () {
    var world = this.world();
    if (world) {
        return ((this.center().y - world.hand.position().y) / this.scale)  / this.camera.zoomFactor * 2 + this.controls.center.y;
    }
    return 0;
};

StageMorph.prototype.turnXRayOn = function () {
  this.isXRay = true;
  for (i = this.myStitchLines.children.length - 1; i >= 0; i--) {
      this.myStitchLines.remove(this.myStitchLines.children[i]);
  }
  stitches = this.turtleShepherd.getStitchesAsArr();
  this.renderer.setClearColor(new THREE.Color("rgb(0,0,0)"), this.hasBackgroundImage ? 0.0 : 1);

  if (!StageMorph.prototype.hideGrid)
    this.scene.grid.toggle();
  if (!StageMorph.prototype.hideStitches)
    this.renderer.toggleStitchPoints();
  if (!StageMorph.prototype.hideJumps)
    this.renderer.toggleJumpLines();
    if (!StageMorph.prototype.hideTurtle)
      this.renderer.toggleTurtle();

  for (i =0; i < stitches.length; i++) {
    stitch = stitches[i];
    var deltaX = stitch[1][0] - stitch[0][0];
    var deltaY = stitch[1][1] - stitch[0][1];
    var angle = Math.abs(deltaX) < 0.000 ? (deltaY < 0 ? 90 : 270)
          : Math.round( (deltaX >= 0 ? 0 : 180)  - (Math.atan(deltaY / deltaX) * 57.2957795131),8
        ) + 90;
    //if (angle == 270 ) angle = 0;

    this.children[0].addStitch(stitch[0][0], stitch[0][1], stitch[1][0], stitch[1][1], angle)
  }
  this.renderer.changed = true;

}

StageMorph.prototype.turnXRayOff = function () {
  this.isXRay = false;
  for (i = this.myStitchLines.children.length - 1; i >= 0; i--) {
      this.myStitchLines.remove(this.myStitchLines.children[i]);
  }

  stitches = this.turtleShepherd.getStitchesAsArr();

  this.renderer.setClearColor(
      new THREE.Color(
          "rgb("+
          StageMorph.prototype.backgroundColor.r + "," +
          StageMorph.prototype.backgroundColor.g + "," +
          StageMorph.prototype.backgroundColor.b + ")"),
          this.hasBackgroundImage ? 0.0 : 1
  );

  for (i =0; i < stitches.length; i++) {
    stitch = stitches[i];
    this.children[0].color = stitch[2];
    var deltaX = stitch[1][0] - stitch[0][0];
    var deltaY = stitch[1][1] - stitch[0][1];

    var angle = Math.abs(deltaX) < 0.000 ? (deltaY < 0 ? 90 : 270)
          : Math.round( (deltaX >= 0 ? 0 : 180)  - (Math.atan(deltaY / deltaX) * 57.2957795131),8
        ) + 90;
    this.children[0].addStitch(stitch[0][0], stitch[0][1], stitch[1][0], stitch[1][1], angle)
  }

  ide = this.parentThatIsA(IDE_Morph);

  if (ide.hideGrid != StageMorph.prototype.hideGrid)
    this.scene.grid.toggle();
  if (ide.hideStitches != StageMorph.prototype.hideStitches)
    this.renderer.toggleStitchPoints();
  if (ide.hidejumps != StageMorph.prototype.hideJumps)
    this.renderer.toggleJumpLines();
  if (ide.hideTurtle != StageMorph.prototype.hideTurtle)
    this.renderer.toggleTurtle();

  this.renderer.changed = true;

}

StageMorph.prototype.getIsXRay = function () {
  return this.isXRay;
}

StageMorph.prototype.clearPenTrails = nop;

StageMorph.prototype.penTrails = function () {
    if (!this.trailsCanvas) {
        this.trailsCanvas = newCanvas(this.dimensions, true);
    }
    return this.trailsCanvas;
};

// StageMorph drawing
StageMorph.prototype.originalDrawOn = StageMorph.prototype.drawOn;
StageMorph.prototype.drawOn = function (ctx, rect) {
    // If the scale is lower than 1, we reuse the original method,
    // otherwise we need to modify the renderer dimensions
    // we do not need to render the original canvas anymore because
    // we have removed sprites and backgrounds

    var rectangle, area, delta, src, w, h, sl, st;
    if (!this.isVisible) {
        return null;
    }
    /*
    if (this.scale < 1) {
        return this.originalDrawOn(aCanvas, aRect);
    }*/

    // costume, if any, and background color
    StageMorph.uber.drawOn.call(this, ctx, rect);

    rectangle = rect || this.bounds;
    area = rectangle.intersect(this.bounds).round();
    if (area.extent().gt(new Point(0, 0))) {
        delta = this.position().neg();
        src = area.copy().translateBy(delta).round();
        ctx.globalAlpha = this.alpha;

        sl = src.left();
        st = src.top();
        w = Math.min(src.width(), area.width() - sl);
        h = Math.min(src.height(), area.height() - st);

        if (w < 1 || h < 1) {
            return null;
        }
        // we only draw pen trails!
        ctx.save();
        try {
            ctx.drawImage(
                this.penTrails(),
                sl,
                st,
                w,
                h,
                area.left(),
                area.top(),
                w,
                h
            );
        } catch (err) { // sometimes triggered only by Firefox
            console.log(err);
        }
        ctx.restore();
    }
};

StageMorph.prototype.originalSetScale = StageMorph.prototype.setScale;
StageMorph.prototype.setScale = function (number) {
    this.scaleChanged = true;
    this.originalSetScale(number);
    this.camera.aspect = this.extent().x / this.extent().y;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.extent().x, this.extent().y);
    this.renderer.changed = true;
};


// Contextual menu
StageMorph.prototype.userMenu = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        menu = new MenuMorph(this),
        shiftClicked = this.world().currentKey === 16,
        myself = this;

    if (ide && ide.isAppMode) {
        menu.hide();
        return menu;
    }
    menu.addItem(
            'pic...',
            function () {
                window.open(myself.fullImageClassic().toDataURL());
            },
            'open a new window\nwith a picture of the scene'
            );
    return menu;
};


StageMorph.prototype.toggleIgnoreWarnings = function () {
	StageMorph.prototype.ignoreWarnings = !StageMorph.prototype.ignoreWarnings;
	this.turtleShepherd.ignoreWarning = StageMorph.prototype.ignoreWarnings;
};


StageMorph.prototype.reportX = function (x) {
	return (x - this.center().x)
	        / this.camera.zoomFactor
          / this.scale
          * 2
          + this.controls.center.x;
};

StageMorph.prototype.reportY = function (y) {
	return (this.center().y - y)
	        / this.camera.zoomFactor
          / this.scale
          * 2
          + this.controls.center.y;
};


// Caches

var Cache;

Cache.prototype = {};
Cache.prototype.constructor = Cache;
Cache.uber = Object.prototype;

function Cache () {
    this.init();
};

Cache.prototype.init = function () {
    this.materials = [];
    this.geometries = { stitch: [], stitchPoint: [], densityPoint: [], circle: [], plane: [], meshline: [] };
};

Cache.prototype.clear = function () {
    this.init();
};

Cache.prototype.addMaterial = function (material) {
    this.materials.push(material);
};

Cache.prototype.findMaterial = function (color, opacity) {
    return detect(
		this.materials,
		function (each) {
			return each.color.r == color.r && each.color.g == color.g && each.color.b == color.b && each.opacity == opacity;
		});
};

Cache.prototype.addGeometry = function (type, geometry, params) {
    this.geometries[type].push({ params: params, geometry: geometry });
};

Cache.prototype.findGeometry = function (type, params) {
    var geometry = detect(
            this.geometries[type],
            function (each) {
                return (each.params.length === params.length)
                    && each.params.every(function (element, index) {
                        return element === params[index];
                    })
            });

    if (geometry) {
        return geometry.geometry;
    } else {
        return null;
    }
};


StageMorph.prototype.clearStageBackground = function() {
  var myself = this;
/*
 var wardrobe = this.parentThatIsA(WardrobeMorph),
        idx = this.parent.children.indexOf(this),
        off = CamSnapshotDialogMorph.prototype.enableCamera ? 3 : 2,
        ide = this.parentThatIsA(IDE_Morph);
    wardrobe.removeCostumeAt(idx - off); // ignore paintbrush and camera buttons
    if (ide.currentSprite.costume === this.object) {
        ide.currentSprite.wearCostume(null);
    }
  */

  myself.shadowAttribute('costumes');
  for(var i=0; i < myself.costumes.length(); i++) {
    myself.costumes.remove(0);
  }
  myself.wearCostume(null);
  myself.hasBackgroundImage =  false;
  myself.renderer.setClearColor(
    new THREE.Color(
        "rgb("+
        StageMorph.prototype.backgroundColor.r + "," +
        StageMorph.prototype.backgroundColor.g + "," +
        StageMorph.prototype.backgroundColor.b + ")"),
        myself.hasBackgroundImage ? 0.5 : 1
  );
  myself.hasChangedMedia = true;
};

StageMorph.prototype.loadCameraSnapshot = function() {
    var myself = this;
    var ide = this.parentThatIsA(IDE_Morph);
    var camDialog,
        sprite = this;

    camDialog = new CamSnapshotDialogMorph(
        ide,
        sprite,
        nop,
        costume => {
          ide.loadAsBackgroundOrData(costume, 'snapshot')
        });

    camDialog.key = 'camera';
    camDialog.popUp(this.world());
};
