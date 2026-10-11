// Efeitos sonoros sintetizados via Web Audio API (sem arquivos de áudio
// externos). O contexto só é criado/retomado na primeira interação do
// usuário, respeitando a política de autoplay dos navegadores.

const SFX = (() => {
  let ctx;

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone({ freq = 440, duration = 0.12, type = 'square', gain = 0.18, slideTo = null, delay = 0 }) {
    const ac = ensureCtx();
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
    amp.gain.setValueAtTime(gain, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(amp).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function noiseBurst({ duration = 0.12, gain = 0.22, filterFreq = 1500 }) {
    const ac = ensureCtx();
    const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = filterFreq;
    const amp = ac.createGain();
    const t0 = ac.currentTime;
    amp.gain.setValueAtTime(gain, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    noise.connect(filter).connect(amp).connect(ac.destination);
    noise.start(t0);
  }

  function arpeggio(freqs, { duration = 0.18, type = 'square', gain = 0.18, step = 0.1 } = {}) {
    freqs.forEach((freq, i) => tone({ freq, duration, type, gain, delay: i * step }));
  }

  return {
    ensureCtx,
    jump() {
      tone({ freq: 420, slideTo: 760, duration: 0.14, type: 'square', gain: 0.16 });
    },
    attack() {
      noiseBurst({ duration: 0.09, gain: 0.2, filterFreq: 2000 });
    },
    hitEnemy() {
      tone({ freq: 220, slideTo: 90, duration: 0.1, type: 'sawtooth', gain: 0.18 });
    },
    enemyDeath() {
      tone({ freq: 320, slideTo: 40, duration: 0.3, type: 'sawtooth', gain: 0.2 });
    },
    playerHurt() {
      tone({ freq: 180, slideTo: 55, duration: 0.25, type: 'square', gain: 0.22 });
    },
    pause() {
      tone({ freq: 500, duration: 0.07, type: 'triangle', gain: 0.1 });
    },
    select() {
      tone({ freq: 600, slideTo: 900, duration: 0.09, type: 'square', gain: 0.14 });
    },
    levelComplete() {
      arpeggio([523, 659, 784], { duration: 0.16, gain: 0.16, step: 0.09 });
    },
    victory() {
      arpeggio([523, 659, 784, 1046], { duration: 0.22, gain: 0.18, step: 0.12 });
    },
    defeat() {
      arpeggio([392, 330, 262, 196], { duration: 0.28, type: 'sawtooth', gain: 0.18, step: 0.13 });
    },
  };
})();
