//* <-- //* to enable; /* to disable
// 3x3 grid (30 lines)
function turnR() {
  turnLeft();
  turnLeft();
  turnLeft();
}
function turnAroundRight() {
  turnR();
  moveForward();
  turnR();
}
function move3() {
  moveForward();
  moveForward();
  moveForward();
}
function squiggle() {
  move3();
  turnAroundRight();
  move3();
  turnLeft();
  moveForward();
  turnLeft();
  move3();
  turnAroundRight();
  move3();
}
squiggle();
turnR();
squiggle();

// return to start position (an additional 5 lines)
turnR();
move3();
turnR();
move3();
turnR();
//*/

//* <-- //* to enable; /* to disable
// full grid with while statements (56 lines)
function drawCorner() {
  turnLeft();
  moveForward();
  turnLeft();
  moveForward();
}

penUp();
turnLeft();
turnLeft();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
turnLeft();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
moveForward();
turnLeft();
penDown();

var c1 = 1;
while (c1 <= 32) {
  var c2 = 1;
  while (c2 <= c1) {
    drawCorner();
    turnLeft();
    turnLeft();
    c2++;
  }
  turnLeft();
  turnLeft();
  turnLeft();
  var c3 = 1;
  while (c3 <= c1) {
    moveForward();
    c3++;
  }
  turnLeft();
  var c4 = 1;
  while (c4 <= c1) {
    moveForward();
    c4++;
  }
  moveForward();
  c1++;
}
//*/
