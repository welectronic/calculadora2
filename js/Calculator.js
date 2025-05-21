class Calculator {
    constructor(display) {
        this.display = display;
        this.currentOperation = null;
        this.value1 = null;
        this.value2 = null;
        this.lastOperation = null;
        this.lastValue2 = null;
        this.justCalculatedByEquals = false; // For Bug 2
        this.updateClearButtonText("AC"); // Initial state
    }

    updateClearButtonText(text) {
        const clearButton = document.getElementById('clearButton');
        if (clearButton) {
            clearButton.textContent = text;
        }
    }

    pressButton(value){
        // Lógica para manejar los botones presionados
        const clearButton = document.getElementById('clearButton');

        switch (value) {
            case 'C':
                if (clearButton && clearButton.textContent === 'AC') {
                    this.allClear();
                } else {
                    this.clear();
                }
                break;
            case '+/-':
                this.toggleSign();
                break;
            case '%':
                this.percent();
                break;
            case '+':
                this.setOperation(new Addition());
                break;
            case '-':
                this.setOperation(new Substraction());
                break;
            case '*':
                this.setOperation(new Multiplication());
                break;
            case '/':
                this.setOperation(new Division());
                break;
            case '=':
                if (this.currentOperation) { // First press of '='
                    this.value2 = parseFloat(this.display.currentValue);
                    this.lastValue2 = this.value2;
                    this.lastOperation = this.currentOperation;
                    this.calculate();
                    // this.currentOperation remains for repeat
                } else if (this.lastOperation) { // Subsequent presses of '='
                    this.currentOperation = this.lastOperation;
                    this.value2 = this.lastValue2;
                    this.calculate();
                    // this.currentOperation remains for repeat
                }
                this.justCalculatedByEquals = true; // For Bug 2
                this.updateClearButtonText("AC");
                break;
            default: // Digits and decimal point
                if (this.display.currentValue === "Error") { // For Bug 3
                    this.display.clear(); // Clears "Error" to "0"
                    this.value1 = null;
                    this.currentOperation = null;
                    this.lastOperation = null;
                    this.lastValue2 = null;
                    // AC/C state is handled by the next block or by clearButton.textContent check
                }

                if (this.justCalculatedByEquals) { // For Bug 2
                    this.display.clear(); 
                    this.lastOperation = null; 
                    this.lastValue2 = null;
                    // value1 is the result on display, new input will naturally start a new value1
                    // currentOperation should be null if we just calculated by equals.
                    // If a user presses "5", then "=", then "5", currentOperation should be null before "5" is processed.
                    // The original check for `this.currentOperation === null` handles resetting lastOp/Val2.
                    // Let's ensure currentOperation is also reset here for clarity for new number inputs.
                    this.currentOperation = null; 
                }
                this.justCalculatedByEquals = false; // Reset flag after handling it

                // This block handles starting a new number if no operation is pending (e.g. after AC, or after C if no op was set)
                // OR if justCalculatedByEquals handled the state (currentOperation would be null).
                if (this.currentOperation === null) { 
                    // If display isn't "0" (e.g. from a previous result still showing but justCalculatedByEquals was false for some reason)
                    // and we are starting a new number, ensure display is clear.
                    // This is a bit of a safeguard; justCalculatedByEquals should handle most cases of previous results.
                    if (this.display.currentValue !== "0" && (this.value1 !== null && this.display.currentValue === this.value1.toString())) {
                         // This condition might be too specific if display.clear() was already called by justCalculatedByEquals
                         // The primary goal here is if we are starting a new number (no currentOp), reset repeat states.
                    }
                    this.lastOperation = null; // Redundant if justCalculatedByEquals was true, but safe.
                    this.lastValue2 = null;    // Redundant if justCalculatedByEquals was true, but safe.
                }
                
                if (clearButton && clearButton.textContent === 'AC') {
                    this.updateClearButtonText("C");
                }
                this.display.append(value);
                break;
        }
    }

    // "C" behavior: Clears current input, then sets button to AC.
    // Does not clear value1 or currentOperation if an operation is pending.
    clear() {
        this.display.update("0"); // Clear display to 0
        this.updateClearButtonText("AC");
        // If an operation is set, we were inputting value2, so only the display (value2) is cleared.
        // If no operation is set, we were inputting value1. value1 is effectively cleared by new input.
        // this.value2 = null; // Not strictly needed as new input will overwrite or calculation will use fresh display value
    }

    // "AC" behavior: Clears everything.
    allClear() {
        this.display.update("0");
        this.currentOperation = null;
        this.value1 = null;
        this.value2 = null;
        this.lastOperation = null;
        this.lastValue2 = null;
        this.justCalculatedByEquals = false; // For Bug 2 related state
        this.updateClearButtonText("AC");
    }


    setOperation(operation){
        if (this.display.currentValue === "Error") { // For Bug 4
            this.display.update("0"); 
            this.value1 = null; // Start fresh for value1
            this.currentOperation = null; // Ensure no lingering operation
            this.lastOperation = null;
            this.lastValue2 = null;
        }
        this.justCalculatedByEquals = false; // For Bug 2: new operation breaks equals chain

        if (this.currentOperation && this.value1 !== null && this.display.currentValue !== "0") {
            this.value2 = parseFloat(this.display.currentValue); 
            this.calculate();
        }
        // If value1 is null due to error handling, parseFloat("0") or current display if not error.
        this.value1 = parseFloat(this.display.currentValue); 
        this.currentOperation = operation;
        this.lastOperation = null;
        this.lastValue2 = null;
        this.display.clear();
        this.updateClearButtonText("AC");
    }

    calculate(){
        // value1 is already set (either from previous calculation or input)
        // currentOperation is set (either from an op button or restored for repeat equals)
        // value2 is set (either from display for first equals, or from lastValue2 for repeat)
        if (this.currentOperation === null || this.value1 === null || this.value2 === null) {
             // Added check for value2 as it's now explicitly set before calling calculate
            return;
        }

        // this.value2 is already set by the caller (pressButton for '=' or setOperation)
        // For the first press of '=', this.value2 is from display. For repeat, it's this.lastValue2.
        // For setOperation, this.value2 is from display.

        let result;
        try{
            result = this.currentOperation.execute(this.value1, this.value2);
        } catch (error){
            result = 'Error';
        }
        this.display.update(result.toString());
        // this.updateClearButtonText("AC"); // Moved to pressButton('=') or setOperation
        this.value1 = result; // Result becomes new value1 for next operation or repeat
        // DO NOT clear this.currentOperation or this.value2 here to allow for repeat equals
    }

    toggleSign(){
        let value = this.display.currentValue;
        if (value === '0' || value === 'Error') {
            return;
        }
        let numericValue = parseFloat(value);
        numericValue *= -1;
        this.display.update(numericValue.toString());
    }

    percent(){
        let value = this.display.currentValue;
        if (value === 'Error') {
            return;
        }
        let numericValue = parseFloat(value);
        numericValue /= 100;
        this.display.update(numericValue.toString());
    }
}
