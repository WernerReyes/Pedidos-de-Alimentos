// Función para crear las mesas normales
export function crearMesasNormales(cantidad) {
    const mesasNormales = [];
    for (let i = 1; i <= cantidad; i++) {
        const mesa = {
            nombre: `P${i}`,
            tipo: 'normal',
            precio: 20,
            disponible: true,
        };
        mesasNormales.push(mesa);
    }
    return mesasNormales;
}

// Función para crear las mesas VIP
export function crearMesasVIP(cantidad) {
    const mesasVIP = [];
    for (let i = 1; i <= cantidad; i++) {
        const mesa = {
            nombre: `VIP${i}`,
            tipo: 'vip',
            precio: 50,
            disponible: true,
        };
        mesasVIP.push(mesa);
    }
    return mesasVIP;
}

// Validamos que lo campos no esten vacios
export function validarCamposVacios(campos) {
    return campos.some(campo => campo.trim() === '');
}


// Validamos que los digitos ingresados sean 8 y que sea NÚMERO
export function validarDNI(dni) {
    const regex = /^[0-9]*$/;
    return dni.length === 8 && regex.test(dni);
}


// Verificamos si existe el DNI en nuestros registro
export  function existeDNI(usuariosRegistrados, dni) {
   return usuariosRegistrados.some( usuario => usuario.dni === dni );
}

// Verificamos si el nombre coincide con el DNI ya exitente
export function validarUsuarioExistente(usuariosRegistrados, dni, nombre) {
    return usuariosRegistrados.some( usuario => usuario.dni === dni.trim() && usuario.nombre === nombre.trim() );
 }


// Verificamos si los datos coinciden para eliminar 
export function verificarUsuario(usuariosRegistrados, dni, codigo) {
   return usuariosRegistrados.some( usuario => usuario.dni === dni.trim() && usuario.reservas.some( reserva => reserva.codigo === codigo.trim() ) );
}

// Expiramos la reserva del cliente
export function expirarReservasClientes(array, codigo) {
    array.forEach(usuario => {
         usuario.reservas = usuario.reservas.filter(reserva => reserva.codigo !== codigo );
         if (usuario.reservas.length === 0) {
            console.log("Si cumple")
           // Si el usuario ya no tiene reservas, lo eliminamos del array
           array = array.filter(usua => usua.dni !== usuario.dni);
         }
       });

       sincronizarStorage('usuarios-reserva', array );
       
}

// Generar ID para las reservas
export function generarCodigo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        id += caracteres.charAt(indiceAleatorio);
    }

    return id;
}

// Verificamos si existe el platillo
export function existePlatillo(array, id, cantidad, tipo) {
    array = array.map(platillo => {
         if (platillo.id === Number(id) && !tipo ) {
              platillo.cantidad += cantidad ?? 1;
         } else if (platillo.id === Number(id) && tipo ) {
            platillo.cantidad -= cantidad ?? 1;
       }

         return platillo;
    })

    return array;
}

// Obtener cantidad total de Platillos agregados al carrito
export function obtenerCantidadTotal(platillos) {
    const cantidadTotal = platillos.reduce( (total,platillo) => total + platillo.cantidad, 0 );
    return cantidadTotal;
}

// Obtener total a pagar
export function obtenerTotalPagar(platillos) {
    const totalPagar = platillos.reduce( (total,platillo) => total + platillo.precio*platillo.cantidad, 0 );
    return totalPagar.toFixed(2);
}

// Verificamos el codigo de reserva
export function verificarCodigoReserva(array, codigo) {
   return array.some( usuario => {
    const verificado = usuario.reservas.some( reserva => reserva.codigo === codigo );
    return verificado;
   } )
}

// Verificamos que el el codigo, nombre y dni coincidan con lo registrado
export function verificarDatosUsuario(array, datosVerificar) {
    const { nombres, dni, codigo } = datosVerificar;
    
   return array.some( usuario => usuario.dni === dni && usuario.nombre === nombres && usuario.reservas.some( reserva => reserva.codigo === codigo )  );
}

// Verificar si el pedido ya fue realizado
export function pedidoRealizado(array, codigo) {
    return array.some( usuario => usuario.reservas.some( reserva => reserva.codigo === codigo && reserva.pedidoHecho === true ) );
}

// Sicronizamos el storage
export function sincronizarStorage(nombre, campo) {
    localStorage.setItem(nombre, JSON.stringify(campo));
}

