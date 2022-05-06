let admin = false;
let botonLogin = document.getElementById("botonLogin")
const botones = [{ id: 2, nombre: "Cargar productos" }, { id: 3, nombre: "Eliminar producto" }, { id: 4, nombre: "Actualizar producto" }]


//Funcion para generar tabla de productos
function mostrarProductos(input) {

    if (input.length == 0) {
        const renderTabla = Handlebars.compile(`<div class="alerta alert alert-warning" role="alert">
        No existen productos cargados
      </div>`)
        document.getElementById("listaProd").innerHTML = renderTabla()
    } else {
        const renderTabla = Handlebars.compile(`
        <h2>Listado de productos</h2>
        <div id="cartasHTML" class="cards grid row text-dark">
        {{#each productos}}
            <div class="card" style="width: 18rem; margin: 5px" >
                <img class="card-img-top" src="{{this.thumbnail}}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">{{this.nombre}}</h5>
                    <p class="card-text">{{this.descripcion}}</p>
                    <p class="card-text">$ {{this.precio}}</p>
                    <button id="bdProd{{this.id}}" class="botonCards btn btn-primary">Agregar al carrito</button>
                    <input type="number" class="inputsCards col-auto me-auto" style="margin: 5px;" id="ndCarrito{{this.id}}"></input>
                </div>
            </div>
        {{/each}}
        </div>
        `)
        document.getElementById("listaProd").innerHTML = renderTabla({
            productos: input
        })
    }
}

function generarBotones() {
    if (admin) {
        const renderBotones = Handlebars.compile(`
            {{#each botones}}
                <button id="boton{{this.id}}" class="btn btn-primary">{{this.nombre}}</button>
            {{/each}}
            
            `)
        document.getElementById("login").innerHTML = renderBotones({
            botones: botones
        })
    } else {
        const renderBotones = Handlebars.compile(`
            <button id="botonLogin" class="btn btn-primary">Login</button>
            `)
        document.getElementById("login").innerHTML = renderBotones({
            botones: botones
        })
    }
}


const campos = [
    { nombreCampo: "Nombre Producto", type: "text", name: "nombre" },
    { nombreCampo: "Descripción", type: "text", name: "descripcion" },
    { nombreCampo: "Codigo", type: "number", name: "codigo" },
    { nombreCampo: "URL Imagen", type: "text", name: "thumbnail" },
    { nombreCampo: "Precio", type: "number", name: "precio" },
    { nombreCampo: "Stock", type: "number", name: "stock" }
]




function generarFormCarga() {
    const renderForm = Handlebars.compile(`<h2>Ingrese nuevo producto</h2>
        <br>
        <div class="principal">
            <form id="formDeCarga" action="/api/productos" method="post" class="row gx-4 gy-4">
                {{#each productos}}
                <div class="entradas col-md-4">
                    <input id="input{{this.name}}" class="form-control" type="{{this.type}}" name="{{this.name}}" placeholder="{{this.nombreCampo}}" required="required">
                </div>
                {{/each}}
                <br>
                <div class="col-12 justify-items-center">
                    <button type="submit" id="botonEnviar" class="btn btn-primary">Cargar</button>
                </div>
            </form>
        </div>`)
    document.getElementById("insForm").innerHTML = renderForm({
        productos: campos
    })
}

function generarFormActualizacion() {
    const renderForm = Handlebars.compile(`<h2>Complete campos a actualizar</h2>
        <br>
        <div id="selectorProd"></div>
        <br>
        <div class="principal">
            <form id="formDeActualizacion" class="row gx-4 gy-4">
                {{#each productos}}
                <div class="entradas col-md-4">
                    <input id="input{{this.name}}" class="form-control" type="{{this.type}}" name="{{this.name}}" placeholder="{{this.nombreCampo}}">
                </div>
                {{/each}}
                <br>
                <div class="col-12 justify-items-center">
                    <button id="botonActualizar" class="btn btn-primary">Actualizar</button>
                </div>
            </form>
        </div>`)
    document.getElementById("insForm").innerHTML = renderForm({
        productos: campos
    })
    fetch(`/api/productos/`, { method: "get" })
        .then(res => res.json())
        .then(data => {
            const productos = JSON.parse(data)
            let idsDisponibles = []
            for (elements of productos) {
                idsDisponibles.push({ "id": elements.id, "nombre": elements.nombre })
            }
            let idsOrdenados = idsDisponibles.sort(function (a, b) { return a - b })


            return [productos, idsOrdenados]
        }
        )
        .then(([productos, idsOrdenados]) => {

            const renderForm = Handlebars.compile(`<h5>Seleccione el producto a actualizar</h5> <select class="form-control col-md-4" id="seleccionA"><br>
            {{#each id}}
                <option value="{{this.id}}">{{this.nombre}}</option>
            {{/each}}
            </select>
            `)
            document.getElementById("selectorProd").innerHTML = renderForm({ id: idsOrdenados })
            return
        })
}

