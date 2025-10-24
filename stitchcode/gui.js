VERSION="2.11.0-dev8-api"

// get debug mode
url = new URL(window.location.href);
searchParams = new URLSearchParams(url.search);
var DEBUG = (searchParams.get("debug") == "true")

// Force flat design
IDE_Morph.prototype.setDefaultDesign = IDE_Morph.prototype.setFlatDesign;
IDE_Morph.prototype.setDefaultTheme = IDE_Morph.prototype.setBrightTheme;

// ad some padding
IDE_Morph.prototype.originalInit = IDE_Morph.prototype.init;
IDE_Morph.prototype.init = function(config) {
    this.originalInit(config);
    this.padding = 1;
	/*
	 this.droppedText(
		this.getURL(this.resourceURL('stitchcode/embroidery-library.xml')),
		'Embroidery tools'
	);
	*/
	//this.isAnimating = false;
    this.paletteWidth = 250; // initially same as logo width
    //MorphicPreferences.globalFontFamily = 'Sans, Helvetica, Arial';
	// this.cloud = new BeetleCloud('/api', this);
};


//  change logo
IDE_Morph.prototype.originalCreateLogo = IDE_Morph.prototype.createLogo;
IDE_Morph.prototype.createLogo = function () {
	this.originalCreateLogo();
	//if (MorphicPreferences.isFlat) {
	// we are always flat!
  this.logo.texture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAgCAYAAACSEW+lAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUJDg4Jd5V8gAAACNhJREFUaN7tmXtwVPUVxz/37jOb1yYjyW5IspBNIOQF1KQ+Y8RaxeeM2qpVZuwgdfpQbEWLluKDqbXTmXY6+BjH1qKOAkEsoGMjyCMkEmwSCCYQ8ti8Nwl5sdmwz+ze/fUPZGHLQ9BRSGe///1+v/O7e873nnPuOWchiiiiuIhwHD362FTUW5pKyvb19on/fL4Xv99PQkICIGGxWCiaN1eKEv0toPlQs2hva8Pj8RAfH4csq7j19ttOs2VwcFB02DoYGjpCcXExlhkzLpq98lQkOi8/Tyotu26pwRCDooRoOXwYW3u7OFWmu6tLHGxqIhRS8Hl9SNLF9akpSTRAcnLyy/kFBQwPDaFSq+i390ecH2hoIDY2lrHRUZzj42RaLFI0dXwDbK2oEEeOHEGv15M2fTqpJhOjIyM4nU5kSaK7u5vLi4spLimJEv11YLfbha2tHbVGTUJ8ArJKxuVyMe5wMDAwQEyMAWOSEZ/Xx1333H3R7VRPRZJbW1pFS3Mzs3JzyczMPI3EI4ODorqqigmnk9KysmhN/HUwODgo3i8vF46jR288Z73tcGRtWL9eRBn7mthdWSkONjWdF4FVlZXis+rqS4LsKZWje3t6RFdnF2ULrj8vvfv6+kTFxx9jNCah02mRVSpmz57NrNmzv3O7p1R5Z7PZmJ4+/bzlMzIyJL0+hgmnk7i4eLQaDTV79jA4MCCiRJ8DoyOjZOfkXJA3hkIKBUWFCAROpxODIZaDTQejDcuZ0G+3i701NUKv119YBLTbREgJccWVV3JtaSn5BQUkGhPp7e3BZrN9p159SZd3nR0doru7m6bGJgb6+8m0ZF7gTOQg09PTAdDpdOTl55ORkUF5dw+HmpouTh398yU/E8FgkNjYWLxeL4qi8MRTT/HuO+9QWFTEA4selABWPP2MsGZbWbxkifTiC6tES0sLgclJZufm8utly5bW1daufuvNf2JMTkKtUjHucDB3/nwW/OAGXnv5VX63cgVZVqsEx0eeq557frXb4yEwOYlKpWLVH18kLS1N6rDZREtLCypZRlEUfH4fknRhAehyuSgsKqKuto5DB5uYlpLCvHnzycq2Uldby+7KShGjj2F0bBSz2Xz8d3w+LBYLra2tyLKMXq8nGAzicbtZeOutEkDNnj2i396PTqcjN28OEtDd3U1BYSFms1lqa20TXZ2d5Bfkk56RIUWkDo1Wg9PpZMumTYyMjKDVaVGUIFsrKmhqbAwrv3P7dhr2NwCwZfNmxsfHKbniCjZv2sQTjz++OhQKodVraTxwgE+3bUNWyWg0Ggb6+/lw8yYcDkf4WePj46s/2rKFAbudhIQE4uPjidHrlwKMjY1hMpnIslqxZlspKCzE5/OdN8lVu3eLnFmzCAQCHNi/n9RUE5IkEQgEMBgMFBXNpae7h+HhYZRgEEVR6OrsZHBwEJ/Ph9/nZ2xsDHufHZfLRTCoAFBdVSX21e9Dr9djMBiY9B+Xs7W3oyjHZXw+H329vXjPpm/TF40i05wmqiorw/nr+/O/J577/crw+obSMvHkb54QAFcVl4g/v/SSEEKI51euFEVz8sJyK5Y/LUqvvCq8/vijj8SMtHTRsL9BnDphy7HMFOvefS8iX3Z0dIihI0dOy6Hvl5d/ZV4dHh6u/+TfFWJvTY0A2LC+XJSvW3fGe+vWrhXbPtkaPvtwyxaxfu3a8PrzvXvF22vWCLvdLk6ksnfeelvsq6+PeN6++nrxjzf+Ljo7OgRAe1ubeHvNW6LlcIs448fQ7/cjSRL+ycnIYvvUEaMkABHOe/W1dfztL39l+7btLF6yJCwWDAYR4n/tO93e2LhYXnvlFW658YfiwfvuFwBWq1VKNZlOqy48bg9Hz9IRjo2O/qmutlYc2N9wuWWGhauuvloCSE9Px+v18q+NH5zW6AQnAxE66nS6iKjRaDT4vD40avWJ1h9Zlrm8uDhCN70+BlmWqaut44ONG0VvTy96vQ5Zls78MRQniBDi3D3Ol8dqtZqhoSG2VlTgcBzlpoU3w7Jz90cR70ySUIIK1uxs8vLziI2L473y9We9PdOaRfXuqk/31dej1Wjx+rx4PR58fj8HGhqYlpLCTQtvjiDh6muvkZoaG0V3Vxc1e/ZwuLlZzMnLkwAkWUav1518kR4PKpUqwvFiDAY0Wu1SAEUJRpB3Aj6vl5CiEBOjJyExEVmW8Xq9BAKB8y/vEo1GOjs6wuuhwUFMZlNYsZtvWcgnO7ZLcXHxvPH661+ZO1WqyELH5/Ny2x2389tnnpF+9dhj56yRrysrk4xJRoaHhvH6vMiyjMvl/jLiJIrmnvkvrcKiIuma0tKlCQmJ9PX2hffj4uIIhUInPVqrw2AwhNcxMTFoNGom/f7VACazGZfLRfOh5ghPVGvUaHVaiubO5foFCySTyczExASyLJ/ZoxVF4dixYwSDwfDeXffczR9eWMUvHnlEDNj7aWtt4/Y77+TJ5ctxu91MOCcAKC4pZteOnad4gw+3230yTBUFr9fD8mXLuOuOO0V6RjoetwdJknh19Sssuv8nYnJykhXPrmTuvHlnJbzs+sj2u3LXLuE65orwnlOxccMGERcfT4fNRmxcLGnT005GsAihVp+kQKvVMjIyHMGHWq0OB3hxSYm0ccMG0dT4Bbt27BRqtZqU1BQA3G53+IMZDAaJj4+PmHBEEJ2amsrihx8m02IJ7/3y0UelNW++KXZ8up30jAxWPPssuXPmSAA/vu8+8gsKAHhg0SIMsbFs3blDmEwm6ZprS0lJTaXh4PF6debMmfz04cUgYDIQIDU1lURjIoseegi3y0VQUQgGAuh0ugsq4dLS0mhsbCQpKemM5yazGcdRB37/JDmzZpGbmyudenbZZdPCstNSpqE7JZUkJycTCAQwp5nDd350773SZ9XVIhAIIEnHX47BYCAnJ4fsnGwJwGhMJCvLitFonPqD/5PdX7to/KKRTIuF4pLiS9YeeaoT7fV6MSYZL2mS/y/w+d690eF+FFFEEUUU3wj/Bfcz33x83aRpAAAAAElFTkSuQmCC";

  this.logo.fixLayout();
};



IDE_Morph.prototype.createPalette = function (forSearching) {
    // assumes that the logo pane has already been created
    // needs the categories pane for layout
    var myself = this,
	    vScrollAction;

    if (this.palette) {
        this.palette.destroy();
    }

    if (forSearching) {
        this.palette = new ScrollFrameMorph(
            null,
            null,
            this.currentSprite.sliderColor
        );

        // search toolbar (floating cancel button):
        /* commented out for now
        this.palette.toolBar = new PushButtonMorph(
            this,
            function () {
                myself.refreshPalette();
                myself.palette.adjustScrollBars();
            },
            new SymbolMorph("magnifierOutline", 16)
        );
        this.palette.toolBar.alpha = 0.2;
        this.palette.toolBar.padding = 1;
        // this.palette.toolBar.hint = 'Cancel';
        this.palette.toolBar.labelShadowColor = new Color(140, 140, 140);
        this.palette.toolBar.fixLayout();
        this.palette.toolBar.fixLayout();
        this.palette.add(this.palette.toolBar);
	    */
    } else {
        this.palette = this.currentSprite.palette(this.currentCategory);
    }
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = true;
    this.palette.enableAutoScrolling = false;
    this.palette.contents.acceptsDrops = false;
	
    if (this.scene.unifiedPalette) {
        this.palette.adjustScrollBars = function () {
            ScrollFrameMorph.prototype.adjustScrollBars.call(this);
            myself.categories.refresh();
        };

        vScrollAction = this.palette.vBar.action;
        this.palette.vBar.action = function (num) {
            vScrollAction(num);
            myself.categories.buttons.forEach(each => each.refresh());
        };
    }	

    this.palette.reactToDropOf = function (droppedMorph, hand) {
        if (droppedMorph instanceof DialogBoxMorph) {
            myself.world().add(droppedMorph);
        } else if (droppedMorph instanceof SpriteMorph) {
            myself.removeSprite(droppedMorph);
        } else if (droppedMorph instanceof SpriteIconMorph) {
            droppedMorph.destroy();
            myself.removeSprite(droppedMorph.object);
        } else if (droppedMorph instanceof CostumeIconMorph) {
            //myself.currentSprite.wearCostume(null);
            droppedMorph.perish(myself.isAnimating ? 200 : 0);
        } else if (droppedMorph instanceof BlockMorph) {
            myself.stage.threads.stopAllForBlock(droppedMorph);
            if (hand && hand.grabOrigin.origin instanceof ScriptsMorph) {
                hand.grabOrigin.origin.clearDropInfo();
                hand.grabOrigin.origin.lastDroppedBlock = droppedMorph;
                hand.grabOrigin.origin.recordDrop(hand.grabOrigin);
            }
            droppedMorph.perish(myself.isAnimating ? 200 : 0);
            myself.currentSprite.recordUserEdit(
                'scripts',
                'block',
                'delete',
                droppedMorph.abstractBlockSpec()
            );
        } else {
            droppedMorph.perish(myself.isAnimating ? 200 : 0);
            if (droppedMorph instanceof CommentMorph) {
                myself.currentSprite.recordUserEdit(
                    'scripts',
                    'comment',
                    'delete'
                );
            }
        }
    };

    this.palette.contents.reactToDropOf = function (droppedMorph) {
        // for "undrop" operation
        if (droppedMorph instanceof BlockMorph) {
            droppedMorph.destroy();
        }
    };

    this.palette.droppedImage = (aCanvas, name, embeddedData) => {
        this.droppedImage(aCanvas, name, embeddedData, 'palette');
    };
	
    this.palette.setWidth(this.logo.width());
    this.add(this.palette);
    return this.palette;
};


