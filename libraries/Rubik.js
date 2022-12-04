class Cubie {
  constructor(cube, x, y, z, size, dim) {
    this.cube = cube;
    this.dim = dim;
    this.length = size / dim;

    const offset = newDiagVector((dim - 1) / 2);

    this.position = new p5.Vector(x, y, z);
    this.graphicPosition = this.position.copy().sub(offset).mult(this.length);

    this.color = "gray";

    let index = 0;
    this.faces = arrayFromMap(6, (_faces, i) => {
      const arr = [0, 0, 0];
      const it = i % 2;
      arr[index] = it * 2 - 1;
      if (it === 1) index++;

      return arr;
    });
  }

  get _numberOfStickers() {
    const onFace = (num) => num === 0 || num === this.dim - 1;

    return ["x", "y", "z"].reduce((a, v) => a + onFace(this.position[v]), 0);
  }

  get onFace() {
    return this._numberOfStickers > 0;
  }

  drawFace(arr) {
    let dim1, dim2;
    let i = 0;
    const points = [];
    const r = this.length / 2;

    do {
      dim1 = i++;
    } while (arr[dim1] !== 0);

    do {
      dim2 = i++;
    } while (arr[dim2] !== 0);

    for (let i = 0; i <= 1; i++) {
      for (let j = i; j <= i + 1; j++) {
        const arrCopy = [...arr];
        arrCopy[dim1] = i * 2 - 1;
        arrCopy[dim2] = (j % 2) * 2 - 1;
        points.push(arrCopy);
      }
    }

    beginShape(QUADS);
    points.forEach((p) => vertex(...p.map((px) => px * r)));
    endShape();
  }

  show() {
    push();
    fill(this.color);
    stroke(0);
    strokeWeight(3);
    translate(this.graphicPosition);
    this.faces.forEach((face) => this.drawFace(face));
    pop();
  }
}

class Cube {
  static colorSchemes = {
    western: {
      U: "white",
      L: "orange",
      F: "green",
      R: "red",
      B: "blue",
      D: "yellow",
    },

    japanese: {
      U: "white",
      L: "orange",
      F: "green",
      R: "red",
      B: "yellow",
      D: "blue",
    },
  };

  constructor(dim, size, { colorScheme } = {}) {
    this.dim = dim;
    // this.size = size;
    this.colorScheme = colorScheme ?? Cube.colorSchemes.western;
    this.cubies = this._generateCubies(dim, size);
  }

  _generateCubies(dim, size) {
    return arrayFromMap(dim, (_face, i) =>
      arrayFromMap(dim, (_row, j) =>
        arrayFromMap(dim, (_c, k) => new Cubie(this, i, j, k, size, dim))
      )
    )
      .flat()
      .flat()
      .filter((cubie) => cubie.onFace);
  }

  show() {
    this.cubies.forEach((cubie) => cubie.show());
  }
}
