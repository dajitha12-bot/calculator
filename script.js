class Calculator {
    constructor() {
        this.display = document.getElementById('result');
        this.historyElement = document.getElementById('history');
        this.currentInput = '0';
        this.shouldResetDisplay = false;
        this.calculationHistory = [];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Button click events
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                const action = button.getAttribute('data-action');
                
                if (value) {
                    this.appendToDisplay(value);
                } else if (action) {
                    this.handleAction(action);
                }
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
    }
    
    updateDisplay() {
        this.display.textContent = this.currentInput;
    }
    
    appendToDisplay(value) {
        if (this.currentInput === '0' || this.shouldResetDisplay) {
            this.currentInput = value;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput += value;
        }
        this.updateDisplay();
    }
    
    handleAction(action) {
        switch(action) {
            case 'clear':
                this.clearDisplay();
                break;
            case 'delete':
                this.deleteLast();
                break;
            case 'calculate':
                this.calculate();
                break;
        }
    }
    
    clearDisplay() {
        this.currentInput = '0';
        this.updateDisplay();
    }
    
    deleteLast() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    calculate() {
        try {
            // Replace × with * for evaluation
            let expression = this.currentInput.replace(/×/g, '*');
            
            // Validate expression to prevent security issues
            if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
                throw new Error('Invalid expression');
            }
            
            let result = eval(expression);
            
            // Format the result to avoid long decimals
            if (Number.isInteger(result)) {
                this.currentInput = result.toString();
            } else {
                this.currentInput = parseFloat(result.toFixed(10)).toString();
            }
            
            // Add to history
            this.addToHistory(expression, this.currentInput);
            
            this.updateDisplay();
            this.shouldResetDisplay = true;
        } catch (error) {
            this.currentInput = 'Error';
            this.updateDisplay();
            this.shouldResetDisplay = true;
        }
    }
    
    addToHistory(expression, result) {
        this.calculationHistory.unshift({expression, result});
        if (this.calculationHistory.length > 5) {
            this.calculationHistory.pop();
        }
        
        this.historyElement.innerHTML = '';
        this.calculationHistory.forEach(item => {
            let historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${item.expression} = ${item.result}`;
            this.historyElement.appendChild(historyItem);
        });
    }
    
    handleKeyboardInput(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            this.appendToDisplay(key);
        } else if (key === '.') {
            this.appendToDisplay('.');
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            this.appendToDisplay(key);
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clearDisplay();
        } else if (key === 'Backspace') {
            this.deleteLast();
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
