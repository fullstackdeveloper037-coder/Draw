const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const msg = document.getElementById('msg');

let player, platforms, particles, score, gameActive, speed;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  score = 0;
  speed = 5;
  gameActive = true;
  platforms = [];
  particles = [];
  
  player = {
    x: 100, y: canvas.height / 2,
    w: 30, h: 30,
    vy: 0, gravity: 0.6,
    jumpStrength: -12, grounded: false
  };

  // Piattaforma iniziale
  for(let i=0; i<5; i++) {
    platforms.push({ x: i * 300, y: canvas.height / 1.5, w: 200, h: 20 });
  }
  
  msg.innerHTML = "SCHIVA IL VUOTO!";
  update();
}

function spawnPlatform() {
  const last = platforms[platforms.length - 1];
  const newX = last.x + 250 + Math.random() * 150;
  const newY = Math.max(200, Math.min(canvas.height - 100, last.y + (Math.random() - 0.5) * 200));
  platforms.push({ x: newX, y: newY, w: 150 + Math.random() * 100, h: 20 });
}

function update() {
  if (!gameActive) return;

  // Logica Giocatore
  player.vy += player.gravity;
  player.y += player.vy;
  player.grounded = false;

  // Velocità progressiva
  speed += 0.002;
  score += Math.floor(speed / 5);
  scoreDisplay.innerText = `DISTANZA: ${score}m`;

  // Collisioni Piattaforme
  platforms.forEach(p => {
    p.x -= speed;
    if (player.x < p.x + p.w && player.x + player.w > p.x &&
        player.y + player.h > p.y && player.y + player.h < p.y + p.h + 20 && player.vy >= 0) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  });

  // Gestione Piattaforme (Spawn/Remove)
  if (platforms[0].x + platforms[0].w < 0) platforms.shift();
  if (platforms.length < 10) spawnPlatform();

  // Game Over
  if (player.y > canvas.height) {
    gameOver();
    return;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  // Sfondo con effetto scia
  ctx.fillStyle = 'rgba(0, 5, 10, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Disegna Piattaforme (Effetto Neon)
  platforms.forEach(p => {
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0ff';
    ctx.fillStyle = '#0ff';
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

  // Disegna Giocatore
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#0f0';
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.shadowBlur = 0;
}

function gameOver() {
  gameActive = false;
  msg.innerHTML = "CADUTO NEL VUOTO!<br><span style='color:white; font-size:1.5rem'>CLICCA PER RIGENERARE</span>";
  canvas.style.filter = "hue-rotate(90deg) blur(2px)";
  window.addEventListener('mousedown', () => {
    canvas.style.filter = "none";
    init();
  }, { once: true });
}

// Input
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && player.grounded) player.vy = player.jumpStrength;
});
window.addEventListener('mousedown', () => {
  if (player.grounded) player.vy = player.jumpStrength;
});

init();