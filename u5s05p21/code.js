setStyle("game_screen", "cursor: none");

var score = 0;
var lives = 2;
var x, y, w, h;
function moveGeorge() {
  x = randomNumber(50,280);
  y = randomNumber(50, 350);
  w = randomNumber(10,200);
  h = randomNumber(10,100);
  setPosition("apple", x, y, w, h);
  setPosition("overlay", x, y, w, h);
}

onEvent("start_button", "click", function() {
  score = 0;
  lives = 2;
  setText("total_score", score);
  setText("number_lives", lives);
  setScreen("game_screen");
  moveGeorge();
  
  // set up timer
  var endTime = new Date(new Date().getTime() + 4000);
  timedLoop(9, function() {
    var timeLeft = endTime.getTime() - (new Date()).getTime();
    setText("time_left", timeLeft / 1000 + " s");
    if(timeLeft <= 0) {
      stopTimedLoop();
      setScreen("lose_screen");
    }
  });
});
onEvent("overlay", "click", function() {
  score++;
  setText("total_score", score);
  if(score >= 4) {
    stopTimedLoop();
    setScreen("win_screen");
  }
  moveGeorge();
});
onEvent("game_screen", "mousemove", function(e) {
  setPosition("cursor", e.x, e.y);
});
onEvent("background", "click", function() {
  lives--;
  setText("number_lives", lives);
  if(lives <= 0) {
    setScreen("lose_screen");
  }
});
onEvent("playAgain_button", "click", function() {
  setScreen("welcome_screen");
});
onEvent("tryAgain_button", "click", function() {
  setScreen("welcome_screen");
});