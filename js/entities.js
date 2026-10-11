// Entidades do jogo: Player e Enemy. Física simples (gravidade +
// colisão AABB eixo-a-eixo) e combate (espada com hitbox temporária).

const GRAVITY = 1800;
const MOVE_SPEED = 220;
const JUMP_VELOCITY = -650;

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Resolve movimento de um corpo contra uma lista de plataformas,
// eixo por eixo (padrão clássico de plataforma 2D). `body` usa
// width/height (não w/h) para as dimensões, por isso não reutiliza
// rectsOverlap aqui.
function bodyOverlapsPlatform(body, p) {
  return body.x < p.x + p.w && body.x + body.width > p.x &&
         body.y < p.y + p.h && body.y + body.height > p.y;
}

function moveAndCollide(body, dx, dy, platforms) {
  body.x += dx;
  for (const p of platforms) {
    if (!bodyOverlapsPlatform(body, p)) continue;
    if (dx > 0) body.x = p.x - body.width;
    else if (dx < 0) body.x = p.x + p.w;
  }

  body.grounded = false;
  body.y += dy;
  for (const p of platforms) {
    if (!bodyOverlapsPlatform(body, p)) continue;
    if (dy > 0) {
      body.y = p.y - body.height;
      body.vy = 0;
      body.grounded = true;
    } else if (dy < 0) {
      body.y = p.y + p.h;
      body.vy = 0;
    }
  }
}

class Player {
  constructor(x, y) {
    this.width = 36;
    this.height = 54;
    this.x = x;
    this.y = y - this.height;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1 = direita, -1 = esquerda
    this.grounded = false;

    this.attacking = false;
    this.attackTimer = 0;
    this.attackDuration = 0.18;
    this.attackCooldown = 0;
    this.enemiesHitThisSwing = new Set();

    this.hearts = 3;
    this.maxHearts = 3;
    this.invincibleTimer = 0;
    this.alive = true;
  }

  get rect() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  startAttack() {
    if (this.attackCooldown > 0) return;
    this.attacking = true;
    this.attackTimer = this.attackDuration;
    this.attackCooldown = 0.32;
    this.enemiesHitThisSwing.clear();
  }

  get attackHitbox() {
    if (!this.attacking) return null;
    const w = 30;
    const h = 40;
    const x = this.facing > 0 ? this.x + this.width : this.x - w;
    const y = this.y + 6;
    return { x, y, w, h };
  }

  takeHit() {
    if (this.invincibleTimer > 0 || !this.alive) return;
    this.hearts -= 1;
    this.invincibleTimer = 1.1;
    if (this.hearts <= 0) {
      this.hearts = 0;
      this.alive = false;
    }
  }

  update(dt, platforms) {
    if (!this.alive) return;

    // Entrada horizontal.
    let moveX = 0;
    if (Input.isDown('KeyA') || Input.isDown('ArrowLeft')) moveX -= 1;
    if (Input.isDown('KeyD') || Input.isDown('ArrowRight')) moveX += 1;

    this.vx = moveX * MOVE_SPEED;
    if (moveX !== 0) this.facing = moveX > 0 ? 1 : -1;

    // Pulo.
    if ((Input.wasPressed('Space')) && this.grounded) {
      this.vy = JUMP_VELOCITY;
      this.grounded = false;
    }

    // Ataque.
    if (Input.wasPressed('KeyJ')) {
      this.startAttack();
    }

    // Gravidade.
    this.vy += GRAVITY * dt;
    if (this.vy > 1400) this.vy = 1400;

    moveAndCollide(this, this.vx * dt, this.vy * dt, platforms);

    // Timers.
    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) this.attacking = false;
    }
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
  }
}

class Enemy {
  constructor(def) {
    this.width = 34;
    this.height = 46;
    this.minX = def.minX;
    this.maxX = def.maxX;
    this.x = def.minX;
    this.y = def.groundY - this.height;
    this.vx = def.speed;
    this.speed = def.speed;
    this.hp = 2;
    this.alive = true;
    this.deathTimer = 0;
    this.hitFlash = 0;
  }

  get rect() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  takeDamage() {
    if (!this.alive) return;
    this.hp -= 1;
    this.hitFlash = 0.15;
    if (this.hp <= 0) {
      this.alive = false;
      this.deathTimer = 0.4;
    }
  }

  update(dt) {
    if (!this.alive) {
      this.deathTimer -= dt;
      return;
    }

    this.x += this.vx * dt;
    if (this.x <= this.minX) {
      this.x = this.minX;
      this.vx = Math.abs(this.speed);
    } else if (this.x + this.width >= this.maxX) {
      this.x = this.maxX - this.width;
      this.vx = -Math.abs(this.speed);
    }

    if (this.hitFlash > 0) this.hitFlash -= dt;
  }

  get isGone() {
    return !this.alive && this.deathTimer <= 0;
  }
}
