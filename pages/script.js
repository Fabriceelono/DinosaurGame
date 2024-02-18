const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const highScore = document.getElementById("score-text");
let walkingSpeed = 40;
const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = 1000;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 50;
const GAME_SPEED = 1.5;
const OBSTACLE_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
let OBSTACLE_X = 900;
let gameScore = 0;
let PlayerImage;
let canvasBackground;
const playerStepImages = [];
const playerJumpingImages = [];
let playerIdle;
let gameOver = false;
let BACKGROUND_X = 0;
let gameStarted = false;
let jumping = false;
let falling = false;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let gameSpeed = GAME_SPEED;
let player = {
  x: 20,
  y: 160,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
};
let gameObstacle;
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
      BACKGROUND_X,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    context.drawImage(
      canvasBackground,
      BACKGROUND_X + CANVAS_WIDTH,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    if (BACKGROUND_X < -CANVAS_WIDTH) {
      BACKGROUND_X = 0;
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
}
function resetGame() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gameScore = 0;
  jumping = false;
  falling = false;
  gameStarted = false;
  gameSpeed = GAME_SPEED;
  OBSTACLE_X = 900;
  player = { ...player, x: 20, y: 160 };
  gameOver = false;
  BACKGROUND_X = 0;

  loadImages();
}

function startGame() {
  if (!gameStarted || gameOver) return;
  console.log(checkCollision());
  if (checkCollision()) {
    gameOver = true;
    context.fillStyle = "rgba(0, 0, 0, 0.4)";
    context.font = "30px serif";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillText(`Click or Press Space to play again`, 300, 150);
    return;
  }
  BACKGROUND_X -= gameSpeed * 2;
  OBSTACLE_X -= gameSpeed * 2;
  updateBackground();
  playerWalkAndJump();
  updateObstacle();
  highScore.innerHTML = updateScore();
  gameSpeed += 0.0001 * GAME_SPEED;
  requestAnimationFrame(startGame);
  gameScore += 0.1;
}
function updateScore() {
  return Math.floor(gameScore).toString().padStart(6, 0);
}
window.addEventListener("keydown", handleJump);
function handleJump(e) {
  if ((e.code == "Space" || e.code == "ArrowUp") && player.y == 160) {
    if (!gameStarted) {
      gameStarted = true;
      startGame();
      return;
    }
    jumping = true;
  }
}
window.addEventListener("click", () => {
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
});

function updateObstacle() {
  if (OBSTACLE_X < -10) {
    OBSTACLE_X = 1100;
  }
  context.drawImage(
    gameObstacle,
    OBSTACLE_X,
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
    player.x + player.width >= OBSTACLE_X &&
    player.x <= OBSTACLE_X + OBSTACLE_WIDTH &&
    player.y + player.height >= 205 &&
    player.y <= 205 + OBSTACLE_HEIGHT
  );
}
function updateBackground() {
  context.drawImage(
    canvasBackground,
    BACKGROUND_X,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
  context.drawImage(
    canvasBackground,
    BACKGROUND_X + CANVAS_WIDTH,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
  if (BACKGROUND_X < -CANVAS_WIDTH) {
    BACKGROUND_X = 0;
  }
}
loadImages();
requestAnimationFrame(startGame);
