
Process.prototype.proxy = 'https://cors-proxy.turtlestitch.org';
Process.prototype.enableJS = true;

Process.prototype.reportMouseX = function () {
    var stage, world;
    if (this.homeContext.receiver) {
        stage = this.homeContext.receiver.parentThatIsA(StageMorph);
        if (stage) {
            world = stage.world();
            if (world) {
                 return (
                   (world.hand.position().x - stage.center().x)
                     / stage.camera.zoomFactor
                     / stage.scale
                     * 2
                     + stage.controls.center.x
               );
            }
        }
    }
    return 0;
};

Process.prototype.reportMouseY = function () {
    var stage, world;
    if (this.homeContext.receiver) {
        stage = this.homeContext.receiver.parentThatIsA(StageMorph);
        if (stage) {
            world = stage.world();
            if (world) {
                return (
                  (stage.center().y - world.hand.position().y)
                   / stage.camera.zoomFactor
                   / stage.scale
                   * 2
                   + stage.controls.center.y
                 );
            }
        }
    }
    return 0;
};

Process.prototype.zoomToFit = function() {
	stage = this.homeContext.receiver.parentThatIsA(StageMorph);
	if (stage) {
		stage.camera.fitScene();
	}
}

Process.prototype.reportPi = function (min, max) {
    return Math.PI;
};

// Process URI retrieval (interpolated)

Process.prototype.reportURL = function (url) {
    var response;
    if (!this.httpRequest) {
        // use the location protocol unless the user specifies otherwise
        if (url.indexOf('//') < 0 || url.indexOf('//') > 8) {
            if (location.protocol === 'file:') {
                // allow requests from locally loaded sources
                url = 'https://' + url;
            } else {
                url = location.protocol + '//' + url;
            }
        }
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.open("GET", url, true);
        // cache-control, commented out for now
        // added for Snap4Arduino but has issues with local robot servers
        // this.httpRequest.setRequestHeader('Cache-Control', 'max-age=0');
        this.httpRequest.send(null);
        if (this.context.isCustomCommand) {
            // special case when ignoring the result, e.g. when
            // communicating with a robot to control its motors
            this.httpRequest = null;
            return null;
        }
    } else if (this.httpRequest.readyState === 4) {
        response = this.httpRequest.responseText;
        this.httpRequest = null;
        return response;
    }
    this.pushContext('doYield');
    this.pushContext();
};

Process.prototype.reportProxiedURL = function (url) {
    return this.reportURL(this.proxy + '/' + url);
};

Process.prototype.origReportDistanceTo = Process.prototype.reportDistanceTo;
Process.prototype.reportDistanceTo = function (name) {
	var thisObj = this.blockReceiver();
	if (thisObj && this.inputOption(name) === 'mouse-pointer') {
		return new Point(thisObj.xPosition(), thisObj.yPosition()).distanceTo(new Point(this.reportMouseX(), this.reportMouseY()));
	} else {
		return this.origReportDistanceTo(name);
  }
}

Process.prototype.origDoGotoObject = Process.prototype.doGotoObject;
Process.prototype.doGotoObject = function (name) {
	var thisObj = this.blockReceiver(),
			stage;

	if (thisObj && this.inputOption(name) === 'random position') {
		stage = thisObj.parentThatIsA(StageMorph);
		if (stage) {
			thisObj.gotoXY(
        this.reportBasicRandom(stage.reportX(stage.left()), stage.reportX(stage.right())),
        this.reportBasicRandom(stage.reportY(stage.top()), stage.reportY(stage.bottom()))
    );
		}
	} else {
		this.origDoGotoObject(name);
	}
};

Process.prototype.reportRandomPosition = function () {
	var thisObj = this.blockReceiver(),
			stage;

	if (thisObj) {
	  stage = thisObj.parentThatIsA(StageMorph);
	  return new List([this.reportBasicRandom(stage.reportX(stage.left()), stage.reportX(stage.right())),
                   this.reportBasicRandom(stage.reportY(stage.top()), stage.reportY(stage.bottom()))]);
  }

};
