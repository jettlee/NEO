var socket = io();

socket.on('planet', function(data){
    //compose planet according to data from server
    var particleSystem = composePlanet(data.texturePath, data.vertex);

    //draw planet at client side
    Galaxy.TopScene.add(particleSystem);
});

$('#three-canvas').on('click',this.canvasClickEvent);

function canvasClickEvent(e){
    var self = this;
    e.preventDefault();
    e.stopPropagation();

    socket.on('planet', function(data) {
        //console.log(data);
    });
};

function composePlanet(filePath, vertex) {
    var particles = new THREE.Geometry();
    var vertex = new THREE.Vector3(vertex[0], vertex[1], vertex[2]);
    particles.vertices.push(vertex);

    var pMaterial = new THREE.ParticleBasicMaterial({
        size: 100,
        map: THREE.ImageUtils.loadTexture(filePath),
        blending: THREE.AdditiveBlending,
        transparent: false,
        depthTest: false
    });

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    return particleSystem;
}
