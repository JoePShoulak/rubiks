function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function toggleLoop() {
  isLooping() ? noLoop() : loop();
}

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

function draw() {
  background(20);
  cube.draw();
}
