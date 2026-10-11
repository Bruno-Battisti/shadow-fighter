// Pixel art construída em código: cada sprite é uma grade de caracteres
// (um caractere = um "pixel" lógico) desenhada uma única vez num canvas
// fora da tela e depois escalada para o tamanho da entidade com
// `imageSmoothingEnabled = false`, mantendo o visual blocado.

function buildSprite(rows, palette) {
  const h = rows.length;
  const w = rows[0].length;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const octx = off.getContext('2d');
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < w; x++) {
      const key = row[x];
      if (key === '.' || !palette[key]) continue;
      octx.fillStyle = palette[key];
      octx.fillRect(x, y, 1, 1);
    }
  }
  return off;
}

const PLAYER_PALETTE = {
  H: '#232a47', // capuz / cabelo
  S: '#e8b98a', // pele
  B: '#4e7cf6', // túnica
  D: '#2b3a67', // sombra da túnica / cinto
  G: '#c9a227', // guarda da espada
  W: '#eef0f6', // lâmina
};

const PLAYER_IDLE_ROWS = [
  '..HHHH....',
  '.HHHHHH...',
  '.HSSSSH...',
  '.HSSSSH...',
  '..HHHH....',
  '.BBBBBBB..',
  '.BBBBBBG..',
  '.BDDDBBB..',
  '.BDDDBBB..',
  '.BBBBBBB..',
  '..BB.BB...',
  '..BB.BB...',
  '..DD.DD...',
  '..DD.DD...',
  '.BBB.BBB..',
  '.BBB.BBB..',
];

// Ciclo de caminhada (2 quadros): a perna e o braço livre (lado oposto
// à espada) alternam de posição a cada quadro para dar sensação de passo.
const PLAYER_WALK_A_ROWS = [
  '..HHHH....',
  '.HHHHHH...',
  '.HSSSSH...',
  '.HSSSSH...',
  '..HHHH....',
  '.BBBBBBB..',
  '.BBBBBBG..',
  '.BDDDBBB..',
  'BBDDDBBB..',
  'SBBBBBBB..',
  '..BB.BB...',
  '..BB.BB...',
  '..DD......',
  '..DD......',
  '.BBB......',
  '.BBB......',
];

const PLAYER_WALK_B_ROWS = [
  '..HHHH....',
  '.HHHHHH...',
  '.HSSSSH...',
  '.HSSSSH...',
  '..HHHH....',
  '.BBBBBBB..',
  'SBBBBBBG..',
  'BBDDDBBB..',
  '.BDDDBBB..',
  '.BBBBBBB..',
  '..BB.BB...',
  '..BB.BB...',
  '.....DD...',
  '.....DD...',
  '.....BBB..',
  '.....BBB..',
];

const PLAYER_ATTACK_ROWS = [
  '..HHHH......',
  '.HHHHHH.....',
  '.HSSSSH.....',
  '.HSSSSH.....',
  '..HHHH......',
  '.BBBBBBB....',
  '.BBBBBBBGWWW',
  '.BDDDBBB.WWW',
  '.BDDDBBB....',
  '.BBBBBBB....',
  '..BB.BB.....',
  '..BB.BB.....',
  '..DD.DD.....',
  '..DD.DD.....',
  '.BBB.BBB....',
  '.BBB.BBB....',
];

const ENEMY_PALETTE = {
  D: '#3a2250',
  R: '#ff4d6d',
};

const ENEMY_IDLE_ROWS = [
  '..DDDDDD..',
  '.DDDDDDDD.',
  'DDDRDDRDDD',
  'DDDDDDDDDD',
  'DDDDDDDDDD',
  'DDDDDDDDDD',
  '.DDDDDDDD.',
  '.DDDDDDDD.',
  '..DDDDDD..',
  '..DD.DD...',
  '..DD.DD...',
  '..DD.DD...',
  '..DD.DD...',
  '.DDD.DDD..',
];

const SPRITES = {
  playerIdle: buildSprite(PLAYER_IDLE_ROWS, PLAYER_PALETTE),
  playerWalkA: buildSprite(PLAYER_WALK_A_ROWS, PLAYER_PALETTE),
  playerWalkB: buildSprite(PLAYER_WALK_B_ROWS, PLAYER_PALETTE),
  playerAttack: buildSprite(PLAYER_ATTACK_ROWS, PLAYER_PALETTE),
  enemyIdle: buildSprite(ENEMY_IDLE_ROWS, ENEMY_PALETTE),
};
