// JavaScript for the Counter App

let counter = 0;
const counterDisplay = document.getElementById('counter-display');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');

incrementBtn.addEventListener('click', () => {
    counter++;
    counterDisplay.textContent = counter;
});

decrementBtn.addEventListener('click', () => {
    counter--;
    counterDisplay.textContent = counter;
});