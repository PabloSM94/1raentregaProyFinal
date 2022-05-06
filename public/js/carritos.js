let botonCarritos = document.getElementById("botonCarritos")
const botonesCarrito = [{ id: 1, nombre: "Crear carrito" }, { id: 2, nombre: "Vaciar carrito por ID" }, { id: 3, nombre: "Ver productos de carrito" },{ id: 5, nombre: "Borrar productos de carrito"}]

botonCarritos.addEventListener("click", e=>{
    e.preventDefault()
    generarBotones2()
    botonCrear = document.getElementById("boton1")
    botonVaciar = document.getElementById("boton2")
    botonVisualizar = document.getElementById("boton3")
    botonBorrarProductoDCarrito = document.getElementById("boton5")
    botonIraProductos = document.getElementById("boton6")
    ///------------------------
    botonCrear.addEventListener("click",e=>{
        fetch("/api/carrito",{method:"post"})
        .then(res => res.text())
        .then(data => alert(data))
    })
    //---------------------------
    botonVisualizar.addEventListener("click",e=>{
        const idCarrito = document.getElementById("idCarrito").value
        fetch(`/api/carrito/${idCarrito}/productos`,{method:"get"})
        .then(res => res.json())
        .then(data => {
            productosdecarrito = JSON.parse(data)
            console.log(productosdecarrito)
            if(productosdecarrito.status === `error404${idCarrito}`){
                const renderProdCarr = Handlebars.compile(`
                <h1>No existe carrito ID ${idCarrito}</h1>
                `)
                document.getElementById("respuesta").innerHTML = renderProdCarr({
                    productos: productosdecarrito
                })
            }else{

            const renderProdCarr = Handlebars.compile(`
            <h1>Productos de carrito ID ${idCarrito}</h1>
            <div class="cards grid row text-dark">
            {{#each productos}}
            <div class="card" style="width: 18rem; margin: 5px;" >
                <img class="card-img-top" src="{{this.thumbnail}}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">{{this.nombre}}</h5>
                    <p class="card-text">{{this.descripcion}}</p>
                    <p class="card-text">$ {{this.precio}}</p>
                </div>
            </div>
            {{/each}}
            </div>
            `)
            document.getElementById("respuesta").innerHTML = renderProdCarr({
                productos: productosdecarrito
            })
        }
        })
        

    })
    /////////////////////------------------------------
    botonIraProductos.addEventListener("click",e=>{
        console.log("redirigir a productos")
        location.reload("/")
    })

    //------------------------
    botonVaciar.addEventListener("click",e=>{
        const idCarrito = document.getElementById("idCarrito").value
        console.log(idCarrito)
        fetch(`/api/carrito/${idCarrito}`,{method:"delete"})
        .then(res=>res.json())
        .then(data=>{
            const respuestaJSON = JSON.parse(data)
            document.getElementById("respuesta").innerHTML = `${respuestaJSON.msg}`
        })
    })
    //-----------------
    botonBorrarProductoDCarrito.addEventListener("click",e=>{
        const idCarrito = document.getElementById("idCarrito").value
        const idProducto = document.getElementById("idProducto").value
        console.log("trato de borrar")
        fetch(`/api/carrito/${idCarrito}/productos/${idProducto}`,{method:"delete"})
        .then(res=>res.json())
        .then(data=>{
            const respuestaJSON = JSON.parse(data)
            document.getElementById("respuesta").innerHTML = `${respuestaJSON.msg}`
        })
    })
})

function generarBotones2() {
    if (admin) {
        const renderBotones = Handlebars.compile(`
        <h1>Administrador de Carritos</h1>
        <div id="botonesdeAccesos" class="flex row">    
            <div class="col-auto me-auto" style="margin: 5px;" id="carritosLogin">
            {{#each botones}}
                <button id="boton{{this.id}}" class="btn btn-warning">{{this.nombre}}</button>
            {{/each}}
                <button id="boton6" class="btn btn-primary">Ir a productos</button>
            </div>
        </div>
        
        <div id="cuerpo">
        <div>
            <form id="identificadores" action="">
            Indique ID de carrito<input id="idCarrito" type="number" required="required"></input>
            Indique ID de producto<input id="idProducto" type="number"></input>
            </form>
        </div>
        <div id="respuesta">
        </div>
        </div>
            `)
        document.getElementById("principalMain").innerHTML = renderBotones({
            botones: botonesCarrito
        })
        document.getElementById("idCarrito").value = 1
        document.getElementById("idProducto").value = 1
    } else {
        alert("Debe ser administrador")
    }
}