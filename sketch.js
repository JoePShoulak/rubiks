function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
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
}

let index = 0;
let waiting = false;

function draw() {
  background(20);
  if (index < moves.length && frameCount % 3 === 0) {
    cube.rotate[moves[index++]]();
  } else {
    if (!waiting) {
      waiting = true;
      setTimeout(() => {
        index = 0;
        waiting = false;
      }, 10 * 1000);
    }
  }
  cube.draw();
}
