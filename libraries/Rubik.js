class Cubie {
  constructor(cube, x, y, z, size, dim) {
    this.cube = cube;
    this.dim = dim;
    this.length = size / dim;

    const offset = newDiagVector((dim - 1) / 2);

    this.position = new p5.Vector(x, y, z);
    this.pos = this.position;
    this.graphicPosition = this.position.copy().sub(offset).mult(this.length);

    this.color = "gray";

    let index = 0;
    this.stickers = arrayFromMap(6, (_stickers, i) => {
      const colorScheme = this.cube.colorScheme;
      const arr = [0, 0, 0];
      const it = i % 2;
      arr[index] = it * 2 - 1;
      if (it === 1) index++;

      const mapPos = (pos) => 2 * (pos / (this.dim - 1)) - 1;

      let color = "black";
      if (arr[0] == -1 && mapPos(this.pos.x) === -1) color = colorScheme.L;
      if (arr[0] == 1 && mapPos(this.pos.x) === 1) color = colorScheme.R;
      if (arr[1] == -1 && mapPos(this.pos.y) === -1) color = colorScheme.U;
      if (arr[1] == 1 && mapPos(this.pos.y) === 1) color = colorScheme.D;
      if (arr[2] == -1 && mapPos(this.pos.z) === -1) color = colorScheme.B;
      if (arr[2] == 1 && mapPos(this.pos.z) === 1) color = colorScheme.F;

      color = color ?? this.color;

      return { arr, color };
    });
  }

  get _visibleStickers() {
    const onFace = (num) => num === 0 || num === this.dim - 1;

    return ["x", "y", "z"].reduce((a, v) => a + onFace(this.position[v]), 0);
  }

  get onFace() {
    return this._visibleStickers > 0;
  }

  drawFace(face) {
    const arr = face.arr;
    let slot1, slot2;
    let i = 0;
    const points = [];
    const r = this.length / 2;

    do {
      slot1 = i++;
    } while (arr[slot1] !== 0);

    do {
      slot2 = i++;
    } while (arr[slot2] !== 0);

    for (let i = 0; i <= 1; i++) {
      for (let j = i; j <= i + 1; j++) {
        const arrCopy = [...arr];
        arrCopy[slot1] = i * 2 - 1;
        arrCopy[slot2] = (j % 2) * 2 - 1;
        points.push(arrCopy);
      }
    }

    beginShape(QUADS);
    fill(face.color);
    if (face.color === "black") return;
    points.forEach((p) => vertex(...p.map((px) => px * r)));
    endShape();
  }

  show() {
    push();
    stroke(0);
    strokeWeight(3);
    translate(this.graphicPosition);
    this.stickers.forEach((face) => this.drawFace(face));
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

  get faces() {
    return {
      L: this.cubies.filter((c) => c.position.x === 0),
      R: this.cubies.filter((c) => c.position.x === this.dim - 1),
      U: this.cubies.filter((c) => c.position.y === 0),
      D: this.cubies.filter((c) => c.position.y === this.dim - 1),
      B: this.cubies.filter((c) => c.position.z === 0),
      F: this.cubies.filter((c) => c.position.z === this.dim - 1),
    };
  }

  show() {
    this.cubies.forEach((cubie) => cubie.show());
  }
}
