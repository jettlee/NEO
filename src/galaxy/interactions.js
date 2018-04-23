var start = 0;
var mapped = 0;
var currnm = 30;

function updatenm(val){
  if(val != null) {
    console.log("Val is "+val);
    currnm+=val;
    console.log("New curr is "+currnm);
  }
  if(currnm < 0){
    currnm = 0;
    return currnm;
  }
  if(currnm > 200){
    currnm = 200;
    return currnm;
  }
  return currnm;
}

function clicked(str){
  if(str=="start"){
    start = 1;
    return null;
  } else if (str == "stop"){
    start = 0;
    return null;
  }
  if(start == 1){
    return true;
  } else return false;
}

function mapping(str) {
  if(str == "yes"){
    mapped = 1;
    return null;
  } else if (str == "no"){
    mapped = 0;
    return null;
  }
  if(mapped == 1) {
    return true;
  } else return false;
}

socket.on('neomatter', function(value){
    currentNeomatterValue = value;
});

Galaxy.InteractionHandler = function (camera, particleSystemsArray){
    this.cameraMotions = new Galaxy.CameraMotions(camera);
    _.bindAll(this,'canvasClickEvent','selectVertex', 'iframeSubmitClickEvent','iframeSubmitClickEvent1','transitionToNeuroglancer','inspectIframe');
    _.bindAll(this,'showInstructable', 'getTagManager','resetInteractionTimer','backEvent','transitionToNGToInspect','backFromPlanetGeneration','enterWormhole');

    // need status right away, in case we need to report something:
    //this.__statusIndicator = new window.GalaxyStatusIndicator();

    this.camera = camera;
    this.particleSystemsArray = particleSystemsArray;
    this.frozen = false;
    this.tagClickItem = null;
    this.currentTagPos = null;
    this.currentTagTexture = null;

    this.__interactionTimer = null;
    this.__constellation = null;
    this.__onscreenKeyboardView = null;

    var that = this;
    $('#three-canvas').on('click',this.canvasClickEvent);
    $('#iframeSubmitButton').on('click', this.iframeSubmitClickEvent);
    $('#iframeSubmitButton1').on('click', this.iframeSubmitClickEvent1);
    $('#planetMap').on('click',this.showInformation);
    $('#inspectBtn').on('click',this.inspectIframe);
    $('#apoint').on('click',this.transitionToNGToInspect);
    $('#bpoint').on('click',this.transitionToNGToInspect);
    $('#cpoint').on('click',this.transitionToNGToInspect);
    $('#dpoint').on('click',this.transitionToNGToInspect);
    $('#epoint').on('click',this.transitionToNGToInspect);
    $('#acreate').on('click',this.transitionToNeuroglancer);
    $('#bcreate').on('click',this.transitionToNeuroglancer);
    $('#ccreate').on('click',this.transitionToNeuroglancer);
    $('#dcreate').on('click',this.transitionToNeuroglancer);
    $('#ecreate').on('click',this.transitionToNeuroglancer);
    $('#createBtn').on('click',this.createIframe);
    $('#backBtn').on('click',this.backEvent);
    $('#backBtnPlanet').on('click',this.backFromPlanetGeneration);
    $('#poe').on('click',this.enterWormhole);
    // Because of the confusing contexts, it's a little easier to do this than to handle each of the types of links properly
    $(document).on('click','a',{context: that},this.clickAnchor);
    $('#startbtn').on('click', function(){
        that.reset({projectTagsAddAfterCameraReset: true});
        _.delay(function(){
            if (that.__tagManager.__activeTagCount == 0) {
                that.reset({projectTagsAddAfterCameraReset: true});
            }
        }, 2000);
    });

    //this.searchButton = new window.GalaxyToolbar();
    //this.searchButton.on("requestSearchKeyboard",this.initiateSearch);

    // instantiate tagManager
    this.__tagManager = new Galaxy.ProjectTagManager(particleSystemsArray,camera,Galaxy.Settings,Galaxy.Datasource);

    // generate initial tags
    _.delay(function(){that.getTagManager().maintainTagCount(5);},5000);

    // put event listener on a customized tag
    $(this.__tagManager).on('clickTag',function(e){
        that.resetInteractionTimer();
        that.clearProjectDescriptionLong(); // do this even if nothing else gets done
        that.tagClickItem = Galaxy.Datasource[e.instructableId];
        if (that.cameraMotions.isAnimating === false) {
            that.showInstructable(e.instructableId);
        }
    });

    this.resetInteractionTimer();
}

