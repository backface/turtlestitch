// Beetle Blocks cloud
// Inspired in Snap! cloud

function BeetleCloud (url, ide) {
    this.init(url, ide);
};

BeetleCloud.prototype.init = function (url, ide) {
    this.url = url;
    this.ide = ide;
    if (typeof this.url !== 'undefined')  {
       this.checkCredentials();
    }
};

BeetleCloud.prototype.parseDict = Cloud.prototype.parseDict;
BeetleCloud.prototype.encodeDict = Cloud.prototype.encodeDict;

BeetleCloud.prototype.clear = function () {
    this.username = null;
};

BeetleCloud.prototype.get = function (path, callBack, errorCall, errorMsg) {
    var request = new XMLHttpRequest(),
        myself = this;

    try {
        request.open(
            'GET',
            this.url + path,
            true
        );
        request.setRequestHeader(
            'Content-Type',
            'application/json; charset=utf-8'
        );

        request.withCredentials = true;
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.responseText) {
                    if(request.status === 404) { 
                      if (errorCall) 
                        errorCall.call(
                            null,
                            myself.url,
                            errorMsg
                        );
                      else
                        console.log("error in checking credentials")
                      return false;
                    }
                    var response = JSON.parse(request.responseText);
                    if (!response.error) {
                        callBack.call(null, response);
                    } else {
                        errorCall.call(
                            null,
                            response.error,
                            errorMsg
                        );
                    }
                } else {
                    if (typeof errorCall != 'undefined') {
                      errorCall.call(
                        null,
                        myself.url,
                        errorMsg
                      );
                    }
                }
            }
        };
        request.send();
    } catch (err) {
        errorCall.call(this, err.toString(), 'TurtleCloud');
    }

};


BeetleCloud.prototype.getImage = function (path, callBack, errorCall, errorMsg) {
    var request = new XMLHttpRequest(),
        myself = this;

    try {
        request.open(
            'GET',
            this.url + path,
            true
        );
        request.setRequestHeader(
            'Content-Type',
            'application/json; charset=utf-8'
        );

        request.withCredentials = true;
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.responseText) {
                    if(request.status === 404) { 
                      if (errorCall) 
                        errorCall.call(
                            null,
                            myself.url,
                            errorMsg
                        );
                      else
                        console.log("error in checking credentials")
                      return false;
                    }
                    callBack.call(null, request.responseText);
                } else {
                    if (typeof errorCall != 'undefined') {
                      errorCall.call(
                        null,
                        myself.url,
                        errorMsg
                      );
                    }
                }
            }
        };
        request.send();
    } catch (err) {
        errorCall.call(this, err.toString(), 'TurtleCloud');
    }

};

BeetleCloud.prototype.post = function (path, body, callBack, errorCall, errorMsg) {
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open(
            'POST',
            this.url + path,
            true
        );
        request.setRequestHeader(
            'Content-Type',
            'application/json'
        );

        request.withCredentials = true;

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.responseText) {
                    var response = JSON.parse(request.responseText);
                    if (response.error) {
                        errorCall.call(
                            this,
                            response.error,
                            'TurtleCloud'
                        );
                    } else {
                        callBack.call(
                            null,
                            response.text,
                            'TurtleCloud'
                        );
                    }
                } else {
                    if (typeof errorCall !== undefined) {
                      errorCall.call(
                        null,
                        myself.url + path,
                        localize('could not connect to:')
                      );
                    }
                }
            }
        };
        request.send(body);
    } catch (err) {
        errorCall.call(this, err.toString(), 'TurtleCloud');
    }

};

BeetleCloud.prototype.getCurrentUser = function (callback, errorCallback) {
    this.get('/user', callback, errorCallback, 'Could not retrieve current user');
};

BeetleCloud.prototype.checkCredentials = function (callback, errorCallback) {
    var myself = this;
    this.getCurrentUser(
            function (user) { 
                if (user.username) {
                    myself.username = user.username;
                }
                if (callback) { callback.call(null, user); }
            },
            errorCallback);
};

BeetleCloud.prototype.logout = function (callBack, errorCall) {
    this.get('/users/logout', callBack, errorCall, 'logout failed'); 
};

