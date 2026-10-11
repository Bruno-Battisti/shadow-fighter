// Teclado simples: mantém o estado de teclas pressionadas e teclas
// "recém pressionadas" (para ações de disparo único, como pulo/ataque).
const Input = (() => {
  const down = new Set();
  const pressed = new Set();

  window.addEventListener('keydown', (e) => {
    if (!down.has(e.code)) pressed.add(e.code);
    down.add(e.code);

    // Evita rolar a página com espaço/setas.
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    down.delete(e.code);
  });

  function isDown(code) {
    return down.has(code);
  }

  function wasPressed(code) {
    return pressed.has(code);
  }

  // Deve ser chamado uma vez por frame, depois de processar as entradas.
  function endFrame() {
    pressed.clear();
  }

  return { isDown, wasPressed, endFrame };
})();
