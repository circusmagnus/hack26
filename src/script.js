// JavaScript for the kid-friendly calculator

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function resetCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    function handleNumber(number) {
        if (waitingForSecondOperand === true) {
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    const performCalculation = {
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand // For equals, just return the second operand if no prior operator
    };

    buttons.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('number')) {
            handleNumber(target.textContent);
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.dataset.operator);
            return;
        }

        if (target.classList.contains('clear')) {
            resetCalculator();
            return;
        }

        if (target.classList.contains('equals')) {
            handleOperator(target.dataset.operator); // Use handleOperator for equals as well
            operator = null; // Clear operator after equals
            return;
        }
    });

    // Initialize display
    updateDisplay();
});
