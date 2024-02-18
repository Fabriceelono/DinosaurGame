const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const highScore = document.getElementById("score-text");
const audio = document.getElementById("audio");

const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = 1000;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 50;
const GAME_SPEED = 1.5;
const OBSTACLE_HEIGHT = 50;
const OBSTACLE_WIDTH = 30;

const playerStepImages = [];
const playerJumpingImages = [];

let PlayerImage, gameObstacle, canvasBackground, playerIdle, gameSpeed;
let backgroundX = 0;
let obstacleX = 900;
let walkingSpeed = 40;
let gameScore = 0;
let gameOver = false;
let gameStarted = false;
let jumping = false;
let falling = false;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
gameSpeed = GAME_SPEED;

let player = {
  x: 20,
  y: 160,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
};

function loadImages() {
  canvasBackground = new Image();
  canvasBackground.src = "./images/mario-background.jpg";
  PlayerImage = new Image();
  PlayerImage.src = "./images/mario/idle.png";
  PlayerImage.onload = () =>
    context.drawImage(
      PlayerImage,
      player.x,
      player.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );
  canvasBackground.onload = () => {
    context.drawImage(
      canvasBackground,
      backgroundX,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    context.drawImage(
      canvasBackground,
      backgroundX + CANVAS_WIDTH,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    if (backgroundX < -CANVAS_WIDTH) {
      backgroundX = 0;
    }
  };
  const PlayerStep1 = new Image();
  PlayerStep1.src = "./images/mario/step.png";
  playerStepImages.push(PlayerStep1);

  const PlayerStep2 = new Image();
  PlayerStep2.src = "./images/mario/step-2.png";
  playerStepImages.push(PlayerStep2);

  const PlayerInAir = new Image();
  PlayerInAir.src = "./images/mario/jump-in-air.png";
  playerJumpingImages.push(PlayerInAir);

  const PlayerJumpEnd = new Image();
  PlayerJumpEnd.src = "./images/mario/jump-end.png";
  playerJumpingImages.push(PlayerJumpEnd);

  const Obstacle1 = new Image();
  Obstacle1.src = "./images/obstacles/plant-open.png";

  gameObstacle = Obstacle1;

  const Obstacle2 = new Image();
  Obstacle2.src = "./images/obstacles/blue-plant.png";
  gameObstacle = Obstacle2;
}
function resetGame() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gameScore = 0;
  jumping = false;
  falling = false;
  gameStarted = false;
  gameSpeed = GAME_SPEED;
  obstacleX = 900;
  player = { ...player, x: 20, y: 160 };
  gameOver = false;
  backgroundX = 0;
  loadImages();
}

function endGame() {
  gameOver = true;
  audio.pause();
  context.fillStyle = "rgba(0, 0, 0, 0.4)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "rgb(255,20,20)";
  context.font = "bold 60px serif";
  context.strokeStyle = "black";
  context.fillText("GAME OVER", 300, 150);
  context.strokeText("GAME OVER", 300, 150);

  context.fillStyle = "#fff";
  context.font = "bold 40px serif";
  context.fillText(`Click or Press Space to play again`, 225, 200);
}

function startGame() {
  if (!gameStarted || gameOver) return;
  if (checkCollision()) {
    return endGame();
  }
  audio.play();
  backgroundX -= gameSpeed * 2;
  obstacleX -= gameSpeed * 2;
  updateBackground();
  playerWalkAndJump();
  updateObstacle();
  highScore.innerHTML = updateScore();
  gameSpeed += 0.0001 * GAME_SPEED;
  requestAnimationFrame(startGame);
  gameScore += 0.1;
}
function updateScore() {
  return Math.floor(gameScore).toString();
}

function updateObstacle() {
  if (obstacleX < -10) {
    obstacleX = 1100;
  }
  context.drawImage(
    gameObstacle,
    obstacleX,
    205,
    OBSTACLE_WIDTH,
    OBSTACLE_HEIGHT
  );
}
function playerWalkAndJump() {
  if (jumping && !falling) {
    if (player.y > -20) {
      PlayerImage = playerJumpingImages[0];
      player.y -= 5;
    } else {
      falling = true;
    }
  } else if (jumping && falling) {
    if (player.y < 160) {
      PlayerImage = playerJumpingImages[1];
      player.y += 5;
    } else {
      falling = false;
      jumping = false;
      PlayerImage = playerStepImages[0];
    }
  } else {
    if (walkingSpeed <= 0) {
      if (PlayerImage == playerStepImages[0]) {
        PlayerImage = playerStepImages[1];
      } else {
        PlayerImage = playerStepImages[0];
      }
      walkingSpeed = 80;
    }
    walkingSpeed -= gameSpeed;
  }
  context.drawImage(
    PlayerImage,
    player.x,
    player.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );
}
function checkCollision() {
  return (
    player.x + player.width >= obstacleX + 10 &&
    player.x <= obstacleX + OBSTACLE_WIDTH - 20 &&
    player.y + player.height >= 210 &&
    player.y <= 205 + OBSTACLE_HEIGHT + 10
  );
}
function updateBackground() {
  context.drawImage(
    canvasBackground,
    backgroundX,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
  context.drawImage(
    canvasBackground,
    backgroundX + CANVAS_WIDTH,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
  if (backgroundX < -CANVAS_WIDTH) {
    backgroundX = 0;
  }
}
loadImages();
requestAnimationFrame(startGame);

function handleJump() {
  if (gameOver) {
    resetGame();
    gameStarted = true;
    startGame();
    return;
  }
  if (!gameStarted) {
    gameStarted = true;
    startGame();
    return;
  }
  jumping = true;
}

window.addEventListener("click", handleJump);
window.addEventListener("keydown", (e) => {
  if (e.code == "Space" || e.code == "ArrowUp") {
    handleJump();
  }
});
