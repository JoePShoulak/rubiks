class Cubie {
  constructor(x, y, z, length, dim) {
    this.position = new p5.Vector(x, y, z);
    this.graphicPosition = this.position.copy().sub(1, 1, 1).mult(length);
    this.length = length;
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
    return arrayMap(dim, (_face, i) =>
      arrayMap(dim, (_row, j) =>
        arrayMap(dim, (_cubie, k) => new Cubie(i, j, k, size, dim)).filter(
          (cubie) => {
            const onFace = (num) => num === 0 || num === dim - 1;

            return (
              onFace(cubie.position.x) ||
              onFace(cubie.position.y) ||
              onFace(cubie.position.z)
            );
          }
        )
      )
    )
      .flat()
      .flat();
  }

  constructor(dim, size) {
    this.dim = dim;
    this.size = size;
    this.cubies = Cube.generateCubies(dim, size);
    console.log(this.cubies);
  }

  show() {
    this.cubies.forEach((cubie) => cubie.show());
  }
}
