/******************************************************************************
Copyright (c) 2019 Nathaniel Adam, Chad Li-Campbell, Max Liubich, and Leo Wang.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
******************************************************************************/

speed(100);
drawScene();

/**
 * Draws a solid rectangle of provided size.
 * Turtle starts at top left corner and ends at top right.
 * By Nathan
 */
function drawRectangle(width, height) {
  penWidth(2);
  // zig zag!!!!!!!!
  for (var i = 0; i < width / 2; i++) {
    // only want to draw when moving up or down
    penDown();
    move(0, height);
    penUp();
    move(1, 0);
    // must go back up
    penDown();
    move(0, -1*height);
    penUp();
    move(1, 0);
  }
}

/**
 * Draws a solid isosceles triangle (flat base) of provided size
 * Note that height must be negative for the apex to point up
 * Turtle starts at bottom left vertex and ends at bottom right.
 * By Nathan
 */
function drawTriangle(width, height) {
  var slope = 2 * height/width;
  penWidth(2);
  // first half
  for (var i = 0; i < width/2; i++) {
    penDown();
    move(0, i*slope);
    penUp();
    move(0, -1*i*slope);
    move(1, 0);
  }
  // second half; opposite slope
  for (i = width/2; i >= 0; i--) {
    penDown();
    move(0, i*slope);
    penUp();
    move(0, -1*i*slope);
    move(1, 0);
  }
}

/**
 * Puting dots in random spots to make the background
 * (Nathan's note: for some reason he chose to use random dots...)
 * By Leo
 */
function drawBackground() {
  for (var i = 0; i < 10000; i++) {
   // the color that is set
   penRGB(20, 20, 100, 1);
   // moving to random spots and making dots
   moveTo(randomNumber(0, 320), randomNumber(0, 450));
   dot(randomNumber(1, 20));
  }
}

/**
 * Drawing a detailed 5 pointed star
 * (you can see every single point if you look closely)
 * By Leo
 */
function drawStars() {
  // moving to a random spot
  moveTo(randomNumber(0, 320), randomNumber(0, 450));
  penDown();
  // drawing the star in the random spot
  penColor("white");
  for (var i = 0; i < 5; i++) {
    moveForward(5);
    turnRight(144);
  }
  penUp();
}

/**
 * Drawing a faded moon with a fution that makes x=255 after 40
 * By Leo
 */
function drawMoon() {
  // moving it to the top of the screen
  moveTo(160, 100);
  // drawing the fading moon
  penDown();
  for (var i = 0; i < 40; i++) {
    penRGB(20 + 5.875*i, 20 + 5.875*i, 100 + 3.875*40, 1);
    dot(110 - 1.25*i);
  }
}

/**
 * Draw two fields
 * By Edward William Wei Chadwick Li-Campbell IV
 */
function drawField() {
  penUp();
  moveTo(300, 500);
  penColor("#5ebed6");
  dot(200);
  moveTo(70, 550);
  penColor("lightblue");
  dot(200);
}

/**
 * Draw one tree at places given prameters
 * By Chad
 */
function drawTree(treePositionX, treePositionY, treeWidth, treeHeight) {
  penColor("green");
  moveTo(treePositionX, treePositionY);
  drawTriangle(treeWidth, treeHeight);
  moveTo(treeWidth / 2 + treePositionX, treePositionY);
  turnTo(180);
  penDown();
  penColor("brown");
  moveForward(treeHeight / -4);
  penUp();
}

/**
 * Draws smoke based on sine. Parameters are hard to explain so experiment
 * Suggested: drawSmoke(10, 100, 2, 10, randomNumber(0,100), 10)
 * Turtle starts at the top and ends at the bottom.
 * By Nathan
 */
function drawSmoke(width, length, thickness, curviness,
                   periodOffset, randRange) {
  penColor("#ffffff");
  penWidth(1);
  // need to offset the curve
  var y_axis = getX();
  penDown();
  for (var y = periodOffset; y < periodOffset + length; y++) {
    // this method was mostly found by mistake but it looks pretty
    // if randRange == 0 you can see what i originally had
    moveTo(randomNumber(width, width + randRange) *
      Math.sin(y / randomNumber(curviness, curviness + randRange)) + y_axis,
      getY() + 1);
    for (var i = 0; i < thickness; i++) {
      move(randomNumber(width, width + randRange) *
        Math.sin(y / randomNumber(curviness, curviness + randRange)), 0);
    }
  }
  penUp();

}

/**
 * Draws a house!
 * The width of the chimmney will be equal to size. Color in hex or rgb().
 * Turtle starts at top of smoke and ends at the top right corner of the roof.
 * By Nathan
 */
function drawHouse(size, color) {
  // draw smoke
  drawSmoke(size, 12*size, 2, size, randomNumber(0, 5*size), size);
  move(-3.5*size, 5*size);
  // draw body
  penUp();
  penColor(color);
  drawRectangle(12*size, 4*size);
  // draw chimmney
  move(-9*size, -5*size + 1);
  drawRectangle(size, size);
  // draw roof
  move(-2*size, size);
  penColor("#ffffff");
  drawRectangle(8*size, 4*size);
  move(-11*size, 4*size);
  drawTriangle(6*size, -4*size);
  move(2*size, 0);
  penColor(color);
  drawTriangle(6*size, -4*size);
  // draw snow things
  penWidth(Math.abs(size));
  penColor("white");
  penDown();
  move(-3*size, -4*size);
  move(-8*size, 0);
  move(-3*size, 4*size);
  move(8*size - 1, 0);
  move(3*size, -4*size);
  penUp();
}

