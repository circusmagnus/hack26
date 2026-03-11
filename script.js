// JavaScript for the Counter App

let counter = 0;
const counterDisplay = document.getElementById('counter-display');
const incrementBtn = document.getElementById('increment-btn');

incrementBtn.addEventListener('click', () => {
    counter++;
    counterDisplay.textContent = counter;
});