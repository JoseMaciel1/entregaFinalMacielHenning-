
// es la key que uso para localStorage
const KEY_CARRITO = "carrito"

// esta variable no esta inicalizada aun porque tendra los datos con los resultados del fetch
let preciosDestinos;

// crea el objeto de mi precio destino
const precioDestino = function (pais, alojamiento, precio) {

    this.pais = pais
    this.alojamiento = alojamiento
    this.precio = precio
}

// transforma la data el json en una lista de precioDestino
function transformarPrecioDestino(data) {
    const { destinos } = data

    // transforma un array de arrays en preciosDestinos   
    const preciosDestinos = destinos.map((arr) => {
        const [pais, hotel, precio] = arr
        return new precioDestino(pais, hotel, precio)
    })
    return preciosDestinos
}

// utiliza el fetch para traer los datos del json 
function cargarDatos() {

    fetch('./data.json')
        .then(response => response.json())
        .then(transformarPrecioDestino)

        //incializamos preciosDestinos con los datos del json
        //termina el estado de loading(estado por defecto)
        .then((_preciosDestinos) => {
            preciosDestinos = _preciosDestinos
            document.getElementById("loading").style.display = "none";
            document.querySelector("main").style.display = "grid";
        })
        .catch(error => console.log(error));
}

const form = document.getElementById("formId");
//interrumpimos el submit del formulario para buscar alojamientos
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const input = document.getElementById("seleccionDestino").value

    if (input.trim() !== "") {
        buscarAlojamientos();
    }
})

// 
function buscarAlojamientos() {

    const input = document.getElementById("seleccionDestino").value

    //cambia todo a mayuscula y borra los espacios para garantizar que busque independientemete de si esta en mays o min.
    const destinoSeleccionado = input.trim().toUpperCase()

    const lugares = preciosDestinos.filter((precioDestino) => {

        //si el pais en mayuscula incluye el texto del usuario
        return precioDestino.pais.toUpperCase().includes(destinoSeleccionado)
    })

    const listaResultados = document.getElementById("resultados")
    listaResultados.innerHTML = ""


    //si la busqueda tuvo resultados los muestra 
    if (lugares.length > 0) {
      mostrarLugaresEncontrados(lugares, listaResultados)
    } else {
        listaResultados.innerHTML = "<p>No se encontraron resultados.</p>"
    }
}

// muetra al usario los luagres encontrados de su busqueda
function mostrarLugaresEncontrados(lugares, listaResultados) {

    lugares.forEach((precioDestino) => {
        const item = document.createElement("li")
        const titulo = document.createElement("h2")

        const textContent = document.createTextNode(precioDestino.pais)
        titulo.appendChild(textContent)

        const alojamiento = document.createElement("p")
        alojamiento.textContent = `Alojamiento: ${precioDestino.alojamiento}`

        const precio = document.createElement("p")
        precio.textContent = `Precio: ${"$" + precioDestino.precio + " USD"} `

        item.appendChild(titulo)
        item.appendChild(alojamiento)
        item.appendChild(precio)
        listaResultados.appendChild(item)

        const seleccionarButton = document.createElement("button")
        seleccionarButton.textContent = "Seleccionar este hotel"
        seleccionarButton.addEventListener("click", () => clickSeleccion(precioDestino));
        item.appendChild(seleccionarButton)
    })
}


// muestra los iteams del carrito que esta en el local storage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem(KEY_CARRITO)

    //si el carrito no existe devuelve array vacio sino parsea el array guardado como stirng
    const carrito = (carritoGuardado === null) ? [] : JSON.parse(carritoGuardado)

    //termina la ejecucion cuando no hay nada que mostrar
    if (carrito.length === 0) return

    document.getElementById("botonVaciarCarrito").removeAttribute("disabled"); //habilita el boton

    //agrego los items al carrito
    const itemsCarrito = document.getElementById("itemsCarrito")
    carrito.forEach((item) => {

        const li = document.createElement("li")
        li.innerText = item
        itemsCarrito.appendChild(li)
    })
}

//agrega el destino a los destinos del carrito
function seleccionarDestino(seleccion) {

    // guarda en localstorage 
    const carritoGuardado = localStorage.getItem(KEY_CARRITO)

    //si el carrito no existe devuelve array vacio sino parsea el array guardado como stirng
    const carrito = (carritoGuardado === null) ? [] : JSON.parse(carritoGuardado)

    //creamos un nuevo array con lo que habia en el carrito y lo nuevo seleccionado por el usuario
    const nuevoCarrito = [...carrito, seleccion]

    //convertimos en string el array y lo guardamos en el local storage
    localStorage.setItem(KEY_CARRITO, JSON.stringify(nuevoCarrito))

    //agrega el item al carrito de la ui
    document.getElementById("TextoCarritoVacio").style.display = "none"; //oculta el texto de carrito vacio

    const itemsCarrito = document.getElementById("itemsCarrito")

    const li = document.createElement("li")
    li.innerText = seleccion
    itemsCarrito.appendChild(li)
}

function clickSeleccion(precioDestino) {

    const valorSeleccionado = document.getElementById("transporte")
    const tipoTransporte = valorSeleccionado.value
    const costoTransporteAvion = 220
    const costoTransporteOmnibus = 95
    let costoTransporte

    tipoTransporte == "avion" ? costoTransporte = costoTransporteAvion : costoTransporte = costoTransporteOmnibus


    const costoFinal = costoTransporte + precioDestino.precio

    seleccionarDestino(`Hotel: ${precioDestino.alojamiento} y el costo total es ${costoFinal}  `)

    document.getElementById("botonVaciarCarrito").removeAttribute("disabled")
    Toastify({
        text: "Alojamiento seleccionado",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { }
    }).showToast();
}

function vaciarCarrito() {

    localStorage.removeItem(KEY_CARRITO)

    const itemsCarrito = document.getElementById("itemsCarrito")


    while (itemsCarrito.firstChild) {
        itemsCarrito.removeChild(itemsCarrito.lastChild);
    }
    document.getElementById("TextoCarritoVacio").style.display = "block";
    document.getElementById("botonVaciarCarrito").setAttribute("disabled", true)
}

//simula que la pagina tarda en cargar (prueba de concepto )
setTimeout(()=>{
    cargarDatos()
    cargarCarrito()
}, 3000)
