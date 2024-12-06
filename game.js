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
  barriers: [
    { x: 200, y: 100, width: 400, height: 20 },
    { x: 200, y: 300, width: 20, height: 200 },
    { x: 400, y: 400, width: 200, height: 20 },
    { x: 600, y: 200, width: 20, height: 200 },
  ],
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

// Función para dibujar las barreras
function drawBarriers() {
  ctx.fillStyle = 'gray';
  gameState.barriers.forEach(barrier => {
    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
  });
}

// Verificar si el jugador colisiona con una barrera
function checkBarrierCollision() {
  return gameState.barriers.some(barrier => {
    return (
      gameState.player.x < barrier.x + barrier.width &&
      gameState.player.x + gameState.player.width > barrier.x &&
      gameState.player.y < barrier.y + barrier.height &&
      gameState.player.y + gameState.player.height > barrier.y
    );
  });
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
    window.location.href = 'amor.html'; // Redirige a la página del mensaje
  }
}

// Bucle principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameState.loveFound) {
    drawPlayer();
    drawLove();
    drawBarriers();

    if (checkBarrierCollision()) {
      // Si colisiona con una barrera, regresar al punto inicial
      gameState.player.x = 50;
      gameState.player.y = 500;
    }

    checkCollision();
    requestAnimationFrame(gameLoop);
  }
}

// Iniciar el juego cuando la imagen esté cargada
playerImage.onload = function () {
  gameLoop();
};
