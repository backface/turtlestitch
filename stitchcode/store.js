SnapSerializer.prototype.app = 'TurtleStitch 2.11, http://www.turtlestitch.org';
SnapSerializer.prototype.thumbnailSize = new Point(480, 360);

// Project instance creation:

function Project(scenes, current) {
    var projectScene;

    this.scenes = scenes || new List();
    this.currentScene = current;

    // proxied for display
    this.name = null;
    this.notes = null;
    this.thumbnail = null;
    this.origName = null;
    this.creator = null;
    this.origCreator = null;
    this.remixHistory = null;

    projectScene = this.scenes.at(1);
    if (projectScene) {
        this.name = projectScene.name;
        this.notes = projectScene.notes;
        this.thumbnail = normalizeCanvas(
            projectScene.stage.thumbnail(SnapSerializer.prototype.thumbnailSize)
        );
    }

    // for deserializing - do not persist
    this.sceneIdx = null;

    // for undeleting scenes - do not persist
    this.trash = [];
}

Project.prototype.initialize = function () {
    // initialize after deserializing
    // only to be called by store
    this.currentScene = this.scenes.at(+this.sceneIdx || 1);
    return this;
};

Project.prototype.addDefaultScene = function () {
    var scene = new Scene();
    scene.addDefaultSprite();
    this.scenes.add(scene);
};

Project.prototype.toXML = function (serializer) {
    var thumbdata;

    // thumb data catch cross-origin tainting exception when using SVG costumes
    try {
        thumbdata = this.thumbnail.toDataURL('image/png');
    } catch (error) {
        thumbdata = null;
    }

    return serializer.format(
        '<project name="@" app="@" version="@">' +
            '<notes>$</notes>' +
            '<thumbnail>$</thumbnail>' +
            '<scenes select="@">%</scenes>\n' +
            '<creator>$</creator>\n' +
            '<origCreator>$</origCreator>\n' +
            '<origName>$</origName>\n' +
            '<remixHistory>$</remixHistory>\n' +
            '</project>',
        this.name || localize('Untitled'),
        serializer.app,
        serializer.version,
        this.scenes.at(1).notes || '',
        thumbdata,
        this.scenes.asArray().indexOf(this.currentScene) + 1,
        serializer.store(this.scenes.itemsArray()),
        this.creator || '',
        this.origCreator || '',
        this.origName || '',
        this.remixHistory || ''
    );
};

SnapSerializer.prototype.loadProjectModel = function (xmlNode, ide, remixID) {
    // public - answer a new Project represented by the given XML top node
    // show a warning if the origin apps differ

    var appInfo = xmlNode.attributes.app,
    app = appInfo ? appInfo.split(' ')[0] : null,
    appVersion = appInfo ? parseFloat(appInfo.split(' ')[1]) || 0 : 0,
    scenesModel = xmlNode.childNamed('scenes'),
    project = new Project();

    if (ide && app && app !== this.app.split(' ')[0]) {
        ide.inform(
            app + ' Project',
            'This project has been created by a different app:\n\n' +
                app +
                '\n\nand may be incompatible or fail to load here.'
        );
    }

    project_model = {project: xmlNode };
    //project.notes = project_model.project.childNamed('notes') ? project_model.project.childNamed('notes').contents : ""
    project.name = project_model.project.attributes.name;
    project.origName = project_model.project.childNamed('origName') ? project_model.project.childNamed('origName').contents : ""
    project.creator =  project_model.project.childNamed('creator') ? project_model.project.childNamed('creator').contents : ""
    project.origCreator =  project_model.project.childNamed('origCreator') ? project_model.project.childNamed('origCreator').contents : ""
    project.remixHistory =  project_model.project.childNamed('remixHistory') ? project_model.project.childNamed('remixHistory').contents : ""

    ide.projectName = project.name;
    //ide.projectNotes = project.notes || '';
    ide.origName = project.origName || '';
    ide.origCreator = project.origCreator || '';
    ide.creator = project.creator || '';
    ide.remixHistory = project.remixHistory || '';

    if (scenesModel) {
        if (scenesModel.attributes.select) {
            project.sceneIdx = +scenesModel.attributes.select;
        }
        scenesModel.childrenNamed('scene').forEach(model => {
            ide.scene.captureGlobalSettings();
            project.scenes.add(this.loadScene(model));
            ide.scene.applyGlobalSettings();
        });
    } else {
        project.scenes.add(this.loadScene(xmlNode, remixID));
    }
    return project.initialize();
};


// =============================================

