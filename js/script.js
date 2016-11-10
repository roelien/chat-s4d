
if ( !window.requestAnimationFrame ) { // Deze methode vertelt de browser dat je een animatie wilt uitvoeren
       window.requestAnimationFrame = ( function() {
           return window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame || //voor Firefox
           window.oRequestAnimationFrame || //voor Opera
           window.msRequestAnimationFrame || //voor internet explorer
           
           function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
               window.setTimeout( callback, 1000 / 60 );
           }; 
       } )(); 
   }
   
   function drawDisc( x,y,r ) {  // Tekent de bal
      theContext.beginPath();
      theContext.arc(x,y,r,0,Math.PI*2,false);
      theContext.closePath();
      theContext.fill();
   }
   function drawPlatform1(x, y) {   // Tekent het platform links
      theContext.beginPath();
      theContext.rect(platform1X, platform1Y, 10, hoogtePlatform)
      theContext.closePath();
      theContext.fill();
      theContext.stroke();
   }

   function drawPlatform2(x, y) {   // Tekent het platform rechts
      theContext.beginPath();
      theContext.rect(platform2X, platform2Y, 10, hoogtePlatform)
      theContext.closePath();
      theContext.fill();
      theContext.stroke();
   }
 
   function startDrawing(canvasId) {
      var canvasElement = document.getElementById(canvasId);
      var drawingContext = canvasElement.getContext("2d");
      return drawingContext;
   }
   
   var canvasWidth = window.innerWidth
   var canvasHeight = window.innerHeight
   var theContext = startDrawing("mijnCanvasje")
   window.addEventListener('resize', resizeCanvas, false)
   function resizeCanvas() {
      mijnCanvasje.width = canvasWidth
      mijnCanvasje.height = canvasHeight
   }
    resizeCanvas();
 
   var x = 100;  // houdt de veranderende horizontale positie bij
   var y = 100;  // houd de veranderende verticale positie bij
   var frameTeller = 0;
   var stapX = 5;    // De X-as snelheid (in frames) per seconde
   var stapY = 5;    // De Y-as snelheid (in frames) per seconde
   var straal = 10;  // De straal van de bal
   var hoogtePlatform = 75;   // De hoogte van de platform (in pixels)
   var platform1X = (canvasWidth/100)*5    // Beginpositie X-as platform links
   var platform1Y    // Beginpositie Y-as (niet ingesteld)
   var onderkantPlatform1
   var bovenkantPlatform1
   var platform2X    // Beginpositie X-as platform rechts
   var platform2Y     // Beginpositie Y-as platform rechts
   var onderkantPlatform2
   var bovenkantPlatform2
   var hitCounter = 0   // Variable die bijhoud hoe vaak de bal op het platform komt
   var speler1Count = 0    // Variable die bijhoud hoe veel punten speler 1 heeft
   var speler2Count = 0    // Variable die bijhoud hoe veel punten speler 2 heeft
    
   setInterval( maakSpel, 40 )   // 40 frames per seconde
   
   var cursorX
   var cursorY

   function init(){
      balk = document.getElementById("balk");
      w = canvasWidth;
      h = canvasHeight;
   
      balk.style.left = (w/100)*95+"px"; //positie balk
      balk.style.top = (h/2)+"px";
      balk.snelheid = {x:0,y:0}
      balk.positie = {x:0,y:h/2}
    
      if (window.DeviceOrientationEvent) {
         window.addEventListener("deviceorientation", function(event) {
            balk.snelheid.y = Math.round(event.beta); //beta is je mobiel kantelen via de lengte.
            balk.snelheid.x = Math.round(event.gamma); //gamma is je mobiel kantelen via de breedte.
         } )
      }; 
   update();
   }

   function update(){
           balk.positie.y += (balk.snelheid.y / 2);
            
            if(balk.positie.y < 0 && balk.snelheid.y < 0){ //bovenkant
               balk.positie.y = 0;
            }

            if(balk.positie.y > canvasHeight && balk.snelheid.y > 0){ //onderkant
               balk.positie.y = canvasHeight;
            }

         balk.style.top = balk.positie.y + "px"
       
       requestAnimationFrame( update );//KEEP ANIMATING
   }

   document.onmousemove = function(a){    // Bijhouden welke coördinaten de muis heeft
      cursorX = a.pageX
      cursorY = a.pageY
   }

   function maakSpel() {   // Het spel beginnen
      platform1Y = cursorY    // Y-as van de muis = Y-as van platform
      onderkantPlatform1 = platform1Y + hoogtePlatform   // Grootte platform links berekenen
      bovenkantPlatform1 = platform1Y
      bovenkantPlatform2 = balk.positie.y + 75
      onderkantPlatform2 = balk.positie.y + 75 - hoogtePlatform
      frameTeller++;
   	x += stapX;
   	y += stapY;
   	theContext.clearRect(0,0,canvasWidth,canvasHeight);    // wis het canvas
   	drawDisc( x, y, straal );
      drawPlatform1(100, 100)    // Teken linker platform op locatie 100, 100
      drawPlatform2(100, 100)    // Teken rechter platform op locatie 100, 100

   	if(x <= platform1X + straal + 10 && x >= platform1X + straal - 10){   // Checken of het linker platform wordt geraakt 
         if (y >= bovenkantPlatform1 - straal && y <= bovenkantPlatform1 && x >= 30 - straal && x <= 40 + straal){
            stapY =- stapY
            stapX =- stapX
            //console.log("bovenkantPlatform1")
         }
         if (y <= onderkantPlatform1 + straal + 10 && y >= onderkantPlatform1 + straal && x >= 30 - straal && x <= 40 + straal) {
            stapY =- stapY
            stapX =- stapX
            //console.log("onderkantPlatform1")
         }
         if (y < onderkantPlatform1 + straal && y > bovenkantPlatform1 + straal){
         	stapX =-stapX
            hitCounter++
            console.log(hitCounter)
            if (hitCounter % 5 == 0) {    // Bij elke 5 aanrakingen de balSneller() functie uitoeren
               console.log("Bal sneller!")
               balSneller()
            }
   	   }
      }
      if (x >= (canvasWidth/100)*95 - straal - 10 && x <= (canvasWidth/100)*95 + straal - 10){    // Checken of het rechter platform wordt geraakt
         if (y >= (balk.positie.y + 75) - straal && y <= (balk.positie.y + 75) && x >= (canvasWidth/100)*95 - straal - 10 && x <= (canvasWidth/100)*95 + straal - 10){  
            //stapX =- stapX
            stapY =- stapY
            console.log("")
         }
         if (y <= (balk.positie.y + 75 - hoogtePlatform) + straal && y >= (balk.positie.y + 75 - hoogtePlatform) && x >= (canvasWidth/100)*95 - straal && x <= (canvasWidth/100)*95 + straal - 10) {
            //stapX =- stapX
            stapY =- stapY
         }
         if (y < balk.positie.y + 75 && y > balk.positie.y) {
            stapX = -stapX
            hitCounter++
            console.log(hitCounter)
            if (hitCounter % 5 == 0){  // Bij elke 5 aanrakingen de balSneller() functie uitoeren
               console.log("Bal sneller!")
               balSneller()
            }
         }
      }
   	if ( y >= canvasHeight - straal || y <= straal ){    // Checken of de boven en onderkant van het canvas wordt geraakt
   		stapY = -stapY;
   	}
      if ( x <= 0 || x >= canvasWidth){  // Checken of de bal langs een platform gaat
         if (x <= 0){   // Gaat de bal voorbij aan speler 1, dan wint speler 2
            alert("Speler 2 heeft gewonnen!")
            speler2Count++    // Punt er bij voor speler 2
            document.getElementById("score").innerHTML = "Score speler 1: " + speler1Count + "<br> Score speler 2: " + speler2Count    // Update de score
            resetBal("speler2")  // Reset de bal positie, speler 2 heeft gewonnen
         }
         if (x >= canvasWidth){    // Gaat de bal voorbij aan speler 2, dan wint speler 1
            alert("Speler 1 heeft gewonnen!")
            speler1Count++    // Punt er bij voor speler 1
            document.getElementById("score").innerHTML = "Score speler 1: " + speler1Count + "<br> Score speler 2: " + speler2Count    // Update de score
            resetBal("speler1")  // Reset de bal positie, speler 1 heeft gewonnen
         }
      }
   }

   function resetBal(winnaar) {
      if (winnaar == "speler1") {   // Welke speler heeft gewonnen?
         x = 100     // Set bal X-as positie
         y = 100     // Set bal Y-as positie
         stapX=5     // Snelheid X-as 5px per sec
         stapY=5     // Snelheid Y-as 5px per sec
         hitCounter = 0    // Reset de hitCounter
      }
      if (winnaar == "speler2") {   // Welke speler heeft gewonnen?
         x = 400     // Set bal X-as positie
         y = 200     // Set bal Y-as positie
         stapX=-5    // Snelheid X-as 5px per sec
         stapY=-5    // Snelheid Y-as 5px per sec
         hitCounter = 0    // Reset de hitCounter
      }
   }

   function balSneller() {    // De snelheid van de bal met 2px verhogen
      if (stapX > 0) {  // Checken of de X-coördinaat van de bal naar rechts gaat
         stapX+=2
      }
      if (stapY > 0) {  // Checken of de Y-coörinaat van de bal naar beneden gaat
         stapY+=2
      }
      if (stapX < 0) {  // Checken of de X-coördinaat van de bal naar links gaat
         stapX-=2
      }
      if (stapY < 0) {  // Checken of de Y-coördinaat van de bal naar boven gaat
         stapY-=2
      }
   }