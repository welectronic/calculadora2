let botones = document.getElementsByClassName("button");
let botonesArray = Array.from(botones);

botonesArray.forEach(element => {
    // adicionar una accion al evento click
    element.addEventListener("mouseover", eventoBoton);
});


function eventoBoton() {
    console.log("se ha pulsado el boton con valor " + this.dataset.value);
}