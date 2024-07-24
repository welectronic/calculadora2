document.addEventListener('DOMContentLoaded', () => {
    const calculatorInstance = new Calculator(new Display());

    const buttonElements = document.querySelectorAll('.button');
    buttonElements.forEach(buttonElement => {
        const value = buttonElement.getAttribute('data-value');
        new Button(buttonElement,() => calculatorInstance.pressButton(value) );
    });
    
}

)