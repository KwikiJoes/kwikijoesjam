const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mysql = require('mysql2');
var allsockets = [];

//set listening port
server.listen(1400, console.log('Listening on port: 1400'));

//serve the page on request
app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

//connect to database and get words
var mycon = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "kjjam",
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
        let type = data.type == '(Noun}' ? 'nouns' : 'verbs';
        type = data.type == '(Adjective)' ? 'adjectives' : type;
        mycon.query("INSERT INTO " + type + " (word) VALUES (\"" + data.idea + "\")", function(err, result){
            if(err) throw err;
            allsockets.forEach(soc => {
                soc.emit('addedword', data);
            });
        });
    });
    
    
});