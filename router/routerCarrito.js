// El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:

const express = require('express')
const { Router } = express
const fs = require('fs')

const app = express()
const router = Router()
const {carrito} = require('../public/js/constructores')
const {producto} = require('../public/js/constructores')
let carritos;


// POST: '/' - Crea un carrito y devuelve su id.

router.post('/carrito', (req, res) => {
    fs.promises.readFile("./public/carritos.txt", "utf-8")
    .then (data =>{
        carritos = JSON.parse(data)
        return carritos
    })
    .then( carritos => {
        //Recorrer objeto con el fin de encontrar id faltante   
        let ids = [];
        for (elements of carritos){
            ids.push(elements.id)
        }
        let idsOrdenados = ids.sort(function(a, b) {return a - b})
        //Asignar id en funcion de la memoria
        let identificador = 1;
        while (identificador == idsOrdenados[identificador-1]){
            identificador++
        }
        //Crear carrito con id
        const nuevoCarrito = new carrito(identificador,new Date().toLocaleString(),[])
        //Agregar carrito a objeto de carritos
        carritos.push(nuevoCarrito)
        const carritosJSON = JSON.stringify(carritos)
        res.send(`El id asignado al nuevo carrito es ${identificador}`)
        return carritosJSON
    })
    .then( carritosJSON => {
        fs.promises.writeFile("./public/carritos.txt",carritosJSON, "utf-8")
        console.log(carritosJSON)
        })   
 })


// DELETE: '/:id' - Vacía un carrito y lo elimina.
router.delete('/carrito/:id', (req, res) => {
    const {params} = req
    let flag = 0;
    
    fs.promises.readFile("./public/carritos.txt", "utf-8")
    .then (data =>{
        carritos = JSON.parse(data)
        return carritos
    })
    .then (carritos => {
        for (carr of carritos){
            if (carr.id == parseInt(params.id)){
            flag = 1         
            }          
        }
        let nuevoArrayJSON;
        //Comprobacion de que exista elemento
        if (flag == 1){
            let nuevoArraydeCarritos = carritos.filter((carr) => carr.id !== parseInt(params.id))
            nuevoArrayJSON = JSON.stringify(nuevoArraydeCarritos)
            res.json(JSON.stringify({ "status": `ok`, "msg":`Carrito id${params.id} eliminado`})) 
        }
        else {
            res.json(JSON.stringify({ "status": `error404${params.id}`,"msg": "No existe el carrito, seleccione otro id"})) 
            nuevoArrayJSON = JSON.stringify(carritos)
        }
        return nuevoArrayJSON
    })
    .then( nuevoArrayJSON => {
        fs.promises.writeFile("./public/carritos.txt",nuevoArrayJSON, "utf-8")
        })
   
 })
// GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
router.get('/carrito/:id/productos', (req, res) => {
    const {params} = req
    let carritoBuscado;
    let flag = 0;
    fs.promises.readFile("./public/carritos.txt", "utf-8")
    .then (data =>{
        carritos = JSON.parse(data)
        return carritos
    })
    .then( carritos => {
        for (carr of carritos){
            if (carr.id == parseInt(params.id)){
                carritoBuscado = carr
                flag = 1            
            }          
            }
        if (flag == 1){
            productosDeCarrBuscado = carritoBuscado.productos
            res.json(JSON.stringify(productosDeCarrBuscado))
        }
        else{
            res.json(JSON.stringify({ "status": `error404${params.id}`})) 
            }
        }
    )
    
 })
// POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto

router.post('/carrito/:id/productos', (req, res) => {
    const {params} = req
    const {body} = req
    let carritoBuscado;
    let productoBuscado;
    let flag = 0;
    let flagP =0;
    fs.promises.readFile("./public/carritos.txt", "utf-8")
    .then (data =>{
        carritos = JSON.parse(data)
        return carritos
    })
    .then( carritos => {
        for (carr of carritos){
            if (carr.id == parseInt(params.id)){
                carritoBuscado = carr
                flag = 1            
            }          
            }
        if (flag == 1){
            fs.promises.readFile("./public/productos.txt", "utf-8")
            .then (datap =>{
                productos = JSON.parse(datap)
                return productos
            })
            .then (productos => {
                for (prod of productos){
                    if (prod.id == parseInt(body.id)){
                        productoBuscado = prod
                        flagP = 1            
                    }          
                    }
                if (flagP ==1){
                    carritoBuscado.productos.push(productoBuscado)
                    res.json(JSON.stringify({ "status": `ok`,"msg":`Se cargo producto en carrito ${params.id}`}))
                }
                else{
                    res.json(JSON.stringify({ "status": `error404${body.id}`,"msg":`Error! el producto id: ${body.id} no se encuentra en la base de datos`}))
                }
            })
            .then( resultado => {
                fs.promises.writeFile("./public/carritos.txt",JSON.stringify(carritos), "utf-8")
            })

        }
        else{
            res.json(JSON.stringify({ "status": `error404${params.id}`,"msg":`Error! el carrito id: ${params.id} no se encuentra en la base de datos`}))
            }
        }
    )
    
 })

// DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

router.delete('/carrito/:id/productos/:id_prod', (req, res) => {
    console.log("peticion de borrado")
    const {params} = req
    let flag = 0;
    let flagP =0;

    //Cargo carritos
    fs.promises.readFile("./public/carritos.txt", "utf-8")
    .then (data =>{
        carritos = JSON.parse(data)
        return carritos
    })
    //Busco carrito desado con params.id
    .then (carritos => {
        
        for (carr of carritos){
            if (carr.id == parseInt(params.id)){
                carritoBuscado = carr
                flag = 1            
            }          
            }
        if (flag == 1){
        //Dentro de ese carrito, busco el producto con el params.id_prod y elimino el producto
            for (prod of carritoBuscado.productos){
                console.log(prod)
                if (prod.id == parseInt(params.id_prod)){
                    flagP = 1            
                }          
            }
            if (flagP == 1) {
                carritoBuscado.productos = carritoBuscado.productos.filter((productos) => productos.id !== parseInt(params.id_prod))
                res.json(JSON.stringify({ "status": `ok`, "msg":`Se elimino el producto id: ${params.id_prod} del carrito id: ${params.id}`}))
            }
            else{
                res.json(JSON.stringify({ "status": `ok`, "msg":`Error! En el carrito id: ${params.id} no se encuentra el producto id: ${params.id_prod}`}))
            }
        }
           

        else{
            res.send(`Error! el carrito id: ${params.id} no se encuentra en la base de datos`) 
            }
        return carritos
    })

    //Guardo carritos modificados
    .then( carritosModificados => {
        fs.promises.writeFile("./public/carritos.txt",JSON.stringify(carritosModificados), "utf-8")
        })
   
 })


 //// Exportar ---- 

module.exports = {router}