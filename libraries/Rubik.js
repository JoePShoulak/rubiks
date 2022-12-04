class Cubie {
  constructor(x, y, z, length) {
    this.position = new p5.Vector(x, y, z);
    this.length = length;
  }

  show() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(3);
    translate(this.position);
    box(this.length);
    pop();
  }
}

class Cube {
  constructor(dim, size) {
    this.dim = dim;
    this.size = size;
    this.cubies = arrayMap(dim, (_face, i) =>
      arrayMap(dim, (_row, j) =>
        arrayMap(
          dim,
          (_cubie, k) => new Cubie(i * size, j * size, k * size, size)
        ).filter((cubie) => {
          const onFace = (num) => num === 0 || num === (dim - 1) * size;

          return (
            onFace(cubie.position.x) ||
            onFace(cubie.position.y) ||
            onFace(cubie.position.z)
          );
        })
      )
    )
      .flat()
      .flat();
  }

  show() {
    this.cubies.forEach((cubie) => cubie.show());
  }
}
