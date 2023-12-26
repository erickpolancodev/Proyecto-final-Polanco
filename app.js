
let tienda              = [];
let carrito             = (!localStorage.getItem('carrito')) ? localStorage.setItem('carrito', JSON.stringify([])): localStorage.getItem('carrito');
let totalCarrito        = 0;


const contenedorTienda  = document.querySelector('.tienda');
const bodyCarrito       = document.querySelector('.carrito tbody');
const total             = document.querySelector('.total');
const btnReset          = document.querySelector('.reset');
const btnComprar        = document.querySelector('#btnComprar');


async function obtenerTienda(){
    const response = await fetch('./productos.json');
    console.log(response); // devolvera una promesa pending
    if( response.ok ){
        tienda = await response.json(); //esperamos a que la promesa deje de estar pending 
        
        tienda.forEach((producto, index) => { 
            contenedorTienda.innerHTML +=  
            `
                <div class="item col-12 col-sm-6 col-md-4 col-lg-3 my-4">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
                    <h3 class="fw-bolder"> ${producto.nombre} </h3>
                    <h4 class="fw-light"> ${producto.marca} </h4>
                    <h5> ${producto.precio} USD</h5>
                    <button type="button" class="btn btn-primary btn-tienda" data-producto="${index}">Agregar</button>
                </div>
            `;
            total
        });
    }
}

obtenerTienda();

// listener a los botones de la tienda
contenedorTienda.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn-tienda')){
        let btnTienda = e.target;
        let id = btnTienda.getAttribute('data-producto');
        obtenerAtributo(id);
    }
})


// Obtenemos los items del localstorage del carrito
function verificarStorage() {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito.length !== 0 && construirCarrito();
    btnComprar.disabled = (carrito.length !== 0) ? '': 'disabled';
}

verificarStorage();


//se le añade el evento click a cada boton de la tienda
btnReset.addEventListener('click', resetCarrito);

function obtenerAtributo(idProducto){
    carrito.push(tienda[idProducto]);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    construirCarrito();
    btnComprar.disabled = (Object.keys(carrito).length === 0);

    Toastify({
        text: "Agregado al carrito",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
    }).showToast();
}

function construirCarrito(){
    bodyCarrito.innerHTML = '';
    totalCarrito = 0;
    carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito.forEach((producto,index) => {
        let precioProducto = producto.precio;
        bodyCarrito.innerHTML += 
        `
        <tr>
            <td> ${index+1} </td>
            <td> ${producto.nombre} </td>
            <td> ${producto.marca} </td>
            <td> ${producto.precio} </td>
        </tr>
        `;
        sumar(precioProducto);        
    });
    
}

function sumar(precio){
    totalCarrito = totalCarrito + precio;
    total.innerHTML = ` ${totalCarrito}  USD`;
}

function resetCarrito(){
    totalCarrito = 0;
    total.innerHTML = totalCarrito;
    bodyCarrito.innerHTML = '<tr><td colspan="4"><h5 class="text-center">No hay productos en el carrito</h5></td></tr>';
    localStorage.removeItem("carrito");
    carrito = [];
    btnComprar.disabled = 'disabled';
}

btnComprar.addEventListener('click', comprarProductos);

function comprarProductos(){
    console.log('comprando')
    btnComprar.disabled = 'disabled';
    Swal.fire({
        title: 'Gracias por su compra, vuelva pronto',
        icon: 'success',
        confirmButtonText: 'Aceptar',
    }).then((result) =>{
        // saber si el usuario apreto el boton confirmar
        if(result.isConfirmed){
            resetCarrito();
        }
    })
}