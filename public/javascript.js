var timerA = null;
var socket = io({transports:['websocket'], upgrade:false});
var resulted = false;

//list of drawers
var drawers = [ 'Office Supplies', 'Paper', 'Straws', 'Buttons and beads', 'Colored Pencils', 'Craft kits', 'Pipe Cleaners', 'String', 'Tape', 'Unlabeled Drawer', 'Wooden Crafts', 'Popscicle Sticks', 'Erasers', 'Note Cards', 'Rubber Bands', 'Toothpicks', 'Clips', 'Scissors', 'Glue', 'Frames', 'Stamps', 'Shells and Animals', 'Individual Stickers', 'Sticker Sheets', 'Stickers' ];
drawers = shuffle(drawers);
var adjs = [];
var vrbs = [];
var nons = [];


//on document ready
document.addEventListener("DOMContentLoaded", () => {
    //add texture svg
    let rects = '';
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            let o = Math.random() * .05;
            rects += '%3Crect opacity=\"' + o + '\" x=\"' + (i*10) + '\" y=\"' + (j*10) + '\" width=\"10\" height=\"10\" /%3E';
        }
    }
    let newsvg = "url(\'data:image/svg+xml,%3Csvg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23000\"%3E" + rects + "%3C/g%3E%3C/svg%3E\')";
    document.getElementById('texture').style.backgroundImage = newsvg;
    
    //add enter button function
    document.querySelector('textarea[name="words"]').addEventListener('keydown', (e) => {
        if(e.keyCode == 27) hideshowinput();
        if(e.keyCode == 13){
            e.preventDefault();
            sendIdea();
            document.querySelector('textarea[name="words"]').value = '';
        }
    });
    
    //show all drawers
    drawwords('drawers', drawers);
});

//focus text input on click anywhere
/*document.addEventListener("click", () => {
    hideshowinput();
});*/

//on window load
window.addEventListener("load", () => {
    //hide page loader
    gsap.to('#loader', { opacity:0, display:"none", ease:"power1.out", duration:1, delay:1 });
});

//setup socket.io
socket.on('words', data => { 
    drawwords(data.type, data.words);
    if(data.type == 'verbs') vrbs = data.words;
    if(data.type == 'adjectives') adjs = data.words;
    if(data.type == 'nouns') nons = data.words;
});

//send app the idea
function sendIdea(){
    let types = ['Verb', 'Adjective', 'Noun'];
    document.getElementById('wordtype').innerHTML = '(' + types[Math.floor(Math.random() * (types.length))] + ')';
    let idea = document.querySelector('textarea[name="words"]').value;
    if(idea != '') socket.emit('sendIdea', {idea:idea, type:document.getElementById('wordtype').innerHTML });
}

//add word
socket.on('addedword', data => {
    addword(data.type.toString().replace('\(', '').replace('\)', '').toLowerCase(), data.idea);
});

//make mini cloud parts appear and disappear
function cloudsaction(){
    //fade clouds
    document.querySelectorAll('#clouds div').forEach(elem => {
        gsap.to(elem, { opacity:1, scale:1, duration:.4, ease:'power.in', delay:Math.random() * 5 + 2, onComplete:function(){ gsap.to(elem, { opacity:0, scale:.1, duration:.85, ease:'power1.in' }); } });
    });
}

//hide and show the idea input
function hideshowinput(){
    let elem = document.querySelector('#panelback');
    let types = ['Verb', 'Adjective', 'Noun'];
    if(elem.style.opacity == 0){
        document.getElementById('wordtype').innerHTML = '(' + types[Math.floor(Math.random() * (types.length))] + ')';
        document.querySelector("textarea[name='words']").style.pointerEvents = 'all';
        if(timerA == null) timerA = setInterval(cloudsaction, Math.random() * 3000 + 2000);
        gsap.to('#cloudchain1', { opacity:1, scale:1, duration:.5, ease:'elastic.out' });
        gsap.to('#cloudchain0', { opacity:1, scale:1, duration:.7, delay:.13, ease:'elastic.out' });
        gsap.to(elem, { opacity:1, scale:1, duration:.8, delay:.3, ease:'elastic.out' });
        gsap.to('#submitidea, #getresults', { opacity:0, scale:.1, duration:.8, ease:'expo.out' });
        document.querySelector("textarea[name='words']").focus();
        document.getElementById('closer').style.display = 'block';
    }else{
        document.getElementById('wordtype').innerHTML = '';
        document.querySelector("textarea[name='words']").blur();
        document.querySelector("textarea[name='words']").style.pointerEvents = 'none';
        gsap.to(elem, { opacity:0, scale:.95, duration:.3, ease:'power1.in' });
        gsap.to('#cloudchain1', { opacity:0, scale:.4, duration:.5, delay:.35, ease:'power1.in' });
        gsap.to('#cloudchain0', { opacity:0, scale:.4, duration:.3, delay:.15, ease:'power1.in', onComplete:function(){
            clearInterval(timerA);
            timerA = null;
            document.getElementById('closer').style.display = 'none';
            gsap.to('#submitidea, #getresults', { opacity:1, scale:1, duration:.8, ease:'elastic.out' });
        }});
        document.querySelector('textarea[name="words"]').value = '';
    }
}

