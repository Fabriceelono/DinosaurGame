const audio = document.getElementById("audio");
var character = document.getElementById("character");
var block = document.getElementById("block");
var score = 0;
var initialCharacterTop = 300; // Initial top position of the character
var initialBlockLeft = 800; // Initial left position of the block

var gameStarted = false;

function jump() {
  if (character.classList == "animate") {
    return;
  }
  if (gameStarted == false) {
    return;
  }
  audio.play();

  character.classList.add("animate");
  setTimeout(function () {
    character.classList.remove("animate");
  }, 300);
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    jump();
  }
});

function checkDeadLogic() {
  let characterTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top")
  );
  let blockLeft = parseInt(
    window.getComputedStyle(block).getPropertyValue("left")
  );
  if (blockLeft < 30 && blockLeft > -50 && characterTop >= 260) {
    block.classList.remove("obstacles-animate");
    audio.pause();
    //alert("Game Over. score: " + Math.floor(counter / 100));
    document.getElementById("score-container").style.display = "flex";
    document.getElementById("score-text").innerHTML = Math.floor(score / 100);
    clearInterval(checkDead);
    gameStarted = false;
  } else {
    score++;
    document.getElementById("scoreSpan").innerHTML = Math.floor(score / 100);
  }
}
var checkDead;

function startCountdown() {
  gameStarted = false;
  score=0;
  document.getElementById("score-container").style.display = "none";
  document.getElementById("counter-container").style.display = "flex";
  let seconds = 3;
  const countdownElement = document.getElementById('counter-text');

  const timer = setInterval(() => {
    countdownElement.textContent = seconds;
    seconds--;

    if (seconds < 0) {
      document.getElementById("counter-container").style.display = "none";
      clearInterval(timer);
      block.classList.add("obstacles-animate");
      checkDead = setInterval(checkDeadLogic, 10);
      gameStarted = true;
    }
  }, 1000);
}

startCountdown();