BeetleCloud.prototype.shareProject = function (shareOrNot, projectName, callBack, errorCall) {
    var myself = this;

    this.checkCredentials(
            function (user) {
                if (user.username) { 
                    myself.get('/users/' + encodeURIComponent(user.username)
                            + '/projects/' + encodeURIComponent(projectName)
                            + '/visibility?ispublic=' + shareOrNot, // path
                            callBack, // ok callback
                            errorCall, // error callback
                            (shareOrNot ? 'S' : 'Uns') + 'haring failed'); // error message
                } else {
                    errorCall.call(this, 'You are not logged in', 'TurtleCloud');
                }
            },
            errorCall
            );
};

BeetleCloud.prototype.saveProject = function (ignorethis, discardthis, callBack, errorCall) {
    var myself = this;

    this.ide.stage.reRender();

    this.checkCredentials(
            function (user) {
                if (user.username) {
                    project = new Project(myself.ide.scenes, myself.ide.scene);
                    project.name = myself.ide.projectName;
                    project.notes = myself.ide.projectNotes;
                    project.origName = myself.ide.origName;
                    project.origCreator  = myself.ide.origCreator;
                    project.creator = myself.ide.creator;
                    project.remixHistory = myself.ide.remixHistory;
                    
                    var pdata = myself.ide.serializer.serialize(project);
                    
                    // check if serialized data can be parsed back again
                    try {
                        myself.ide.serializer.parse(pdata);
                    } catch (err) {
                        myself.ide.showMessage('Serialization of program data failed:\n' + err);
                        throw new Error('Serialization of program data failed:\n' + err);
                    }
                  
                    myself.ide.showMessage('Uploading project...'); 

                    if (typeof myself.ide.tags == 'undefined')  {
                      myself.ide.tags = ""
                    }

                    //(path, body, callBack, errorCall, errorMsg)
                    myself.post(
                            '/projects/save?projectname='
                            + encodeURIComponent(myself.ide.projectName)
                            + '&username='
                            + encodeURIComponent(myself.username)
                            + '&tags='
                            + encodeURIComponent(myself.ide.tags)                            
                            + '&ispublic=true', // path
                            pdata, // body
                            callBack,
                            errorCall,
                            'Project could not be saved' // error message
                            )

                } else {
                    errorCall.call(this, 'You are not logged in', 'TurtleCloud');
                    return;
                }
            }
    );

};

// Backwards compatibility with old cloud, to be removed

BeetleCloud.prototype.getPublicProject = function (
    id,
    callBack,
    errorCall
) {
    // id is Username=username&projectName=projectname,
    // where the values are url-component encoded
    // callBack is a single argument function, errorCall takes two args

    var parsedId = id.split('&').map(function(each){return each.split('=')[1]}),
        username = decodeURIComponent(parsedId[0]),
        projectName = decodeURIComponent(parsedId[1]);

    this.fetchProject(projectName, callBack, errorCall, username);
};

BeetleCloud.prototype.fetchProject = function (projectName, callBack, errorCall, publicUsername) {
    var myself = this;

    this.checkCredentials(
            function (user) {
                var username = publicUsername || user.username;
                if (!username) {
                    errorCall.call(this, 'Project could not be fetched', 'TurtleCloud');
                    return;
                } else {
                    myself.get(
                            '/users/'
                            + encodeURIComponent(username)
                            + '/projects/'
                            + encodeURIComponent(projectName),
                            function (response) { callBack.call(null, response.contents); },
                            errorCall,
                            'Could not fetch project'
                            )
                }
            },
            errorCall
            );
};

BeetleCloud.prototype.deleteProject = function (projectName, callBack, errorCall) {
    var myself = this;

    this.checkCredentials(
            function (user) {
                if (!user.username) {
                    errorCall.call(this, 'You are not logged in', 'TurtleCloud');
                    return;
                } else {
                    myself.get(
                            '/users/'
                            + encodeURIComponent(user.username)
                            + '/projects/'
                            + encodeURIComponent(projectName)
                            + '/delete',
                            function (response) { callBack.call(null, response.text); },
                            errorCall,
                            'Could not delete project'
                            );
                }
            },
            errorCall
            );
}

