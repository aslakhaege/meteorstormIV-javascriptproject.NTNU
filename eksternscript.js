
//variabler for modal
var modal = document.getElementById('myModal');
var restart = document.getElementById("restart");
//variabel til musikk
var audio = document.getElementById("audio");


// Ikke vis modal ved start
window.onload = function () {
    modal.style.display = "none"
}

var c =document.getElementById("myCanvas");
var myCanvas=c.getContext("2d");

//størrelsen på canvas
var w=500,h=500;

//spillebrikke
var player = new Player(0, 0, 16);

//canvas stil
c.height=h;
c.width=w;

//ball array
var ball=[];

//Koordinater til player
document.getElementById("myCanvas").addEventListener('mousemove', function(e){
    player.x = e.x;
    player.y = e.y;
});

//funksjonen lager spillebrikken
function Player(x, y, r){
  this.x=x; //start x koordinat
  this.y=y; //start y koordinat
  this.r=r; //radius
  this.update=function(){
    myCanvas.beginPath();
    myCanvas.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
    myCanvas.closePath();
  }
}

//funksjonen definerer ballens størrelse, farge, posisjon og bane
function Ball(x,y,r,c,vx,vy){
  this.x=x; //start x koordinat
  this.y=y; //start y koordinat
  this.r=r; //radius
  this.c=c; //farge
  this.vx=vx; // x-retning fart
  this.vy=vy; // y-retning fart
  this.update=function(){
        myCanvas.beginPath();
		myCanvas.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		myCanvas.fillStyle = this.c;
		myCanvas.fill();
		myCanvas.closePath();
        this.x += this.vx;
        this.y += this.vy;

        //endre retning på bane når ballen treffer veggen
        if(this.y>=(w-10)||this.y<=10){
        this.vy=-this.vy;
         }

        if(this.x>=(h-10)||this.x<=10){
        this.vx=-this.vx;
         }
 }
}

//nullstill canvas
function clearCanvas(){
myCanvas.clearRect(0, 0, w, h);
}

//forskjellige fargealternativer for ball
var color = ["red","blue","yellow", "orange", "lightblue" ,"green" ,"Cyan" ,"violet" ,"olive" ,
 "#ffb100", "#2bff9d", "#fff585", "#c3a1ff", "#fc94f6", "#f7aa2d", "#e7a27a", "#ff9e00", "#ff7f00"];

//teller baller
var count = 0;

//legger til nye baller
function addBall(){
  if(count<100){
  var rndColor=Math.floor((Math.random() * 16) + 1); //velger tilfeldig farge
  var rndX=Math.floor((Math.random() * 5) + 1);     //Bestemmer fart x-retning
  var rndY=Math.floor((Math.random() * 5) + 1);     //Bestemmer fart y-retning
  ball[count]= new Ball(Math.floor((Math.random() * 490) + 1),
  Math.floor((Math.random() * 490)+1),Math.floor((Math.random() * 10) + 5),color[rndColor],rndX,rndY);
  count++;

 //utdata til meteor-teller
  document.getElementById("ballCount").innerHTML = "Meteors: " + count;
 }
}

//oppdater canvas og ballarray
function update(){
  var i;
  clearCanvas();
  for(i=0;i<count;i++){
  ball[i].update();
 }
}

//legg til musikk
function play(){
     audio.play();
     document.getElementById("mute").innerHTML = "Press M to turn the music on/off";
}

//mute-funksjon
window.addEventListener("keyup", playPauseKb, false);
function playPauseKb(event) {
  var x = event.keyCode;
  return audio.paused ? audio.play() : audio.pause();
  (x === 77)
};


//oppdatere bilde på canvas sånn at vi ser bevegelse av baller
setInterval(update, 1000/60);

//variabler til timer
var sec = 0;
var min = 0;

//funksjon til restartknapp modal
restart.onclick = function () {
    modal.style.display = "none"; //lukk modal
    window.location.reload(); // last inn på nytt
  }

//funksjon til startknapp, starter klokke samtidig som ball 1
function start() {

//start timer
  var klokke = setInterval(function() {
    sec++;
    if (sec == 60) {
      sec = 0;
      min++;
      if (min == 60) min = 0;
    }
    document.getElementById("time").innerHTML = "Time: " + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec); //output klokke
  }, 1000);


  setInterval(function(){

    ball.forEach(function(ballen){
      //returnerer størrelser og posisjonen til et element relativt til canvaset
      let rect = c.getBoundingClientRect();

    //ballen regner ut posisjonen for kvar enkelt ball, og kor langt unna dei er unna player. Når ball og player kommer for nært, så blir det kollisjon.
      if (Math.sqrt(Math.pow(ballen.x - (player.x-rect.left), 2) + Math.pow(ballen.y - (player.y-rect.top), 2)) <= ballen.r + player.r) {
            modal.style.display = "block"; //åpner modal
            clearInterval(klokke); //stopper klokke
            clearInterval(addballContinue); //stopper å legge til nye baller
            document.getElementById("modal-resultat").innerHTML =
            "Time: " + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec) + "<br> Meteors: " + count; //resultatutdata modal
        }
      //game over hvis player/musepeker beveger seg sidelengs i bredden utenfor canvas
        if (player.x >= c.width + rect.left || player.x <= rect.left) {
          clearInterval(klokke);
          clearInterval(addballContinue);
          modal.style.display = "block";
          document.getElementById("modal-resultat").innerHTML = "Time: " + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec) + "<br> Meteors: " + count;

        }
        //game over hvis player/musepeker beveger seg sidelengs i høyden utenfor canvas
        if (player.y >= c.height + rect.top || player.y <= rect.top) {
          clearInterval(klokke);
          clearInterval(addballContinue);
          modal.style.display = "block";
          document.getElementById("modal-resultat").innerHTML = "Time: " + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec) + "<br> Meteors: " + count;

        }
    });
  }, 3);


//start første ball
  setInterval(addBall(),10);

//gjenntar funksjonen addBall etter 10 sekunder og legger til en ny ball
  var addballContinue = setInterval(function(){addBall()}, 10000);
}

//Lager startknappen opp på canvaset
var $startButton = $('<button>Start</button>').attr({
    class: 'button',
    value: 'Start',
    id: 'start',
    style: 'position: absolute; top:35%; left: 50%; transform: translateX(-50%); zindex:2'
});
$('body').append($startButton);
//ved klikk så starter startfunksjonen og knappene forsvinner
$(document).on("click", "#start", function() {
    start();
        $("#start").remove();
        $("#credits").remove();
        $("#instructions").remove();
        //starter musikk
        setInterval(play(), 10);
});

//lager creditsknappen opp på canvaset
var $creditsButton = $('<button>Credits</button>').attr({
    class: 'button',
    id: 'credits',
    value: 'Credits',
    style: 'position: absolute; top:65%; left: 50%; transform: translateX(-50%); zindex:2',
});
$('body').append($creditsButton);
//ved klikk åpner "about us" siden
$(document).on("click", "#credits", function() {
    window.location.href = 'credits.html';
});

//lager instructions-knapp
var $creditsButton = $('<button>Instructions</button>').attr({
    class: 'button',
    id: 'instructions',
    value: 'Instructions',
    style: 'position: absolute; top:50%; left: 50%; transform: translateX(-50%); zindex:2',
});
//ved klikk åpnes instructions-siden
$('body').append($creditsButton);
$(document).on("click", "#instructions", function openInstructions() {
    window.location.href = 'instructions.html';
});
