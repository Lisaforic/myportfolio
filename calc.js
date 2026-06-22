// ---------- DOM REFS ----------
const display = document.getElementById('display');
const historyEl = document.getElementById('history');

let lastResult = null;
let historyStack = [];

// ---------- APPEND VALUE ----------
function appendValue(value) {
    const current = display.value;

    // Prevent multiple operators in a row
    const operators = ['+', '-', '*', '/', '%'];
    if (operators.includes(value) && operators.includes(current.slice(-1))) {
        display.value = current.slice(0, -1) + value;
        return;
    }

    // Prevent leading zeros
    if (value === '0' && current === '0') return;
    if (value === '.' && current.includes('.')) return;

    display.value += value;
}

// ---------- CLEAR ----------
function clearDisplay() {
    display.value = '';
    historyEl.textContent = '';
    lastResult = null;
}

// ---------- DELETE LAST ----------
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// ---------- CALCULATE ----------
function calculate() {
    const expression = display.value.trim();

    if (!expression) {
        display.value = '0';
        return;
    }

    try {
        // Replace visual operators with JS equivalents
        let sanitized = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

        // Handle percentage: convert "200+10%" → "200+200*0.1"
        sanitized = sanitized.replace(/(\d+)%/g, (match, num) => {
            return `(${num} * 0.01)`;
        });

        // Evaluate safely
        const result = Function(`"use strict"; return (${sanitized})`)();

        if (typeof result !== 'number' || !isFinite(result)) {
            display.value = 'Error';
            historyEl.textContent = 'Invalid operation';
            return;
        }

        const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

        // Store history
        historyEl.textContent = `${expression} = ${formatted}`;
        historyStack.push({ expression, result: formatted });

        display.value = formatted;
        lastResult = formatted;

    } catch (error) {
        display.value = 'Error';
        historyEl.textContent = 'Syntax error';
        console.warn('Calculation error:', error.message);
    }
}

// ---------- KEYBOARD SUPPORT ----------
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Prevent default for calculator keys
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%', 'Enter', 'Backspace', 'Escape', 'Delete'];
    if (!validKeys.includes(key)) return;

    e.preventDefault();

    if (key === 'Enter') {
        calculate();
        return;
    }

    if (key === 'Backspace' || key === 'Delete') {
        deleteLast();
        return;
    }

    if (key === 'Escape') {
        clearDisplay();
        return;
    }

    // Map visual keys
    let mappedKey = key;
    if (key === '*') mappedKey = '*';
    if (key === '/') mappedKey = '/';

    appendValue(mappedKey);
});

// ---------- AUTO-FOCUS (desktop) ----------
window.addEventListener('load', () => {
    display.focus();
    // Clicking anywhere on calc focuses display
    document.querySelector('.calculator').addEventListener('click', () => {
        display.focus();
    });
});

// ---------- PREVENT ILLEGAL INPUTS ----------
display.addEventListener('keydown', (e) => {
    const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%', 'Enter', 'Backspace', 'Delete', 'Escape', 'ArrowLeft', 'ArrowRight'];
    if (!allowed.includes(e.key)) {
        e.preventDefault();
    }
});