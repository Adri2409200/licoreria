const productos = [
    { id: 1, nombre: "Whisky Johnnie Walker", precio: 45, categoria: "whisky", imagen: "https://tse4.mm.bing.net/th/id/OIP.Gj-Bp8hcHPG1iojEpmjAxgHaJ1?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 2, nombre: "Ron Bacardí", precio: 18, categoria: "ron", imagen: "https://d323g1xugy1rkz.cloudfront.net/wp-content/uploads/sites/47/2021/12/24081524/FY21_Bacardi_Cartablanca_Lifestyle-1200x1200.jpg" },
    { id: 3, nombre: "Vodka Absolut", precio: 24, categoria: "vodka", imagen: "https://tse4.mm.bing.net/th/id/OIP.WMFHs4Er6BOxasHKzyzRGAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 4, nombre: "Whisky Jack Daniels", precio: 32, categoria: "whisky", imagen: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/11/16103043/jack-daniels-honey-whiskey-1.jpeg" },
    { id: 5, nombre: "Ron Zacapa", precio: 65, categoria: "ron", imagen: "https://win.gt/wp-content/uploads/2023/03/Ron-Zacapa-23-Armonia-1536x864.jpg" },
    { id: 6, nombre: "Vodka Grey Goose", precio: 39, categoria: "vodka", imagen: "https://www.raschvin.com/wp-content/uploads/2023/03/Grey_Goose_Vodka_1_5ltr_The_Project_Garments_B_9c2b2af5-6697-4c5a-87e7-9df222917af7_800x.jpg" }
];

let carrito = [];
let total = 0;
let descuentoAplicado = false;
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    actualizarCarrito();
    configurarBotones();
});

function cargarProductos(categoria = 'todos') {
    const contenedor = document.getElementById('productosGrid');
    
    // Filtrar 
    let productosMostrar = productos;
    if (categoria !== 'todos') {
        productosMostrar = productos.filter(p => p.categoria === categoria);
    }
    
    contenedor.innerHTML = productosMostrar.map(producto => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <span class="badge bg-secondary">${producto.categoria}</span>
                    <p class="card-text mt-2">$${producto.precio}</p>
                    <button class="btn btn-licor w-100" onclick="agregarProducto(${producto.id})">
                        <i class="bi bi-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function configurarBotones() {
    document.getElementById('btnVerProductos')?.addEventListener('click', function() {
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    });
        document.getElementById('btnOfertas')?.addEventListener('click', function() {
        alert('¡Oferta especial! Envío gratis en compras mayores a $50');
    });
        document.querySelectorAll('.categoria-btn').forEach(boton => {
        boton.addEventListener('click', function() {
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const categoria = this.getAttribute('data-categoria');
            cargarProductos(categoria);
        });
    });
    
    document.getElementById('btnOfertaWhisky')?.addEventListener('click', function() {
        agregarProducto('oferta');
    });
    
    document.getElementById('btnDescuento')?.addEventListener('click', function() {
        aplicarDescuento();
    });
    
    document.getElementById('btnVaciar')?.addEventListener('click', function() {
        vaciarCarrito();
    });
    
    document.getElementById('btnComprar')?.addEventListener('click', function() {
        comprar();
    });
}

function agregarProducto(id) {
    let producto;
    
    if (id === 'oferta') {
        producto = {
            id: 0,
            nombre: 'Combo Whisky + Vasos',
            precio: 45,
            categoria: 'oferta'
        };
    } else {
        producto = productos.find(p => p.id === id);
    }
    
    if (producto) {
        carrito.push(producto);
        actualizarCarrito();
        mostrarMensaje(`${producto.nombre} agregado al carrito`);
    }
}

function actualizarCarrito() {
    const lista = document.getElementById('listaCarrito');
    const totalElement = document.getElementById('totalCarrito');
    const subtotalElement = document.getElementById('subtotalCarrito');
    const carritoCount = document.getElementById('carritoCount');
    const totalItems = document.getElementById('totalItems');
    const envioInfo = document.getElementById('envioInfo');
    
    total = 0;
    carrito.forEach(item => total += item.precio);
    
    carritoCount.textContent = carrito.length;
    totalItems.textContent = carrito.length + ' items';
        if (carrito.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x text-muted fs-1 mb-3"></i>
                <h5 class="text-muted">Tu carrito está vacío</h5>
                <p class="text-muted mb-0">Agrega productos desde la sección de productos</p>
            </div>
        `;
    } else {
        lista.innerHTML = carrito.map((item, index) => `
            <div class="carrito-item d-flex justify-content-between align-items-center p-3 mb-2 border rounded">
                <div>
                    <h6 class="mb-1">${item.nombre}</h6>
                    <small class="text-muted">${item.categoria}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold">$${item.precio}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
        let totalConDescuento = total;
    if (descuentoAplicado && total >= 100) {
        totalConDescuento = total * 0.9;
        document.getElementById('descuentoSection').style.display = 'flex';
        document.getElementById('descuentoAplicado').textContent = '-$' + (total * 0.1).toFixed(2);
    }
    
    subtotalElement.textContent = total.toFixed(2);
    totalElement.textContent = totalConDescuento.toFixed(2);
    
    if (total >= 50) {
        envioInfo.innerHTML = '<i class="bi bi-check-circle text-success me-1"></i> ¡Envío gratis incluido!';
        envioInfo.className = 'text-success small';
    } else {
        const faltante = (50 - total).toFixed(2);
        envioInfo.innerHTML = `<i class="bi bi-info-circle me-1"></i> Agrega $${faltante} más para envío gratis`;
        envioInfo.className = 'text-muted small';
    }
}

function eliminarDelCarrito(index) {
    if (confirm('¿Eliminar este producto del carrito?')) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }
}

function aplicarDescuento() {
    if (total >= 100 && !descuentoAplicado) {
        descuentoAplicado = true;
        actualizarCarrito();
        mostrarMensaje('¡Descuento del 10% aplicado!');
    } else if (descuentoAplicado) {
        mostrarMensaje('Ya tienes un descuento aplicado', 'warning');
    } else {
        mostrarMensaje('Necesitas al menos $100 para aplicar el descuento', 'info');
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito ya está vacío', 'info');
        return;
    }
    
    if (confirm('¿Vaciar todo el carrito?')) {
        carrito = [];
        descuentoAplicado = false;
        actualizarCarrito();
        mostrarMensaje('Carrito vaciado correctamente');
    }
}

function comprar() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito está vacío', 'warning');
        return;
    }
    
    let mensaje = '¡Compra realizada con éxito!\n\n';
    mensaje += 'Resumen de tu compra:\n\n';
    carrito.forEach(item => {
        mensaje += `• ${item.nombre}: $${item.precio}\n`;
    });
    
    let totalFinal = total;
    if (descuentoAplicado && total >= 100) {
        totalFinal = total * 0.9;
        mensaje += `\nDescuento (10%): -$${(total * 0.1).toFixed(2)}`;
    }
    
    mensaje += `\nTotal: $${totalFinal.toFixed(2)}`;
    
    if (total >= 50) {
        mensaje += '\n\n✅ ¡Envío gratis incluido!';
    }
    
    mensaje += '\n\nGracias por tu compra.';
    
    alert(mensaje);
    
    carrito = [];
    descuentoAplicado = false;
    actualizarCarrito();
}

function mostrarMensaje(texto, tipo = 'success') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alerta.style.zIndex = '9999';
    alerta.innerHTML = `
        ${texto}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 3000);
}