SnapSerializer.prototype.loadScene = function (xmlNode, appVersion, remixID) {
    // private
    var scene = new Scene(),
        model,
        nameID;
    //console.log('appversion:',appVersion);
    this.scene = scene;

    model = {scene: xmlNode };
    if (+xmlNode.attributes.version > this.version) {
        throw 'Project uses newer version of Serializer';
    }

    /* Project Info */

    this.objects = {};
    scene.name = model.scene.attributes.name;
    if (!scene.name) {
        nameID = 1;
        while (
            Object.prototype.hasOwnProperty.call(
                localStorage,
                '-snap-project-Untitled ' + nameID
            )
        ) {
            nameID += 1;
        }
        scene.name = 'Untitled ' + nameID;
    }
    scene.unifiedPalette = model.scene.attributes.palette === 'single';
    scene.showCategories = model.scene.attributes.categories !== 'false';
    scene.showPaletteButtons = model.scene.attributes.buttons !== 'false';
    scene.disableClickToRun = model.scene.attributes.clickrun === 'false';
    scene.penColorModel = model.scene.attributes.colormodel === 'hsl' ?
        'hsl' : 'hsv';
    model.notes = model.scene.childNamed('notes');
    if (model.notes) {
        scene.notes = model.notes.contents;
    }
    model.palette = model.scene.childNamed('palette');
    if (model.palette) {
        scene.customCategories = this.loadPalette(model.palette);
        SpriteMorph.prototype.customCategories = scene.customCategories;
    }
    model.globalVariables = model.scene.childNamed('variables');

    /* Stage */

    model.stage = model.scene.require('stage');
    scene.stage.remixID = remixID;

    if (Object.prototype.hasOwnProperty.call(
            model.stage.attributes,
            'id'
        )) {
        this.objects[model.stage.attributes.id] = scene.stage;
    }
    if (model.stage.attributes.name) {
        scene.stage.name = model.stage.attributes.name;
    }
    if (model.stage.attributes.color) {
        scene.stage.color = this.loadColor(model.stage.attributes.color);
        scene.stage.cachedColorDimensions = scene.stage.color[
            SpriteMorph.prototype.penColorModel
        ]();
    }
    if (model.stage.attributes.volume) {
        scene.stage.volume = +model.stage.attributes.volume;
    }
    if (model.stage.attributes.pan) {
        scene.stage.pan = +model.stage.attributes.pan;
    }
    if (model.stage.attributes.penlog) {
        scene.enablePenLogging =
            (model.stage.attributes.penlog === 'true');
    }

    model.pentrails = model.stage.childNamed('pentrails');
    if (model.pentrails) {
        scene.pentrails = new Image();
        /*
        scene.pentrails.onload = function () {
            if (scene.stage.trailsCanvas) { // work-around a bug in FF
                normalizeCanvas(scene.stage.trailsCanvas);
                var context = scene.stage.trailsCanvas.getContext('2d');
                context.drawImage(scene.pentrails, 0, 0);
                scene.stage.changed();
            }
        };
        */
        scene.pentrails.src = model.pentrails.contents;
    }
    scene.stage.setTempo(model.stage.attributes.tempo);
    if (model.stage.attributes.width) {
        scene.stage.dimensions.x =
            Math.max(+model.stage.attributes.width, 240);
    }
    if (model.stage.attributes.height) {
        scene.stage.dimensions.y =
            Math.max(+model.stage.attributes.height, 180);
    }
    scene.stage.setExtent(scene.stage.dimensions);
    scene.useFlatLineEnds =
        model.stage.attributes.lines === 'flat';
    BooleanSlotMorph.prototype.isTernary =
        model.stage.attributes.ternary !== 'false';
    scene.enableHyperOps =
        model.stage.attributes.hyperops !== 'false';
    scene.stage.isThreadSafe =
        model.stage.attributes.threadsafe === 'true';
    scene.enableCodeMapping =
        model.stage.attributes.codify === 'true';
    scene.enableInheritance =
        model.stage.attributes.inheritance !== 'false';
    scene.enableSublistIDs =
        model.stage.attributes.sublistIDs === 'true';

    
    model.hiddenPrimitives = model.scene.childNamed('hidden');
    if (model.hiddenPrimitives) {
        hidden = model.hiddenPrimitives.contents.split(' ').filter(word =>
            word.length > 0);
        if (hidden.length) {
            hidden.forEach(
                sel => {
                    var selector, migration;
                    if (sel) {
                        migration = SpriteMorph.prototype.blockMigrations[sel];
                        selector = migration ? migration.selector : sel;
                        scene.hiddenPrimitives[selector] = true;
                    }
                }
            );

            // hide new primitives that have been added to the palette
            // since the project has been last saved
            SpriteMorph.prototype.newPrimitivesSince(appVersion).forEach(
                sel => {
                    var selector, migration;
                    if (sel) {
                        migration = SpriteMorph.prototype.blockMigrations[sel];
                        selector = migration ? migration.selector : sel;
                        scene.hiddenPrimitives[selector] = true;
                    }
                }
            );
        }
    }
	
    model.codeHeaders = model.scene.childNamed('headers');
    if (model.codeHeaders) {
        model.codeHeaders.children.forEach(
            xml => scene.codeHeaders[xml.tag] = xml.contents
        );
    }

    model.codeMappings = model.scene.childNamed('code');
    if (model.codeMappings) {
        model.codeMappings.children.forEach(
            xml => scene.codeMappings[xml.tag] = xml.contents
        );
    }

    model.globalBlocks = model.scene.childNamed('blocks');
    if (model.globalBlocks) {
        this.loadCustomBlocks(scene.stage, model.globalBlocks, true);
        this.populateCustomBlocks(
            scene.stage,
            model.globalBlocks,
            true
        );
    }
    this.loadObject(scene.stage, model.stage);

    model.primitives = model.scene.childNamed('primitives');
    if (model.primitives && !this.noPrims) {
        SpriteMorph.prototype.initBlocks();
        this.loadCustomizedPrimitives(scene.stage, model.primitives);
        scene.blocks = SpriteMorph.prototype.blocks;
    }
    /* Sprites */

    model.sprites = model.stage.require('sprites');
    if (model.sprites.attributes.select) {
        scene.spriteIdx = +model.sprites.attributes.select;
    }
    scene.spritesDict[scene.stage.name] = scene.stage;
    model.sprites.childrenNamed('sprite').forEach(
        model => this.loadValue(model)
    );

    // restore inheritance and nesting associations
    this.scene.stage.children.forEach(sprite => {
        var exemplar, anchor;
        if (sprite.inheritanceInfo) { // only sprites can inherit
            exemplar = this.scene.spritesDict[
                sprite.inheritanceInfo.exemplar
            ];
            if (exemplar) {
                sprite.setExemplar(exemplar);
            }
            sprite.inheritedAttributes = sprite.inheritanceInfo.delegated || [];
            sprite.updatePropagationCache();
        }
        if (sprite.nestingInfo) { // only sprites may have nesting info
            anchor = this.scene.spritesDict[sprite.nestingInfo.anchor];
            if (anchor) {
                anchor.attachPart(sprite);
            }
            sprite.rotatesWithAnchor = (sprite.nestingInfo.synch === 'true');
        }
    });
    this.scene.stage.children.forEach(sprite => {
        var costume;
        if (sprite.nestingInfo) { // only sprites may have nesting info
            sprite.nestingScale = +(sprite.nestingInfo.scale || sprite.scale);
            delete sprite.nestingInfo;
        }
        ['scripts', 'costumes', 'sounds'].forEach(att => {
            if (sprite.inheritsAttribute(att)) {
                sprite.refreshInheritedAttribute(att);
            }
        });
        if (sprite.inheritsAttribute('costumes')) {
            if (sprite.inheritsAttribute('costume #')) {
                costume = sprite.exemplar.costume;
            } else {
                costume = sprite.costumes.asArray()[
                    sprite.inheritanceInfo.costumeNumber - 1
                ];
            }
            if (costume) {
                if (costume.loaded) {
                    sprite.wearCostume(costume, true);
                } else {
                    costume.loaded = function () {
                        this.loaded = true;
                        sprite.wearCostume(costume, true);
                    };
                }
            }
        }
        delete sprite.inheritanceInfo;
    });

    /* Global Variables */

    if (model.globalVariables) {
        this.loadVariables(
            scene.globalVariables,
            model.globalVariables
        );
    }

    this.objects = {};

    /* Watchers */

    model.sprites.childrenNamed('watcher').forEach(model => {
        var watcher, color, target, hidden, extX, extY;

        color = this.loadColor(model.attributes.color);
        target = Object.prototype.hasOwnProperty.call(
            model.attributes,
            'scope'
        ) ? scene.spritesDict[model.attributes.scope] : null;

        // determine whether the watcher is hidden, slightly
        // complicated to retain backward compatibility
        // with former tag format: hidden="hidden"
        // now it's: hidden="true"
        hidden = Object.prototype.hasOwnProperty.call(
            model.attributes,
            'hidden'
        ) && (model.attributes.hidden !== 'false');

        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'var'
            )) {
            watcher = new WatcherMorph(
                model.attributes['var'],
                color,
                isNil(target) ? scene.globalVariables
                    : target.variables,
                model.attributes['var'],
                hidden
            );
        } else {
            watcher = new WatcherMorph(
                localize(this.watcherLabels[model.attributes.s]),
                color,
                target,
                model.attributes.s,
                hidden
            );
        }
        watcher.setStyle(model.attributes.style || 'normal');
        if (watcher.style === 'slider') {
            watcher.setSliderMin(model.attributes.min || '1', true);
            watcher.setSliderMax(model.attributes.max || '100', true);
        }
        watcher.setPosition(
            scene.stage.topLeft().add(new Point(
                +model.attributes.x || 0,
                +model.attributes.y || 0
            ))
        );
        scene.stage.add(watcher);
        watcher.onNextStep = function () {this.currentValue = null; };

        // set watcher's contentsMorph's extent if it is showing a list and
        // its monitor dimensions are given
        if (watcher.currentValue instanceof List &&
                watcher.cellMorph.contentsMorph) {
            extX = model.attributes.extX;
            if (extX) {
                watcher.cellMorph.contentsMorph.setWidth(+extX);
            }
            extY = model.attributes.extY;
            if (extY) {
                watcher.cellMorph.contentsMorph.setHeight(+extY);
            }
            // adjust my contentsMorph's handle position
            watcher.cellMorph.contentsMorph.handle.fixLayout();
        }
    });

    // clear sprites' inherited methods caches, if any
    this.scene.stage.children.forEach(
        sprite => sprite.inheritedMethodsCache = []
    );

    this.objects = {};
    return scene.initialize();
};
