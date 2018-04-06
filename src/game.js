var socket = io();

socket.on('planet', function(data){
    console.log(data);
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
