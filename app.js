const express = require('express');
//const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mysql = require('mysql2');
var fscontent = {};
var socketgroups = {};
var allsockets = [];

//set listening port
server.listen(1400, console.log('Listening on port: 1400'));

//get logo svg file
//fs.readFile(__dirname + '/public/images/loader.svg', 'utf8', function(err, cont){ if(err){ console.log(err); }else{ fscontent.loader = cont; } });

//serve the page on request
app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

//server.io connection
io.on('connection', (socket)=>{
    //socket.emit('exsvg', fscontent);
    
    //set initial player variables
    allsockets.push(socket);
    socket.yourname = '';
	socket.game = '';
    socket.isleader = 0;
    socket.ready = 0;
    socket.type = 'Nothing';
    
    //add comments
    socket.on('sendMsg', data => {
        if(socket.game != ''){
            socketgroups[socket.game].forEach(soc => {
                soc.emit('addToChat', {message:'<span class="chatname">' + (socket.yourname == '' ? socket.id : socket.yourname) + ':</span> ' + data, who:socket.yourname});
            });
        }
    });
    
    
});