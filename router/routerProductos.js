// El router base '/api/productos' implementará cuatro funcionalidades:

const express = require('express')
const { Router } = express
const fs = require('fs')

const app = express()
const routerP = Router()
const {carrito} = require('../public/js/constructores')
const {producto} = require('../public/js/constructores')

//const admin = true;
//Comprobacion de conjuntos vacios
function isObjEmpty(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
  
    return true;
  }


// GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
routerP.get('/productos/:id?', (req, res) => {
    const {params} = req

    let productoBuscado;
    let flag = 0;
    fs.promises.readFile("./public/productos.txt", "utf-8")
    .then (data =>{
        productos = JSON.parse(data)
        return productos
    })
    .then( productos => {
        
        if (params.id){
            for (prod of productos){
                if (prod.id == parseInt(params.id)){
                    productoBuscado = prod
                    flag = 1            
                }          
                }
            if (flag == 1){
                res.json(JSON.stringify(productoBuscado))
            }
            else{
                res.send(`No existe el id especificado en la base de datos`) 
                }
        }
        else{
            res.json(JSON.stringify(productos))
        }    
        }
    )
    
    
 })
// POST: '/' - Para incorporar productos al listado (disponible para administradores)

routerP.post('/productos/', (req, res) => {
    //permiso de administrador 
    const admin = true
    if (admin){
        console.log("modo administrador")
        const {body} = req
        //Cargo con fs listado de productos
        fs.promises.readFile("./public/productos.txt", "utf-8")
        .then (data =>{
            productos = JSON.parse(data)
            return productos
        })
        //Verifico id para asignar
        .then (productos => {
            let ids = [];
            for (elements of productos){
                ids.push(elements.id)
            }
            let idsOrdenados = ids.sort(function(a, b) {return a - b})
            //Asignar id en funcion de la memoria
            let identificador = 1;
            while (identificador == idsOrdenados[identificador-1]){
                identificador++
            }
            //Creo el objeto con los parametros del body
            const nuevoProd = new producto (identificador,body.nombre,body.descripcion,body.codigo,body.thumbnail,body.precio,body.stock)
            //Hago push sobre el listado del producto con mi nuevo producto
            productos.push(nuevoProd)
            //Guardo con fs listado nuevo de productos
            fs.promises.writeFile("./public/productos.txt",JSON.stringify(productos), "utf-8")
            // res.send(`Se cargo el producto id ${identificador}`)
            res.redirect("/")
        })
        

    }
    else{
        res.send(`Debes logearte como administrador`)
    }
})

// PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)

routerP.put('/productos/:id', (req, res) => {
    //permiso de administrador 
    const admin=true
    if (admin){
        const {params} = req
        const {body} = req
        console.log(body)
        let productoModificado;
        let flag = 0;
        //Modificacion de campos / Funcion local
        fs.promises.readFile("./public/productos.txt", "utf-8")
        .then (data =>{
            productos = JSON.parse(data)
            return productos
        })
        .then (productos => {
            for (product of productos){
                if (product.id == parseInt(params.id)){
                    //Ejecuto modificaciones
                    if (isObjEmpty(body.nombre)){
                    }else{product.nombre = body.nombre}
                    if (isObjEmpty(body.descripcion)){
                    }else{product.descripcion = body.descripcion}
                    if (isObjEmpty(body.codigo)){
                    }else{product.codigo = body.codigo}
                    if (isObjEmpty(body.thumbnail)){
                    }else{product.thumbnail = body.thumbnail}
                    if (isObjEmpty(body.precio)){
                    }else{product.precio = body.precio}
                    if (isObjEmpty(body.stock)){
                    }else{product.stock = body.stock}
                    productoModificado = JSON.stringify(product)
                    fs.promises.writeFile("./public/productos.txt",JSON.stringify(productos), "utf-8")
                    flag = 1
                }
            }
            if (flag == 1){
                res.json(JSON.stringify({ "status": `ok`,"msg":`Se modifico el producto`}))
            }
            else{
                res.json(JSON.stringify({ "status": `error404${params.id}`,"msg":`Error! el id: ${params.id} no se encuentra en la base de datos`}))
            }
        })
        

        console.log("login ok")
    }
    else{
        res.send(`Debes logearte como administrador`)
    }
})

// DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
routerP.delete('/productos/:id', (req, res) => {
    //permiso de administrador 
    const admin=true
    if (admin){
        console.log("login ok")
        const {params} = req
        let flag = 0;
        fs.promises.readFile("./public/productos.txt", "utf-8")
        .then (data =>{
            productos = JSON.parse(data)
            return productos
        })
        .then (productos => {
            for (product of productos){
                if (product.id == parseInt(params.id)){
                flag = 1         
                }          
            }
        
            if (flag == 1){
                let nuevoArraydeProductos = productos.filter((item) => item.id !== parseInt(params.id))
                fs.promises.writeFile("./public/productos.txt",JSON.stringify(nuevoArraydeProductos), "utf-8")
                res.send(JSON.stringify(`Se eliminó el producto con id: ${params.id}`))                
            }
            else {
                res.send(`Error! el id: ${params.id} no se encuentra en la base de datos`) 
            }
        })
    }
    else{
        res.send(`Debes logearte como administrador`)
    }
})

 module.exports = {routerP}
 
 