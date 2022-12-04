const arrayFromMap = (size, cb) => Array(size).fill().map(cb);

const newDiagVector = (val) => new p5.Vector(1, 1, 1).mult(val);

const vToA = (vec) => [vec.x, vec.y, vec.z];

const mapPos = (dim, pos) => 2 * (pos / (dim - 1)) - 1;

function rotateAround(vect, axis, angle) {
  // Make sure our axis is a unit vector
  axis = p5.Vector.normalize(axis);

  return p5.Vector.add(
    p5.Vector.mult(vect, cos(angle)),
    p5.Vector.add(
      p5.Vector.mult(p5.Vector.cross(axis, vect), sin(angle)),
      p5.Vector.mult(
        p5.Vector.mult(axis, p5.Vector.dot(axis, vect)),
        1 - cos(angle)
      )
    )
  );
}

function rotateSticker(sticker, axis, angle) {
  sticker.points = sticker.points.map((p) => {
    let vec = new p5.Vector(...p);
    vec = rotateAround(vec, axis, angle);
    return [round(vec.x), round(vec.y), round(vec.z)];
  });
  return sticker;
}

function roundVector(vec) {
  const x = round(vec.x);
  const y = round(vec.y);
  const z = round(vec.z);
  return new p5.Vector(x, y, z);
}

function dirToVec({ i, v }) {
  const arr = [0, 0, 0];
  arr[i] = v;
  return new p5.Vector(...arr);
}

function dirToArr({ i, v }) {
  const arr = [0, 0, 0];
  arr[i] = v;
  return arr;
}
