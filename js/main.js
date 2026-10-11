// Loop principal do jogo e máquina de estados (menu, jogando, pausado,
// transição de fase, vitória, derrota).

const CANVAS_W = 960;
const CANVAS_H = 540;
const FALL_LIMIT_Y = CANVAS_H + 80; // abaixo disso, o jogador caiu no buraco

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const el = {
  hearts: document.getElementById('hearts'),
  levelLabel: document.getElementById('level-label'),
  menu: document.getElementById('overlay-menu'),
  pause: document.getElementById('overlay-pause'),
  victory: document.getElementById('overlay-victory'),
  defeat: document.getElementById('overlay-defeat'),
  banner: document.getElementById('level-banner'),
};

const STATE = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  TRANSITION: 'TRANSITION',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT',
};

let state = STATE.MENU;
let currentLevelIndex = 0;
let player = null;
let platforms = [];
let enemies = [];
let exitZone = null;
let transitionTimer = 0;
let bannerText = '';
let bannerTimer = 0;

function showOverlay(elem) {
  elem.classList.remove('hidden');
}
function hideOverlay(elem) {
  elem.classList.add('hidden');
}

function hideAllOverlays() {
  hideOverlay(el.pause);
  hideOverlay(el.victory);
  hideOverlay(el.defeat);
  hideOverlay(el.menu);
}

function loadLevel(index, carryHearts) {
  const def = LEVELS[index];
  platforms = def.platforms;
  exitZone = def.exit;
  enemies = def.enemies.map((e) => new Enemy(e));
  player = new Player(def.start.x, def.start.y);
  if (typeof carryHearts === 'number') player.hearts = carryHearts;
  el.levelLabel.textContent = def.name;
  showBanner(def.name);
}

function showBanner(text) {
  bannerText = text;
  bannerTimer = 1.4;
  el.banner.textContent = text;
  el.banner.classList.remove('hidden');
}

function startNewGame() {
  currentLevelIndex = 0;
  loadLevel(0);
  state = STATE.PLAYING;
  hideAllOverlays();
}

function goToNextLevel() {
  const keepHearts = player.hearts;
  currentLevelIndex += 1;
  if (currentLevelIndex >= LEVELS.length) {
    state = STATE.VICTORY;
    showOverlay(el.victory);
    return;
  }
  loadLevel(currentLevelIndex, keepHearts);
  state = STATE.PLAYING;
}

function updateHud() {
  el.hearts.innerHTML = '';
  for (let i = 0; i < player.maxHearts; i++) {
    const span = document.createElement('span');
    span.textContent = '♥';
    if (i >= player.hearts) span.classList.add('empty');
    el.hearts.appendChild(span);
  }
}

function update(dt) {
  if (state === STATE.PLAYING) {
    if (Input.wasPressed('Escape')) {
      state = STATE.PAUSED;
      showOverlay(el.pause);
      return;
    }

    player.update(dt, platforms);
    for (const enemy of enemies) enemy.update(dt);
    enemies = enemies.filter((e) => !e.isGone);

    // Ataque do jogador atinge inimigos.
    const hitbox = player.attackHitbox;
    if (hitbox) {
      for (const enemy of enemies) {
        if (!enemy.alive || player.enemiesHitThisSwing.has(enemy)) continue;
        if (rectsOverlap(hitbox, enemy.rect)) {
          enemy.takeDamage();
          player.enemiesHitThisSwing.add(enemy);
        }
      }
    }

    // Contato de inimigo com o jogador causa dano.
    for (const enemy of enemies) {
      if (enemy.alive && rectsOverlap(player.rect, enemy.rect)) {
        player.takeHit();
      }
    }

    // Caiu em um buraco.
    if (player.y > FALL_LIMIT_Y) {
      player.takeHit();
      if (player.alive) {
        const def = LEVELS[currentLevelIndex];
        player.x = def.start.x;
        player.y = def.start.y - player.height;
        player.vx = 0;
        player.vy = 0;
      }
    }

    if (!player.alive) {
      state = STATE.DEFEAT;
      showOverlay(el.defeat);
    } else if (exitZone && rectsOverlap(player.rect, exitZone)) {
      state = STATE.TRANSITION;
      transitionTimer = 0.5;
    }

    updateHud();
  } else if (state === STATE.PAUSED) {
    if (Input.wasPressed('Escape')) {
      state = STATE.PLAYING;
      hideOverlay(el.pause);
    }
  } else if (state === STATE.TRANSITION) {
    transitionTimer -= dt;
    if (transitionTimer <= 0) goToNextLevel();
  }

  if (bannerTimer > 0) {
    bannerTimer -= dt;
    if (bannerTimer <= 0) el.banner.classList.add('hidden');
  }
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#171a2b');
  grad.addColorStop(1, '#0b0d14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Silhuetas de fundo simples.
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(i * 170 + 20, 60, 60, CANVAS_H);
  }
}

