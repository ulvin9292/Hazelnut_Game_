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