//shuffle array
function shuffle(array){
  let ci = array.length, ri;
  while(ci > 0){
      ri = Math.floor(Math.random() * ci);
      ci--;
      [array[ci], array[ri]] = [array[ri], array[ci]];
  }
  return array;
}

//draw words
function drawwords(type, arr){
    let total = arr.length;
    shuffle(arr);
    let main = document.getElementById(type);
    main.innerHTML = '';
    for(let k = 0; k < total; k++){
        //get z position
        let z = Math.floor(Math.random() * total);
        let per = z/total;
        
        let initpos = Math.random() * 90;
        let l = (initpos * per) + (90-(90*per))/2;
        initpos = Math.random() * 90;
        let t = (initpos * per) + (90-(90*per))/2;
        
        let idea = document.createElement("div");
        idea.className = 'idea';
        idea.style.left = l + '%';
        idea.style.top = t + '%';
        idea.style.zIndex = z;
        //idea.style.filter = 'blur(' + ((5-per*2))+ 'px)';
        
        idea.style.transform = 'scale(' + (per + .5) + ')';
        let c = Math.floor(per*80);
        idea.style.color = 'rgba(' + (c + 50) + ',' + (c + 60) + ',' + (c + 70) + ',1)';
        
        let p = document.createElement("div");
        p.innerHTML = arr[k];
        
        idea.appendChild(p);
        main.appendChild(idea);
    }
}

//add one word
function addword(typew, word){
    //get z position
    let par = document.querySelector('#' + typew + 's');
    let parent = par.querySelectorAll('.idea');
    let z = Math.floor(Math.random() * parent.length);
    let per = z/parent.length;

    let initpos = Math.random() * 90;
    let l = (initpos * per) + (90-(90*per))/2;
    initpos = Math.random() * 90;
    let t = (initpos * per) + (90-(90*per))/2;

    let idea = document.createElement("div");
    idea.className = 'idea';
    idea.style.left = l + '%';
    idea.style.top = t + '%';
    idea.style.zIndex = z;

    idea.style.transform = 'scale(' + (per + .5) + ')';
    let c = Math.floor(per*80);
    idea.style.color = 'rgba(' + (c + 50) + ',' + (c + 60) + ',' + (c + 70) + ',1)';

    let p = document.createElement("div");
    p.innerHTML = word;

    idea.appendChild(p);
    par.appendChild(idea);
}

//see results
function getresults(){
    if(resulted == false){
        document.querySelector('#getresults').classList.add('hovered');

        let ds = document.querySelectorAll('#drawers .idea');
        let vs = document.querySelectorAll('#verbs .idea');
        let as = document.querySelectorAll('#adjectives .idea');
        let ns = document.querySelectorAll('#nouns .idea');

        //get random drawers
        shuffle(ds);
        let drws = [ds[0], ds[1], ds[2]];
        ds.forEach(elem => {
            if(!drws.includes(elem)) gsap.to(elem, { opacity:.1, duration:.6, ease:'expo.out' });
        });
        drws.forEach((elem, index) => {
            gsap.to(elem, { scale:2, zIndex:ds.length, left:'50%', translateX:'-50%', opacity:1, top:34 + (14*index) + '%', color:'rgba(255,255,255,1)', duration:.5, ease:'expo.inOut' });
        });

        //get random verb
        getrandomword(vs);

        //get random adjective
        getrandomword(as);

        //get random noun
        getrandomword(ns);

        resulted = true;
    }else{
        reset();
        resulted = false;
        document.querySelector('#getresults').classList.remove('hovered');
    }
}

//get random elem
function getrandomword(arr){
    //get random word
    let word = arr[0];
    arr.forEach(elem => {
        if(elem != word) gsap.to(elem, { opacity:.1, duration:.6, ease:'expo.out' });
    });
    gsap.to(word, { scale:2, zIndex:arr.length, left:'50%', translateX:'-50%', opacity:1, top:'45%', color:'rgba(255,255,255,1)', duration:.5, ease:'expo.inOut' });
}

function reset(){
    drawwords('drawers', drawers);
    drawwords('verbs', vrbs);
    drawwords('adjectives', adjs);
    drawwords('nouns', nons);
}