IDE_Morph.prototype.resourceURLOrig  = IDE_Morph.prototype.resourceURL;
IDE_Morph.prototype.resourceURL = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args[0] == "Backgrounds" || args[0] == "Examples" || args[0] == "libraries" )
        return 'stitchcode/' + args[0] + '/' + args[1];
    else {
        return args.join('/');
    }
};

// Single Sprite mode, no corral and no tabs in the scripting area
IDE_Morph.prototype.createCorralBar = nop;
IDE_Morph.prototype.createCorral = nop;

// build panes (do not add all)
IDE_Morph.prototype.buildPanes = function () {
    this.createLogo();
    this.createControlBar();
    this.createCategories();
    this.createPalette();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.createStage();
    //this.createCorralBar();
    //this.createCorral();
    this.createStatusDisplay();
    this.createStageHandle();
    this.createPaletteHandle();
    this.applySavedTurtleStitchSettings();

};

IDE_Morph.prototype.applySavedTurtleStitchSettings = function () {
  units = this.getSetting('units'),
  hidegrid = this.getSetting('hidegrid');
  hidejumps = this.getSetting('hidejumps');
  hideturtle = this.getSetting('hideturtle');
  hidestitches = this.getSetting('hidestitches');
  warnings = this.getSetting('ignoreWarning');
  isImperial = this.getSetting('isImperial');
  backgroundColor = this.getSetting('backgroundColor')
  defaultPenColor = this.getSetting('defaultPenColor')


  if(hidegrid) {
    this.stage.scene.grid.toggle();
    //StageMorph.prototype.hideGrid = true;
  }
  else {
    StageMorph.prototype.hideGrid = false;
  }

  if(hidejumps) {
    //StageMorph.prototype.hideJumps = true;
    this.stage.renderer.toggleJumpLines()
  } else {
    StageMorph.prototype.hideJumps = false;
  }

  if(hideturtle) {
    this.stage.renderer.toggleTurtle()
    //StageMorph.prototype.hideTurtle = true;
  } else {
    StageMorph.prototype.hideTurtle = false;
  }

  if(hidestitches) {
    this.stage.renderer.toggleStitchPoints()
    //StageMorph.prototype.hideStitches = true;
  } else {
    StageMorph.prototype.hideStitches = false;
  }

  if(warnings) {
   this.stage.toggleIgnoreWarnings();
	 //StageMorph.prototype.ignoreWarnings = true;
  } else {
	 StageMorph.prototype.ignoreWarnings = false;
  }

  if(isImperial) {
    this.stage.turtleShepherd.setMetric(false);
    this.stage.scene.grid.draw();
    this.stage.renderer.changed = true;
  } else {
    this.stage.turtleShepherd.setMetric(true);
  }

  if (backgroundColor) {
    this.stage.renderer.setBackgroundColorHex(backgroundColor);
  } else {
    this.stage.renderer.setBackgroundColorHex('#fffffff');
  }

  if (defaultPenColor) {
    this.stage.renderer.setDefaultPenColorHex(defaultPenColor);
    this.currentSprite.setColor(StageMorph.prototype.defaultPenColor);
  } else {
    this.stage.renderer.setDefaultPenColorHex('#000000');
  }

}

IDE_Morph.prototype.unitsMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        pos = this.controlBar.turtlestitchButton.bottomLeft(),
        myself = this;

    menu.addItem(
        (true ? '\u2713 ' : '    ') +   "pixel",
        function () {
            myself.setUnits("pixel");
        }
    );
    menu.addItem(
        (this.units === "millimeter" ? '\u2713 ' : '    ') +   "millimeter",
        function () {
            myself.setUnits("millimeter");
        }
    );
    menu.addItem(
        (this.units === "inch" ? '\u2713 ' : '    ') +   "inch",
        function () {
            myself.setUnits("inch");
        }
    );
    menu.popup(world, pos);
};


IDE_Morph.prototype.setUnits = function (unit) {
   // TODO:
}


PaletteHandleMorph.prototype.init = function (target) {
    this.target = target || null;
    HandleMorph.uber.init.call(this);
    this.color = MorphicPreferences.isFlat ?
            new Color(125, 125, 125) : new Color(190, 190, 190);
    this.isDraggable = false;
    this.noticesTransparentClick = true;
    this.setExtent(new Point(12, 50));
};

IDE_Morph.prototype.origNewProject = IDE_Morph.prototype.newProject;
IDE_Morph.prototype.newProject = function () {
    //this.origNewProject();

    var project = new Project();

    project.addDefaultScene();


    this.openProject(project);


    StageMorph.prototype.dimensions = new Point(480, 360);
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    StageMorph.prototype.enableInheritance = true;
    StageMorph.prototype.enableSublistIDs = false;

    StageMorph.prototype.hideGrid = false;
    StageMorph.prototype.hideJumps = false;
    StageMorph.prototype.hideTurtle = false;
    StageMorph.prototype.hidestitches = false;
    StageMorph.prototype.ignoreWarnings = false;

    StageMorph.prototype.backgroundColor = new Color(255,255,255);
    StageMorph.prototype.penColor = new Color(255,255,255);

    SpriteMorph.prototype.useFlatLineEnds = false;

    // hide sprite
    this.stage.children[0].hide();
    this.stage.clearAll();
    this.stage.rotateTurtle(this.stage.children[0].heading);
    this.createStatusDisplay();
    // clear stitch cache now (loading projects sends turtle move commands!)
    this.stage.clearAll();
    this.stage.turtleShepherd.clear();
    this.stage.reRender();
    
    this.setProjectName('');
    this.projectNotes = '';
    this.createStageHandle();
};


IDE_Morph.prototype.openProject = function (project, purgeCustomizedPrims) {
	var scn = project.currentScene || project.scenes.at(1);
    if (this.isAddingScenes) {
        project.scenes.itemsArray().forEach(scene => {
            scene.name = this.newSceneName(scene.name, scene);
            this.scenes.add(scene);
        });
    } else {
        this.scenes = project.scenes;
    }
    this.performerMode = false;
    if (purgeCustomizedPrims) {
        scn.blocks = SpriteMorph.prototype.primitiveBlocks();
    }	
    this.switchToScene(
        scn,
        true,  // refresh album
        null, // msg
        null, // data
        true // pause generic WHEN hat blocks
    );

    // hide sprite
    this.stage.children[0].resetAll();
    this.stage.clearAll();
    this.stage.rotateTurtle(this.stage.children[0].heading);
    this.createStatusDisplay();
    // clear stitch cache now (loading projects sends turtle move commands!)
    this.stage.clearAll();
    this.stage.turtleShepherd.clear();
    this.stage.reRender();

    this.createStageHandle();
    this.flushBlocksCache();
    this.refreshPalette(true);
};

IDE_Morph.prototype.buildProjectRequest = function () {
    var proj = new Project(this.scenes, this.scene),
        body,
        xml;

    // TS: add remix tags
    proj.origName = this.origName;
    proj.origCreator  = this.origCreator;
    proj.creator = this.creator;
    // ------

    this.scene.captureGlobalSettings();
    this.serializer.isCollectingMedia = true;
    xml = this.serializer.serialize(proj);
    body = {
        notes: proj.notes,
        xml: xml,
        /*
        media: this.hasChangedMedia ? // incremental media upload, disabled
            this.serializer.mediaXML(proj.name) : null,
        */
        media: this.serializer.mediaXML(proj.name),
        thumbnail: proj.thumbnail.toDataURL(),
        remixID: this.stage.remixID
    };
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    this.scene.applyGlobalSettings();

    return body;
};

IDE_Morph.prototype.exportProject = function (name) {
    // Export project XML, saving a file to disk
    var menu, str;
    if (name) {
        name = this.setProjectName(name);
        this.scene.captureGlobalSettings();
        try {
            menu = this.showMessage('Exporting');
            project = new Project(this.scenes, this.scene);
            project.name = this.projectName;
            project.notes = this.projectNotes;
            project.origName = this.origName;
            project.origCreator  = this.origCreator;
            project.creator = this.creator;

            str = this.serializer.serialize(
                project
            );
            this.saveXMLAs(str, name);
            menu.destroy();
            this.recordSavedChanges();
            this.showMessage('Exported!', 1);
        } catch (err) {
            if (Process.prototype.isCatchingErrors) {
                this.showMessage('Export failed: ' + err);
            } else {
                throw err;
            }
        }
    }
};


IDE_Morph.prototype.origRawOpenProjectString = IDE_Morph.prototype.rawOpenProjectString;
IDE_Morph.prototype.rawOpenProjectString = function (str, noPrims) {
    this.origRawOpenProjectString(str, noPrims);
	
    // hide sprite
    this.stage.children[0].hide();
    this.stage.clearAll();
    this.stage.rotateTurtle(this.stage.children[0].heading);
    this.createStatusDisplay();
    // clear stitch cache now (loading projects sends turtle move commands!)
    this.stage.clearAll();
    this.stage.turtleShepherd.clear();
    this.stage.reRender();

};


/*

TODO: remove sprite instead of hideing it?

IDE_Morph.prototype.originalRemoveSprite = IDE_Morph.prototype.removeSprite;
IDE_Morph.prototype.removeSprite = function (sprite) {
    var stage = sprite.parentThatIsA(StageMorph);
    stage.scene.remove(sprite.beetle);
    stage.reRender();
    this.originalRemoveSprite(sprite);
};

*/