function drawPlatforms() {
  for (const p of platforms) {
    ctx.fillStyle = '#2d3250';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#4a5080';
    ctx.fillRect(p.x, p.y, p.w, 4);
  }
}

function drawExit() {
  if (!exitZone) return;
  const t = performance.now() / 300;
  const glow = 0.5 + Math.sin(t) * 0.25;
  ctx.fillStyle = `rgba(110, 220, 150, ${0.35 + glow * 0.3})`;
  ctx.fillRect(exitZone.x - 4, exitZone.y - 4, exitZone.w + 8, exitZone.h + 8);
  ctx.fillStyle = '#55d98f';
  ctx.fillRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
}

function drawEnemy(enemy) {
  if (enemy.isGone) return;
  ctx.save();
  if (!enemy.alive) {
    const t = Math.max(0, enemy.deathTimer / 0.4);
    ctx.globalAlpha = t;
  }
  ctx.fillStyle = enemy.hitFlash > 0 ? '#ffb3b3' : '#c23b4f';
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  // "olhos" simples para dar direção
  ctx.fillStyle = '#1a0d10';
  const eyeX = enemy.vx >= 0 ? enemy.x + enemy.width - 10 : enemy.x + 4;
  ctx.fillRect(eyeX, enemy.y + 10, 6, 6);
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  if (player.invincibleTimer > 0 && Math.floor(player.invincibleTimer * 20) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }
  ctx.fillStyle = '#4e7cf6';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = '#1a2340';
  const eyeX = player.facing > 0 ? player.x + player.width - 10 : player.x + 4;
  ctx.fillRect(eyeX, player.y + 10, 6, 6);
  ctx.restore();

  const hitbox = player.attackHitbox;
  if (hitbox) {
    ctx.fillStyle = 'rgba(255, 230, 140, 0.85)';
    ctx.fillRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
  }
}

function render() {
  drawBackground();
  drawPlatforms();
  drawExit();
  for (const enemy of enemies) drawEnemy(enemy);
  if (player) drawPlayer();
}

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 1 / 30);
  lastTime = now;

  update(dt);
  render();

  Input.endFrame();
  requestAnimationFrame(loop);
}

// --- Eventos de UI / estado ---

function tryStartFromMenu() {
  if (state !== STATE.MENU) return;
  startNewGame();
}

document.getElementById('btn-start').addEventListener('click', tryStartFromMenu);
document.getElementById('btn-resume').addEventListener('click', () => {
  if (state !== STATE.PAUSED) return;
  state = STATE.PLAYING;
  hideOverlay(el.pause);
});
document.getElementById('btn-restart-win').addEventListener('click', startNewGame);
document.getElementById('btn-restart-lose').addEventListener('click', startNewGame);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && state === STATE.MENU) {
    tryStartFromMenu();
  } else if (e.code === 'Enter' && (state === STATE.VICTORY || state === STATE.DEFEAT)) {
    startNewGame();
  }
});

requestAnimationFrame(loop);
