let score = 0;

const clickBtn = document.getElementById('click-btn');
const adBtn = document.getElementById('ad-btn');
const scoreDisplay = document.getElementById('score');

clickBtn.addEventListener('click', () => {
    score += 1;
    scoreDisplay.innerText = score;
});

adBtn.addEventListener('click', () => {
    // Burada reklam mexanizmini əlavə edə bilərsiniz
    score += 10;
    scoreDisplay.innerText = score;
});
function completeTask(reward, button) {
  state.score += reward;
  button.disabled = true;
  button.textContent = 'Tamamlandı';
  updateUI();
  saveGameData();
}
function updateWalletUI() {
  document.getElementById('holding-wallet').textContent = state.holding.toLocaleString();
  document.getElementById('pool-wallet').textContent = state.pool.toLocaleString();
}
