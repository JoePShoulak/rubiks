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

  static directionMap = {
    L: { i: 0, v: -1 },
    R: { i: 0, v: 1 },
    U: { i: 1, v: -1 },
    D: { i: 1, v: 1 },
    B: { i: 2, v: -1 },
    F: { i: 2, v: 1 },
  };

  constructor(dim, size, { colorScheme, animateRate } = {}) {
    this.dim = dim;
    this.colorScheme = colorScheme ?? Cube.colorSchemes.western;
    this.animateRate = animateRate ?? 25;

    this.cubies = arrayFromMap(dim, (_face, i) =>
      arrayFromMap(dim, (_row, j) =>
        arrayFromMap(dim, (_c, k) => new Cubie(this, i, j, k, size, dim))
      )
    )
      .flat()
      .flat()
      .filter((cubie) => cubie.onFace);
  }

  lookup(...colors) {
    return this.cubies.filter((c) => {
      const visibleStickers = c.stickers
        .map((s) => s.color)
        .filter((c) => c != "gray");
      return (
        colors.every((c) => visibleStickers.includes(c)) &&
        visibleStickers.length === colors.length
      );
    })[0];
  }

  get faces() {
    const cubies = this.cubies;
    const faces = {};

    Object.entries(Cube.directionMap).forEach(([k, { i, v }]) => {
      faces[k] = cubies.filter(
        (c) => mapPos(this.dim, vToA(c.position)[i]) === v
      );
    });

    return faces;
  }

  rotate(animate = false) {
    const angle = animate ? HALF_PI / this.animateRate : HALF_PI;

    function rotFace(cubies, axis, rev = false) {
      cubies.forEach((cubie) => {
        const offset = cubie.drawOffset;
        const pos = cubie.position.sub(offset);
        cubie.position = rotateAround(pos, axis, rev ? -angle : angle).add(
          offset
        );
        cubie.stickers = cubie.stickers.map((s) =>
          rotateSticker(s, axis, rev ? -angle : angle)
        );
        cubie._updateGraphicPosition();
        if (!animate) cubie._align();
      });
    }

    const root = {
      U: (rev) => rotFace(cube.faces.U, dirToVec(Cube.directionMap.U), rev),
      D: (rev) => rotFace(cube.faces.D, dirToVec(Cube.directionMap.D), rev),
      L: (rev) => rotFace(cube.faces.L, dirToVec(Cube.directionMap.L), rev),
      R: (rev) => rotFace(cube.faces.R, dirToVec(Cube.directionMap.R), rev),
      F: (rev) => rotFace(cube.faces.F, dirToVec(Cube.directionMap.F), rev),
      B: (rev) => rotFace(cube.faces.B, dirToVec(Cube.directionMap.B), rev),
    };

    return {
      ...root,

      U_: () => root.U(true),
      D_: () => root.D(true),
      L_: () => root.L(true),
      R_: () => root.R(true),
      F_: () => root.F(true),
      B_: () => root.B(true),

      U2: () => (root.U(), root.U()),
      D2: () => (root.D(), root.D()),
      L2: () => (root.L(), root.L()),
      R2: () => (root.R(), root.R()),
      F2: () => (root.F(), root.F()),
      B2: () => (root.B(), root.B()),
    };
  }

  draw() {
    this.cubies.forEach((cubie) => cubie.draw());
  }
}

class Cubie {
  static generateFacePoints(arr) {
    let slot1, slot2;
    let i = 0;
    const points = [];

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

    return points;
  }

  constructor(cube, x, y, z, size, dim) {
    this.cube = cube;
    this.length = size / dim;

    this.position = new p5.Vector(x, y, z);
    this.originalPosition = this.position.copy();
    this.drawOffset = newDiagVector((this.cube.dim - 1) / 2);
    this._updateGraphicPosition();

    let index = 0;
    this.stickers = arrayFromMap(6, (_stickers, i) => {
      const colors = this.cube.colorScheme;
      const arr = [0, 0, 0];
      const it = i % 2;
      arr[index] = it * 2 - 1;
      if (it === 1) index++;

      let color;
      Object.entries(Cube.directionMap).forEach(([k, { i, v }]) => {
        if (
          arr[i] === v &&
          mapPos(this.cube.dim, vToA(this.position)[i]) === v
        ) {
          color = colors[k];
        }
      });

      return {
        arr,
        points: Cubie.generateFacePoints(arr),
        color: color ?? "gray",
      };
    });

    this.originalStickers = [...this.stickers];
  }

  _align() {
    this.position = roundVector(this.position);
  }

  _updateGraphicPosition() {
    this.graphicPosition = this.position
      .copy()
      .sub(this.drawOffset)
      .mult(this.length);
  }

  get _visibleStickers() {
    const onFace = (num) => num === 0 || num === this.cube.dim - 1;

    return ["x", "y", "z"].reduce((a, v) => a + onFace(this.position[v]), 0);
  }

  get onFace() {
    return this._visibleStickers > 0;
  }

  get inPosition() {
    return (
      this.position.x === this.originalPosition.x &&
      this.position.y === this.originalPosition.y &&
      this.position.z === this.originalPosition.z
    );
  }

  drawFace(face) {
    beginShape(QUADS);
    fill(face.color);
    if (face.color === "black") return;
    const r = this.length / 2;
    face.points.forEach((p) => vertex(...p.map((px) => px * r)));
    endShape();
  }

  draw() {
    push();
    stroke(0);
    strokeWeight(3);
    translate(this.graphicPosition);
    this.stickers.forEach((face) => this.drawFace(face));
    pop();
  }
}
