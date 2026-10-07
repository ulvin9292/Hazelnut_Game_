​let balance = parseFloat(localStorage.getItem('coin_balance')) || 0;
​const coinButton = document.getElementById('hzcoin');
​const balanceDisplay = document.getElementById('balance-display');
​coinButton.addEventListener('click', () => { balance += 1; balanceDisplay.textContent = balance.toFixed(4); localStorage.setItem('coin_balance', balance); });
