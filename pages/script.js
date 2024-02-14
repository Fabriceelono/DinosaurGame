const audio = document.getElementById("audio");
var character = document.getElementById("character");
var block = document.getElementById("block");
var counter = 0;
var initialCharacterTop = 300; // Initial top position of the character
var initialBlockLeft = 800; // Initial left position of the block

function jump() {
  audio.play();
  if (character.classList == "animate") {
    return;
  }
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

var checkDead = setInterval(function () {
  let characterTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top")
  );
  let blockLeft = parseInt(
    window.getComputedStyle(block).getPropertyValue("left")
  );
  if (blockLeft < 30 && blockLeft > -50 && characterTop >= 260) {
    block.style.animation = "none";
    audio.pause();
    alert("Game Over. score: " + Math.floor(counter / 100));
    counter = 0;
    block.style.animation = "block 1s infinite linear";
  } else {
    counter++;
    document.getElementById("scoreSpan").innerHTML = Math.floor(counter / 100);
  }
}, 10);
