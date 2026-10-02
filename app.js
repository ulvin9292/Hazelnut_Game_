6import { TonConnectUI } from '@tonconnect/ui';

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://ulvin9292.github.io/Hazelnut_Game_/tonconnect-manifest.json'
});

document.getElementById('connect-wallet-btn').addEventListener('click', async () => {
  try {
    await tonConnectUI.openModal();
  } catch (error) {
    console.error("Xəta baş verdi:", error);
  }
});

let state = { score: 0, level: 1, totalTaps: 0, energy: 1000, maxEnergy: 1000, pointsPerTap: 1, nextLevelThreshold: 100 };
const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const scoreDisplay = document.getElementById('score-display');
const levelTitle = document.getElementById('level-title');
const levelProgress = document.getElementById('level-progress');
const energyText = document.getElementById('energy-text');
const energyBar = document.getElementById('energy-bar');
const clickTarget = document.getElementById('click-target');
const statTaps = document.getElementById('stat-taps');
const statLevel = document.getElementById('stat-level');

function loadGameData() {
  const saved = localStorage.getItem('hazelnut_game_state');
  if (saved) state = JSON.parse(saved);
  updateUI();
}

function saveGameData() { localStorage.setItem('hazelnut_game_state', JSON.stringify(state)); }

function updateUI() {
  scoreDisplay.textContent = `${state.score} 🪙`;
  energyText.textContent = `${state.energy} / ${state.maxEnergy}`;
  energyBar.style.width = `${(state.energy / state.maxEnergy) * 100}%`;
  levelTitle.textContent = `Səviyyə ${state.level}`;
  const progressPercent = Math.min((state.score / state.nextLevelThreshold) * 100, 100);
  levelProgress.style.width = `${progressPercent}%`;
  statTaps.textContent = state.totalTaps;
  statLevel.textContent = state.level;
}

clickTarget.addEventListener('touchstart', handleTap);
clickTarget.addEventListener('click', handleTap);

function handleTap(event) {
  event.preventDefault();
  if (state.energy <= 0) return;
  state.energy = Math.max(0, state.energy - 1);
  state.score += state.pointsPerTap;
  state.totalTaps += 1;
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  showFloatingText(`+${state.pointsPerTap}`, event);
  if (state.score >= state.nextLevelThreshold) {
    state.level += 1;
    state.nextLevelThreshold *= 2;
    state.maxEnergy += 200;
    state.energy = state.maxEnergy;
  }
  updateUI();
  saveGameData();
}

function showFloatingText(text, event) {
  const el = document.createElement('div');
  el.className = 'floating-text';
  el.textContent = text;
  const rect = clickTarget.getBoundingClientRect();
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
  const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  clickTarget.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

setInterval(() => {
  if (state.energy < state.maxEnergy) {
    state.energy = Math.min(state.maxEnergy, state.energy + 1);
    updateUI();
    saveGameData();
  }
}, 1000);

function switchTab(screenId, btnElement) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(screenId).classList.add('active-screen');
  btnElement.classList.add('active');
}

function completeTask(reward, button) {
  state.score += reward;
  button.disabled = true;
  button.textContent = 'Tamamlandı';
  function updateUI() {
  scoreDisplay.innerText = state.score;
  updateWalletUI();
}

  saveGameData();
}

loadGameData();
if (state.score >= 10000) {
  alert("Təbriklər! 10 000 Fındıq Coin toplayaraq 1 kvadrat metr torpaq sahəsi qazandınız.");
}
