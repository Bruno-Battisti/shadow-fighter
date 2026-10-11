# Shadow Fighter

▶️ [Jogar online](https://bruno-battisti.github.io/shadow-fighter/)

Jogo 2D de plataforma e combate, construído em HTML5 Canvas + JavaScript puro
(sem dependências externas). Implementa o MVP descrito em
[`planejamento_shadow_fighter.pdf`](./planejamento_shadow_fighter.pdf): 3 fases
curtas, um inimigo que patrulha e morre em dois golpes, sistema de vida com 3
corações, menu inicial e telas de vitória/derrota — com pixel art e efeitos
sonoros gerados inteiramente em código (nenhum arquivo de imagem ou áudio
externo).

## Como jogar

Basta abrir `index.html` em um navegador. Como o jogo usa apenas `<script>`
comuns (sem módulos ES), não é obrigatório rodar um servidor — mas se o seu
navegador bloquear algo ao abrir via `file://`, sirva a pasta localmente:

```bash
python -m http.server 8000
# depois acesse http://localhost:8000
```

## Controles

| Tecla | Ação |
|---|---|
| `A` / `D` | Mover para esquerda / direita |
| `Espaço` | Pular |
| `J` | Atacar com a espada |
| `Esc` | Pausar / retomar |

## Estrutura

```
index.html       Estrutura da página e overlays (menu, pausa, vitória, derrota)
style.css        Estilo do HUD e das telas
js/input.js       Teclado (teclas pressionadas / seguradas)
js/audio.js       Efeitos sonoros sintetizados via Web Audio API
js/sprites.js     Pixel art (grades de pixels desenhadas em canvas)
js/entities.js    Player e Enemy — física, colisão AABB, combate, animação
js/levels.js      Dados das 3 fases (plataformas, inimigos, saída)
js/main.js        Loop do jogo e máquina de estados
```

Tanto os sprites quanto os sons são gerados em tempo de execução (nenhum
`.png`/`.mp3` no repositório): os sprites são grades de pixels desenhadas num
`<canvas>` fora da tela, e os sons são sintetizados com osciladores/ruído do
Web Audio API.

## Escopo

Vida: 3 corações · Inimigo morre em 2 golpes · Sem chefes · Sem salvamento de
progresso — ver o PDF de planejamento para o escopo completo do MVP e os
recursos deixados para versões futuras (múltiplas armas, história, fases
procedurais, etc).