Galaxy.InteractionHandler.prototype = {

    constructor: Galaxy.InteractionHandler,

    setFrozen: function(frozen){
        this.frozen = frozen;
        $(this).trigger({
            type: 'frozenStateChanged',
            frozen: true
        });
    },
    resetInteractionTimer: function(){
        if (!_.isNull(this.__interactionTimer)) clearTimeout(this.__interactionTimer);

        var that = this;
        // this.__interactionTimer = setTimeout(function(){ no reset
        //     // user has been inactive. Reset the display
        //     that.reset({projectTagsClear: false, projectTagsAddAfterCameraReset: true},function(){
        //         //that.cameraMotions.beginAutomaticTravel();
        //     });
        // },9000000000)
    },

    backFromPlanetGeneration: function(){
      $('body').fadeOut(600, function(){
        $('#planetGen').hide();
        $('#planetMap').show();
        $('body').fadeIn(600, function(){});
      });
    },

    backEvent: function(e){
      var self = this;
      $('body').fadeOut(600, function(){
        document.getElementById("planetMap").style.display = "none";
        document.getElementById("inspectBtn").style.display = "none";
        document.getElementById("createBtn").style.display = "none";
        document.getElementById("apoint").style.display = "none";
        document.getElementById("bpoint").style.display = "none";
        document.getElementById("cpoint").style.display = "none";
        document.getElementById("dpoint").style.display = "none";
        document.getElementById("epoint").style.display = "none";
        document.getElementById("acreate").style.display = "none";
        document.getElementById("bcreate").style.display = "none";
        document.getElementById("ccreate").style.display = "none";
        document.getElementById("dcreate").style.display = "none";
        document.getElementById("ecreate").style.display = "none";
        $('#msty').show();
        // $('#mstyDialogue').hide();
        clicked("start");
        $('body').fadeIn(600, function(){
        });
      })


    },

    showInformation: function(){
      // document.getElementById("title-info").style.display = "block";
      // document.getElementById("currentPlayers").style.display = "block";
      // document.getElementById("coordinates").style.display = "block";
      // document.getElementById("poe").style.display = "block";
      document.getElementById("inspectBtn").style.display = "block";
      document.getElementById("createBtn").style.display = "block";
      $('#mstyDialogue5').show();
      $('#mstyDialogue1').hide();
      $('#mstyDialogue2').hide();
      $('#mstyDialogue3').hide();
      $('#mstyDialogue4').hide();
      $('#mstyDialogue6').hide();
      $('#mstyDialogue7').hide();
      $('#mstyDialogue8').hide();
      $('#mstyDialogue9').hide();
      $('#mstyDialogue10').hide();
      // $('#apoint').hide();
      // $('#bpoint').hide();
      // $('#cpoint').hide();
      // $('#dpoint').hide();
      // $('#epoint').hide();
      // $('#acreate').hide();
      // $('#bcreate').hide();
      // $('#ccreate').hide();
      // $('#dcreate').hide();
      // $('#ecreate').hide();
    },

    transitionToNeuroglancer: function(e) {
        // to neuroglancer for mapping
          $('#msty').hide();
          var tagId = '#' + e.target.id;
          mapping("yes");
          $('#inspectBtn').hide();
          $('#createBtn').hide();
          $('body').fadeOut(600, function(){
             updatenm(-50);
              $('#iframeDiv').height($(document).height());
              $('#iframeDiv').show();
              $(tagId).hide();
              $('#uppershipconsole').hide();
              $('#lowershipconsole').hide();
              document.getElementById("planetMap").style.display = "none";
              $('body').fadeIn(600, function(){});
          })
          // socket.emit('changeNeomatter', -50);
    },

    inspectIframe: function() {
      $('#inspectBtn').fadeOut(3000, function(){});
      $('#createBtn').fadeOut(3000, function(){});
      $('#mstyDialogue5').hide();
      $('#mstyDialogue4').hide();
      $('#mstyDialogue3').hide();
      $('#mstyDialogue2').hide();
      $('#mstyDialogue1').hide();
      $('#mstyDialogue6').hide();
      $('#mstyDialogue7').hide();
      $('#mstyDialogue8').hide();
      $('#mstyDialogue9').hide();
      $('#mstyDialogue10').hide();
      document.getElementById("apoint").style.display = "block";
      document.getElementById("bpoint").style.display = "block";
      document.getElementById("cpoint").style.display = "block";
      document.getElementById("dpoint").style.display = "block";
      document.getElementById("epoint").style.display = "block";
      document.getElementById("acreate").style.display = "none";
      document.getElementById("bcreate").style.display = "none";
      document.getElementById("ccreate").style.display = "none";
      document.getElementById("dcreate").style.display = "none";
      document.getElementById("ecreate").style.display = "none";
      // document.getElementById("neomatter").style.display = "none";
      // $('body').fadeOut(600, function(){
      //   document.getElementById("planetMap").style.display = "none";
      //   $('#iframeToInspect').height($(document).height());
      //   $('#iframeToInspect').show();
      //   $('body').fadeIn(600, function(){});
      // })
    },

    createIframe: function() {
      if (updatenm() >= 50) {
        $('#inspectBtn').fadeOut(3000, function(){});
        $('#createBtn').fadeOut(3000, function(){});
        $('#mstyDialogue5').hide();
        $('#mstyDialogue4').hide();
        $('#mstyDialogue3').hide();
        $('#mstyDialogue2').hide();
        $('#mstyDialogue1').hide();
        $('#mstyDialogue6').hide();
        $('#mstyDialogue7').hide();
        $('#mstyDialogue8').hide();
        $('#mstyDialogue9').hide();
        $('#mstyDialogue10').hide();
        document.getElementById("acreate").style.display = "block";
        document.getElementById("bcreate").style.display = "block";
        document.getElementById("ccreate").style.display = "block";
        document.getElementById("dcreate").style.display = "block";
        document.getElementById("ecreate").style.display = "block";
        document.getElementById("apoint").style.display = "none";
        document.getElementById("bpoint").style.display = "none";
        document.getElementById("cpoint").style.display = "none";
        document.getElementById("dpoint").style.display = "none";
        document.getElementById("epoint").style.display = "none";
      } else {
        $('#moreNM').show();
        $('#okBtn').on('click', function(){
          $('#moreNM').hide();
        })
      }
    },

    transitionToNGToInspect: function(e) {
        // to neuroglancer for inspection
        $('#msty').hide();
      var tagId = '#' + e.target.id;
      $('body').fadeOut(600, function(){
        $('#iframeToInspect').height($(document).height());
        $('#iframeToInspect').show();
        $('#uppershipconsole').hide();
        $('#lowershipconsole').hide();
        document.getElementById("planetMap").style.display = "none";
        $(tagId).hide();
        $('body').fadeIn(600, function(){});
      })
    },

    // Detect canvas click event and zoom in to a particle.
    // In GDC demo prototype, we prohibit the functionality of selecting a random vertex
    // Will implement click to neuroglancer here
    canvasClickEvent: function(e){
        var self = this;
        e.preventDefault();
        e.stopPropagation();
        this.resetInteractionTimer();

        // prevent galaxy rotation
        //this.setFrozen(true);

        var vector = new THREE.Vector3( ( e.clientX / Galaxy.Settings.width ) * 2 - 1, - ( e.clientY / Galaxy.Settings.height ) * 2 + 1, 0.5 );
        var projector = new THREE.Projector();
        projector.unprojectVector( vector, this.camera );

        var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );

        // If there are already selected stars out in the field, ie, from an author constellation or related group,
        // we assume the user is trying to select one of those. However, if each of these systems contains
        // only a single vertex, that indicates the user may just be clicking around individually. So don't use pre-selected
        // stars for the intersection in that case.
        var intersectSystems = this.particleSystemsArray,
            that = this;
        if (!_.isUndefined(this.__glowingParticleSystems)) {
            _.each(this.__glowingParticleSystems,function(system){
                if (system.geometry.vertices.length !== 1) {
                    // intersec with the glowing systems instead
                    intersectSystems = that.__glowingParticleSystems;
                }
            });
        }

        // When the camera is very close to the star that's selected, distance is deceiving. We basically need to adjust hit tolerance based on the distance to camera
        // Calculate the distance camera --> star by converting star's position to world coords, then measuring
        // intersection.point = Vector3
        // intersection.object = ParticleSystem it's a part of
        var getCameraDistanceForHit = function(intersection){
            var intersectionVect = intersection.point.clone();
            intersectionVect = intersection.object.localToWorld(intersectionVect);
            return intersectionVect.distanceTo(that.camera.position.clone());
        };

        // intersects sorted by distance so the first item is the "best fit"
        var intersects = _.sortBy(ray.intersectObjects( intersectSystems, true ),function(intersection){
            return getCameraDistanceForHit(intersection) / intersection.distance;
        });

        // When a hit is too close to the camera for its hit tolerance, it doesn't count. Remove those values.
        intersects = _.filter(intersects, function(intersection){
            return getCameraDistanceForHit(intersection) / intersection.distance > 100;
        });

        // the following is a workaround for GDC demo. Instead of detecting a particular object in canvas,
        // I made it detecting a certain area, which is the earth mesh on top layer.
        var clickRange = {
            locationX : e.clientX / Galaxy.Settings.width,
            locationY : e.clientY / Galaxy.Settings.height
        }

        // if the click area is around earth mesh and in a zoom-in mode,
        // then go to neuroglancer; otherwise, reset
        if (self.tagClickItem !== null && clickRange.locationX >= 0.4 && clickRange.locationX <= 0.6 && clickRange.locationY >= 0.37 && clickRange.locationY <= 0.63) {
            // document.getElementById("neomatter").style.display = "none";
            document.getElementById("title-info").style.display = "none";
            document.getElementById("currentPlayers").style.display = "none";
            document.getElementById("coordinates").style.display = "none";
            document.getElementById("poe").style.display = "none";
            // $('#msty').hide();
            $('body').fadeOut(600, function(){
                document.getElementById("planetMap").style.display = "block";
                clicked("stop");
                $('body').fadeIn(600, function(){
                  $('#mstyDialogue9').hide();
                  $('#mstyDialogue10').hide();
                  $('#mstyDialogue3').hide();
                  $('#mstyDialogue1').hide();
                  $('#mstyDialogue2').hide();
                  $('#mstyDialogue5').hide();
                  $('#mstyDialogue6').hide();
                  $('#mstyDialogue7').hide();
                  $('#mstyDialogue8').hide();
                  $('#mstyDialogue4').show();
                });
            })
            // $('body').fadeOut(600, function(){
            //     $('#iframe').height($(document).height());
            //     $('#iframe').show();
            //     $('body').fadeIn(600, function(){});
            // })

        } else {
            this.reset({projectTagsAddAfterCameraReset: true});
        }
        // if ( intersects.length > 0 ) {
        //     _.each(intersects, function(node){
        //         //console.log(node);
        //
        //     });
        //     this.selectVertex(intersects[0])
        // } else {
        //     // no intersections are within tolerance.
        //     this.reset({projectTagsAddAfterCameraReset: true});
        // }
    },

    enterWormhole: function(){
      document.getElementById("title-info").style.display = "none";
      document.getElementById("currentPlayers").style.display = "none";
      document.getElementById("coordinates").style.display = "none";
      document.getElementById("poe").style.display = "none";
      // $('#msty').hide();
      $('body').fadeOut(600, function(){
          document.getElementById("planetMap").style.display = "block";
          clicked("stop");
          $('body').fadeIn(600, function(){
            $('#mstyDialogue9').hide();
            $('#mstyDialogue10').hide();
            $('#mstyDialogue3').hide();
            $('#mstyDialogue1').hide();
            $('#mstyDialogue2').hide();
            $('#mstyDialogue5').hide();
            $('#mstyDialogue6').hide();
            $('#mstyDialogue7').hide();
            $('#mstyDialogue8').hide();
            $('#mstyDialogue4').show();
          });
      })
    },

    updateProgressBar: function(){
        // bar.animate(currentNeomatterValue / maxNeomatterValue);
        var max = 200;
        var curr = updatenm();
        console.log(curr);
        bar.animate(curr/max);
    },

    iframeSubmitClickEvent1: function(e){
        // submit in inspecting
        $('#msty').show();
        $('#mstyDialogue6').show();
        $('#mstyDialogue8').hide();
        $('#mstyDialogue7').hide();
        $('#mstyDialogue5').hide();
        $('#mstyDialogue4').hide();
        $('#mstyDialogue3').hide();
        $('#mstyDialogue2').hide();
        $('#mstyDialogue1').hide();
        $('#mstyDialogue9').hide();
        $('#mstyDialogue10').hide();

        sleep(6000).then(() => {
          $('#mstyDialogue6').hide();
          $('#mstyDialogue7').show();
          $('#mstyDialogue5').hide();
          $('#mstyDialogue4').hide();
          $('#mstyDialogue3').hide();
          $('#mstyDialogue2').hide();
          $('#mstyDialogue1').hide();
          $('#mstyDialogue8').hide();
          $('#mstyDialogue9').hide();
          $('#mstyDialogue10').hide();
        });
        var self = this;
        var countForFlags = 0;
        $('body').fadeOut(600, function(){
        $('#iframeToInspect').height(0);
        $('#iframeToInspect').hide();
        $('#apoint').hide();
        $('#bpoint').hide();
        $('#cpoint').hide();
        $('#dpoint').hide();
        $('#epoint').hide();
        $('#acreate').hide();
        $('#bcreate').hide();
        $('#ccreate').hide();
        $('#dcreate').hide();
        $('#ecreate').hide();
        document.getElementById("planetMap").style.display = "block";
        var el1 = document.getElementById("div1");
        var el2 = document.getElementById("div2");
        var el3 = document.getElementById("div3");
        var d1 = document.getElementById("i1");
        var d2 = document.getElementById("i2");
        var d3 = document.getElementById("i3");
        var ic1 = document.getElementById("icon1");
        var ic2 = document.getElementById("icon2");
        var ic3 = document.getElementById("icon3");
        while(el1.firstChild){
          el1.removeChild(el1.firstChild);
          countForFlags++;
        }
        while(el2.firstChild){
          el2.removeChild(el2.firstChild);
          countForFlags++;
        }
        while(el3.firstChild){
          el3.removeChild(el3.firstChild);
          countForFlags++;
        }
        if(!d1.firstChild){
          d1.appendChild(ic1);
        }
        if(!d2.firstChild){
          d2.appendChild(ic2);
        }
        if(!d3.firstChild){
          d3.appendChild(ic3);
        }
        // socket.emit('changeNeomatter', 5 * countForFlags);
        updatenm(20*countForFlags);
        console.log("\nFlags are "+countForFlags+"\n");
        $('body').fadeIn(600, function(){
            self.updateProgressBar();
            $('#uppershipconsole').show();
            $('#lowershipconsole').show();
        });
      })
    },

    iframeSubmitClickEvent: function(e){
        // submit in mapping
        $('#msty').show();
        $('#mstyDialogue8').hide();
        $('#mstyDialogue7').hide();
        $('#mstyDialogue6').hide();
        $('#mstyDialogue5').hide();
        $('#mstyDialogue4').hide();
        $('#mstyDialogue3').hide();
        $('#mstyDialogue2').hide();
        $('#mstyDialogue1').hide();
        $('#mstyDialogue10').hide();
        $('#mstyDialogue9').show();
        sleep(6000).then(() => {
          $('#mstyDialogue6').hide();
          $('#mstyDialogue7').hide();
          $('#mstyDialogue5').hide();
          $('#mstyDialogue4').hide();
          $('#mstyDialogue3').hide();
          $('#mstyDialogue2').hide();
          $('#mstyDialogue1').hide();
          $('#mstyDialogue8').hide();
          $('#mstyDialogue9').hide();
          $('#mstyDialogue10').show();
        });
        var self = this;
        // socket.emit('changeNeomatter', -50);
        updatenm(-50);
        // console.log('neomatter changed' + currentNeomatterValue);
        var el1 = document.getElementById("div4");
        var d1 = document.getElementById("i4");
        var ic1 = document.getElementById("icon4");
        $('#apoint').hide();
        $('#bpoint').hide();
        $('#cpoint').hide();
        $('#dpoint').hide();
        $('#epoint').hide();
        $('#acreate').hide();
        $('#bcreate').hide();
        $('#ccreate').hide();
        $('#dcreate').hide();
        $('#ecreate').hide();
      $('body').fadeOut(600, function(){
        while(el1.firstChild){
          updatenm(-5);
          el1.removeChild(el1.firstChild);
        }
        if(!d1.firstChild){
          d1.appendChild(ic1);
        }
        // document.getElementById("planetMap").style.display = "block";
        var planetImgArray  = ["./images/ang-transparent.png","./images/ash-transparent.png","./images/ero-transparent.png","./images/fire-transparent.png","./images/glee-transparent.png","./images/gold-transparent.png","./images/jade-transparent.png","./images/test3-transparent.png","./images/test5-transparent.png"];
        var elem = document.createElement("img");
        var planetIndex = Math.floor(Math.random() * Math.floor(planetImgArray.length));
        elem.setAttribute("src",planetImgArray[planetIndex]);
        elem.setAttribute("width","35%");
        elem.setAttribute("height","35%");
        if(document.getElementById("planet").firstChild){
          document.getElementById("planet").removeChild(document.getElementById("planet").firstChild);
        }
        document.getElementById("planet").appendChild(elem);
        self.updateProgressBar();
        $('#iframeDiv').height(0);
        $('#iframeDiv').hide();
        $('#planetGen').show();
        $('#uppershipconsole').show();
        $('#lowershipconsole').show();
        $('body').fadeIn(600, function(){});
      })
        // var self = this;
        // e.preventDefault();
        // e.stopPropagation();
        // // document.getElementById("neomatter").style.display = "block";
        // // document.getElementById("title-info").style.display = "block";
        // // document.getElementById("currentPlayers").style.display = "block";
        // // document.getElementById("coordinates").style.display = "block";
        // // document.getElementById("poe").style.display = "block";
        // $('body').fadeOut(600, function(){
        //     console.log($('iframeDiv'));
        //     console.log($('iframe'));
        //     $('#iframeDiv').height(0);
        //     $('#iframeDiv').hide();
        //     $('body').fadeIn(600, function(){
        //         _.delay(function(){
        //             var particles = new THREE.Geometry();
        //             var randomNum = self.integerRandom();
        //             var vertex = new THREE.Vector3(self.currentTagPos.x - 50, self.currentTagPos.y + 50, self.currentTagPos.z - 10);
        //             particles.vertices.push(vertex);
        //             var planetImgArray  = ["./images/ang-transparent.png","./images/ash-transparent.png","./images/ero-transparent.png","./images/fire-transparent.png","./images/glee-transparent.png","./images/gold-transparent.png","./images/jade-transparent.png","./images/test3-transparent.png","./images/test5-transparent.png"];
        //             var planetIndex = Math.floor(Math.random() * Math.floor(planetImgArray.length));
        //
        //             var pMaterial = new THREE.ParticleBasicMaterial({
        //                 size: 100,
        //                 map: THREE.ImageUtils.loadTexture(planetImgArray[planetIndex]),
        //                 blending: THREE.AdditiveBlending,
        //                 transparent: false,
        //                 depthTest: false
        //             });
        //             // create the particle system
        //             var particleSystem = new THREE.ParticleSystem(
        //                 particles,
        //                 pMaterial);
        //
        //             // add it to the scene
        //             this.__glowingParticleSystems = this.__glowingParticleSystems || [];
        //             this.__glowingParticleSystems.push(particleSystem);
        //             Galaxy.TopScene.add(particleSystem);
        //
        //             // emit planet data to server
        //             var planetData = {
        //                 vertex : [self.currentTagPos.x - 50, self.currentTagPos.y + 50, self.currentTagPos.z - 10],
        //                 texturePath : planetImgArray[planetIndex]
        //             };
        //             socket.emit('add', planetData);
        //         }, 500);
        //     });
        // });
    },

    integerRandom: function(){
        return [this.intervalRandom(5, -5), this.intervalRandom(3, -3), this.intervalRandom(0, -5)];
    },

    intervalRandom: function(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    reset: function(thingsToReset, callback){
        // A default object will reset everything. Situations calling for a more nuanced reset can have that, too, by overriding defaults here.
        var resetSettings = {
            keyboard: true,
            sceneComposers: true,
            projectDescriptionLong: true,
            projectTagsAddAfterCameraReset: false,
            projectTagsClear: true,
            freezeMotion: false,
            glowingIbles: true,
            constellation: true,
            cameraMotions: true
        };
        // override any defaults
        thingsToReset = thingsToReset || {};
        _.extend(resetSettings,thingsToReset);

        // go about resetting things:
        var delay = 0;
        this.tagClickItem = null;
        if (resetSettings.glowingIbles === true) this.clearGlowing();
        //if (resetSettings.constellation) this.clearConstellation();

        // big project descriptions take jquery a moment to unbind. If there's one showing, delay all the rest of the reset a tiny bit.
        if (resetSettings.projectDescriptionLong === true) delay = this.clearProjectDescriptionLong() === 0 ? 0 : 250;
        _.delay(_.bind(function(){
            if (!_.isNull(this.__onscreenKeyboardView) && resetSettings.keyboard === true) //this.__onscreenKeyboardView.closeModal();
            if (resetSettings.sceneComposers === true) Galaxy.Composers = Galaxy.ComposeScene();
            if (resetSettings.projectTagsClear === true) this.getTagManager().removeAllTags();
            this.setFrozen(resetSettings.freezeMotion);
            if (resetSettings.cameraMotions === true) {
                this.cameraMotions.reset(function(){
                    if (typeof callback === "function") callback();
                });
                var that = this;
                if (resetSettings.projectTagsAddAfterCameraReset === true) {
                    that.__tagManager.tagAnyProjects();
                    that.__tagManager.maintainTagCount(5);
                }
            } else {
                if (typeof callback === "function") callback();
            }
        },this),delay);
    },

    // when guest clicks a tag, this function will zoom in and show details
    showInstructable: function(projectId){
        this.setFrozen(true);

        // Glow selected vertex
        this.glowIbles([Galaxy.Datasource[projectId]]);

        var particleSystem = Galaxy.Utilities.particleSystemForProjectid(projectId);
        var point = Galaxy.Utilities.vertexForProjectId(projectId, particleSystem);

        var that = this,
            pointLocal = point.clone(),
            selectedPointWorldCoords = particleSystem.localToWorld(pointLocal);

        this.cameraMotions.zoomAndDollyToPoint(selectedPointWorldCoords,function(){
            var starLocation = Galaxy.Utilities.vectorWorldToScreenXY(pointLocal, that.camera);
            // can put detailed information here, cuz this is the callback function executed after zoom in
            that.placeProjectDescriptionLong(starLocation,projectId);
        });
    },

    selectVertex: function(vertex){
        // var that = this,
        //     // before we begin, make sure there's no active stuff on the screen yet.
        //     projDescriptionCount = this.clearProjectDescriptionLong(),
        //     pointLocal = vertex.point.clone(),
        //     selectedPointWorldCoords = vertex.object.localToWorld(pointLocal),
        //     delay = projDescriptionCount === 0 ? 0 : 350;  // delay camera zooming if a big project description needs to be removed
        //
        // _.delay(_.bind(function(){
        //     // If there's an active constellation, visible or not, it can tell us which neighboring points to show.
        //     // that.__constellation.getConnections(that.__constellation.connections[3][0]);
        //     if (!(_.isUndefined(this.__constellation) || _.isNull(this.__constellation))) {
        //         var neighbors = this.__constellation.getConnections(vertex.point.instructableId);
        //         if (neighbors.length > 0) {
        //             var pointList = Galaxy.Utilities.worldPointsFromIbleIds(_.union([vertex.point.instructableId],neighbors));
        //             // this.cameraMotions.showThreePointsNicely(pointList,function(){
        //             //     var starLocation = Galaxy.Utilities.vectorWorldToScreenXY(pointLocal, that.camera);
        //             //     that.placeProjectDescriptionLong(starLocation,vertex.point.instructableId);
        //             // });
        //         }
        //     } else {
        //         // When randomly selecting a point, it needs to glow:
        //         this.glowIbles([Galaxy.Datasource[vertex.point.instructableId]]);
        //
        //         // zoom in, there's nothing specific we want on screen
        //         this.cameraMotions.zoomAndDollyToPoint(selectedPointWorldCoords,function(){
        //             var starLocation = Galaxy.Utilities.vectorWorldToScreenXY(pointLocal, that.camera);
        //             that.placeProjectDescriptionLong(starLocation,vertex.point.instructableId);
        //         });
        //     }
        // },that),delay);
    },

    // this function is to add extra layer on top of the basic layer, which renders all particles
    // as a result, changing material here is to change what will be rendered after clicking
    glowIbles: function(ibleList){
        // if (!_.isNull(this.__onscreenKeyboardView)) this.__onscreenKeyboardView.closeModal();

        var self = this;
        var particles = new THREE.Geometry();
        _.each(ibleList,function(ibleData){
            var vec = Galaxy.Utilities.worldPointsFromIbleIds([ibleData.id])[0];
            self.currentTagPos = vec;
            self.currentTagTexture = ibleData.squareUrl;
            var vertex = new THREE.Vector3(vec.x,vec.y,vec.z);
            vertex.instructableId = ibleData.id;
            particles.vertices.push(vertex);
        });

        var pMaterial = new THREE.ParticleBasicMaterial({
            size: 100,
            map: THREE.ImageUtils.loadTexture(self.currentTagTexture),
            blending: THREE.AdditiveBlending,
            transparent: false,
            depthTest: false
        });

        // create the particle system
        var particleSystem = new THREE.ParticleSystem(
            particles,
            pMaterial);

        // var sun = makeSun(
        //     {
        //         radius: 7.35144e-8,
		// 		spectral: 0.656,
        //     }
        // )

        // add it to the scene

        this.__glowingParticleSystems = this.__glowingParticleSystems || [];
        this.__glowingParticleSystems.push(particleSystem);
        Galaxy.TopScene.add(particleSystem);
        //Galaxy.TopScene.add(sun);
    },

    showKeyboard: function(settings){
        var popover = $('.popover.fade');

        // temporarily hide project description
        popover.removeClass('in');
        _.delay(function(){
            popover.addClass('out');
        },500);

        // make sure that the keyboard is closed in the callback
        var that = this,
            wrappedSettings = {
                enterButtonTitle: settings.enterButtonTitle,
                titleLine: settings.titleLine,
                promptLine: settings.promptLine,
                callback: function(keyBoardResult){
                    settings.callback(keyBoardResult);
                }
            };

        // if (_.isEmpty(this.__onscreenKeyboardView)) {
        //     this.__onscreenKeyboardView = new GalaxyTextInputModal(wrappedSettings);
        //     this.__onscreenKeyboardView.on('removed',function(){
        //         // replace project description
        //         popover.removeClass('out').addClass('in');
        //         $(this).off();
        //         that.__onscreenKeyboardView = null;
        //     });
        // }
    },

    initiateSearch: function(){
        var that = this;
        this.showKeyboard({
            callback: function(query){
                // Do a case-insensitive author search in memory first. Show results as constellation if existing.
                var authorIbles = _.filter(Galaxy.Datasource,function(ibleData){
                    return ibleData.author.replace(" ","").toLowerCase() === query.replace(" ","").toLowerCase();
                });
                if (authorIbles.length > 0) {
                    var canonicalAuthorname = authorIbles[0]["author"];
                    //that.showAuthor(canonicalAuthorname);
                    return;
                }

                // No author found. Do a /searchInstructables solr search by title if none. Display top 10-15 results with "lite" annotations.
                //that.displaySearchResultsForQuery(query);
            },
            enterButtonTitle: "Search",
            titleLine: "Search Authors & Keywords",
            promptLine: "Term"
        });
    },
    clearProjectDescriptionLong: function(){
        var el = $('div.threejs-project-anchor.project-description-long'),
            numberOfDescriptions = el.length;
        $('.slideshow').cycle('destroy');
        el.popover('destroy');
        el.remove();
        return numberOfDescriptions;
    },

    placeProjectDescriptionLong: function(screenLocation,projectId){
        var htmlElement = $("<div class='threejs-project-anchor project-description-long' id='project-"+projectId+"'></div>"),
        that = this;
        $('body').append(htmlElement);
    },

    clearGlowing: function(){
        _.each(this.__glowingParticleSystems, function(child){
            Galaxy.TopScene.remove(child);
        });
        delete this.__glowingParticleSystems;
    },

    getTagManager: function(){
        return this.__tagManager;
    },

    // planetGenerate: function() {
    //
    // }
};
