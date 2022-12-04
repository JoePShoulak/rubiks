function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function toggleLoop() {
  isLooping() ? noLoop() : loop();
}

let moves = [
  "U2",
  "R2",
  "L_",
  "D_",
  "U",
  "R_",
  "L",
  "F_",
  "R",
  "L2",
  "U_",
  "R2",
  "B_",
  "L_",
  "B",
  "U",
  "L_",
  "D_",
  "L_",
  "D",
  "L_",
  "D_",
  "B",
  "L_",
  "B2",
];

moves = [...moves, ...undoMoves(moves)];

let cube;
let easyCam;
const scale = 0.5;

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  cube = new Cube(3, height * scale);

  easyCam = createEasyCam();

  document.oncontextmenu = () => false;

  const button = createButton("Toggle Loop");
  button.position(0, 0);
  button.mouseClicked(toggleLoop);
}

let index = 0;

function draw() {
  background(20);
  if (index < moves.length && frameCount % 10 === 0) {
    cube.rotate[moves[index++]]();
  }
  cube.draw();
}
