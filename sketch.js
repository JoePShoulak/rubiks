function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let cube;
let easyCam;
const scale = 0.5;

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  cube = new Cube(3, height * scale);

  easyCam = createEasyCam();

  document.oncontextmenu = () => false;
}

function draw() {
  background(20);
  cube.draw();
}
