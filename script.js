​document.addEventListener('DOMContentLoaded', () => {
​if (window.Telegram && window.Telegram.WebApp) {
​const user = window.Telegram.WebApp.initDataUnsafe.user;
​if (user && user.first_name) {
​document.getElementById('user-name').textContent = user.first_name;
​}
​}
