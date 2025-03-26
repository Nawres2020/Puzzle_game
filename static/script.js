const container = document.getElementById('puzzle-container');
const message = document.getElementById('message');
const winSound = document.getElementById('win-sound');
const bgMusic = document.getElementById('bg-music');
const envelopeContainer = document.getElementById('envelope-container');
const stageDisplay = document.getElementById('stage-number');

let positions = [];
let selected = null;
let stage = 0;

// Get player name
let playerName = prompt("Hi! What's your name, handsome? 💖😊") || "Cutie";
document.getElementById('player-name').textContent = playerName;

// Load images from HTML template
const stageImages = window.stageImages;

document.getElementById('start-btn').addEventListener('click', () => {
  bgMusic.play();
  document.getElementById('start-btn').style.display = 'none';
  envelopeContainer.classList.add('hidden');
  startStage();
});

function getGridSize(stage) {
  if (stage === 0) return 3;
  if (stage === 1) return 4;
  if (stage === 2) return 5;
  return 3;
}

function startStage() {
  message.textContent = `Stage ${stage + 1}: Let's go, ${playerName}! ✨`;
  stageDisplay.textContent = stage + 1;
  const gridSize = getGridSize(stage);

  positions = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({ row, col });
    }
  }

  positions.sort(() => Math.random() - 0.5);
  render();
}

function render() {
  const gridSize = getGridSize(stage);
  const tileSize = 100;

  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${gridSize}, ${tileSize}px)`;
  container.style.width = `${gridSize * tileSize + (gridSize - 1) * 5}px`;
  container.style.height = `${gridSize * tileSize + (gridSize - 1) * 5}px`;

  const bgImage = `url('${stageImages[stage]}')`;

  positions.forEach((pos, index) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.index = index;

    tile.style.width = tileSize + 'px';
    tile.style.height = tileSize + 'px';
    tile.style.backgroundImage = bgImage;
    tile.style.backgroundSize = `${gridSize * tileSize}px ${gridSize * tileSize}px`;
    tile.style.backgroundPosition = `-${pos.col * tileSize}px -${pos.row * tileSize}px`;
    tile.style.border = '1px solid #ccc';
    tile.style.cursor = 'pointer';

    tile.onclick = () => handleClick(index);
    container.appendChild(tile);
  });
}

function handleClick(index) {
  if (selected === null) {
    selected = index;
  } else {
    [positions[selected], positions[index]] = [positions[index], positions[selected]];
    selected = null;
    render();
    checkSolved();
  }
}

function checkSolved() {
  const gridSize = getGridSize(stage);
  let solved = true;

  for (let i = 0; i < positions.length; i++) {
    const correctRow = Math.floor(i / gridSize);
    const correctCol = i % gridSize;

    if (positions[i].row !== correctRow || positions[i].col !== correctCol) {
      solved = false;
      break;
    }
  }

  if (solved) {
    winSound.play();
    triggerConfetti();

    if (stage < 2) {
      stage++;
      setTimeout(startStage, 1000);
    } else {
      message.textContent = `🎉 You did it, ${playerName}! Here's your invitation 💌`;
      envelopeContainer.classList.remove('hidden');
    }
  }
}

function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 120,
    origin: { y: 0.6 },
    emojis: ['💖', '🌸', '✨', '💌', '🍓']
  });
}

function openEnvelope() {
  const envelope = document.getElementById('envelope');
  envelope.classList.add('opened');
}
