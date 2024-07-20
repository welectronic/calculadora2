class Division extends Operation {
    execute(value1, value2) {
        if (value2 === 0) {
            throw new Error("Division por 0 no está permitida");
        }
        return value1 / value2;
    }
}