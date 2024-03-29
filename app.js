require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mysql = require('mysql2');
var allsockets = [];

//set listening port
server.listen(process.env.SERVER_PORT, console.log('Listening on port: ' + process.env.SERVER_PORT));

//serve the page on request
app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

//connect to database and get words
var mycon = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//server.io connection
io.on('connection', (socket)=>{
    var verbs = [];
    var adjectives = [];
    var nouns = [];

    //set initial player variables
    allsockets.push(socket);
    
    //get all verbs
    mycon.query("SELECT * FROM verbs", function(err, result){
        if(err) throw err;
        var stres = JSON.stringify(result);
        var resar = JSON.parse(stres);
        resar.forEach(row => {
            verbs.push(row.word);
        });
        socket.emit('words', {type:'verbs', words:verbs });
    });
    
    //get all adjectives
    mycon.query("SELECT * FROM adjectives", function(err, result){
        if(err) throw err;
        var stres = JSON.stringify(result);
        var resar = JSON.parse(stres);
        resar.forEach(row => {
            adjectives.push(row.word);
        });
        socket.emit('words', { type:'adjectives', words:adjectives });
    });
    
    //get all nouns
    mycon.query("SELECT * FROM nouns", function(err, result){
        if(err) throw err;
        var stres = JSON.stringify(result);
        var resar = JSON.parse(stres);
        resar.forEach(row => {
            nouns.push(row.word);
        });
        socket.emit('words', { type:'nouns', words:nouns });
    });
    
    //add comments
    socket.on('sendIdea', data => {
        mycon.query("INSERT INTO " + data.type + " (word) VALUES (\"" + data.idea + "\")", function(err, result){
            if(err) throw err;
            allsockets.forEach(soc => {
                soc.emit('addedword', data);
            });
        });
    });
    
    //on disconnect
	socket.on('disconnect', () => {
        for(var sc = 0; sc < allsockets.length; sc++){
            if(allsockets[sc].id == socket.id) allsockets.splice(sc,1);
        }
	});
});