// VARIABLES
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCards = document.getElementById('template-card').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content
const fragment = document.createDocumentFragment()
let carrito = {}

cards.addEventListener('click', (e)=>{
    agregarCarrito(e)
})

items.addEventListener('click', (e) => {
    accionBtn(e)
})

document.addEventListener('DOMContentLoaded', () => {
    fetchApi()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})

const fetchApi = async () => {
    const url = 'api.json'
    try {
        const res = await fetch(url)
        const data = await res.json()
        // console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
const pintarCards = (data) =>{
    // console.log(data)
    data.forEach(producto => {
        templateCards.querySelector('h5').textContent = producto.title
        templateCards.querySelector('p').textContent = producto.precio
        templateCards.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCards.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCards.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const agregarCarrito = (e)=>{
    // console.log(e.target)
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
        // console.log(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objeto =>{
    // console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach( producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    // console.log(nCantidad)
    // console.log(nPrecio)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const vaciarBtn = document.getElementById('vaciar-carrito')
    vaciarBtn.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const accionBtn = (e) => {
    // console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        // console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        // console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        // carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    e.stopPropagation()
}

















