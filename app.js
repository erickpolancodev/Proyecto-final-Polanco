
let tienda              = [];
let carrito             = (!localStorage.getItem('carrito')) ? localStorage.setItem('carrito', JSON.stringify([])): localStorage.getItem('carrito');
let totalCarrito        = 0;
let claseClima;


const contenedorTienda  = document.querySelector('.tienda');
const bodyCarrito       = document.querySelector('.carrito tbody');
const total             = document.querySelector('.total');
const btnReset          = document.querySelector('.reset');
const btnComprar        = document.querySelector('#btnComprar');
const countCarrito      = document.querySelector('.badge');
const filtroCategorias  = document.querySelector('#filtro');


async function obtenerTienda(){
    const response = await fetch('./productos.json');
    console.log(response); // devolvera una promesa pending
    if( response.ok ){
        tienda = await response.json(); //esperamos a que la promesa deje de estar pending 
        
        tienda.forEach((producto, index) => { 
            contenedorTienda.innerHTML +=  
            `
                <div class="item col-12 col-sm-6 col-md-4 col-lg-3 my-4" data-categoria="${producto.categoria.toLowerCase()}"">
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
    contadorCarrito();
    cargarFiltro();
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
        gravity: "bottom", 
        position: "right", 
    }).showToast();

    contadorCarrito();
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
    contadorCarrito();
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

    contadorCarrito();
}

function contadorCarrito(){
    let cuenta = Object.keys(carrito).length;
    countCarrito.innerHTML = cuenta;
}

async function weather(){
    //const appID = 'c8b73b0c82529f1afc73e3a0b747fde6';
    const appID ='';
    const city = "Buenos Aires, Argentina";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appID}`;

    // const response = await fetch(URL)
    // .then((response) => response.json())
    // .then((data) => {
    //     let icon = document.querySelector('.weather');
    //     icon.innerHTML = determinateWeather(data.weather[0].main);
    // });
}

weather();

function determinateWeather(clima){
    switch(clima){
        case 'Rain':
            claseClima = `<i class="fa-solid fa-cloud-rain fa-2x"></i> `;
            break;
        case 'Clouds':
            claseClima = `<i class="fa-solid fa-cloud fa-2x"></i>`;
            break;
        case 'Sun':
            claseClima = `<i class="fa-solid fa-sun fa-2x"></i>`;
            break;
        case 'Clear':
            claseClima =`<i class="fa-solid fa-cloud-sun fa-2x"></i>`;
            break;
        case 'Snow':
            claseClima =`<i class="fa-solid fa-snowflake fa-2x"></i>`;
            break;
        case 'Drizzle':
            claseClima =`<i class="fa-solid fa-cloud-sun-rain fa-2x"></i>`;
            break;
        case 'Thunderstorm':
            claseClima =`<i class="fa-solid fa-cloud-bolt fa-2x"></i>`;
            break;
        default:
            claseClima = `<i class="fa-solid fa-sun fa-2x"></i>`;
    }

    return claseClima;
}

async function cargarFiltro(){
    const response = await fetch('./productos.json');
    let options = `<option value="todos">Todos</option>`;
    let categoriasInicial = [];
    console.log(response); // devolvera una promesa pending
    if( response.ok ){
        cat = await response.json();
        cat.forEach((nombre) => {
            categoriasInicial.push(nombre.categoria);
        });

        let categorias = new Set(categoriasInicial);

        categorias.forEach((index) =>{
            options += `<option value="${index.toLowerCase()}">${index}</option>`
        })
        filtroCategorias.innerHTML = options;

    }
}

filtroCategorias.addEventListener('change', filtrar);

function filtrar(){
    items = document.querySelectorAll('.item');
    // limpiamos todos los posibles hide
    items.forEach((item) => {
        item.classList.remove('hide');
    });

    const option = filtroCategorias.options[filtroCategorias.selectedIndex];

    console.log(option.value);

    itemsArray = Array.from(items);

    const itemsCat = itemsArray.filter((item) => {
        return item.getAttribute("data-categoria") !== option.value;
    });
    
    if(option.value !== 'todos'){
        itemsCat.forEach((item) => {
            item.classList.add('hide');
        });
    }else{
        items.forEach((item) => {
            item.classList.remove('hide');
        });
    }

}

