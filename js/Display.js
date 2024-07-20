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
        if(this.currentValue === '0') {
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
