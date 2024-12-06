// Configuración básica del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Cargar la imagen del personaje
const playerImage = new Image();
playerImage.src = 'valery.png'; // Reemplaza esto con la ruta de tu imagen

// Estado del juego
const gameState = {
  player: {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    speed: 5,
  },
  love: {
    x: 700,
    y: 100,
    width: 40,
    height: 40,
    color: 'pink',
  },
  gameOver: false,
  loveFound: false,
};

// Variables para manejo táctil
let isDragging = false;
let lastTouch = { x: 0, y: 0 };

// Eventos táctiles para controlar al personaje
canvas.addEventListener('touchstart', (e) => {
  isDragging = true;
  lastTouch.x = e.touches[0].clientX - canvas.offsetLeft;
  lastTouch.y = e.touches[0].clientY - canvas.offsetTop;
});

canvas.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const currentTouchX = e.touches[0].clientX - canvas.offsetLeft;
    const currentTouchY = e.touches[0].clientY - canvas.offsetTop;

    // Calcular el desplazamiento del toque
    const dx = currentTouchX - lastTouch.x;
    const dy = currentTouchY - lastTouch.y;

    // Mover al personaje
    gameState.player.x += dx;
    gameState.player.y += dy;

    // Actualizar la última posición del toque
    lastTouch.x = currentTouchX;
    lastTouch.y = currentTouchY;

    // Evitar que el jugador salga del canvas
    if (gameState.player.x < 0) gameState.player.x = 0;
    if (gameState.player.x > canvas.width - gameState.player.width) gameState.player.x = canvas.width - gameState.player.width;
    if (gameState.player.y < 0) gameState.player.y = 0;
    if (gameState.player.y > canvas.height - gameState.player.height) gameState.player.y = canvas.height - gameState.player.height;
  }
});

canvas.addEventListener('touchend', () => {
  isDragging = false;
});

// Función para dibujar al jugador
function drawPlayer() {
  ctx.drawImage(playerImage, gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
}

// Función para dibujar el corazón
function drawLove() {
  ctx.fillStyle = gameState.love.color;
  ctx.beginPath();
  ctx.arc(gameState.love.x, gameState.love.y, gameState.love.width, 0, Math.PI * 2);
  ctx.fill();
}

// Verificar si el jugador ha alcanzado el corazón
function checkCollision() {
  const playerX = gameState.player.x + gameState.player.width / 2;
  const playerY = gameState.player.y + gameState.player.height / 2;

  const loveX = gameState.love.x + gameState.love.width / 2;
  const loveY = gameState.love.y + gameState.love.height / 2;

  const distance = Math.sqrt((playerX - loveX) ** 2 + (playerY - loveY) ** 2);
  if (distance < (gameState.player.width / 2 + gameState.love.width / 2)) {
    gameState.loveFound = true;
    gameState.gameOver = true;
  }
}

// Mostrar el corazón y el mensaje final
function displayHeartMessage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar un gran corazón en el centro del canvas
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
  ctx.fill();

  // Dibujar el mensaje encima del corazón
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  const message = "¡Has encontrado el amor!";
  ctx.fillText(message, canvas.width / 2 - ctx.measureText(message).width / 2, canvas.height / 2 - 120);
}

// Bucle principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameState.gameOver) {
    drawPlayer();
    drawLove();
    checkCollision();
    requestAnimationFrame(gameLoop);
  } else if (gameState.loveFound) {
    displayHeartMessage();
  }
}

// Iniciar el juego cuando la imagen esté cargada
playerImage.onload = function () {
  gameLoop();
};
