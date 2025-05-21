class Display {
    constructor() {
        this.displayElement = document.getElementById('display');
        this.currentValue = '0'
    }

    update(value) {
        this.currentValue =value;
        this.render();
    }

    append(value) {
        if (value === '.' && this.currentValue.includes('.')) {
            return; // Do not append if it's a decimal point and one already exists
        }
        if (this.currentValue === '0' && value !== '.') { // Avoid "0." becoming "."
            this.currentValue = value;
        } else {
            this.currentValue += value;
        }
        this.render();
    }

    clear() {
        this.currentValue = '0';
        this.render();
    }

    render(){
        this.displayElement.textContent = this.currentValue
    }


}
