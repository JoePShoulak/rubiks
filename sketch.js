function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let cube;
let easyCam;
let moves;
let index;
let waiting;
const scale = 0.5;

function newDemo() {
  const randomMove = () => random(Object.keys(cube.rotate));
  moves = arrayFromMap(25, (_move) => randomMove());
  moves = [...moves, ...undoMoves(moves)];
  index = 0;
  waiting = false;
}

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  const constraint = Math.min(height, width);
  cube = new Cube(3, constraint * scale);

  easyCam = createEasyCam();

  document.oncontextmenu = () => false;

  newDemo();
}

function draw() {
  background(20);
  if (index < moves.length && frameCount % 3 === 0) {
    cube.rotate[moves[index++]]();
  } else {
    if (!waiting) {
      waiting = true;
      setTimeout(newDemo, 10 * 1000);
    }
  }
  cube.draw();
}
