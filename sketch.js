const randomMove = () => random(Object.keys(cube.rotate));

const undoMoves = (moves) => {
  return moves
    .map((m) => {
      if (m.includes("2")) return m;
      if (m.includes("_")) return m[0];
      if (m.length === 1) return `${m}_`;
    })
    .reverse();
};

let cube;
let easyCam;
let moves;
let index;
let waiting;
const scale = 0.5;

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function newDemo() {
  moves = arrayFromMap(26, (_move) => randomMove());
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

let animate = 0;
function draw() {
  background(20);
  if (index < moves.length) {
    if (animate < cube.animateRate) {
      cube.rotate[moves[index]]();
      animate++;
    } else {
      animate = 0;
      index++;
      cube.cubies.forEach((c) => c._align());
    }
  } else {
    if (!waiting) {
      waiting = true;
      setTimeout(newDemo, 10 * 1000);
    }
  }
  cube.draw();
}
