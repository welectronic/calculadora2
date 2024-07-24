class Calculator {
    constructor(display) {
        this.display = display;
        this.currentOperation = null;
        this.value1 = null;
        this.value2 = null;
    }

    pressButton(value){
        // Lógica para manejar los botones presionados
        switch (value) {
            case 'C':
                this.clear();
                break;
            case '+/-':
                this.toggleSign();
                break;
            case '%':
                this.percent();
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
                this.calculate();
                break;
            default:
                this.display.append(value);
                break;
        }
    }

    clear() {
        this.display.clear();
        this.currentOperation = null;
        this.value1 = null;
        this.value2 = null;
    }

    setOperation(operation){
        if (this.currentOperation) {
            this.calculate();
        }
        this.value1 = parseFloat(this.display.currentValue);
        this.currentOperation = operation;
        this.display.clear();
    }

    calculate(){
        if(!this.currentOperation || this.value1 === null) {
            return;
        }

        this.value2 = parseFloat(this.display.currentValue);
        let result;
        try{
            result = this.currentOperation.execute(this.value1, this.value2);
        } catch (error){
            result = 'Error';
        }
        this.display.update(result.toString());
        this.value1 = result;
        this.currentOperation = null;
        this.value2 = null;
    }

    toggleSign(){
        // opendiente de implementar
    }

    percent(){
        // pendiente de implementar
    }
}
