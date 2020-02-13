/******************************************************************************
Copyright (c) 2019 Nathaniel Adam

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

// Colors
var lightBeige = "#e5c29f";
var darkBeige = "#d7b899";
var lightGreen = "#abd751";
var darkGreen = "#a2d148";
var flagColor = "#f23705";
// 7 and 8 are unknown
var clueColor = ["", "#1876d2", "#388e3c", "#d32e2f", "#7b1ea2",
   "#ff8f00", "#0096a7", "##0096a7", "##0096a7"];

// var board = generateBoard(8, 10, 10);   // easy board - use size 38
// var board = generateBoard(14, 18, 40);  // medium board - use size 20
var board = generateBoard(20, 24, 99);  // hard board - use size 14
penUp();
moveTo(0, 0);
drawBoard(board, 14);
printBoard(board);
hide();


/**
 * Shuffles an array!
 * adapted from https://stackoverflow.com/a/6274398
 */
function shuffle(array) {
  var counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    var index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

/**
 * Generates a minesweeper board given width, height, and number of mines.
 * Squares with a value more than 8 indicate mines.
 */
function generateBoard(width, height, numMines) {
  // create blank row
  var blankRow = [];
  for (var i = 0; i < width; i++) {
    blankRow.push(0);
  }
  // create array of blank rows
  var board = [];
  for (i = 0; i < height; i++) {
    board.push(blankRow.slice());   // must be a copy of the blankRow
  }
  // generate random mine positions
  var minePositions0 = [];
  for (i = 0; i < width * height; i++) {
    minePositions0.push(i);
  }
  minePositions0 = shuffle(minePositions0);
  // for some reason app lab doesn't like combining these two lines
  var minePositions = minePositions0.slice(0, numMines);
  // put the mines onto the board
  for (i = 0; i < minePositions.length; i++) {
    var mineColumn = minePositions[i] % width;
    var mineRow = (minePositions[i] - mineColumn) / width;
    board[mineRow][mineColumn] += 9;
  }
  // mark squares around mines
  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[row].length; col++) {
      // if square is a mine
      if (board[row][col] > 8) {
        // check if adjacent squares are on the board first
        if (row > 0 && col > 0)
          board[row - 1][col - 1]++;
        if (row > 0)
          board[row - 1][col]++;
        if (row > 0 && col < width - 1)
          board[row - 1][col + 1]++;
        if (col > 0)
          board[row][col - 1]++;
        if (col < width - 1)
          board[row][col + 1]++;
        if (row < height - 1 && col > 0)
          board[row + 1][col - 1]++;
        if (row < height - 1)
          board[row + 1][col]++;
        if (row < height - 1 && col < width - 1)
          board[row + 1][col + 1]++;
      }
    }
  }
  return board;
}

/**
 * Draws a solid rectangle of provided size.
 * Turtle starts at top left corner and ends at top right.
 * By Nathan
 */
function drawRectangle(width, height, color) {
  penColor(color);
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
 * Draws a dot which matches the color the clue should be
 * TODO: make it look like a number
 * Size defines the width/height of the square the clue is in
 */
function drawClue(n, size) {
  // only if n > 0
  if (n > 0) {
    penColor(clueColor[n]);
    move(size / -2, size / 2);
    dot(size / 5);
    move(size / 2, size / -2);
  }
}

/**
 * Draws a dot to present a flag
 * TODO: make it look like a flag
 * Size defines the width/height of the square the clue is in
 */
function drawFlag(size) {
  penColor(flagColor);
  move(size / -2, size / 2);
  dot(size / 5);
  move(size / 2, size / -2);
}

/**
 * Draws the minesweeper board defined by param board
 * Size defines the width/height of one square
 */
function drawBoard(board, size) {
  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[row].length; col++) {
      // if odd row XOR odd col, draw dark square
      // (note that x % 2 can only return 0 or 1 so this works)
      if (row % 2 ^ col % 2) {
        if (board[row][col] > 8) {
          drawRectangle(size, size, darkGreen);
          drawFlag(size);
        } else {
          drawRectangle(size, size, darkBeige);
          drawClue(board[row][col], size);
        }
      } else {
        if (board[row][col] > 8) {
          drawRectangle(size, size, lightGreen);
          drawFlag(size);
        } else {
          drawRectangle(size, size, lightBeige);
          drawClue(board[row][col], size);
        }
      }
      move(1, 0);
    }
    move(-1 * board[row].length * (size + 1), size + 1);

  }
}

/**
 * Prints the minesweeper board to console
 */
function printBoard(board) {
  for (var row = 0; row < board.length; row++) {
    var outStr = " ";
    for (var col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
            outStr += "_ ";
        } else if (board[row][col] > 8) {
            outStr += "* ";
        } else {
            outStr += board[row][col] + " ";
        }
    }
    console.log(outStr);
  }
}
