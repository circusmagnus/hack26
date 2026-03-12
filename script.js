document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');

    let currentInput = '';
    let operator = null;
    let previousInput = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('number')) {
                currentInput += value;
                display.textContent = currentInput;
            } else if (button.classList.contains('operator')) {
                previousInput = currentInput;
                operator = value;
                currentInput = '';
            } else if (button.classList.contains('equals')) {
                if (operator === '+') {
                    display.textContent = parseFloat(previousInput) + parseFloat(currentInput);
                } else if (operator === '-') {
                    display.textContent = parseFloat(previousInput) - parseFloat(currentInput);
                }
                currentInput = display.textContent;
                operator = null;
                previousInput = '';
            } else if (button.classList.contains('clear')) {
                currentInput = '';
                operator = null;
                previousInput = '';
                display.textContent = '0';
            }
        });
    });
});