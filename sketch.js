function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let cube;
let easyCam;

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  cube = new Cube(3, height / 2);

  easyCam = createEasyCam();

  document.oncontextmenu = () => false;
}

function draw() {
  background(20);
  cube.draw();
}