/**
 * Draws a leg for the reindeer
 * By Max
 */
function drawReindeerLeg() {
  turnRight(90);
  moveForward(5);
  turnRight(90);
  moveForward(10);
  turnLeft(180);
  moveForward(10);
}

/**
 * Draws a Reindeer at the current turtle location
 * By Max
 */
function drawReindeer() {
  // Reindeer Head
  dot(4);

  //Reindeer Antlers
  turnLeft(90);
  moveForward(10);
  turnRight(90);
  moveForward(10);
  turnLeft(180);
  moveForward(5);
  turnRight(90);
  moveForward(5);
  turnLeft(180);
  moveForward(10);
  turnLeft(180);
  moveForward(5);
  turnLeft(90);
  moveForward(5);
  turnLeft(90);
  moveForward(20);
  turnLeft(90);
  moveForward(10);
  turnLeft(180);
  moveForward(5);
  turnRight(90);
  moveForward(5);
  turnLeft(180);
  moveForward(10);
  turnLeft(180);
  moveForward(5);
  turnLeft(90);
  moveForward(5);
  turnRight(90);
  moveForward(10);
  turnLeft(90);

  // Reindeer Body
  moveForward(10);
  turnRight(90);
  moveForward(15);
  turnLeft(90);
  moveForward(10);
  turnLeft(180);
  moveForward(10);
  for (var i = 0; i < 3; i++) {
    drawReindeerLeg();
  }
  moveForward(5);
}

/**
 * Draws all Reindeer from left to right
 * By Max
 */
function drawAllReindeer() {
  moveTo(150, 120);
  penDown();
  drawReindeer();
  penUp();
  moveTo(180, 120);
  penDown();
  drawReindeer();
  penUp();
  moveTo(210, 120);
  penDown();
  drawReindeer();
  penUp();
  moveTo(240, 120);
  penDown();
  drawReindeer();
}

/**
 * Red Nose is a dot
 * By Max
 */
function drawRedNose() {
  penUp();
  moveTo(244, 121);
  penDown();
  penColor("red");
  dot(2);

  // Go back to neck
  turnLeft(180);
  moveForward(2);
  penColor("black");
}

/**
 * Reins is an arc
 * By Max
 */
function drawReins() {
  moveTo(240, 125);
  turnRight(90);
  moveForward(100);
  arcRight(30, 50);
  turnLeft(30);
}

/**
 * Draws Santa at the current turtle location
 * By Max
 */
function drawSanta() {
  // Santa Arms
  penWidth(3);
  moveForward(7);
  turnRight(45);
  moveForward(7);

 // Santa Body
  turnLeft(130);
  moveForward(15);
  turnLeft(180);
  moveForward(2);
  turnRight(90);
  moveForward(2);
  dot(6);
  turnLeft(180);
  moveForward(4.5);
  turnRight(90);
  moveForward(20);
  turnRight(90);
  moveForward(2);

  // Santa Head
  dot(4);
  turnLeft(135);
  penWidth(4);
  arcLeft(30, 15);
}

/**
 * Draws a sleigh underneath Santa
 * By Max
 */
function drawSleigh() {
  penUp();
  turnLeft(110);
  moveForward(25);
  turnRight(90);
  moveForward(10);
  dot(12);
  turnLeft(180);
  moveForward(25);
  turnRight(90);
  penDown();
  moveForward(10);
  turnRight(90);
  moveForward(25);
}

/**
 * Draws the scene!
 * By Nathan and Max
 */
function drawScene() {
  // Leo's backgrounds
  drawBackground();
  moveTo(160, 240);
  for (var i = 0; i < 69; i++) {
    drawStars();
  }
  drawMoon();

  // Chad's hills and trees
  drawField();
  for (i =  0; i < 4; i++) {
    drawTree(randomNumber(-10, 120), randomNumber(350, 375),
      randomNumber(30, 50), randomNumber(-75, -125));
  }
  for (i =  0; i < 4; i++) {
    drawTree(randomNumber(230, 290), randomNumber(290, 310),
      randomNumber(15, 25),randomNumber(-32, -64));
  }

  // Nathan's houses
  moveTo(52, 280);
  drawHouse(6, "#994e18");
  moveTo(260,240);
  drawHouse(4, "#994e18");

  // More of Chad's trees
  drawTree(randomNumber(-10, 25), randomNumber(390, 415),
    randomNumber(30, 50), randomNumber(-75, -125));
  drawTree(randomNumber(230, 250), randomNumber(320, 340),
    randomNumber(15, 25),randomNumber(-32, -64));
  for (i = 0; i < 4; i++) {
    drawTree(randomNumber(210, 290), randomNumber(450, 500),
      randomNumber(40, 60),randomNumber(-80, -110));
  }

  // One more house and then trees in front
  moveTo(270, 315);
  drawHouse(8, "#994e18");
  for (i = 0; i < 4; i++) {
    drawTree(randomNumber(210, 290), randomNumber(500, 550),
      randomNumber(40, 60),randomNumber(-80, -110));
  }

  // Prepare turtle to draw reindeer and Santa
  hide();
  penUp();
  penWidth(1);
  penColor("black");
  turnTo(0);

  // These five functions draw Santa and his reindeer. Order matters
  // for how different parts of the picture are layered.
  drawAllReindeer();
  drawRedNose();
  drawReins();
  drawSanta();
  drawSleigh();
}
