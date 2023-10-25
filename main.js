// Costo destino

const precioDestino = function (pais, alojamiento, precio) {

    this.pais = pais
    this.alojamiento = alojamiento
    this.precio = precio
}

let precioDestino1 = new precioDestino("Brasil", "Hotel Atlantico", 100)
let precioDestino2 = new precioDestino("Brasil", "Copacabana Design Hotel", 85)
let precioDestino3 = new precioDestino("Chile", "Sheraton", 125)
let precioDestino4 = new precioDestino("Chile", "Le Reve Boutique", 75)
let precioDestino5 = new precioDestino("Bolivia", "Hotel Palacio de Sal", 55)
let precioDestino6 = new precioDestino("Bolivia", "Hotel Atlantico", 94)
let precioDestino7 = new precioDestino("Uruguay", "Hyatt", 110)
let precioDestino8 = new precioDestino("Uruguay", "Alma Historica", 90)

let preciosDestinos = [precioDestino1, precioDestino2, precioDestino3,
    precioDestino4, precioDestino5, precioDestino6,
    precioDestino7, precioDestino8]


const form = document.getElementById("formId");
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const input = document.getElementById("seleccionDestino").value

    if (input.trim() !== "") {
        buscarAlojamiento();
    }
})

function buscarAlojamiento() {

    const input = document.getElementById("seleccionDestino").value
    const destinoSeleccionado = input.trim().toUpperCase()
    const lugares = preciosDestinos.filter((precioDestino) => precioDestino.pais.toUpperCase().includes(destinoSeleccionado))

    const listaResultados = document.getElementById("resultados")
    listaResultados.innerHTML = ""

    if (lugares.length > 0) {

        lugares.forEach((precioDestino) => {
            const item = document.createElement("li")
            const titulo = document.createElement("h2")


            const textContent = document.createTextNode(precioDestino.pais)
            titulo.appendChild(textContent)


            const alojamiento = document.createElement("p")
            alojamiento.textContent = `alojamiento: ${precioDestino.alojamiento}`

            const precio = document.createElement("p")
            precio.textContent = `precio: ${"$" + precioDestino.precio + " USD"} `

            item.appendChild(titulo)
            item.appendChild(alojamiento)
            item.appendChild(precio)
            listaResultados.appendChild(item)

            const seleccionarButton = document.createElement("button")
            seleccionarButton.textContent = "Seleccionar este hotel"
            seleccionarButton.addEventListener("click", () => {

                const valorSeleccionado = document.getElementById("transporte")
                const tipoTransporte = valorSeleccionado.value
                const costoTransporteAvion = 220
                const costoTransporteOmnibus = 95
                let costoTransporte
                if (tipoTransporte == "avion") {

                    costoTransporte = costoTransporteAvion
                } else {
                    costoTransporte = costoTransporteOmnibus
                }

                const costoFinal = costoTransporte + precioDestino.precio
                localStorage.setItem('paisSeleccionado', precioDestino.pais)
                localStorage.setItem('hotelSeleccionado', precioDestino.alojamiento)
                localStorage.setItem('costoFinal', costoFinal)

                listaResultados.innerHTML = `<p>Ustedes selecciono el Hotel: ${precioDestino.alojamiento} y el costo total es ${costoFinal}  </p>`

            });
            item.appendChild(seleccionarButton)
        })
    } else {
        listaResultados.innerHTML = "<p>No se encontraron resultados.</p>"
    }
}


