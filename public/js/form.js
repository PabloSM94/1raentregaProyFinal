 //ejecución de handlebars
 const campos = [
    {nombreCampo: "Nombre Producto", type:"text", name:"title"},
    {nombreCampo: "Precio", type:"number", name:"price"},
    {nombreCampo: "URL Imagen", type:"text", name:"thumbnail"}
]

const renderForm = Handlebars.compile(`<h2>Ingrese nuevo producto</h2>
    <br>
    <div class="principal">
        <form class="row gx-4 gy-4">
            {{#each productos}}
            <div class="entradas col-md-4">
                <input id="input{{this.name}}" class="form-control" type="{{this.type}}" name="{{this.name}}" placeholder="{{this.nombreCampo}}">
            </div>
            {{/each}}
            <br>
            <div class="col-12 justify-items-center">
                <button id="botonEnviar" class="btn btn-primary">Cargar</button>
            </div>
        </form>
    </div>`)
document.getElementById("insForm").innerHTML = renderForm({
    productos: campos
})   