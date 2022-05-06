let producto = class {
    constructor (id, nombre, descripcion, codigo, thumbnail, precio, stock){
        this.id = id
        this.timestamp = new Date().toLocaleString()
        this.nombre = nombre
        this.descripcion = descripcion
        this.codigo = codigo
        this.thumbnail = thumbnail
        this.precio = precio
        this.stock = stock
    }
}

let carrito = class {
    constructor (id, timestamp, productos){
        this.id = id
        this.timestamp = timestamp
        this.productos = productos
    }
}

module.exports = {producto,carrito}