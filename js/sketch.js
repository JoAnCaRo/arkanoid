//*NOTA* No conseguí que me funcionara la lógica para cuando se destrozan todos los bloques
//dar la enhorabuena y reiniciar, así que lo descarté.

//VARIABLES GLOBALES
let game = "Arkanoid";
let play = "play";
let playAgain = "play again";
let inicio = false;
let juego = false;
let final = false;
let cursorDer = false;
let cursorIzq = false;
let platPos = 210; //Posición inicial de la plataforma
let velX = 5; // velocidad de movimiento en X
let velY = 5; // velocidad de movimiento en Y
let bloques = []; // Array donde se crean los bloques para poder sacarlos/destruirlos cuando los toque la bola 
const bola = { //Bola y su posición de inicio
  x: platPos + 50,
  y: 380,
  radius: 20,
}

function setup() {
  createCanvas(500, 400);
  creaBloques();
}

//1°PANTALLA INICIO = PULSAR PLAY
function dibujaInicio() { // Título Arkanoid
  background("purple");
  fill("white");
  textFont("Helvetica");
  textSize(50);
  text(game, 250, 100);
  textAlign(CENTER, CENTER);
  
  fill("red"); // Botón "play" en rojo con efecto "hover" a blanco cuando el ratón pasa por encima
  if (mouseX > 225 && mouseX < 275 && mouseY > 200 && mouseY < 220) {
    fill("white");
  }
  rect(225, 200, 50, 20); // Botón "play"
  fill(0);
  textFont("Helvetica");
  textSize(15);
  text(play, 250, 210);
  textAlign(CENTER, CENTER);
}

function mousePressed() { // Presionar mouse solo funciona cuando el mouse esta encima del botón 
  if (mouseX > 225 && mouseX < 275 && mouseY > 200 && mouseY < 220) {
    inicio = true;
    juego = true;
    final = false;
  }
}

//2°PANTALLA GAME

function platform() { //Plataforma y su movimiento
  fill("#white");
  rect(platPos, 385, 80, 15, 5);

  if (cursorDer && platPos < 420) {
    platPos += 10;
  }
  if (cursorIzq && platPos > 0) {
    platPos += -10;
  }
}

function keyPressed(value) { // Movimiento de plataforma cuando el cursor está presionado
  if (value.key === "ArrowRight") {
    cursorDer = true;
  }
  if (value.key === "ArrowLeft") {
    cursorIzq = true;
  }
}

function keyReleased(value) {// Plataforma se para cuando deja de estar presionado el cursor
  if (value.key === "ArrowRight") {
    cursorDer = false;
  }
  if (value.key === "ArrowLeft") {
    cursorIzq = false;
  }
}

// Bloques
function creaBloques() { // Creación de los bloques
  const fila = 3;
  const col = 8;

  for (let i = 0; i < col; i++) {
    for (let j = 0; j < fila; j++) {
      let bloque = {
        x: i * 58 + 18,
        y: j * 12 + 10,
        w: 57,
        h: 10,
      };
      bloques.push(bloque);
    }
  }
}

function pintaBloques() {// Color de los bloques
  bloques.forEach((bloque) => {
    fill("white");
    rect(bloque.x, bloque.y, bloque.w, bloque.h);
  });
}

//Bola
function ball() {// Creación bola y lógica para que la bola rebote en las paredes y techo de pantalla
  noStroke();
  fill("white");
  ellipse(bola.x, bola.y, bola.radius, bola.radius);  
  if (bola.y <= 0) {
    velY = -velY;
  }
  if (bola.y >= height - 18 && bola.x > platPos && bola.x <= platPos + 50) {
    velY = -velY;
    if (velX > 0) {
      velX = -velX;
    }
    if (velX < 0) {
      velX = velX;
    }
  }
  if (bola.y >= height - 18 && bola.x > platPos + 50 && bola.x <= platPos + 100) {
    velY = -velY;
    if (velX > 0) {
      velX = velX;
    }
    if (velX < 0) {
      velX = -velX;
    }
  }
  if (bola.x >= width - 10 || bola.x <= 0) {
    velX = -velX;
  }
// Desaparición de bloques cuando los toca la bola. Se sacan del array.
  bloques.forEach((item, index) => {
    if (choqueBola(bola, item)) {
      velY = -velY;
      bloques.splice(index, 1);
    }
  });

  if (bola.y > height) { // El juego se detiene si la bola toca la base de la pantalla y se resetea
    final = true;
    inicio = false;
    juego = false;
    bola.x = platPos + 50;
    bola.y = 380;
    bloques = [];
    creaBloques();
  }
  
  bola.x += velX;
  bola.y += velY;
}

function choqueBola(ball, bloque) {// Detecta el choque de la bola con los bloques 
   if (ball.y - 20 < bloque.y && ball.x > bloque.x && ball.x <= bloque.x + 58) {
   return true;
   }
}

//3°PANTALLA = PLAY AGAIN
function dibujaFinal() { // Título Arkanoid
  background("purple");
  fill("white");
  textFont("Helvetica");
  textSize(50);
  text(game, 250, 100);
  textAlign(CENTER, CENTER);
  
  // Botón play en rojo con efecto "hover" a blanco cuando el ratón pasa por encima
  fill("red");
  if (mouseX > 200 && mouseX < 300 && mouseY > 200 && mouseY < 220) {
    fill("white");
  }
  rect(200, 200, 100, 20); //Botón "play again"
  fill(0);
  textFont("Helvetica");
  textSize(15);
  text(playAgain, 250, 210);
  textAlign(CENTER, CENTER);
}

// DIBUJAR JUEGO
function draw() {
  background("purple");

  if (juego && inicio) {
    ball();
    pintaBloques();
    platform();
  }
  
  if (!juego && !inicio) {
    dibujaInicio();
  }
  
  if (final) {
    dibujaFinal();
  }
}