BeetleCloud.prototype.getProjectList = function (callBack, errorCall) {
    var myself = this;

    this.checkCredentials(
            function (user) {
                if (!user.username) {
                    errorCall.call(this, 'You are not logged in', 'TurtleCloud');
                    return;

                } else {
                    myself.get(
                            '/users/'
                            + encodeURIComponent(myself.username)
                            + '/projects',
                            function (response) { 
                                if (Object.keys(response).length > 0) {
                                    response.forEach(function(eachProject) {
                                        // This looks absurd, but PostgreSQL doesn't respect case
                                        eachProject.Public = eachProject.ispublic ? 'true' : 'false'; // compatibility with old cloud
                                        eachProject.ProjectName = eachProject.projectname;
                                        eachProject.Thumbnail = eachProject.thumbnail;
                                        eachProject.Updated = eachProject.updated;
                                        eachProject.Notes = eachProject.notes;
                                        
                                    });
                                    callBack.call(null, response);
                                } else {
                                    // alert("empty")
                                    callBack.call(null, []);
                                } 
                            },
                            errorCall,
                            'Could not fetch project list'
                            );
                }
            },
            errorCall
            );
};

BeetleCloud.prototype.getThumbnail = function (username, projectName, callBack, errorCall) {
    this.getImage('/users/' + this.username
            + '/projects/' + encodeURIComponent(projectName)
            + '/image', // path
            callBack, // ok callback
            () => {}, // error callback
            'Could not fetch thumbnail'); // error message
                
};

BeetleCloud.prototype.disable = function () {
    this.disabled = true;
    this.username = null;
};

Cloud = BeetleCloud;

var SnapCloud = new BeetleCloud(
   '/api' 
);

// Overrides to be moved to the proper corresponding files after this goes live

// gui.js

