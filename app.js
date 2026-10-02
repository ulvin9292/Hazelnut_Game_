const state = {
  score: 0,
  holding: 0,
  pool: 0,
  energy: 1000,
  maxEnergy: 1000,
  energyRegenRate: 5,
  profitPerSecond: 0,
  lastUpdate: Date.now(),
  level: 1,
  xp: 0,
  xpNeeded: 100,
  clickPower: 1,
  frenzyActive: false,
  frenzyMultiplier: 1,
  lastDailyReward: null,
  achievements: {
    firstClick: false,
    noviceTycoon: false,
    masterClicker: false
  },
  clickPowerCost: 50,
  autoMinerCost: 100,
  autoMinerRate: 10
};

const clickBtn = document.getElementById('click-btn');
const adBtn = document.getElementById('ad-btn');
const buyClickPowerBtn = document.getElementById('buy-click-power');
const buyAutoMinerBtn = document.getElementById('buy-auto-miner');
const scoreDisplay = document.getElementById('score');
const energyDisplay = document.getElementById('energy');
const profitDisplay = document.getElementById('profit-per-second');
const levelDisplay = document.getElementById('level');
const xpDisplay = document.getElementById('xp');
const frenzyDisplay = document.getElementById('frenzy-status');

function checkAchievements() {
  if (state.score >= 100 && !state.achievements.firstClick) {
    state.achievements.firstClick = true;
    state.score += 50;
  }
  if (state.score >= 10000 && !state.achievements.noviceTycoon) {
    state.achievements.noviceTycoon = true;
    state.score += 500;
  }
  if (state.score >= 1000000 && !state.achievements.masterClicker) {
    state.achievements.masterClicker = true;
    state.score += 10000;
  }
}

function checkLevelUp() {
  if (state.xp >= state.xpNeeded) {
    state.level += 1;
    state.xp -= state.xpNeeded;
    state.maxEnergy += 200;
    state.energyRegenRate += 1;
    state.xpNeeded = Math.floor(state.xpNeeded * 1.5);
    state.clickPower += 1;
  }
}

clickBtn.addEventListener('click', () => {
  if (state.energy > 0) {
    const earned = state.clickPower * state.frenzyMultiplier;
    state.score += earned;
    state.energy -= 1;
    state.xp += 1;
    checkLevelUp();
    checkAchievements();
    updateUI();
    saveGameData();
  }
});

adBtn.addEventListener('click', () => {
  state.score += 10;
  updateUI();
  saveGameData();
});

buyClickPowerBtn.addEventListener('click', () => {
  if (state.score >= state.clickPowerCost) {
    state.score -= state.clickPowerCost;
    state.clickPower += 1;
    state.clickPowerCost = Math.floor(state.clickPowerCost * 1.5);
    buyClickPowerBtn.innerText = `Klik Gücünü Artır (Qiymət: ${state.clickPowerCost})`;
    updateUI();
    saveGameData();
  }
});

buyAutoMinerBtn.addEventListener('click', () => {
  if (state.score >= state.autoMinerCost) {
    state.score -= state.autoMinerCost;
    state.profitPerSecond += state.autoMinerRate;
    state.autoMinerCost = Math.floor(state.autoMinerCost * 1.5);
    buyAutoMinerBtn.innerText = `Avtomatik Qazıcı Al (Qiymət: ${state.autoMinerCost})`;
    updateUI();
    saveGameData();
  }
});

setInterval(() => {
  const now = Date.now();
  const deltaTime = (now - state.lastUpdate) / 1000;

  state.score += state.profitPerSecond * deltaTime;

  if (state.energy < state.maxEnergy) {
    state.energy += state.energyRegenRate * deltaTime;
    if (state.energy > state.maxEnergy) {
      state.energy = state.maxEnergy;
    }
  }

  state.lastUpdate = now;
  checkAchievements();
  updateUI();
}, 1000);

function updateUI() {
  if (scoreDisplay) scoreDisplay.innerText = Math.floor(state.score).toLocaleString();
  if (energyDisplay) energyDisplay.innerText = `${Math.floor(state.energy)} / ${state.maxEnergy}`;
  if (profitDisplay) profitDisplay.innerText = state.profitPerSecond;
  if (levelDisplay) levelDisplay.innerText = `Səviyyə: ${state.level}`;
  if (xpDisplay) xpDisplay.innerText = `XP: ${state.xp} / ${state.xpNeeded}`;

  const holdingElem = document.getElementById('holding-wallet');
  const poolElem = document.getElementById('pool-wallet');
  if (holdingElem) holdingElem.textContent = state.holding.toLocaleString();
  if (poolElem) poolElem.textContent = state.pool.toLocaleString();
}

function saveGameData() {
  localStorage.setItem('gameData', JSON.stringify(state));
}

function loadGameData() {
  const savedData = localStorage.getItem('gameData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    
    if (parsedData.lastUpdate) {
      const offlineDuration = (Date.now() - parsedData.lastUpdate) / 1000;
      const offlineEarnings = parsedData.profitPerSecond * offlineDuration;
      parsedData.score += offlineEarnings;
    }

    Object.assign(state, parsedData);
    state.lastUpdate = Date.now();
    
    if (buyClickPowerBtn) buyClickPowerBtn.innerText = `Klik Gücünü Artır (Qiymət: ${state.clickPowerCost})`;
    if (buyAutoMinerBtn) buyAutoMinerBtn.innerText = `Avtomatik Qazıcı Al (Qiymət: ${state.autoMinerCost})`;
    
    updateUI();
  }
}

loadGameData();
function showAd() {
  if (typeof window.Adsgram !== 'undefined') {
    const ad = window.Adsgram.init({ blockId: "REKLAM_BlOK_İDNİZ" });
    ad.show()
      .then((result) => {
        if (result.done) {
          // Reklam uğurla bitdi, istifadəçini mükafatlandırın
          gameState.score += 50; // Məsələn, 50 xal əlavə edirik
          updateUI();
          saveGameData();
          console.log("Reklam uğurla izlənildi!");
        } else {
          console.log("İstifadəçi reklamı vaxtından əvvəl bağladı.");
        }
      })
      .catch((error) => {
        console.error("Reklam yüklənərkən xəta baş verdi:", error);
      });
  } else {
    console.warn("AdsGram SDK tam yüklənməyib.");
  }
}
