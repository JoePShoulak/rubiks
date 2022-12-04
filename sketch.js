const randomMove = () => random(Object.keys(cube.rotate()));

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
let method;
const scale = 0.5;
const buttonWidth = 30;
const buttonHeight = 20;
const buttonPadding = 10;

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function newDemo() {
  moves = arrayFromMap(26, (_move) => randomMove());
  moves = [...moves, ...undoMoves(moves)];
  index = 0;
  waiting = false;
}

function cubeButton(turn, pos) {
  const b = createButton(turn);
  b.position(...pos);
  b.size(30, 20);
  b.mousePressed(() => cube.rotate()[turn]());
}

function createButtons() {
  Object.keys(Cube.directionMap).forEach((key, index) => {
    cubeButton(key, [buttonPadding, buttonPadding + buttonHeight * index]);

    cubeButton(`${key}2`, [
      buttonPadding * 2 + buttonWidth,
      buttonPadding + buttonHeight * index,
    ]);

    cubeButton(`${key}_`, [
      buttonPadding * 3 + buttonWidth * 2,
      buttonPadding + buttonHeight * index,
    ]);
  });

  const b = createButton("loop toggle");
  b.size(100, buttonHeight);
  b.position(buttonPadding, height - buttonHeight - buttonPadding);
  b.mousePressed(() => (isLooping() ? noLoop() : loop()));
}

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  const constraint = Math.min(height, width);
  cube = new Cube(3, constraint * scale);

  easyCam = createEasyCam();

  document.oncontextmenu = () => false;

  newDemo();

  // createButtons();

  // moves.forEach((m) => {
  //   cube.rotate()[m]();
  //   cube.cubies.forEach((c) => c._align());
  // });

  method = new Beginner(cube);

  console.log(method.state);
}

let animate = 0;
function draw() {
  background(20);

  // TODO: Re-implement animation
  if (index < moves.length) {
    if (animate < cube.animateRate) {
      cube.rotate(true)[moves[index]]();
      animate++;
    } else {
      animate = 0;
      cube.cubies.forEach((c) => c._align());
      index++;
    }
  } else if (!waiting) {
    waiting = true;
    setTimeout(newDemo, 10 * 1000);
  }

  cube.draw();
}