// In the BeetleCloud we allow uppercase characters in usernames
// so we need to override this function
IDE_Morph.prototype.openIn = function (world) {
    var hash, myself = this, urlLanguage = null;

    window.onmessage = function (event) {
        // make the API accessible from outside an iframe
        var ide = myself;
        if (!isNil(event.data.selector)) {
            window.top.postMessage(
                {
                    selector: event.data.selector,
                    response: ide[event.data.selector].apply(
                        ide,
                        event.data.params
                    )
                },
                '*'
            );
        }
    };
    
    SnapCloud.checkCredentials(
            function (user) {
                if (user.username) {
                    myself.source = 'cloud';
                }
            });

    this.buildPanes();
    world.add(this);
    world.userMenu = this.userMenu;

    // override SnapCloud's user message with Morphic
    SnapCloud.message = function (string) {
        var m = new MenuMorph(null, string),
            intervalHandle;
        m.popUpCenteredInWorld(world);
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, 2000);
    };

    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };

    this.reactToWorldResize(world.bounds);

    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            throw new Error('unable to retrieve ' + url);
        } catch (err) {
            myself.showMessage('unable to retrieve project');
            return '';
        }
    }

    // This function returns the value of a parameter given its key
    function getParameterByName(name) {
        var param = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'),
            regex = new RegExp('[\\?&]' + param + '=([^&#]*)'),
        results = regex.exec(location.href);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // dynamic notifications from non-source text files
    // has some issues, commented out for now
    /*
    this.cloudMsg = getURL('http://snap.berkeley.edu/cloudmsg.txt');
    motd = getURL('http://snap.berkeley.edu/motd.txt');
    if (motd) {
        this.inform('Snap!', motd);
    }
    */
    function interpretUrlAnchors() {
        var dict;
        if (location.hash.substr(0, 6) === '#open:') {
            hash = location.hash.substr(6);
            if (hash.charAt(0) === '%'
                    || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (contains(
                    ['project', 'blocks', 'sprites', 'snapdata'].map(
                        function (each) {
                            return hash.substr(0, 8).indexOf(each);
                        }
                    ),
                    1
                )) {
                this.droppedText(hash);
            } else {
                this.droppedText(getURL(hash));
            }
        } else if (location.hash.substr(0, 5) === '#run:')  {
            dict = '';
            hash = location.hash.substr(5);

            //decoding if hash is an encoded URI
            if (hash.charAt(0) === '%'
                    || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            idx = hash.indexOf("&");

            // supporting three URL cases

            // xml project
            if (hash.substr(0, 8) === '<project') {
                this.rawOpenProjectString(
                    hash.slice(0,hash.indexOf('</project>') + 10)
                );
                applyFlags(
                    myself.cloud.parseDict(
                        hash.substr(hash.indexOf('</project>') + 10)
                    )
                );
            // no project, only flags
            } else if (idx == 0){
                applyFlags(myself.cloud.parseDict(hash));
            // xml file path
            // three path types allowed:
            //  (1) absolute (http...),
            //  (2) relative to site ("/path") or
            //  (3) relative to folder ("path")
            } else {
                this.shield = new Morph();
                this.shield.alpha = 0;
                this.shield.setExtent(this.parent.extent());
                this.parent.add(this.shield);
                this.showMessage('Fetching project...');
                if (idx > 0) {
                    dict = myself.cloud.parseDict(hash.substr(idx));
                    hash = hash.slice(0,idx);
                }
                this.getURL(
                    hash,
                    projectData => {
                        var msg;
                        this.nextSteps([
                            () => msg = this.showMessage('Opening project...'),
                            () => {
                                if (projectData.indexOf('<snapdata') === 0) {
                                    this.rawOpenCloudDataString(projectData);
                                } else if (
                                    projectData.indexOf('<project') === 0
                                ) {
                                    this.rawOpenProjectString(projectData);
                                }
                                this.hasChangedMedia = true;
                            },
                            () => {
                                this.shield.destroy();
                                this.shield = null;
                                msg.destroy();
                                // this.toggleAppMode(true);
                                applyFlags(dict);
                            }
                        ]);
                    }
                );
            }
        } else if (location.hash.substr(0, 9) === '#present:') {
            this.shield = new Morph();
            this.shield.color = this.color;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            dict = SnapCloud.parseDict(location.hash.substr(9));

            SnapCloud.getPublicProject(
                SnapCloud.encodeDict(dict),
                function (projectData) {
                    var msg;
                    myself.nextSteps([
                        function () {
                            msg = myself.showMessage('Opening project...');
                        },
                        function () {nop(); }, // yield (bug in Chrome)
                        function () {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                            ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        function () {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();

                            if (dict.editMode) {
                                myself.toggleAppMode(false);
                            } else {
                                myself.toggleAppMode(true);
                            }

                            if (!dict.noRun) {
                                myself.runScripts();
                            }

                            if (dict.hideControls) {
                                myself.controlBar.hide();
                                window.onbeforeunload = function () {nop(); };
                            }
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 7) === '#cloud:') {
            this.shield = new Morph();
            this.shield.alpha = 0;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            dict = SnapCloud.parseDict(location.hash.substr(7));

            SnapCloud.getPublicProject(
                SnapCloud.encodeDict(dict),
                function (projectData) {
                    var msg;this
                    myself.nextSteps([
                        function () {
                            msg = myself.showMessage('Opening project...');
                        },
                        function () {nop(); }, // yield (bug in Chrome)
                        function () {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                            ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        function () {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            myself.toggleAppMode(false);
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 6) === '#lang:') {
            urlLanguage = location.hash.substr(6);
            this.setLanguage(urlLanguage);
            this.loadNewProject = true;
        } else if (location.hash.substr(0, 7) === '#signup') {
            this.createCloudAccount();
        }
    }
    
    function applyFlags(dict) {
        if (dict.noCloud) {
            myself.cloud.disable();
        }
        if (dict.embedMode) {
            myself.setEmbedMode();
        }
        if (dict.editMode) {
            myself.toggleAppMode(false);
        } else {
            myself.toggleAppMode(true);
        }
        if (!dict.noRun) {
            autoRun();
        }
        if (dict.hideControls) {
            myself.controlBar.hide();
            window.noExitWarning = true;
        }
        if (dict.noExitWarning) {
            window.noExitWarning = true;
        }
        if (dict.blocksZoom) {
            myself.savingPreferences = false;
            myself.setBlocksScale(Math.max(1,Math.min(dict.blocksZoom, 12)));
            myself.savingPreferences = true;
        }

        // only force my world to get focus if I'm not in embed mode
        // to prevent the iFrame from involuntarily scrolling into view
        if (!myself.isEmbedMode) {
            world.worldCanvas.focus();
        }
    }

    function autoRun () {
        // if we're going to run the project anyway, remove the embed
        // overlay in case we're in embedMode
        if (myself.embedOverlay) {
            myself.embedPlayButton.destroy();
            myself.embedOverlay.destroy();
        }
        // wait until all costumes and sounds are loaded
        if (isLoadingAssets()) {
            myself.world().animations.push(
                new Animation(nop, nop, 0, 200, nop, autoRun)
            );
        } else {
            myself.runScripts();
        }
    }
    
    function isLoadingAssets() {
        return myself.sprites.asArray().concat([myself.stage]).some(any =>
            (any.costume ? any.costume.loaded !== true : false) ||
            any.costumes.asArray().some(each => each.loaded !== true) ||
            any.sounds.asArray().some(each => each.loaded !== true)
        );
    }    

    if (this.userLanguage) {
        this.setLanguage(this.userLanguage, interpretUrlAnchors);
    } else {
        interpretUrlAnchors.call(this);
    }
};


ProjectDialogMorph.prototype.originalBuildContents = ProjectDialogMorph.prototype.buildContents;
ProjectDialogMorph.prototype.buildContents = function () {
    var notification, myself = this;

    SnapCloud.checkCredentials(
            function (user) {
                if (user.username) {
                    myself.source = 'cloud';
                }
            });

    this.originalBuildContents();
    this.tagsLabelField = new TextMorph("Tags (New cloud projects only):");
    this.body.add(this.tagsLabelField);
    this.notesLabelField = new TextMorph("Notes");
    this.notesLabelField.edge = InputFieldMorph.prototype.edge;
    this.body.add(this.notesLabelField);
    this.tagsField = new InputFieldMorph("");
    this.tagsField.edge = InputFieldMorph.prototype.edge;
    this.tagsField.contrast = InputFieldMorph.prototype.contrast;
    this.tagsField.fixLayout = InputFieldMorph.prototype.fixLayout;
    this.body.add(this.tagsField);
    this.tagsField.hide();
    this.tagsLabelField.hide();    
    this.fixLayout();
    /*
    this.preview.setExtent(
        new Point(320,240).add(this.preview.edge * 2)
    );
    */
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

ProjectDialogMorph.prototype.deleteProject = function () {
    var myself = this,
    proj,
    idx,
    name;

    if (this.source === 'cloud') {
        proj = this.listField.selected;
        if (proj) {
            this.ide.confirm(
                    localize(
                        'Are you sure you want to delete'
                        ) + '\n"' + proj.ProjectName + '"?',
                    'Delete Project',
                    function () {
                        SnapCloud.deleteProject(
                                proj.ProjectName,
                                function () {
                                    myself.ide.hasChangedMedia = true;
                                    idx = myself.projectList.indexOf(proj);
                                    myself.projectList.splice(idx, 1);
                                    myself.installCloudProjectList(myself.projectList);
                                },
                                function (err, lbl) {
                                    myself.ide.cloudError().call(null, err, lbl);
                                }
                                );
                    }
                    );
        }
    } else { // 'local, examples'
        if (this.listField.selected) {
            name = this.listField.selected.name;
            this.ide.confirm(
                    localize(
                        'Are you sure you want to delete'
                        ) + '\n"' + name + '"?',
                    'Delete Project',
                    function () {
                        delete localStorage['-snap-project-' + name];
                        myself.setSource(myself.source); // refresh list
                    }
                    );
        }
    }
};

ProjectDialogMorph.prototype.shareProject = function () {
    var myself = this,
    ide = this.ide,
    proj = this.listField.selected,
    entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
                localize(
                    'Are you sure you want to publish'
                    ) + '\n"' + proj.ProjectName + '"?',
                'Share Project',
                function () {
                    myself.ide.showMessage('sharing\nproject...');
                    SnapCloud.shareProject(
                            true, // make public
                            proj.ProjectName,
                            function () {
                                proj.Public = 'true';
                                proj.ispublic = 'true';
                                myself.unshareButton.show();
                                myself.shareButton.hide();
                                entry.label.isBold = true;
                                entry.label.fixLayout();
                                entry.label.changed();
                                myself.buttons.fixLayout();
                                myself.fixLayout();
                                myself.ide.showMessage('shared.', 2);
                            },
                            myself.ide.cloudError()
                            );
                    // Set the Shared URL if the project is currently open
                    if (proj.ProjectName === ide.projectName) {
                        var usr = SnapCloud.username,
                            projectId = 'Username=' +
                                encodeURIComponent(usr.toLowerCase()) +
                                '&ProjectName=' +
                                encodeURIComponent(proj.ProjectName);
                        location.hash = 'cloud:' + projectId;
                    }
                }
        );
    }
};

ProjectDialogMorph.prototype.unshareProject = function () {
    var myself = this,
    ide = this.ide,
    proj = this.listField.selected,
    entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
                localize(
                    'Are you sure you want to unpublish'
                    ) + '\n"' + proj.ProjectName + '"?',
                'Unshare Project',
                function () {
                    myself.ide.showMessage('unsharing\nproject...');
                    SnapCloud.shareProject(
                            false, // make not public
                            proj.ProjectName,
                            function () {
                                proj.Public = 'false';
                                proj.ispublic = 'true';
                                myself.shareButton.show();
                                myself.unshareButton.hide();
                                entry.label.isBold = false;
                                entry.label.fixLayout();
                                entry.label.changed();
                                myself.buttons.fixLayout();
                                myself.fixLayout();
                                myself.ide.showMessage('unshared.', 2);
                            },
                            myself.ide.cloudError()
                            );
                    // Remove the shared URL if the project is open.
                    if (proj.ProjectName === ide.projectName) {
                        location.hash = '';
                    }
                }
        );
    }
};


ProjectDialogMorph.prototype.rawOpenCloudProject = function (proj) {
    var myself = this;
    SnapCloud.fetchProject(
            proj.ProjectName,
            function (response) {
                myself.ide.source = 'cloud';
                myself.ide.droppedText(response);
                if (proj.Public === 'true') {
                    location.hash = '#cloud:Username=' +
                        encodeURIComponent(SnapCloud.username) +
                        '&ProjectName=' +
                        encodeURIComponent(proj.ProjectName);
                }
            },
            myself.ide.cloudError()
            );
    this.destroy();
};


// gui.js

IDE_Morph.prototype.cloudMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.cloudButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);
        menu.popup(world, pos); 
   
};


ProjectDialogMorph.prototype.setSource = function (source) {
    var myself = this,
        msg;

    this.source = source; //this.task === 'save' ? 'local' : source;
    this.srcBar.children.forEach(function (button) {
        button.refresh();
    });
    switch (this.source) {
        case 'cloud':
            msg = myself.ide.showMessage('Updating\nproject list...');
            this.projectList = [];

            //msg.destroy();
            SnapCloud.getProjectList(
                    function (projectList) {
                        myself.installCloudProjectList(projectList);
                        msg.destroy();
                    },
                    function (err, lbl) {
                        msg.destroy();
                        myself.ide.cloudError().call(null, err, lbl);
                    }
                    );
            return;
            break;
        case 'examples':
            this.projectList = this.getExamplesProjectList();
            break;
        case 'local':
              // deprecated, only for reading
              this.projectList = this.getLocalProjectList();
              break;
        case 'disk':
            if (this.task === 'save') {
                this.projectList = [];
            } else {
                this.destroy();
                this.ide.importLocalFile();
                return;
            }
            break;                 
    }

    this.listField.destroy();
    this.listField = new ListMorph(
            this.projectList,
            this.projectList.length > 0 ?
            function (element) {
                return element.name;
            } : null,
            null,
            function () {myself.ok(); }
            );

    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    if (this.source === 'local') {
        this.listField.action = function (item) {
            var src, xml;

            if (item === undefined) {return; }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            if (myself.task === 'open') {

                src = localStorage['-snap-project-' + item.name];
                xml = myself.ide.serializer.parse(src);

                myself.notesText.text = xml.childNamed('notes').contents
                    || '';
                myself.notesText.fixLayout();
                myself.notesField.contents.adjustBounds();
                myself.preview.texture = xml.childNamed('thumbnail').contents
                    || null;
                myself.preview.cachedTexture = null;
                myself.preview.fixLayout();
            }
            myself.edit();
        };
    } else { // 'examples', 'cloud' is initialized elsewhere
        this.listField.action = function (item) {
            var src, xml;
            if (item === undefined) {return; }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            //src = myself.ide.getURL(item.path);
            src = myself.ide.getURL(
                myself.ide.resourceURL('Examples', item.fileName)
            );

            xml = myself.ide.serializer.parse(src);
            myself.notesText.text = xml.childNamed('notes').contents
                || '';
            myself.notesText.fixLayout();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = xml.childNamed('thumbnail').contents
                || null;
            myself.preview.cachedTexture = null;
            myself.preview.fixLayout();
            myself.edit();
        };
    }
    this.body.add(this.listField);
    this.shareButton.hide();
    this.unshareButton.hide();
    if (this.source === 'local') {
        this.deleteButton.show();
    } else { // examples
        this.deleteButton.hide();
    }
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};