function eliminarProducto() {
    fetch(`/api/productos/`, { method: "get" })
        .then(res => res.json())
        .then(data => {
            const productos = JSON.parse(data)
            let idsDisponibles = []
            for (elements of productos) {
                idsDisponibles.push({ "id": elements.id, "nombre": elements.nombre })
            }
            let idsOrdenados = idsDisponibles.sort(function (a, b) { return a - b })


            return [productos, idsOrdenados]
        }
        )
        .then(([productos, idsOrdenados]) => {

            const renderForm = Handlebars.compile(`<h2>Eliminar producto</h2><br>
            <p>Seleccionar producto a eliminar:<p> <select class="form-control col-md-4" id="seleccion3">
            {{#each id}}
                <option value="{{this.id}}">{{this.nombre}}</option>
            {{/each}}
            </select>
            <button id="botonelimProd" class="btn btn-primary">Eliminar</button>
            `)
            document.getElementById("insForm").innerHTML = renderForm({ id: idsOrdenados })
            return
        })
        .then(() => {
            elimProd = document.getElementById("botonelimProd")
            elimProd.addEventListener("click", e => {
                e.preventDefault()
                const inputIDelement = document.getElementById("seleccion3").value
                fetch(`/api/productos/${inputIDelement}`, { method: "delete" })
                    .then(res => res.json())
                    .then(data => alert(data))
            })
        })
}

let cartas;
let arrayBotonCarrito = [];
let elementosCartas = [];
//Fetch para generar vista de productos
function armarListado() {
    fetch(`/api/productos/`, { method: "get" })
    .then(res => res.json())
    .then(data => {
        const productos = JSON.parse(data)
        let idsDisponibles = []
        for (elements of productos) {
            idsDisponibles.push({ "id": elements.id, "nombre": elements.nombre })
        }
        let idsOrdenados = idsDisponibles.sort(function (a, b) { return a - b })


        return [productos, idsOrdenados]
    }
    )
    .then(([productos, idsOrdenados]) => {

        const renderForm = Handlebars.compile(`
        <h2>Buscar productos</h2>
        <div class="row row-cols-lg-auto">
            <div style="padding-top: 9px; padding-left: 17px;"> 
            <h6>Buscar producto:</h6> 
            </div>

            <div>
            <select class="form-control" id="seleccion">
            {{#each id}}
            <option value="{{this.id}}">{{this.nombre}}</option>
            {{/each}}
            <option value="">Todos</option>
            </select>
            </div>
            
            <div>
            <button id="verProd" class="btn btn-primary">Ver</button>
            </div>
        </div>
        `)
        document.getElementById("pedirProducto").innerHTML = renderForm({ id: idsOrdenados })
        return
    })
    .then(() => {
        const solicitarProducto = document.getElementById("verProd")
        solicitarProducto.addEventListener("click", e => {
            e.preventDefault()
            const inputIDelement = document.getElementById("seleccion").value
            fetch(`/api/productos/${inputIDelement}`, { method: "get" })
                .then(res => res.json())
                .then(data => {
                    let productos;
                    if (inputIDelement === "") {
                        productos = JSON.parse(data)
                    } else {
                        productos = [JSON.parse(data)]
                    }
                    mostrarProductos(productos)
                    return productos
                })
                .then((productos)=>{
                    console.log(productos)
                    cartas = document.getElementsByClassName("botonCards")
                    
                    console.log(cartas)
                    for (let i=0;cartas.length;i++){
                        cartas[i].addEventListener("click",e=>{
                            console.log(`se hizo click en ${cartas[i].id}`)
                            const idProd = parseInt((cartas[i].id).substring(6,7))
                            console.log(idProd)
                            const idagregaraCarrito = document.getElementById(`ndCarrito${idProd}`)
                            console.log("se debe agregar al carrito")
                            console.log(parseInt(`${idagregaraCarrito.value}`))
                            const iddeCarrito = idagregaraCarrito.value
                            const postID = {id: idProd}
                            console.log(iddeCarrito)
                            if(iddeCarrito){
                                fetch(`/api/carrito/${iddeCarrito}/productos`,
                                {
                                    method: "POST",
                                    body: JSON.stringify(postID),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(res=>res.json())
                                .then(data=>{
                                    console.log(data)
                                    const mensajes1 = JSON.parse(data)
                                    alert(`${mensajes1.msg}`)
                                })
                            }else{
                                alert("Ingrese un valor de ID de carrito")
                            }

                            
                        })
                    }
                    
                    
                
                })
        })

    })

}

armarListado()


botonLogin.addEventListener("click", e => {
    admin = true //Forzado el administrador
    generarBotones()

    botonCarga = document.getElementById("boton2")
    botonCarga.addEventListener("click", e => {
        console.log("cargar producto")
        generarFormCarga()
    })

    botonEliminar = document.getElementById("boton3")
    botonEliminar.addEventListener("click", e => {
        console.log("elminar producto")
        eliminarProducto()
    })

    botonActualizar = document.getElementById("boton4")
    botonActualizar.addEventListener("click", e => {
        console.log("actualizar producto")
        generarFormActualizacion()
        botonenviarAct = document.getElementById("botonActualizar")
        botonenviarAct.addEventListener("click", e => {
            e.preventDefault()
            const update = {
                nombre: document.getElementById("inputnombre").value,
                descripcion: document.getElementById("inputdescripcion").value,
                codigo: document.getElementById("inputcodigo").value,
                thumbnail: document.getElementById("inputthumbnail").value,
                precio: document.getElementById("inputprecio").value,
                stock: document.getElementById("inputstock").value
            }
            console.log(JSON.stringify(update))
            fetch(`/api/productos/${document.getElementById("seleccionA").value}`, {
                method: "PUT",
                body: JSON.stringify(update),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res=>res.json())
            .then(data => {
                const mensajes2 = JSON.parse(data)
                alert(mensajes2.msg)
            })
        })
    })

})