// Create contol bar - (and add custom buttons)
IDE_Morph.prototype.createControlBar = function () {
    // assumes the logo has already been created
    var padding = 4,
        button,
        stopButton,
        pauseButton,
        startButton,
        projectButton,
        settingsButton,
        steppingButton,
        stageSizeButton,
        zoomToFitButton,
        //largeStageSizeButton,
        appModeButton,
        cloudButton,
        upstitchButton,
        x,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ],
        myself = this;

    if (this.controlBar) {
        this.controlBar.destroy();
    }

    this.controlBar = new Morph();
    //this.controlBar.color = this.frameColor;
    this.controlBar.color = new Color(250, 250, 250);
    this.controlBar.setHeight(this.logo.height()); // height is fixed
    this.controlBar.mouseClickLeft = function () {
        this.world().fillPage();
    };
    this.add(this.controlBar);

    //smallStageButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleStageSize',
        [
            new SymbolMorph('smallStage', 14),
            new SymbolMorph('normalStage', 14)
        ],
        function () {  // query
            return myself.isSmallStage;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'stage size\nsmall & normal';
    button.fixLayout();
    button.refresh();
    stageSizeButton = button;
    this.controlBar.add(stageSizeButton);
    this.controlBar.stageSizeButton = button; // for refreshing

    //appModeButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleAppMode',
        [
            new SymbolMorph('fullScreen', 14),
            new SymbolMorph('normalScreen', 14)
        ],
        function () {  // query
            return myself.isAppMode;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'app & edit\nmodes';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    this.controlBar.add(appModeButton);
    this.controlBar.appModeButton = appModeButton; // for refreshing



    // zoomToFitButton
    //appModeButton

    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'zoomToFit', new SymbolMorph('zoomToFit', 14),
        function () {  // query
            return false;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'start green\nflag scripts';
    button.fixLayout();
    button.refresh();
    zoomToFitButton = button;
    this.controlBar.add(zoomToFitButton);
    this.controlBar.zoomToFitButton = zoomToFitButton; // for refreshing


    //steppingButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleSingleStepping',
        [
            new SymbolMorph('footprints', 16),
            new SymbolMorph('footprints', 16)
        ],
        function () {  // query
            return Process.prototype.enableSingleStepping;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = new Color(153, 255, 213);
//    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    button.hint = 'Visible stepping';
    button.fixLayout();
    button.refresh();
    steppingButton = button;
    this.controlBar.add(steppingButton);
    this.controlBar.steppingButton = steppingButton; // for refreshing

    // stopButton
    button = new ToggleButtonMorph(
        null, // colors
        this, // the IDE is the target
        'stopAllScripts',
        [
            new SymbolMorph('octagon', 14),
            new SymbolMorph('square', 14)
        ],
        function () {  // query
            return myself.stage ?
                    myself.stage.enableCustomHatBlocks &&
                        myself.stage.threads.pauseCustomHatBlocks
                        : true;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(200, 0, 0);
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'stop\nevery-\nthing';
    button.fixLayout();
    button.refresh();
    stopButton = button;
    this.controlBar.add(stopButton);
    this.controlBar.stopButton = stopButton; // for refreshing

    //pauseButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'togglePauseResume',
        [
            new SymbolMorph('pause', 12),
            new SymbolMorph('pointRight', 14)
        ],
        function () {  // query
            return myself.isPaused();
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(255, 220, 0);
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'pause/resume\nall scripts';
    button.fixLayout();
    button.refresh();
    pauseButton = button;
    this.controlBar.add(pauseButton);
    this.controlBar.pauseButton = pauseButton; // for refreshing

    // startButton
    button = new PushButtonMorph(
        this,
        'pressStart',
        new SymbolMorph('flag', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'start green\nflag scripts';
    button.fixLayout();
    startButton = button;
    this.controlBar.add(startButton);
    this.controlBar.startButton = startButton;

    // steppingSlider
    slider = new SliderMorph(
        61,
        1,
        Process.prototype.flashTime * 100 + 1,
        6,
        'horizontal'
    );
    slider.action = function (num) {
        Process.prototype.flashTime = (num - 1) / 100;
        myself.controlBar.refreshResumeSymbol();
    };
    slider.alpha = MorphicPreferences.isFlat ? 0.1 : 0.3;
    slider.setExtent(new Point(50, 14));
    this.controlBar.add(slider);
    this.controlBar.steppingSlider = slider;

    // projectButton
    button = new PushButtonMorph(
        this,
        'projectMenu',
        new SymbolMorph('file', 14)
        //'\u270E'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'open, save, & annotate project';
    button.fixLayout();
    projectButton = button;
    this.controlBar.add(projectButton);
    this.controlBar.projectButton = projectButton; // for menu positioning

    // settingsButton
    button = new PushButtonMorph(
        this,
        'settingsMenu',
        new SymbolMorph('gears', 14)
        //'\u2699'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'edit settings';
    button.fixLayout();
    settingsButton = button;
    this.controlBar.add(settingsButton);
    this.controlBar.settingsButton = settingsButton; // for menu positioning

    // settingsButton
    button = new PushButtonMorph(
        this,
        'turtlestitchMenu',
        new SymbolMorph('turtle', 14)
        //new Morph.fromImageURL('stitchcode/assets/turtles.png')
        //'\u2699'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.fixLayout();
    // button.hint = 'edit settings';
    button.fixLayout();
    button.rerender();
    turtlestitchButton = button;
    this.controlBar.add(turtlestitchButton);
    this.controlBar.turtlestitchButton = turtlestitchButton; // for menu positioning


    // cloudButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'cloudMenu',
        [
            new SymbolMorph('cloudOutline', 11),
            new SymbolMorph('cloud', 11)
        ],
        () => !isNil(this.cloud.username) // query
    );

    button.hasNeutralBackground = true;
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[0];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    // button.hint = 'cloud operations';
    button.fixLayout();
    button.refresh();
    cloudButton = button;
    this.controlBar.add(cloudButton);
    this.controlBar.cloudButton = cloudButton; // for menu positioning & refresh
        
    this.controlBar.fixLayout();

    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        [stopButton, pauseButton, startButton].forEach(
            function (button) {
                button.setCenter(myself.controlBar.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = Math.min(
            startButton.left() - (3 * padding + 2 * stageSizeButton.width()),
            myself.right() - StageMorph.prototype.dimensions.x *
                (myself.isSmallStage ? myself.stageRatio : 1)
        );
        [stageSizeButton, appModeButton, zoomToFitButton].forEach(
            function (button) {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

        slider.setCenter(myself.controlBar.center());
        slider.setRight(stageSizeButton.left() - padding);

        steppingButton.setCenter(myself.controlBar.center());
        steppingButton.setRight(slider.left() - padding);

        settingsButton.setCenter(myself.controlBar.center());
        settingsButton.setLeft(this.left());

        turtlestitchButton.setCenter(myself.controlBar.center());
        turtlestitchButton.setLeft(settingsButton.right() + padding);

        projectButton.setCenter(myself.controlBar.center());
        projectButton.setRight(settingsButton.left() - padding);

        cloudButton.setCenter(myself.controlBar.center());
        cloudButton.setLeft(turtlestitchButton.right() + padding);


        this.refreshSlider();
        this.updateLabel();
    };

    this.controlBar.refreshSlider = function () {
        if (Process.prototype.enableSingleStepping && !myself.isAppMode) {
            // slider.fixLayout();
            slider.fixLayout();
            slider.show();
        } else {
            slider.hide();
        }
        this.refreshResumeSymbol();
    };

    this.controlBar.refreshResumeSymbol = function () {
        var pauseSymbols;
        if (Process.prototype.enableSingleStepping &&
                Process.prototype.flashTime > 0.5) {
            myself.stage.threads.pauseAll(myself.stage);
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('stepForward', 14)
            ];
        } else {
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('pointRight', 14)
            ];
        }
        pauseButton.labelString = pauseSymbols;
        pauseButton.createLabel();
        pauseButton.fixLayout();
        pauseButton.refresh();
    };

    this.controlBar.updateLabel = function () {
        var suffix = myself.world().isDevMode ?
                ' - ' + localize('development mode') : '';

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.label = new StringMorph(
            (myself.projectName || localize('untitled')) + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.label.color = myself.buttonLabelColor;
        // this.label.fixLayout();
        this.label.fixLayout();
        this.add(this.label);
        this.label.setCenter(this.center());
        this.label.setLeft(this.cloudButton.right() + padding + 5);
    };
};

IDE_Morph.prototype.turtlestitchMenu = function () {
    var menu,
        stage = this.stage,
        world = this.world(),
        myself = this,
        pos = this.controlBar.settingsButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    function addPreference(label, toggle, test, onHint, offHint, hide) {
        var on = '\u2611 ',
            off = '\u2610 ';
        if (!hide || shiftClicked) {
            menu.addItem(
                (test ? on : off) + localize(label),
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    }

    menu = new MenuMorph(this);

    //menu.addItem('Units...', 'unitsMenu');
    //menu.addLine();
    addPreference(
        'Display dimension in Inch',
        function () {
            stage.turtleShepherd.toggleMetric();
            stage.scene.grid.draw();
            stage.renderer.changed = true;
            if (!stage.turtleShepherd.isMetric() ) {
                myself.saveSetting('isImperial', true);
            } else {
                myself.removeSetting('isImperial');
            }
        },
        !stage.turtleShepherd.isMetric() ,
        'uncheck to display dimensions in millimeters',
        'check to show dimensions in inch', );

    menu.addLine();
    addPreference(
        'Hide grid',
        function () {
            this.stage.scene.grid.toggle();
            if (StageMorph.prototype.hideGrid) {
                myself.saveSetting('hidegrid', true);
            } else {
                myself.removeSetting('hidegrid');
            }
        },
        StageMorph.prototype.hideGrid,
        'uncheck to show grid',
        'check to hide grid',
    );


    addPreference(
        'Hide jump stitches',
        function () {
            this.stage.renderer.toggleJumpLines();
            if (StageMorph.prototype.hideJumps) {
                myself.saveSetting('hidejumps', true);
            } else {
                myself.removeSetting('hidejumps');
            }
        },
        StageMorph.prototype.hideJumps ,
        'uncheck to show jump stitches',
        'check to hide jump stitches'
    );
    addPreference(
        'Hide stitch points',
        function () {
            this.stage.renderer.toggleStitchPoints();
            if (StageMorph.prototype.hideStitches) {
                myself.saveSetting('hidestitches', true);
            } else {
                myself.removeSetting('hidestitches');
            }
        },
        StageMorph.prototype.hideStitches,
        'uncheck to show stitch points',
        'check to hide stitch points'
    );
    addPreference(
        'Hide turtle',
        function () {
            this.stage.renderer.toggleTurtle();
            if (StageMorph.prototype.hideTurtle) {
                myself.saveSetting('hideturtle', true);
            } else {
                myself.removeSetting('hideturtle');
            }
        },
        StageMorph.prototype.hideTurtle,
        'uncheck to show turtle',
        'check to hide turtle'
    );
    addPreference(
        'Ignore embroidery warnings',
        function () {
           this.stage.toggleIgnoreWarnings();
            if (StageMorph.prototype.ignoreWarnings ) {
                myself.saveSetting('ignoreWarning', true);
            } else {
                myself.removeSetting('ignoreWarning');
            }
        },
        StageMorph.prototype.ignoreWarnings ,

        'uncheck to show embroidery specific warnings',
        'check to ignore embroidery specific warnings'
    );
    menu.addLine();
    menu.addItem('Default background color...', 'userSetBackgroundColor');
    menu.addItem('Default pen color...', 'userSetPenColor');

    menu.addItem('Load a camera snapshot...', 'loadCameraSnapshot');
    menu.addItem('Clear background image', 'clearStageBackground');

    menu.popup(world, pos);
};




IDE_Morph.prototype.toggleAppMode = function (appMode) {
    var world = this.world(),
        elements = [
        this.logo,
        this.controlBar.projectButton,
        this.controlBar.settingsButton,
        this.controlBar.stageSizeButton,
        this.controlBar.steppingButton,
        this.controlBar.turtlestitchButton,
        //this.controlBar.largeStageSizeButton,
        this.spriteEditor,
        this.paletteHandle,
        this.stageHandle,
        this.palette,
        this.statusDisplay,
        this.categories
    ];

    this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;

    if (this.isAppMode) {
        this.wasSingleStepping = Process.prototype.enableSingleStepping;
        if (this.wasSingleStepping) {
          this.toggleSingleStepping();
        }
        this.setColor(this.appModeColor);
        this.controlBar.setColor(this.color);
        this.controlBar.appModeButton.refresh();
        elements.forEach(e =>
            e.hide()
        );
        world.children.forEach(morph => {
            if (morph instanceof DialogBoxMorph) {
                morph.hide();
            }
        });
        if (world.keyboardFocus instanceof ScriptFocusMorph) {
            world.keyboardFocus.stopEditing();
        }
    } else {
        if (this.wasSingleStepping && !Process.prototype.enableSingleStepping) {
             this.toggleSingleStepping();
        }
        this.setColor(this.backgroundColor);
        this.controlBar.setColor(this.frameColor);
        elements.forEach(e =>
            e.show()
        );
        this.stage.setScale(1);
        // show all hidden dialogs
        world.children.forEach(morph => {
            if (morph instanceof DialogBoxMorph) {
                morph.show();
            }
        });
        // prevent scrollbars from showing when morph appears
        world.allChildren().filter(c =>
            c instanceof ScrollFrameMorph
        ).forEach(s =>
            s.adjustScrollBars()
        );
        // prevent rotation and draggability controls from
        // showing for the stage
        if (this.currentSprite === this.stage) { 
            this.spriteBar.children.forEach(child => {
                if (child instanceof PushButtonMorph) {
                    child.hide();
                }
            });
        }
        // update undrop controls
        this.currentSprite.scripts.updateToolbar();
    }
    this.setExtent(this.world().extent());
};


// IDE_Morph resizing
IDE_Morph.prototype.setExtent = function (point) {
    var cnf = this.config,
	padding = new Point(430, 110),
        minExt,
        ext,
        maxWidth,
        minWidth,
        maxHeight,
        minRatio,
        maxRatio;

    // determine the minimum dimensions making sense for the current mode
    if (this.isAppMode) {
        if (this.isEmbedMode) {
            minExt = new Point(100, 100);
        } else {
            minExt = StageMorph.prototype.dimensions.add(
                this.controlBar.height() + 10
            );
        }
    } else {
        if (this.stageRatio > 1) {
            minExt = padding.add(StageMorph.prototype.dimensions);
        } else {
            minExt = padding.add(
                StageMorph.prototype.dimensions.multiplyBy(this.stageRatio)
            );
        }
    }
    if (this.performerMode) {
        ext = point;
    } else {
        ext = point.max(minExt);
    }
	

    // adjust stage ratio if necessary
    maxWidth = ext.x -
        (200 + this.spriteBar.tabBar.width() + (this.padding * 2));
    minWidth = SpriteIconMorph.prototype.thumbSize.x * 3;
    maxHeight = (ext.y - SpriteIconMorph.prototype.thumbSize.y * 3.5);
    minRatio = minWidth / this.stage.dimensions.x;
    maxRatio = Math.min(
        (maxWidth / this.stage.dimensions.x),
        (maxHeight / this.stage.dimensions.y)
    );
    this.stageRatio = Math.min(maxRatio, Math.max(minRatio, this.stageRatio));

    // apply
    IDE_Morph.uber.setExtent.call(this, ext);
    this.fixLayout();
}

IDE_Morph.prototype.zoomToFit = function (appMode) {
    this.stage.camera.fitScene();
}


IDE_Morph.prototype.aboutTurtleStitch = function () {
    var dlg, aboutTxt, pic, world = this.world();

    aboutTxt = 'TurtleStich! ' + VERSION + '\n\n'
        + 'Copyright \u24B8 2014-2025 Michael Aschauer\n\n'

        + 'TurtleStitch is developed by OSEDA - Association for\n'
        + 'Development of Open Source Software in Education, Design\n'
        + 'and Art and stitchcode.com - Visionary Embroidery.\n\n'

        + 'The project has been sponsored by netidee Open Innovation\n'
        + '(Internet Foundation Austria) and kickstarter crowdfunding.\n\n'

        + 'TurtleStich is based on Snap! by Jens Mönig and Brian Harvey\n\n'

        dlg = new DialogBoxMorph();
    dlg.inform(localize('About TurtleStitch'), localize(aboutTxt), world, this.logo.cachedTexture);

    btn1 = dlg.addButton(this.aboutSnap,
        'About Snap!...'
    );
    btn2 = dlg.addButton(
		function () {
            window.open('http://www.turtlestitch.org', 'TurtleStitchWebsite');
        },
        'TurtleStitch Website',
    );
    dlg.fixLayout();
};

// create status display (inspired by beetleblocks)
IDE_Morph.prototype.createStatusDisplay = function () {
    var frame,
    padding = 1,
    myself = this,
    elements = [],
    stage = this.stage;

    if (this.statusDisplay) {
        this.statusDisplay.destroy();
    }

    this.statusDisplay = new Morph();
    this.statusDisplay.color = this.groupColor;
    this.add(this.statusDisplay);

    frame = new ScrollFrameMorph(null, null, this.sliderColor);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    frame.alpha = 0;

    this.statusDisplay.frame = frame;
    this.statusDisplay.add(frame);

    this.statusDisplay.fixLayout = function () {
        this.setLeft(myself.stage.left());
        this.setTop(myself.stage.bottom() + padding);
        this.setWidth(myself.stage.width());
        this.setHeight(myself.height() - myself.stage.height() - myself.controlBar.height() - padding);
        this.frame.setExtent(this.extent());
        this.arrangeContents();
        this.refresh();
    };

    this.statusDisplay.arrangeContents = function () {
        var x = this.left() + padding,
            y = this.top() + padding,
            max = this.right() - padding,
            start = x,
            middle = (max - start) / 2 + start;

        this.frame.contents.children.forEach(function (element) {
            element.setPosition(new Point(x, y));
            x += element.width();

            if (element instanceof ToggleMorph)
                { x+= element.label.width() + 2; }

            if (element.newLines) {
                y += 14 * element.newLines;
                x = start;
            }

            if (element.newColumn) {
                if (element.columns) {
                    x = ((max - start) / element.columns) * element.newColumn + start;
                } else {
                    x = middle;
                }
            }
        });

        this.frame.contents.adjustBounds();
    };

    this.statusDisplay.addElement = function (element) {

        if (typeof element == 'string') {
            if (element == '-') {
                element = new Morph();
                element.setHeight(1);
                element.setWidth(this.width());
                element.setColor(new Color(200, 200, 200));
                element.newLines = 0.5;
                element.flush = true;
            } else {
                element = new StringMorph(localize(element), 12, null, true);
            }
            if (element.hidden) {
                element.setColor(new Color(0,0,0,0));
            }
        };

        this.frame.contents.add(element);
        this.fixLayout();
    };

    this.statusDisplay.refresh = function () {
        this.frame.contents.children.forEach(function (element) {
            if (element.hasOwnProperty('update')) {
                element.update();
                element.changed();
                // element.fixLayout();
                element.fixLayout();
                element.changed();
            };
        });
    };

    this.statusDisplay.acceptsDrops = function () {
        return false;
    };

    this.statusDisplay.watchers = function (leftPos) {
        /* answer an array of all currently visible watchers.
           If leftPos is specified, filter the list for all
           shown or hidden watchers whose left side equals
           the given border (for automatic positioning) */

        return this.children.filter(function (morph) {
            if (morph instanceof WatcherMorph) {
                if (leftPos) {
                    return morph.left() === leftPos;
                }
                return morph.isVisible;
            }
            return false;
        });
    };

    this.statusDisplay.step = function() {
        // update watchers
        current = Date.now();
        elapsed = current - this.lastWatcherUpdate;
        leftover = (1000 / this.watcherUpdateFrequency) - elapsed;
        if (leftover < 1) {
            this.watchers().forEach(function (w) {
                w.update();
            });
            this.lastWatcherUpdate = Date.now();
        }
    };

    this.statusDisplay.lastWatcherUpdate = Date.now();
    this.statusDisplay.watcherUpdateFrequency = 250;

    var space = new Morph();
    space.alpha = 0;
    space.newLines = 0.5;
    elements.push(space);

    elements.push(' Stitches : ');
    element = new StringMorph();
    element.update = function () {
        this.text = (stage.turtleShepherd.getStepCount()).toString()+ "        ";
    };
    element.columns = 3;
    element.newColumn = 1;
    elements.push(element);


    elements.push('Jumps : ');
    element = new StringMorph();
    element.update = function () {
        this.text = (stage.turtleShepherd.getJumpCount()).toString()+ "        ";
    };
    element.columns = 3;
    element.newColumn = 2;
    elements.push(element);

    elements.push('Size : ');
    element = new StringMorph();
    element.update = function () {
        this.text = (stage.turtleShepherd.getDimensions());
    };
	  element.newLines = 1;
    elements.push(element);
    element.newLines = 1;
    elements.push('-');

    // too long
    elements.push('  ');
    element = new StringMorph();
    element.color = new Color(255, 0, 0);
    element.update = function () {
        this.text = "" + (stage.turtleShepherd.getTooLongStr());
    };
    element.columns = 2;
    element.newColumn = 1;
    elements.push(element);

     // density warning
    elements.push('');
    element = new StringMorph();
    element.color = new Color(255, 0, 0);
    element.update = function () {
        this.text = "" + (stage.turtleShepherd.getDensityWarningStr());
    };
    element.columns = 2;
    element.newColumn = 2;
    elements.push(element);

     // density warning
    elements.push('');
    element = new StringMorph("");
    element.newLines = 2;
    elements.push(element);


    var zoomInButton = new PushButtonMorph(
            null,
            function () {
                stage.camera.zoomIn();
                stage.renderer.changed = true; },
            '+'
            );
    elements.push(zoomInButton);

    var zoomOutButton = new PushButtonMorph(
            null,
            function () {
                stage.camera.zoomOut();
                stage.renderer.changed = true;
            },
            ' - '
            );
    elements.push(zoomOutButton);

    var resetCameraButton = new PushButtonMorph(
            null,
            function () { stage.camera.reset(); },
            'Reset View'
            );
    elements.push(resetCameraButton);
    resetCameraButton.columns = 4;
    resetCameraButton.newColumn = 2;


    var XRayButton = new ToggleMorph(
          'checkbox',
          null,
          function () {
            if (stage.isXRay) {
              myself.showMessage("turn off X-RAY ...");
              window.setTimeout(
                function() {
                  stage.turnXRayOff();
                  myself.showMessage("ok.",0.4);
                  myself.XRayButton.refresh();
                }, 250);
            } else {
              myself.showMessage("rendering X-RAY ...");
              window.setTimeout(
                function() {
                  stage.turnXRayOn();
                  myself.showMessage("ok.", 0.4);
                  myself.XRayButton.refresh();
                } ,250);
            }
          },
          'X-Ray',
          function () {
            return stage.getIsXRay();
          });
    elements.push(XRayButton);
    myself.XRayButton = XRayButton;
    XRayButton.columns = 4;
    XRayButton.newColumn = 3;


	var toggleTurboButton = new ToggleMorph(
            'checkbox',
            null,
            function () {
                myself.toggleFastTracking();
            },
            'Turbo mode',
            function () {
                return stage.isFastTracked;
            });
    toggleTurboButton.newLines = 2;
    elements.push(toggleTurboButton);


    var fitScreenButton = new PushButtonMorph(
            null,
            function () { stage.camera.fitScene(); },
            'Zoom to fit'
            );
    elements.push(fitScreenButton);
    fitScreenButton.newLines = 3;

    elements.push('-');


    var downloadSVGButton = new PushButtonMorph(
        null,
        function () { myself.downloadSVG(); },
        'Export as SVG'
    );
    downloadSVGButton.columns = 6;
    downloadSVGButton.newColumn = 2;
    elements.push(downloadSVGButton);

	var ignoreColorsButton = new ToggleMorph(
		'checkbox',
		null,
		function () {
			stage.turtleShepherd.toggleIgnoreColors();
		},
		'Ignore colors during export',
		function () {
			return stage.turtleShepherd.getIgnoreColors();
		});

    ignoreColorsButton.newLines = 1.7;
    elements.push(ignoreColorsButton);

    /* hide for now
    var downloadDXFButton = new PushButtonMorph(
        null,
        function () { myself.downloadDXF(); },
        'Export as DXF'
    );
    downloadDXFButton.newLines = 1.7;
    elements.push(downloadDXFButton);
    */

    var downloadEXPButton = new PushButtonMorph(
        null,
        function () { myself.downloadEXP(); },
        'Export as Melco/EXP'
    );
    downloadEXPButton.newLines = 1.7;
    elements.push(downloadEXPButton);

    var downloadDSTButton = new PushButtonMorph(
        null,
        function () { myself.downloadDST(); },
        'Export as Tajima/DST'
    );
    downloadDSTButton.newLines = 2.7;
    elements.push(downloadDSTButton);

    if (DEBUG) {
		elements.push(' DEBUG MODE: true');
		element = new StringMorph("");

		element.newLines = 1.2;
		elements.push(element);
		elements.push(' RENDERER: ');
		element = new StringMorph();
		element.update = function () {
			this.text = stage.renderer_status_msg;
		};
		element.newLines = 1;
		elements.push(element);
		elements.push('  ');
	}

    elements.forEach(function(each) { myself.statusDisplay.addElement(each); });
};

// fix layout custom function
IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding,
        cnf = this.config,
        border = cnf.border || 0,
        flag,
        maxPaletteWidth;

    Morph.prototype.trackChanges = false;

    this.logo.setLeft(this.left() + border);
    this.logo.setTop(this.top() + border);
	
    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(this.right() - this.controlBar.left());
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(
            cnf.hideControls ? this.top() + border : this.logo.bottom()
        );
        this.categories.setWidth(this.paletteWidth);
        if (this.categories.scroller) {
            this.categories.scroller.setWidth(this.paletteWidth);
        }
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(this.categories.bottom());
    this.palette.setHeight(this.bottom() - this.palette.top());
    this.palette.setWidth(this.paletteWidth);

    if (situation !== 'refreshPalette') {
        // stage
        if (this.isAppMode) {
          this.stage.setScale(Math.floor(Math.min(
              (this.width() - padding * 2) / this.stage.dimensions.x,
              (this.height() - this.controlBar.height() * 2 - padding * 2)
                  / this.stage.dimensions.y
          ) * 10) / 10);
          this.stage.setCenter(this.center());
        } else {
            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(this.logo.bottom() + padding);
            this.stage.setRight(this.right());
            maxPaletteWidth = this.width() -
                this.stage.width() -
                this.spriteBar.tabBar.width() -
                (this.padding * 2);
            if (this.paletteWidth > maxPaletteWidth) {
                this.paletteWidth = maxPaletteWidth;
                this.fixLayout();
            }
            this.stageHandle.fixLayout();
            this.paletteHandle.fixLayout();
        }

        if (this.spriteEditor.isVisible) {
            this.spriteEditor.setLeft(this.paletteWidth + padding);
            this.spriteEditor.setTop(this.logo.bottom() + padding);
            this.spriteEditor.setExtent(new Point(
                //this.spriteBar.width(),
                Math.max(0, this.stage.left() - padding - this.spriteEditor.left()),
                this.bottom() - this.spriteEditor.top()
            ));
        }
        this.statusDisplay.fixLayout();

    }

    Morph.prototype.trackChanges = true;
    this.changed();
};

// SVG export
IDE_Morph.prototype.downloadSVG = function() {
    svgStr = this.stage.turtleShepherd.toSVG();
    blob = new Blob([svgStr], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, (this.projectName ? this.projectName : 'turtlestitch') + '.svg');
};

// DXF export
IDE_Morph.prototype.downloadDXF = function() {
	  dxfStr = this.stage.turtleShepherd.toDXF();
    blob = new Blob([dxfStr]);
    saveAs(blob, (this.projectName ? this.projectName : 'turtlestitch') + '.dxf');
};

// EXP export
IDE_Morph.prototype.downloadEXP = function() {
    expUintArr = this.stage.turtleShepherd.toEXP();
    blob = new Blob([expUintArr], {type: 'application/octet-stream'});
    saveAs(blob, (this.projectName ? this.projectName : 'turtlestitch') + '.exp');
};

// DST export
IDE_Morph.prototype.downloadDST = function() {
	var name = this.projectName ? this.projectName : 'turtlestitch';
    expUintArr = this.stage.turtleShepherd.toDST(name);
    blob = new Blob([expUintArr], {type: 'application/octet-stream'});
    saveAs(blob, name + '.dst');
};

// PNG export
IDE_Morph.prototype.downloadPNG = function() {
	var name = this.projectName ? this.projectName : 'turtlestitch';

	dataURL = this.stage.turtleShepherd.toPNG(name);
	var binary = atob( dataURL.substr( dataURL.indexOf(',') + 1 ) ),
        i = binary.length,
        view = new Uint8Array(i);

    while (i--) {
        view[i] = binary.charCodeAt(i);
    }

    blob = new Blob([view], {type: 'image/png'});
    saveAs(blob, name + '.png');
};


/*
IDE_Morph.prototype.setProjectName = function (string) {
	if (string.replace(/['"]/g, '') != this.projectName || SnapCloud.username != this.creator) {
		this.remixHistory = this.creator + ":" + this.projectName + ";"  + this.remixHistory
		this.origName =  this.projectName;
	}
	this.origName =  this.projectName;
	this.origCreator =  SnapCloud.username != this.creator ? this.creator : SnapCloud.username;
	this.creator = SnapCloud.username ? SnapCloud.username : "anonymous";
    this.projectName = string.replace(/['"]/g, ''); // filter quotation marks
    this.hasChangedMedia = true;
    this.controlBar.updateLabel();
};
*/

IDE_Morph.prototype.setProjectName = function (string) {
    var projectScene = this.scenes.at(1),
        name = this.newSceneName(string, projectScene);
    if (name !== projectScene.name) {
        projectScene.name = name;
        projectScene.stage.version = Date.now();
        this.recordUnsavedChanges();
        if (projectScene === this.scene) {
            this.controlBar.updateLabel();
        }
    }
    this.projectName = string.replace(/['"]/g, '');   
    this.origCreator = this.cloud.username != this.creator ? this.creator : this.cloud.username;
	this.creator = this.cloud.username ? this.cloud.username : "anonymous";
    this.hasChangedMedia = true;
    this.controlBar.updateLabel();
    console.log(this.origCreator)
    return name;
};


IDE_Morph.prototype.createSpriteBar = function () {
    // assumes that the categories pane has already been created
    var rotationStyleButtons = [],
        thumbSize = new Point(45, 45),
        nameField,
        padlock,
        thumbnail,
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        symbols = ['\u2192', '\u21BB', '\u2194'],
        labels = ['don\'t rotate', 'can rotate', 'only face left/right'],
        myself = this;

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    //this.add(this.spriteBar);

    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                if (myself.currentSprite instanceof SpriteMorph) {
                    myself.currentSprite.rotationStyle = rotationStyle;
                    myself.currentSprite.changed();
                    myself.currentSprite.fixLayout();
                    myself.currentSprite.changed();
                }
                rotationStyleButtons.forEach(function (each) {
                    each.refresh();
                });
            },
            symbols[rotationStyle], // label
            function () {  // query
                return myself.currentSprite instanceof SpriteMorph
                    && myself.currentSprite.rotationStyle === rotationStyle;
            },
            null, // environment
            localize(labels[rotationStyle])
        );

        button.corner = 8;
        button.labelMinExtent = new Point(11, 11);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        rotationStyleButtons.push(button);
        button.setPosition(myself.spriteBar.position().add(2));
        button.setTop(button.top()
            + ((rotationStyleButtons.length - 1) * (button.height() + 2))
            );
        myself.spriteBar.add(button);
        if (myself.currentSprite instanceof StageMorph) {
            button.hide();
        }
        return button;
    }

    addRotationStyleButton(1);
    addRotationStyleButton(2);
    addRotationStyleButton(0);
    this.rotationStyleButtons = rotationStyleButtons;

    thumbnail = new Morph();
    thumbnail.setExtent(thumbSize);
    thumbnail.image = this.currentSprite.thumbnail(thumbSize);
    thumbnail.setPosition(
        rotationStyleButtons[0].topRight().add(new Point(5, 3))
    );
    this.spriteBar.add(thumbnail);

    thumbnail.fps = 3;

    thumbnail.step = function () {
        if (thumbnail.version !== myself.currentSprite.version) {
            thumbnail.image = myself.currentSprite.thumbnail(thumbSize);
            thumbnail.changed();
            thumbnail.version = myself.currentSprite.version;
        }
    };

    nameField = new InputFieldMorph(this.currentSprite.name);
    nameField.setWidth(100); // fixed dimensions
    nameField.contrast = 90;
    nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
    this.spriteBar.add(nameField);
    nameField.fixLayout();
    nameField.accept = function () {
        var newName = nameField.getValue();
        myself.currentSprite.setName(
            myself.newSpriteName(newName, myself.currentSprite)
        );
        nameField.setContents(myself.currentSprite.name);
    };
    this.spriteBar.reactToEdit = nameField.accept;

    // padlock
    padlock = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.currentSprite.isDraggable =
                !myself.currentSprite.isDraggable;
        },
        localize('draggable'),
        function () {
            return myself.currentSprite.isDraggable;
        }
    );
    padlock.label.isBold = false;
    padlock.label.setColor(this.buttonLabelColor);
    padlock.color = tabColors[2];
    padlock.highlightColor = tabColors[0];
    padlock.pressColor = tabColors[1];

    padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
            new Point() : new Point(-1, -1);
    padlock.tick.shadowColor = new Color(); // black
    padlock.tick.color = this.buttonLabelColor;
    padlock.tick.isBold = false;
    padlock.tick.fixLayout();

    padlock.setPosition(nameField.bottomLeft().add(2));
    padlock.fixLayout();
    this.spriteBar.add(padlock);
    if (this.currentSprite instanceof StageMorph) {
        padlock.hide();
    }

    // tab bar
    tabBar.tabTo = function (tabString) {
        var active;
        myself.currentTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {active = each; }
        });
        active.refresh(); // needed when programmatically tabbing
        myself.createSpriteEditor();
        myself.fixLayout('tabEditor');
    };

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {tabBar.tabTo('scripts'); },
        localize('Scripts'), // label
        function () {  // query
            return myself.currentTab === 'scripts';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {tabBar.tabTo('costumes'); },
        localize('Costumes'), // label
        function () {  // query
            return myself.currentTab === 'costumes';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {tabBar.tabTo('sounds'); },
        localize('Sounds'), // label
        function () {  // query
            return myself.currentTab === 'sounds';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tab.fixLayout();
    tabBar.add(tab);

    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.spriteBar.tabBar = tabBar;
    this.spriteBar.add(this.spriteBar.tabBar);

    this.spriteBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom());
    };
};


IDE_Morph.prototype.createCategories = function () {
    var myself = this,
        categorySelectionAction = this.scene.unifiedPalette ? scrollToCategory
            : changePalette,
        categoryQueryAction = this.scene.unifiedPalette ? queryTopCategory
            : queryCurrentCategory;
        shift = this.config.noDefaultCat ? 4 : 0,
        flag = true;			

    if (this.categories) {
	flag = this.categories.isVisible;
        this.categories.destroy();
    }
    this.categories = new Morph();
    this.categories.color = this.groupColor;
    this.categories.bounds.setWidth(this.paletteWidth);
    this.categories.buttons = [];
    this.categories.isVisible = flag;
	
    this.categories.droppedImage = (aCanvas, name, embeddedData) => {
        this.droppedImage(aCanvas, name, embeddedData, 'categories');
    };	

    this.categories.refresh = function () {
        this.buttons.forEach(cat => {
            cat.refresh();
            if (cat.state) {
                cat.scrollIntoView();
            }
        });
    };

    this.categories.refreshEmpty = function () {
        var dict = myself.currentSprite.emptyCategories();
        dict.variables = dict.variables || dict.lists || dict.other;
        this.buttons.forEach(cat => {
            if (Object.hasOwn(dict, cat.category) && (dict[cat.category])) {
                cat.enable();
            } else {
                cat.disable();
            }
        });
    };

    function changePalette(category) {
        return () => {
            myself.currentCategory = category;
            myself.categories.buttons.forEach(each =>
                each.refresh()
            );
            myself.refreshPalette(true);
        };
    }

    function scrollToCategory(category) {
        return () => myself.scrollPaletteToCategory(category);
    }

    function queryCurrentCategory(category) {
        return () => myself.currentCategory === category;
    }

    function queryTopCategory(category) {
        return () => myself.topVisibleCategoryInPalette() === category;
    }

    function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(MorphicPreferences.isFlat ? 5 : 50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            categorySelectionAction(category),
            category[0].toUpperCase().concat(category.slice(1)), // label
            categoryQueryAction(category), // query
            null, // env
            null, // hint
            labelWidth, // minWidth
            true // has preview
        );

        button.category = category;
        button.corner = 8;
        button.padding = 2;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = IDE_Morph.prototype.isBright ?
            CLEAR : colors[1];
        button.labelColor = myself.buttonLabelColor;
        if (IDE_Morph.prototype.isBright) {
            button.labelPressColor = WHITE;
        }
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        myself.categories.buttons.push(button);
        return button;
    }

    function addCustomCategoryButton(category, color) {
        var labelWidth = 168,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(IDE_Morph.prototype.isBright ? 5 : 50),
                color
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            categorySelectionAction(category),
            category, // label
            categoryQueryAction(category), // query
            null, // env
            null, // hint
            labelWidth, // minWidth
            true // has preview
        );


        button.category = category;
        button.corner = 8;
        button.padding = 2;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = IDE_Morph.prototype.isBright ?
            CLEAR : colors[1];
        button.labelColor = myself.buttonLabelColor;
        if (IDE_Morph.prototype.isBright) {
            button.labelPressColor = WHITE;
        }
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        myself.categories.buttons.push(button);
        return button;
    }

    function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            more = SpriteMorph.prototype.customCategories.size,
            border = 10,
            xPadding = 5,
            yPadding = 3,
            l = myself.categories.left(),
            t = myself.categories.top(),
            scroller,
            row,
            col,
            i;

        myself.categories.children.forEach((button, i) => {
            row = i < 8 ? i % 4 : i - 4;
            col = (i < 4 || i > 7) ? 1 : 2;
            button.setPosition(new Point(
                l + (col * xPadding + ((col - 1) * buttonWidth)),
                t + (((row - shift) + 1) * yPadding + ((row - shift) *
                        buttonHeight) + border) +
                        0 // (i > 7 ? border + 2 : 0)
            ));
        });

        if (shift) { // hide the built-in category buttons
            for (i = 0; i < 8; i += 1) {
                myself.categories.children[i].hide();
            }
        }
		
        if (more > 6) {
            scroller = new ScrollFrameMorph(null, null, myself.sliderColor);
            scroller.setColor(myself.groupColor);
            scroller.acceptsDrops = false;
            scroller.contents.acceptsDrops = false;
            scroller.setPosition(
                new Point(0, myself.categories.children[8].top())
            );
            scroller.setWidth(myself.paletteWidth);
            scroller.setHeight(buttonHeight * 6 + yPadding * 5);

            for (i = 0; i < more; i += 1) {
                scroller.addContents(myself.categories.children[8]);
            }
            myself.categories.add(scroller);
            myself.categories.scroller = scroller;
            myself.categories.setHeight(
                (4 + 1) * yPadding
                    + 4 * buttonHeight
                    + 6 * (yPadding + buttonHeight) + border + 2
                    + 2 * border
                    + 5
            );
        } else {
            myself.categories.setHeight(
                (4 + 1) * yPadding
                    + 5 * buttonHeight
                    + (more ?
                        (more * (yPadding + buttonHeight) + border + 2)
                            : 0)
                    + 2 * border
                    + 5
            );
        }
    }

    SpriteMorph.prototype.categories.forEach(cat => {
        if (!contains(['lists', 'aa'], cat)) {
            addCategoryButton(cat);
        }
    });

    // sort alphabetically
    Array.from(
        SpriteMorph.prototype.customCategories.keys()
    ).sort().forEach(name =>
        addCustomCategoryButton(
            name,
            SpriteMorph.prototype.customCategories.get(name)
        )
    );

    fixCategoriesLayout();
    this.add(this.categories);
};


IDE_Morph.prototype.projectMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft(),
        graphicsName = this.currentSprite instanceof SpriteMorph ?
                'Costumes' : 'Backgrounds',
        shiftClicked = (world.currentKey === 16);

    // Utility for creating Costumes, etc menus.
    // loadFunction takes in two parameters: a file URL, and a canonical name
    function createMediaMenu(mediaType, loadFunction) {
        return function () {
            var names = this.getMediaList(mediaType),
                mediaMenu = new MenuMorph(
                    myself,
                    localize('Import') + ' ' + localize(mediaType)
                );

            names.forEach(function (item) {
                mediaMenu.addItem(
                    item.name,
                    function () {loadFunction(item.file, item.name); },
                    item.help
                );
            });
            mediaMenu.popup(world, pos);
        };
    }

    menu = new MenuMorph(this);
    menu.addItem('Notes...', 'editNotes');
    menu.addLine();
    menu.addItem('New', 'createNewProject');
    menu.addItem('Open...', 'openProjectsBrowser');
    menu.addItem(
        'Import...',
        'importLocalFile',
        'file menu import hint' // looks up the actual text in the translator
    );
    menu.addLine();
    menu.addItem('Save', "save");
    menu.addItem('Save As...', 'saveProjectsBrowser');
    //menu.addItem('Save to Disk', 'saveToDisk');
    menu.addLine();
    menu.addItem(
            'Export as SVG',
            function() { myself.downloadSVG(); },
            'Export current drawing as SVG Vector file'
    );
    menu.addItem(
            'Export as DXF',
            function() { myself.downloadDXF(); },
            'Export current drawing as DXF file'
    );
    menu.addItem(
            'Export as PNG',
            function() { myself.downloadPNG(); },
            'Export current drawing as PNG image Vector file'
    );
    menu.addItem(
            'Export as Melco/EXP',
            function() { myself.downloadEXP(); },
            'Export current drawing as EXP/Melco Embroidery file'
    );

    menu.addItem(
            'Export as Tajima/DST',
            function() { myself.downloadDST(); },
            'Export current drawing as DST/Tajima Embroidery file'
    );

    if (DEBUG) {
		menu.addItem(
				'Export to Embroidery service',
				function() { myself.uploadOrder(); },
				'Export to stitchcode.com\'s embroidery service'
		);
	}

    menu.addLine();
    if (shiftClicked) {
        menu.addItem(
            'Export all scripts as pic...',
            function () {myself.exportScriptsPicture(); },
            'show a picture of all scripts\nand block definitions',
            new Color(100, 0, 0)
        );
    }
     menu.addItem(
          'Export project...',
          () => {
              var pn = this.getProjectName();
              if (pn) {
                  this.exportProject(pn);
              } else {
                  this.prompt(
                      'Export Project As...',
                      name => this.exportProject(name),
                      null,
                      'exportProject'
                  );
              }
          },
          'save project data as XML\nto your downloads folder'
      );

    if (this.stage.globalBlocks.length) {
        menu.addItem(
            'Export blocks...',
            function () {myself.exportGlobalBlocks(); },
            'show global custom block definitions as XML' +
                '\nin a new browser window'
        );
        menu.addItem(
            'Unused blocks...',
            function () {myself.removeUnusedBlocks(); },
            'find unused global custom blocks' +
                '\nand remove their definitions'
        );
    }

    menu.addItem(
        'Export summary...',
        function () {myself.exportProjectSummary(); },
        'open a new browser browser window\n with a summary of this project'
    );
    if (shiftClicked) {
        menu.addItem(
            'Export summary with drop-shadows...',
            function () {myself.exportProjectSummary(true); },
            'open a new browser browser window' +
                '\nwith a summary of this project' +
                '\nwith drop-shadows on all pictures.' +
                '\nnot supported by all browsers',
            new Color(100, 0, 0)
        );
        menu.addItem(
            'Export all scripts as pic...',
            function () {myself.exportScriptsPicture(); },
            'show a picture of all scripts\nand block definitions',
            new Color(100, 0, 0)
        );
    }

    menu.addLine();
    menu.addItem(
        'Libraries...',
        () => {
            if (location.protocol === 'file:') {
                this.importLocalFile();
                return;
            }
            this.getURL(
                this.resourceURL('libraries', 'LIBRARIES.json'),
                txt => {
                    var libraries = this.parseResourceFile(txt);
                    new LibraryImportDialogMorph(this, libraries).popUp();
                }
            );
        },
        'Select categories of additional blocks to add to this project.'
    );

    menu.addLine();

	if (shiftClicked) {
		menu.addItem(
			'Cloud url...',
			'setCloudURL',
			null,
			new Color(100, 0, 0)
			);
		menu.addLine();
	}

    if (shiftClicked) {
        menu.addLine();
        menu.addItem(
            'export project media only...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
        );
        menu.addItem(
            'export project without media...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectNoMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectNoMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addItem(
            'export project as cloud data...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectAsCloudData(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectAsCloudData(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
        menu.addItem(
            'open shared project from cloud...',
            function () {
                myself.prompt('Author name…', function (usr) {
                    myself.prompt('Project name...', function (prj) {
                        var id = 'Username=' +
                            encodeURIComponent(usr.toLowerCase()) +
                            '&ProjectName=' +
                            encodeURIComponent(prj);
                        myself.showMessage(
                            'Fetching project\nfrom the cloud...'
                        );
                        this.cloud.getPublicProject(
                            id,
                            function (projectData) {
                                var msg;
                                if (!Process.prototype.isCatchingErrors) {
                                    window.open(
                                        'data:text/xml,' + projectData
                                    );
                                }
                                myself.nextSteps([
                                    function () {
                                        msg = myself.showMessage(
                                            'Opening project...'
                                        );
                                    },
                                    function () {nop(); }, // yield (Chrome)
                                    function () {
                                        myself.rawOpenCloudDataString(
                                            projectData
                                        );
                                    },
                                    function () {
                                        msg.destroy();
                                    }
                                ]);
                            },
                            myself.cloudError()
                        );

                    }, null, 'project');
                }, null, 'project');
            },
            null,
            new Color(100, 0, 0)
        );
    }

    menu.popup(world, pos);
};

IDE_Morph.prototype.snapMenu = function () {
    var menu,
        world = this.world();

    menu = new MenuMorph(this);
    menu.addItem('About TurtleStitch...', 'aboutTurtleStitch');
    menu.addItem('About Snap!...', 'aboutSnap');

    menu.addLine();
    menu.addItem(
        'Reference manual',
        function () {
            window.open('https://snap.berkeley.edu/snap/help/SnapManual.pdf', 'SnapReferenceManual');
        }
    );
    menu.addItem(
        'TurtleStitch Web Site',
        function () {
            window.open('http://www.turtlestitch.org', 'TurtleStitchWebsite');
        }
    );
    menu.addItem(
        'Snap! website',
        function () {
            window.open('http://snap.berkeley.edu/', 'SnapWebsite');
        }
    );
    menu.addItem(
        'Download source',
        function () {
            window.open(
                'https://github.com/backface/turtlestitch',
                'Turtlestitchsource'
            );
        }
    );
    if (world.isDevMode) {
        menu.addLine();
        menu.addItem(
            'Switch back to user mode',
            'switchToUserMode',
            'disable deep-Morphic\ncontext menus'
                + '\nand show user-friendly ones',
            new Color(0, 100, 0)
        );
    } else if (world.currentKey === 16) { // shift-click
        menu.addLine();
        menu.addItem(
            'Switch to dev mode',
            'switchToDevMode',
            'enable Morphic\ncontext menus\nand inspectors,'
                + '\nnot user-friendly!',
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, this.logo.bottomLeft());
};


IDE_Morph.prototype.originalCreateSpriteEditor = IDE_Morph.prototype.createSpriteEditor;
IDE_Morph.prototype.createSpriteEditor = function(){
    this.originalCreateSpriteEditor();
    this.spriteEditor.color = new Color(240, 240, 240);
    this.currentSprite.scripts.color = new Color(240, 240, 240);
    this.spriteEditor.mouseEnterDragging = nop;
    this.spriteEditor.contents.mouseEnterDragging =nop;	
};

/* CORRAL BAR */
// Single Sprite mode, no corral and no tabs in the scripting area
IDE_Morph.prototype.createCorralBar = nop;
IDE_Morph.prototype.createCorral = nop;

IDE_Morph.prototype.selectSprite = function (sprite) {
    this.currentSprite = sprite;
    this.createPalette();
    this.createSpriteEditor();
    this.fixLayout('selectSprite');
    this.currentSprite.scripts.fixMultiArgs();
};

// Addressing #54: Stage occasionally goes blank
IDE_Morph.prototype.originalRefreshPalette = IDE_Morph.prototype.refreshPalette;
IDE_Morph.prototype.refreshPalette = function (shouldIgnorePosition) {
    this.originalRefreshPalette(shouldIgnorePosition);
    this.stage.reRender();
};

// Language
IDE_Morph.prototype.originalSetLanguage = IDE_Morph.prototype.setLanguage;
IDE_Morph.prototype.setLanguage = function(lang, callback, noSave) {
    var myself = this;
    myself.originalSetLanguage(lang, function () {
        var translation = document.getElementById('bb-language'),
            src = 'stitchcode/locales/lang-' + lang + '.js',
            myInnerSelf = this;
        if (translation) {
            document.head.removeChild(translation);
        }
        if (lang === 'en') {
            return myself.reflectLanguage('en', callback);
        }
        translation = document.createElement('script');
        translation.id = 'bb-language';
        translation.onload = function () {
            myself.reflectLanguage(lang, callback);
        };
        document.head.appendChild(translation);
        translation.src = src;
    }, noSave);
};

IDE_Morph.prototype.setStageExtent = function (aPoint) {
    var myself = this,
        world = this.world(),
        ext = aPoint.max(new Point(480, 180));

    function zoom() {
        myself.step = function () {
            var delta = ext.subtract(
                StageMorph.prototype.dimensions
            ).divideBy(2);
            if (delta.abs().lt(new Point(5, 5))) {
                StageMorph.prototype.dimensions = ext;
                delete myself.step;
            } else {
                StageMorph.prototype.dimensions =
                    StageMorph.prototype.dimensions.add(delta);
            }
            myself.stage.setExtent(StageMorph.prototype.dimensions);
            myself.stage.clearPenTrails();
            myself.fixLayout();
            this.setExtent(world.extent());
            this.stage.initCamera();
        };
    }

    this.stageRatio = 1;
    this.isSmallStage = false;
    this.controlBar.stageSizeButton.refresh();
    this.setExtent(world.extent());
    if (this.isAnimating) {
        zoom();
    } else {
        StageMorph.prototype.dimensions = ext;
        this.stage.setExtent(StageMorph.prototype.dimensions);
        this.stage.clearPenTrails();
        this.fixLayout();
        this.setExtent(world.extent());
    }
    this.stage.initCamera();
};


DialogBoxMorph.prototype.promptOrder = function (
    title,
    tosURL,
    tosLabel,
    prvURL,
    prvLabel,
    PUBCheckBoxLabel,
    TOSCheckBoxLabel,
    world,
    pic,
    msg
) {
    var usr = new InputFieldMorph(),
        bmn,
        agreeTOS = true,
        agreePUB = true,
        chk_tos,
        chk_pub,
        mCol = new AlignmentMorph('column', 1),
        yCol = new AlignmentMorph('column', 1),
        lnk = new AlignmentMorph('row', 1),
        bdy = new AlignmentMorph('column', this.padding),
        myself = this;

    function labelText(string) {
        return new TextMorph(
            localize(string),
            10,
            null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            MorphicPreferences.isFlat ? null : new Point(1, 1),
            new Color(255, 255, 255) // shadowColor
        );
    }

    function linkButton(label, url) {
        var btn = new PushButtonMorph(
            myself,
            function () {
                window.open(url);
            },
            '  ' + localize(label) + '  '
        );
        btn.fontSize = 10;
        btn.corner = myself.buttonCorner;
        btn.edge = myself.buttonEdge;
        btn.outline = myself.buttonOutline;
        btn.outlineColor = myself.buttonOutlineColor;
        btn.outlineGradient = myself.buttonOutlineGradient;
        btn.padding = myself.buttonPadding;
        btn.contrast = myself.buttonContrast;
        // btn.fixLayout();
        btn.fixLayout();
        return btn;
    }


    bdy.setColor(this.color);

    mCol.alignment = 'left';
    mCol.setColor(this.color);
    yCol.alignment = 'left';
    yCol.setColor(this.color);


    if (msg) {
        bdy.add(labelText(msg));
    }

    if (tosURL || prvURL) {
        bdy.add(lnk);
    }
    if (tosURL) {
        lnk.add(linkButton(tosLabel, tosURL));
    }
    if (prvURL) {
        lnk.add(linkButton(prvLabel, prvURL));
    }

    if (PUBCheckBoxLabel) {
        chk_pub = new ToggleMorph(
            'checkbox',
            this,
            function () {agreePUB = !agreePUB; }, // action,
            PUBCheckBoxLabel,
            function () {return agreePUB; } //query
        );
        chk_pub.edge = this.buttonEdge / 2;
        chk_pub.outline = this.buttonOutline / 2;
        chk_pub.outlineColor = this.buttonOutlineColor;
        chk_pub.outlineGradient = this.buttonOutlineGradient;
        chk_pub.contrast = this.buttonContrast;
        // chk_pub.fixLayout();
        chk_pub.fixLayout();
        bdy.add(chk_pub);
    }

    if (TOSCheckBoxLabel) {
        chk_tos = new ToggleMorph(
            'checkbox',
            this,
            function () {agreeTOS = !agreeTOS; }, // action,
            TOSCheckBoxLabel,
            function () {return agreeTOS; } //query
        );
        chk_tos.edge = this.buttonEdge / 2;
        chk_tos.outline = this.buttonOutline / 2;
        chk_tos.outlineColor = this.buttonOutlineColor;
        chk_tos.outlineGradient = this.buttonOutlineGradient;
        chk_tos.contrast = this.buttonContrast;
        // chk_tos.fixLayout();
        chk_tos.fixLayout();
        bdy.add(chk_tos);
    }


    mCol.fixLayout();
    yCol.fixLayout();
    lnk.fixLayout();
    bdy.fixLayout();

    this.labelString = title;
    this.createLabel();
    if (pic) {this.setPicture(pic); }

    this.addBody(bdy);

    // mCol.fixLayout();
    // yCol.fixLayout();
    bdy.fixLayout();

    this.addButton('ok', 'OK');
    this.addButton('cancel', 'Cancel');
    this.fixLayout();
    // this.fixLayout();
    this.fixLayout();

    function validInputs() {

        function indicate(morph, string) {
            var bubble = new SpeechBubbleMorph(localize(string));
            bubble.isPointingRight = false;
            // bubble.fixLayout();
            bubble.popUp(
                world,
                morph.leftCenter().subtract(new Point(bubble.width() + 2, 0))
            );
            if (morph.edit) {
                morph.edit();
            }
        }


		if (!agreeTOS) {
			indicate(chk_tos, 'please agree to\nthe TOS');
			return false;
		}
		return true;
    }

    this.accept = function () {
        if (validInputs()) {
            DialogBoxMorph.prototype.accept.call(myself);
        }
    };


    this.getInput = function () {
        return {
            choice_pub: agreePUB
        };
    };

    this.reactToChoice = function () {
    };

    this.reactToChoice(); // initialize e-mail label

    if (!this.key) {
        this.key = 'order';
    }

    this.popUp(world);
};


ProjectDialogMorph.prototype.fixLayoutOrig = ProjectDialogMorph.prototype.fixLayout;
ProjectDialogMorph.prototype.initOrig = ProjectDialogMorph.prototype.init;
ProjectDialogMorph.prototype.saveProjectOrig = ProjectDialogMorph.prototype.saveProject;

ProjectDialogMorph.prototype.originalBuildContents = ProjectDialogMorph.prototype.buildContents;
ProjectDialogMorph.prototype.buildContents = function () {
    var notification;

    this.originalBuildContents();
    // this.unpublishButton.hide();   
    // this.publishButton.hide();
    this.fixLayout();
 
    this.notesField.setWidth(this.preview.width());

    if (this.ide.cloudMsg) {
        notification = new TextMorph(
                this.ide.cloudMsg,
                10,
                null, // style
                false, // bold
                null, // italic
                null, // alignment
                null, // width
                null, // font name
                new Point(1, 1), // shadow offset
                new Color(255, 255, 255) // shadowColor
                );
        notification.refresh = nop;
        this.srcBar.add(notification);
    }
    if (notification) {
        this.setExtent(new Point(840, 590).add(notification.extent()));
    } else {
        this.setExtent(new Point(840, 590));
    }
    this.fixLayout();
    
};

ProjectDialogMorph.prototype.fixLayout = function () {
  this.fixLayoutOrig();
  if (this.preview) {
    this.preview.setHeight(310);
  }
  this.changed();
}

ProjectDialogMorph.prototype.popUp = function (wrrld) {
    var world = wrrld || this.ide.world();
    if (world) {
        ProjectDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            700,
            500,
            this.corner,
            this.corner
        );
    }
};

ProjectDialogMorph.prototype.installCloudProjectListOrig  = ProjectDialogMorph.prototype.installCloudProjectList;
ProjectDialogMorph.prototype.installCloudProjectList = function (pl) {
    this.installCloudProjectListOrig(pl)
    if (this.task === 'open' || this.task === 'add') {
        this.recoverButton.hide();      
    }
    this.fixLayout();
}

// ProjectDialogMorph.prototype.init = function (ide, task) {
// 	this.initOrig (ide, task);
// }

// ProjectDialogMorph.prototype.saveProjectOrig = ProjectDialogMorph.prototype.saveProject;
ProjectDialogMorph.prototype.saveProject = function () {
  this.saveProjectOrig();
};


StageMorph.prototype.backgroundColor = new Color(255,255,255);
StageMorph.prototype.defaultPenColor = new Color(0,0,0,1);


IDE_Morph.prototype.userSetBackgroundColor = function () {
    new DialogBoxMorph(
        this,
        function (value) {
            this.stage.renderer.setBackgroundColorHex(value);
            if (value != '#ffffff')
              this.saveSetting('backgroundColor', value);
            else {
                this.removeSetting('backgroundColor');
            }
        },
        this
    ).prompt(
        "Default background color",
        new String("#" + ((1 << 24)
          + (Math.round(StageMorph.prototype.backgroundColor.r) << 16)
          + (Math.round(StageMorph.prototype.backgroundColor.g) << 8)
      	  + Math.round(StageMorph.prototype.backgroundColor.b)).toString(16).slice(1)),
        this.world(),
        null, // pic
        null, // choices
        null, // read only
        false // numeric
    );
};

IDE_Morph.prototype.userSetPenColor = function () {
    new DialogBoxMorph(
        this,
        function (value) {
            this.stage.renderer.setDefaultPenColorHex(value);
            this.currentSprite.setColor(StageMorph.prototype.defaultPenColor);
            if (value != '#000000')
              this.saveSetting('defaultPenColor', value);
            else {
                this.removeSetting('defaultPenColor');
            }
        },
        this
    ).prompt(
        "Default pen color",
        new String("#" + ((1 << 24)
          + (Math.round(StageMorph.prototype.defaultPenColor.r) << 16)
          + (Math.round(StageMorph.prototype.defaultPenColor.g) << 8)
      	  + Math.round(StageMorph.prototype.defaultPenColor.b)).toString(16).slice(1)),
        this.world(),
        null, // pic
        null, // choices
        null, // read only
        false // numeric
    );
};

IDE_Morph.prototype.loadCameraSnapshot = function () {
    this.stage.loadCameraSnapshot()
};

IDE_Morph.prototype.clearStageBackground = function () {
    this.stage.clearStageBackground()
};


IDE_Morph.prototype.droppedImage = function (aCanvas, name) {
    var myself = this;
    var stage = this.stage;
    var costume = new Costume(
        aCanvas,
        this.stage.newCostumeName(
          name ? name.split('.')[0] : '' // up to period
        )
    );
    if (costume.isTainted()) {
        this.inform(
            'Unable to import this image',
            'The picture you wish to import has been\n' +
                'tainted by a restrictive cross-origin policy\n' +
                'making it unusable for costumes in Snap!. \n\n' +
                'Try downloading this picture first to your\n' +
                'computer, and import it from there.'
        );
        return;
    }
    this.loadAsBackgroundOrData(costume, name)
}

IDE_Morph.prototype.loadAsBackgroundOrData = function (costume, name) {
    var myself = this;
    var stage = this.stage;
    var dlg, world = this.world();
    dlg = new DialogBoxMorph();
    dlg.labelString = localize('Import Image');
    dlg.createLabel();c

    var txt = new TextMorph(
        localize('Import Image as Background  or as data table into a variable?'),
        dlg.fontSize,
        dlg.fontStyle,
        true,
        false,
        'center',
        null,
        null,
        MorphicPreferences.isFlat ? null : new Point(1, 1),
        WHITE
    );
    dlg.addBody(txt);

    btn1 = dlg.addButton(
      function () {
        stage.addCostume(costume);
        stage.wearCostume(costume);
        stage.hasBackgroundImage =  true;
        stage.renderer.setClearColor(
          new THREE.Color(
              "rgb("+
              StageMorph.prototype.backgroundColor.r + "," +
              StageMorph.prototype.backgroundColor.g + "," +
              StageMorph.prototype.backgroundColor.b + ")"),
              stage.hasBackgroundImage ? 0.5 : 1
        );
        myself.hasChangedMedia = true;
        myself.recordUnsavedChanges();
        this.destroy();
      },
      'As background'
    );
    btn2 = dlg.addButton(
      function () {
        myself.rawOpenImageData(costume.rasterized().pixels(), name)
        this.destroy();
      },
      'As data',
    );
    dlg.fixLayout();
    dlg.popUp(world);
}


IDE_Morph.prototype.loadSVG = function (anImage, name) {
    var costume = new SVG_Costume(anImage, name);
    var stage = this.stage;
    this.stage.addCostume(costume);
    this.stage.wearCostume(costume);
    this.stage.hasBackgroundImage =  true;
    this.stage.renderer.setClearColor(
      new THREE.Color(
          "rgb("+
          StageMorph.prototype.backgroundColor.r + "," +
          StageMorph.prototype.backgroundColor.g + "," +
          StageMorph.prototype.backgroundColor.b + ")"),
          stage.hasBackgroundImage ? 0.0 : 1
    );
    this.hasChangedMedia = true;
};

IDE_Morph.prototype.droppedAudio = function (anAudio, name) {
   // ignore
};

IDE_Morph.prototype.rawOpenImageData = function (data, name) {
    var data, vName, dlg,
        globals = this.currentSprite.globalVariables();

    function newVarName(name) {
        var existing = globals.names(),
            ix = name.indexOf('\('),
            stem = (ix < 0) ? name : name.substring(0, ix),
            count = 1,
            newName = stem;
        while (contains(existing, newName)) {
            count += 1;
            newName = stem + '(' + count + ')';
        }
        return newName;
    }

    vName = newVarName(name || 'data');
    globals.addVar(vName);
    globals.setVar(vName, data);
    this.currentSprite.toggleVariableWatcher(vName, false); // global
    this.flushBlocksCache('variables');
    this.currentCategory = 'variables';
    this.categories.children.forEach(each =>
        each.refresh()
    );
    this.refreshPalette(true);
    if (data instanceof List) {
        dlg = new TableDialogMorph(data);
        dlg.labelString = localize(dlg.labelString) + ': ' + vName;
        dlg.createLabel();
        dlg.popUp(this.world());
    }
};


// ------
// override switch to scene without touching albums or corrals

IDE_Morph.prototype.switchToScene = function (
    scene,
    refreshAlbum,
    msg,
    data,
    pauseHats
) {
    var appMode = this.isAppMode,
        listeners;
    if (!scene || !scene.stage) {
        return;
    }
    this.siblings().filter(
        morph => !morph.nag
    ).forEach(
        morph => morph.destroy()
    );
    this.scene.captureGlobalSettings();
    this.scene = scene;
    this.globalVariables = scene.globalVariables;
    listeners = this.stage.messageCallbacks;
    this.stage.destroy();
    this.add(scene.stage);
    this.stage = scene.stage;
    this.stage.messageCallbacks = listeners;
    this.sprites = scene.sprites;
    if (pauseHats) {
        this.stage.pauseGenericHatBlocks();
    }
    // this.createCorral(!refreshAlbum); // keep scenes
    scene.applyGlobalSettings();
    this.selectSprite(this.scene.currentSprite, true);
    // this.corral.album.updateSelection();
    this.fixLayout();
    // this.corral.album.contents.children.forEach(function (morph) {
    //     if (morph.state) {
    //         morph.scrollIntoView();
    //     }
    // });
    if (!SpriteMorph.prototype.allCategories().includes(this.currentCategory)) {
        this.currentCategory = 'motion';
    }
    if (!this.setUnifiedPalette(scene.unifiedPalette)) {
        this.createCategories();
        this.createPaletteHandle();
        this.categories.fixLayout();
        this.fixLayout();
        this.flushBlocksCache();
        this.categories.refreshEmpty();
        this.currentSprite.palette(this.currentCategory);
        this.refreshPalette(true);
    }
    this.toggleAppMode(appMode);
    this.controlBar.stopButton.refresh();
    this.world().keyboardFocus = this.stage;
    if (msg) {
        this.stage.fireChangeOfSceneEvent(msg, data);
    }
};

// IDE_Morph.prototype.openProjectName = function (name) {
//     var str;
//     if (name) {
//         this.showMessage('opening project\n' + name);
//         this.setProjectName(name);
//         str = localStorage['-snap-project-' + name];
//         this.openProjectString(str);
//     }
// };




StageHandleMorph.prototype.init = function (target) {
    this.target = target || null;
    HandleMorph.uber.init.call(this);
    this.color = MorphicPreferences.isFlat ?
            new Color(125, 125, 125) : new Color(190, 190, 190);
    this.isDraggable = false;
    this.noticesTransparentClick = true;
    this.setExtent(new Point(12, 50));
};


// backport from Snap 8

IDE_Morph.prototype.inform = function (title, message) {
    return new DialogBoxMorph().inform(
        title,
        localize(message),
        this.world()
    );
};


// IDE_Morph cloud interface

IDE_Morph.prototype.initializeCloud = function () {
    var world = this.world();
    new DialogBoxMorph(
        null,
        user => this.cloud.login(
            user.username.toLowerCase(),
            user.password,
            true, // user.choice (alwyas persist)
            (username, role, response) => {
                sessionStorage.username = username;
                this.controlBar.cloudButton.refresh();
                this.source = 'cloud';
                if (!isNil(response.days_left)) {
                    var duration = response.days_left + ' day' +
                        (response.days_left > 1 ? 's' : '');
                    new DialogBoxMorph().inform(
                        'Unverified account: ' + duration + ' left' +
                        'You are now logged in, and your account\n' +
                        'is enabled for ' + duration + '.\n' +
                        'Please use the verification link that\n' +
                        'was sent to your email address when you\n' +
                        'signed up.\n\n' +
                        'If you cannot find that email, please\n' +
                        'check your spam folder. If you still\n' +
                        'cannot find it, please use the "Resend\n' +
                        'Verification Email..." option in the cloud\n' +
                        'menu.\n\n' +
                        'You have ' + duration + ' left.',
                        world,
                        this.cloudIcon(null, new Color(0, 180, 0))
                    );
                } else if (response.title) {
                    new DialogBoxMorph().inform(
                        response.title,
                        response.message,
                        world,
                        this.cloudIcon(null, new Color(0, 180, 0))
                    );
                } else {
                    this.showMessage(response.message, 2);
                }
            },
            this.cloudError()
        )
    ).withKey('cloudlogin').promptCredentials(
        'Sign in',
        'login',
        null,
        null,
        null,
        null,
        '', //stay signed in on this computer\nuntil logging out',
        world,
        this.cloudIcon(),
        this.cloudMsg
    );
};
