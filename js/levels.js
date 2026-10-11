// Dados das 3 fases do MVP. Cada fase tem: ponto de início, plataformas
// em alturas diferentes, de 2 a 3 inimigos que patrulham, buracos (pits)
// entre as plataformas e uma saída que libera a próxima fase.
//
// `groundY` nos inimigos é o topo da plataforma onde ele nasce; a altura
// do inimigo é descontada na hora de posicioná-lo (ver entities.js).

const LEVELS = [
  // ---------- Fase 1 ----------
  {
    name: 'Fase 1',
    start: { x: 40, y: 500 },
    platforms: [
      { x: 0, y: 500, w: 380, h: 40 },
      { x: 460, y: 500, w: 300, h: 40 },
      { x: 620, y: 420, w: 140, h: 20 },
      { x: 820, y: 340, w: 140, h: 20 },
    ],
    enemies: [
      { minX: 480, maxX: 700, groundY: 500, speed: 70 },
      { minX: 840, maxX: 920, groundY: 340, speed: 60 },
    ],
    exit: { x: 900, y: 280, w: 50, h: 60 },
  },

  // ---------- Fase 2 ----------
  {
    name: 'Fase 2',
    start: { x: 30, y: 500 },
    platforms: [
      { x: 0, y: 500, w: 250, h: 40 },
      { x: 330, y: 500, w: 200, h: 40 },
      { x: 610, y: 500, w: 350, h: 40 },
      { x: 150, y: 410, w: 140, h: 20 },
      { x: 380, y: 330, w: 140, h: 20 },
      { x: 560, y: 260, w: 120, h: 20 },
      { x: 760, y: 180, w: 160, h: 20 },
    ],
    enemies: [
      { minX: 350, maxX: 510, groundY: 500, speed: 70 },
      { minX: 390, maxX: 510, groundY: 330, speed: 75 },
      { minX: 770, maxX: 900, groundY: 180, speed: 65 },
    ],
    exit: { x: 870, y: 120, w: 50, h: 60 },
  },

  // ---------- Fase 3 ----------
  {
    name: 'Fase 3',
    start: { x: 30, y: 500 },
    platforms: [
      { x: 0, y: 500, w: 160, h: 40 },
      { x: 240, y: 430, w: 110, h: 20 },
      { x: 420, y: 360, w: 100, h: 20 },
      { x: 580, y: 300, w: 100, h: 20 },
      { x: 740, y: 250, w: 100, h: 20 },
      { x: 860, y: 190, w: 100, h: 20 },
    ],
    enemies: [
      { minX: 245, maxX: 335, groundY: 430, speed: 80 },
      { minX: 585, maxX: 665, groundY: 300, speed: 85 },
      { minX: 865, maxX: 945, groundY: 190, speed: 70 },
    ],
    exit: { x: 900, y: 130, w: 50, h: 60 },
  },
];
