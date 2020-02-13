// actual lines of code: 67 (before: 177)
speed(95);

// radius of each background dot
// foreground dot radius will be one fourth of this
var size = 20;

// background colors
var lightBeige = "#e5c29f";
var darkBeige = "#d7b899";
var lightGreen = "#aad751";
var darkGreen = "#a2d149";

// foreground colors
var flagColor = "#f23607";
// colors for the numbers; some are unknown and item 0 should be blank
var clueColors = ["", "#0c72d7", "#3a8f3d", "#d33a38", "", "", "#0096a7", "", ""];

// counter to keep track of how far turtle will need to move back
var currentRowLength = 0;

// creates one minesweeper space and then moves for the next space
// fgColor is optional; if omitted there will be no foreground dot
// note that this function only works relative to the turtle
function msDot(radius, bgColor, fgColor) {
  penColor(bgColor);
  dot(radius);
  if (fgColor) {
    penColor(fgColor);
    dot(radius / 4);
  }
  currentRowLength += radius * 2;
  move(radius * 2, 0);
}

// returns to the beginning of the row and moves one row down
// note that this function only works relative to the turtle
// so if it was moved off its path during the row this function may mess up
function newRow() {
  move(currentRowLength * -1, size * 2);
  currentRowLength = 0;
}

penUp();
moveTo(80, 120);

// row 1
msDot(size, darkBeige, clueColors[1]);
msDot(size, lightBeige, clueColors[2]);
msDot(size, darkBeige, clueColors[3]);
msDot(size, lightBeige, clueColors[2]);
msDot(size, darkBeige, clueColors[1]);
newRow();

// row 2
msDot(size, lightBeige, clueColors[2]);
msDot(size, darkGreen, flagColor);
msDot(size, lightGreen, flagColor);
msDot(size, darkGreen, flagColor);
msDot(size, lightBeige, clueColors[2]);
newRow();

// row 3
msDot(size, darkBeige, clueColors[3]);
msDot(size, lightGreen, flagColor);
msDot(size, darkBeige, clueColors[3]);
msDot(size, lightGreen, flagColor);
msDot(size, darkBeige, clueColors[2]);
newRow();

// row 4
msDot(size, lightGreen, flagColor);
msDot(size, darkBeige, clueColors[3]);
msDot(size, lightGreen, flagColor);
msDot(size, darkBeige, clueColors[3]);
msDot(size, lightBeige, clueColors[2]);
newRow();

// row 5
msDot(size, darkBeige, clueColors[1]);
msDot(size, lightBeige, clueColors[3]);
msDot(size, darkBeige, clueColors[3]);
msDot(size, lightGreen, flagColor);
msDot(size, darkBeige, clueColors[1]);
newRow();

// row 6
msDot(size, lightBeige);
msDot(size, darkBeige, clueColors[1]);
msDot(size, lightGreen, flagColor);
msDot(size, darkBeige, clueColors[2]);
msDot(size, lightBeige, clueColors[1]);
newRow();

// row 7
msDot(size, darkBeige);
msDot(size, lightBeige, clueColors[1]);
msDot(size, darkBeige, clueColors[1]);
msDot(size, lightBeige, clueColors[1]);
msDot(size, darkBeige);

hide();