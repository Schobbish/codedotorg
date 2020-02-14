speed(100);
var points = 0;
var themeMusic = "assets/theme.mp3";
var extraMusic = "assets/extra_music.mp3";
var startSFX = "assets/start.mp3";
var loseSFX = "assets/lose.mp3";
var winSFX = "assets/win.mp3";
// var extraSFX = "assets/extra_sfx.mp3";

/** Shows the lose screen better than you */
function showLoseScreen() {
  points = 0;
  // dimensions of lose_text: 80x20
  setPosition("lose_text", randomNumber(0, 240), randomNumber(0, 430));
  setScreen("lose");
  stopSound(themeMusic);
  playSound(loseSFX);
}

/* welcome screen */
playSound(startSFX);
// start the game
onEvent("start", "click", function() {
  points = 0;
  setScreen("game");
  playSound(themeMusic, true);
});
// secret lose button
onEvent("title", "click", function() {
  showLoseScreen();
});

/* game screen */
// move turtle image all the time
onEvent("game", "mousemove", function () {
	var w = randomNumber(1, 320);
	var h = w * 201 / 280;
	setPosition("turtles", randomNumber(0, 320 - w), randomNumber(0, 450 - h), w, h);
});
// give point for clicking button and move it
onEvent("button", "click", function () {
  points++;
  // dimensions of button: 80x20
	setPosition("button", randomNumber(0, 240), randomNumber(0, 430));
});
// not used
/*onEvent("catcher", "click", function() {
  showLoseScreen();
});*/
// either make the player win or lose based on points
onEvent("turtles", "click", function() {
  if (points === 20) {
    setScreen("win");
    stopSound(themeMusic);
    playSound(winSFX);
    playSound(extraMusic);
  } else {
    showLoseScreen();
  }
});

/* lose screen */
// go back to welcome screen
onEvent("lose", "click", function() {
  setScreen("welcome");
  playSound(startSFX);
});

/* win screen */
var imageX = 74;
var imageY = 450;
// move image up
onEvent("win_text", "click", function() {
  showElement("image");
  // playSound(extraSFX);
  for (var i = 0; i < 113; i++) {
    imageY--;
    speed(99);
    setPosition("image", imageX, imageY);
    speed(100);
    if (imageY <= -228) {
      imageY = 450;
    }
  }
  // stopSound(extraSFX);
});
// move image around
onEvent("image", "click", function() {
  // dimensions of image: 172x228
  imageX = randomNumber(0, 148);
  imageY = randomNumber(0, 222);
  setPosition("image", imageX, imageY);
});
