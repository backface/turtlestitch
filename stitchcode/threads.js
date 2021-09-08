
Process.prototype.proxy = 'https://turtlestitch.org:8080';
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
