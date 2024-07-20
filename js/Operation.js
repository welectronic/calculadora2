// interfaz operacion

class Operation {
    constructor() {
        if (this.constructor === Operation) {
            throw new Error("No se puede instanciar la clase abstracta Operation");
        }
    }

    execute(value1, value2) {
        throw new Error("Método abstracto execute() debe ser implementado");
    }
}
