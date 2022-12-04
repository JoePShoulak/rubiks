function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let cube;

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  cube = new Cube(3, 200);

  createEasyCam();
  document.oncontextmenu = () => false;
}

function draw() {
  background(20);
  cube.draw();
}
