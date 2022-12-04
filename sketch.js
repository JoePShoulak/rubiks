function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let c;

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  c = new Cube(3, 200);

  createEasyCam();
  document.oncontextmenu = () => false;
}

function draw() {
  background(20);
  c.show();
}
