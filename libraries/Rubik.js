const newDiagVector = (val) => new p5.Vector(1, 1, 1).mult(val);

class Cubie {
  constructor(x, y, z, size, dim) {
    this.dim = dim;
    this.length = size / dim;

    const offset = newDiagVector((dim - 1) / 2);

    this.position = new p5.Vector(x, y, z);
    this.graphicPosition = this.position.copy().sub(offset).mult(this.length);
  }

  get onFace() {
    const onFace = (num) => num === 0 || num === this.dim - 1;

    return (
      onFace(this.position.x) ||
      onFace(this.position.y) ||
      onFace(this.position.z)
    );
  }

  show() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(3);
    translate(this.graphicPosition);
    box(this.length);
    pop();
  }
}

class Cube {
  static generateCubies(dim, size) {
    return arrayFromMap(dim, (_face, i) =>
      arrayFromMap(dim, (_row, j) =>
        arrayFromMap(dim, (_c, k) => new Cubie(i, j, k, size, dim))
      )
    )
      .flat()
      .flat()
      .filter((cubie) => cubie.onFace);
  }

  constructor(dim, size) {
    // this.dim = dim;
    // this.size = size;
    this.cubies = Cube.generateCubies(dim, size);
  }

  show() {
    this.cubies.forEach((cubie) => cubie.show());
  }
}
