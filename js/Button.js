class Button {
    constructor(element, action) {
        this.element = element;
        this.action = action;
        this.init();
    }

    init() {
        this.element.addEventListener('click', () => {
            this.onClick();
        });
    }

    onClick(){
        this.action();
    }
}
