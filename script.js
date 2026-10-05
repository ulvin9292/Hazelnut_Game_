// === OYUNUN ƏSAS VƏZİYYƏTİ (STATE) ===
const gameState = {
  score: 0,
  clickPower: 1,
  passiveIncome: 0,
  
  // Combo mexanikası
  comboCount: 0,
  comboMultiplier: 1,
  comboTimeout: null,
  
  // Boss Mexanikası
  bossActive: false,
  bossHp: 0,
  bossMaxHp: 100,
  bossTimer: 15,
  bossInterval: null,
  bossReward: 500,

  // Dinamik Upgrade-lər
  upgrades: {
    clickBoost: { count: 0, baseCost: 10, costMultiplier: 1.5, power: 1 },
    autoMiner: { count: 0, baseCost: 50, costMultiplier: 1.6, power: 2 },
    quantumCore: { count: 0, baseCost: 200, costMultiplier: 1.8, power: 10 }
  }
};

// === DOM ELEMENTLƏRİ ===
const scoreEl = document.getElementById('score');
const clickPowerEl = document.getElementById('click-power');
const passiveEl = document.getElementById('passive-income');
const comboEl = document.getElementById('combo-display');
const clickBtn = document.getElementById('click-btn');

// === 1. KOMBİNASİYA (COMBO) MEXANİKASI ===
function registerClick() {
  // Boss döyüşü gedirsə, zərbəni Boss-a vur
  if (gameState.bossActive) {
    hitBoss();
    return;
  }

  // Combo artımı
  gameState.comboCount++;
  if (gameState.comboCount > 20) gameState.comboMultiplier = 3;
  else if (gameState.comboCount > 10) gameState.comboMultiplier = 2;
  else if (gameState.comboCount > 5) gameState.comboMultiplier = 1.5;
  else gameState.comboMultiplier = 1;

  // Xalın hesablanması
  const earned = gameState.clickPower * gameState.comboMultiplier;
  gameState.score += earned;

  // Combo taymerini sıfırla (1.2 saniyə klikləməsən combo bitir)
  clearTimeout(gameState.comboTimeout);
  gameState.comboTimeout = setTimeout(() => {
    gameState.comboCount = 0;
    gameState.comboMultiplier = 1;
    updateUI();
  }, 1200);

  updateUI();
}

// === 2. BOSS DÖYÜŞÜ VƏ SINAQLAR ===
function startBossFight() {
  if (gameState.bossActive) return;

  gameState.bossActive = true;
  gameState.bossMaxHp = Math.floor(100 * Math.pow(1.8, Math.floor(gameState.score / 1000) + 1));
  gameState.bossHp = gameState.bossMaxHp;
  gameState.bossTimer = 15;

  console.log("🔥 BOSS DÖYÜŞÜ BAŞLADI!");

  gameState.bossInterval = setInterval(() => {
    gameState.bossTimer--;
    if (gameState.bossTimer <= 0) {
      endBossFight(false);
    }
    updateUI();
  }, 1000);

  updateUI();
}

function hitBoss() {
  const damage = gameState.clickPower * gameState.comboMultiplier;
  gameState.bossHp -= damage;

  if (gameState.bossHp <= 0) {
    endBossFight(true);
  }
  updateUI();
}

function endBossFight(isWin) {
  clearInterval(gameState.bossInterval);
  gameState.bossActive = false;

  if (isWin) {
    const reward = gameState.bossReward + Math.floor(gameState.score * 0.2);
    gameState.score += reward;
    alert(`🎉 TƏBRİKLƏR! Bossu məğlub etdiniz və ${reward} xal mükafat qazandınız!`);
  } else {
    alert("❌ Vaxt bitdi! Bossu məğlub edə bilmədiniz.");
  }
  updateUI();
}

// === 3. DİNAMİK SCALING UPGRADE SİSTEMİ ===
function buyUpgrade(type) {
  const up = gameState.upgrades[type];
  if (!up) return;

  // Dinamik Qiymət Hesablanması (Non-linear cost)
  const currentCost = Math.floor(up.baseCost * Math.pow(up.costMultiplier, up.count));

  if (gameState.score >= currentCost) {
    gameState.score -= currentCost;
    up.count++;

    // Hər 10-cu səviyyədə Sıçrayışlı Güclənmə (Milestone Bonus)
    let milestoneBonus = up.count % 10 === 0 ? 2.5 : 1;

    if (type === 'clickBoost') {
      gameState.clickPower += up.power * milestoneBonus;
    } else {
      gameState.passiveIncome += up.power * milestoneBonus;
    }

    updateUI();
  } else {
    alert("Kifayət qədər xalınız yoxdur!");
  }
}

// === PASSİV QAZANC TAYMERİ ===
setInterval(() => {
  if (gameState.passiveIncome > 0) {
    gameState.score += gameState.passiveIncome / 10; // Hər 100ms-dən bir
    updateUI();
  }
}, 100);

// === İNTERFEYSİN YENİLƏNMƏSİ (UI UPDATE) ===
function updateUI() {
  if (scoreEl) scoreEl.innerText = Math.floor(gameState.score);
  if (clickPowerEl) clickPowerEl.innerText = gameState.clickPower;
  if (passiveEl) passiveEl.innerText = gameState.passiveIncome.toFixed(1);

  if (comboEl) {
    comboEl.innerText = gameState.comboCount > 1 
      ? `Combo: x${gameState.comboMultiplier} (${gameState.comboCount} klik)` 
      : '';
  }

  // Boss statusunu ekranda göstərmək üçün
  const bossStatusEl = document.getElementById('boss-status');
  if (bossStatusEl) {
    if (gameState.bossActive) {
      bossStatusEl.innerHTML = `
        <div style="color: #ff2a55; font-weight: bold; margin-top: 10px;">
          👹 BOSS HP: ${Math.max(0, gameState.bossHp)} / ${gameState.bossMaxHp} | ⏱️ Vaxt: ${gameState.bossTimer}s
        </div>
      `;
    } else {
      bossStatusEl.innerHTML = '';
    }
  }
}

// Düymə dinləyicisi (EventListener)
if (clickBtn) {
  clickBtn.addEventListener('click', registerClick);
}
// Reklam düyməsi üçün dəyişən
const adBtn = document.getElementById('watch-ad-btn');

// Adsgram reklam mexanikasını başlatmaq funksiyası
const adController = window.Adsgram.init({ blockId: '52079' });

adBtn.addEventListener('click', () => {
    adController.show()
        .then((result) => {
            if (result.done) {
                // Reklam uğurla izlənildikdə bal əlavə olunur
                gameState.score += 1;
                updateUI();
                alert('Təbriklər! 1 HAZEL qazandınız.');
            } else {
                // Reklam yarımçıq dayandıqda
                alert('Reklamı sona qədər izləmədiyiniz üçün mükafat ala bilmədiniz.');
            }
        })
        .catch((err) => {
            console.error('Reklam göstərilərkən xəta baş verdi:', err);
        });
});
