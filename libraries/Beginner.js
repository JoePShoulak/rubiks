class Beginner {
  constructor(cube) {
    this.cube = cube;
  }

  get state() {
    const whiteCross = [
      this.cube.lookup("red", "white"),
      this.cube.lookup("blue", "white"),
      this.cube.lookup("orange", "white"),
      this.cube.lookup("green", "white"),
    ];

    if (whiteCross.every((c) => c.state)) console.log("white cross positioned");
  }
}
