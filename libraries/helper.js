const arrayFromMap = (size, cb) => Array(size).fill().map(cb);

const newDiagVector = (val) => new p5.Vector(1, 1, 1).mult(val);

const vecToArr = (vec) => [vec.x, vec.y, vec.z];

const mapPos = (dim, pos) => 2 * (pos / (dim - 1)) - 1;
