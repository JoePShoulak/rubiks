function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

let c;

function setup() {
  createCanvas(innerWidth, innerHeight, "webgl");
  c = new Cube(3, 20);

  createEasyCam();
  document.oncontextmenu = () => false;
}

function draw() {
  background(20);
  c.show();
  noFill();
  stroke("orange");
  strokeWeight(0.1);
  sphere(50);
}
