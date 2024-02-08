var socket = io({transports:['websocket'], upgrade:false});

//on document ready
document.addEventListener("DOMContentLoaded", () => {
    //add content from file system
    socket.on('exsvg', function(data){
        //show svgs
        data.forEach( ele => {
            console.log(ele);
            //document.getElementById(ele).innerHTML = ele;
        });
    });
});

window.addEventListener("load", () => {
    gsap.to('#loader', { opacity:0, display:"none", ease:"power1.out", duration:1 });
});

//setup socket.io
//socket.on('connected', function(data){ document.getElementById('results').innerHTML = data; });

//send app comment
function sendComment(){
    var comment = document.getElementById('comm').value;
    if(comment != '') socket.emit('sendMsg', comment);
}

//add to chat
socket.on('addToChat', function(data){
    document.getElementById('results').innerHTML = data.message;
});