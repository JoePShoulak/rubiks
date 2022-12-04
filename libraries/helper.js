const arrayFromMap = (size, cb) => Array(size).fill().map(cb);

const newDiagVector = (val) => new p5.Vector(1, 1, 1).mult(val);
