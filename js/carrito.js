import Header from "./header/Header.js";
import UI from "./classes/UI.js";
import {
     sincronizarStorage, existePlatillo, obtenerCantidadTotal,
     obtenerTotalPagar, validarCamposVacios, verificarCodigoReserva,
     verificarDatosUsuario, pedidoRealizado
} from './funciones/funciones.js';
import { localPlatillosData, localTodosLosPlatillos, localPlatillosAgregados, localUsuariosReservados, localPedidosRealizados } from './funciones/selectores.js'

(function () {

     // VARIABLES
     const carritoContainer = document.querySelector('#platillos-agregados tbody');
     const btnAgregarSugerencia = document.querySelector('#modal-sugerencia .modal-footer button');
     const inputBuscar = document.querySelector('#navbars input[type="search"]')

     const codigoReservaInput = document.querySelector('#modal-ordenar-platillo #codigo-input');
     const nombresInput = document.querySelector('#modal-ordenar-platillo #nombre-input');
     const dniInput = document.querySelector('#modal-ordenar-platillo #dni-input');
     const formulario = document.querySelector('#modal-ordenar-platillo #formulario');
     const montoPagarContainer = document.querySelector('#modal-ordenar-platillo .monto-pagar');

     let platillosData = [...localPlatillosData];
     let todosLosPlatillos = [...localTodosLosPlatillos];
     let platillosAgregados = [...localPlatillosAgregados];
     let usuariosReservados;
     let pedidosRealizados = [...localPedidosRealizados];

     const datosRequeridos = {
          codigo: '',
          nombres: '',
          dni: '',
          precioReserva: '',
          mesa: '',
          tipo: '',
          totalPlatillos: '',
          montoTotal: '',
     }

     // INSTANCIAS
     const ui = new UI();

     // EVENTOS
     eventListeners();
     function eventListeners() {

          usuariosReservados = JSON.parse(localStorage.getItem('usuarios-reserva')) ?? localUsuariosReservados;

          document.addEventListener('DOMContentLoaded', () => {

               // Iniciamos la funcionalidad de header
               Header.initApp();

               // Creamos las filas
               crearFilasCarrito()

          });

          // Podemos agregar o disminuir las cantidades
          carritoContainer.addEventListener('click', incrementarOdisminuirCantidad);

          // Podemos agregar alguna sugerencia al platillo
          btnAgregarSugerencia.addEventListener('click', agregarSugerencia);

          // Podemos ver las sugerencias que hicimos
          carritoContainer.addEventListener('click', mostrarSugerenciaAgregado);

          // Si ingresamos el codigo correctamente los demas registros se llenan solo
          codigoReservaInput.addEventListener('blur', llenarDatosRequeridos);

          // Registrar el pedido
          formulario.addEventListener('submit', validarPlatillosUsuario);

          // Filtrar los platillos por busqueda
          inputBuscar.addEventListener('input', filtrarPlatillos);
     }

     // FUNCIONES
     function filtrarPlatillos(e) {
          const filtrado = platillosAgregados.filter(platillo => {
               const letraBusqueda = e.target.value.toLowerCase().trimStart()[0];
               if (e.target.value) {
                    return platillo.nombre.toLowerCase().startsWith(letraBusqueda) &&
                         platillo.nombre.toLowerCase().includes(e.target.value.toLowerCase().trim());
               }

               return platillo
          })

          if (filtrado.length) {
               ui.crearFilasCarrito(carritoContainer, filtrado);
               return;
          }

          if (!e.target.value) {
               ui.crearFilasCarrito(carritoContainer, filtrado);
               return;

          }

          ui.limpiarHTML(carritoContainer);

          const trContainer = document.createElement('TR');

          const tdContainer = document.createElement('TD');
          tdContainer.setAttribute('colspan', '5');

          const noResultado = document.createElement("DIV");
          noResultado.classList.add("alert", "alert-danger", "text-center", "mx-auto", "w-75", 'mt-3');
          noResultado.textContent = "No Hay Resultado, Intenta con otros términos de búsqueda";

          tdContainer.appendChild(noResultado);
          trContainer.appendChild(tdContainer);

          carritoContainer.appendChild(trContainer);
     }


     function llenarDatosRequeridos(e) {

          eventListeners()

          console.log(usuariosReservados);

          console.log(verificarCodigoReserva(usuariosReservados, e.target.value));
          if (verificarCodigoReserva(usuariosReservados, e.target.value)) {
               const { dni, nombre, reservas } = usuariosReservados.find(usuario => {
                    return usuario.reservas.some(reserva => reserva.codigo === e.target.value.trim());
               });

               const { precioMesa, nombreMesa, tipoMesa, codigo } = reservas.find(reserva => reserva.codigo === e.target.value.trim());

               ui.spinner();

               setTimeout(() => {
                    nombresInput.value = nombre;
                    dniInput.value = dni;

                    // Mistamos los datos requeridos
                    mostrarDatosRequeridos({ dni, nombre, codigo, precioMesa, nombreMesa, tipoMesa })
               }, 3000)

          }

     }

     function validarPlatillosUsuario(e) {
          e.preventDefault();

          datosRequeridos.nombres = nombresInput.value;
          datosRequeridos.dni = dniInput.value;


          if (validarCamposVacios([nombresInput.value, dniInput.value, codigoReservaInput.value])) {
               ui.alerta("Todos los campos son obligatorio", 'error');
               return;
          }

          if (!verificarDatosUsuario(usuariosReservados, datosRequeridos)) {
               ui.alerta("Datos incorrectos, intentalo nuevamente", 'error');
               return;
          };

          if (pedidoRealizado(usuariosReservados, datosRequeridos.codigo)) {
               ui.alerta("El pedido ya fue realizado, por favor espere sus platillos", 'error')
               return;
          }

          if (Number(datosRequeridos.montoTotal) === 0) {
               ui.alerta("Necesitar agregar platillos para proceder con la compra", 'error');
               return;
          }

          // Agregamos los pedidos al array
          pedidosRealizados = [...pedidosRealizados, {
               ...datosRequeridos,
               platillos: platillosAgregados,
               fecha: new Date().toLocaleString('en-US', { hour12: true })
          }];
          sincronizarStorage('pedidos', pedidosRealizados);

          // Decimos que el pedido ya fue realizado, para que no se velva a realizar el mismo el mismo pedido con el mismo codigo
          pedidoHecho(codigoReservaInput.value);

          // Alerta de exito 
          ui.alerta('Pedido realizado correctamente')

          // Vaciamos todo los platillos agregados y sincronizamos los platillos en general
          platillosAgregados = [];
          sincronizarStorage('platillos', platillosAgregados);

          // Actualizamos platillosData con una copia de los datos originales
          platillosData = platillosData.map(platillo => ({ ...platillo, cantidad: 0 }));
          sincronizarStorage('platillosData', platillosData);

          // Vaciamos todosLosPlatillos
          todosLosPlatillos = [...platillosData];

          // Volvemos a crear el HTML
          crearFilasCarrito();
          Header.cantidadPlatillosYpedidos();

          // Reseteamos todo el formulario
          montoPagarContainer.classList.add('d-none')
          formulario.reset();

     }


     function pedidoHecho(codigo) {
          usuariosReservados.forEach(usuario => {
               usuario.reservas.map(reserva => {
                    if (reserva.codigo === codigo) {
                         reserva.pedidoHecho = true;
                    }
               })
          });
          sincronizarStorage('usuarios-reserva', usuariosReservados);
     }

     function mostrarDatosRequeridos(datosPedido) {

          const { dni, nombre, codigo, precioMesa, nombreMesa, tipoMesa } = datosPedido;

          montoPagarContainer.classList.remove('d-none');
          montoPagarContainer.firstElementChild.textContent = `Total a pagar: $${obtenerTotalPagar(platillosAgregados)}`;
          montoPagarContainer.firstElementChild.nextElementSibling.textContent = `Precio reserva: $${precioMesa}`;
          montoPagarContainer.lastElementChild.previousElementSibling.textContent = `Mesa: ${nombreMesa}`;
          montoPagarContainer.lastElementChild.textContent = `Tipo de reserva: ${tipoMesa.toUpperCase()}`;

          datosRequeridos.nombres = nombre;
          datosRequeridos.dni = dni;
          datosRequeridos.codigo = codigo;
          datosRequeridos.precioReserva = precioMesa;
          datosRequeridos.mesa = nombreMesa;
          datosRequeridos.tipo = tipoMesa;
          datosRequeridos.totalPlatillos = obtenerCantidadTotal(platillosAgregados);
          datosRequeridos.montoTotal = obtenerTotalPagar(platillosAgregados);
     }


     function crearFilasCarrito() {
          ui.crearFilasCarrito(carritoContainer, platillosAgregados);

          // Cantidad total de platillos añadidos
          document.querySelector('#platillos-agregados h3').textContent = `Platillos añadidos: ${obtenerCantidadTotal(platillosAgregados)}`;

          // Cantidad total de platillos añadidos
          document.querySelector('#platillos-agregados .total-pagar').textContent = `Total a pagar: $ ${obtenerTotalPagar(platillosAgregados)}`;
     }


     function incrementarOdisminuirCantidad(e) {
          let accion = {};

          if (e.target.classList.contains('agregando')) {
               accion.id = Number(e.target.dataset.id)
          };

          if (e.target.classList.contains('disminuendo')) {
               accion.tipo = '-';
               accion.id = Number(e.target.dataset.id)
          }

          // Podemos seguir aumentando y disminuyendo
          cambiosRealizados(accion.id, accion.tipo);

          // Efectuamos los cambios en en el INICIO
          platillosData = existePlatillo(platillosData, accion.id, undefined, accion.tipo);
          sincronizarStorage('platillosData', platillosData);

          // Sicronizamos platillosTotales
          sincronizarTodosLosPlatillos()

          // Aumentamos o disminuimos la cantidad total de platillos en el HEADER
          Header.cantidadPlatillosYpedidos();

          // Volemos a crear el HTML
          crearFilasCarrito();
     }

     function cambiosRealizados(id, tipo) {
          platillosAgregados = platillosAgregados.map(platillo => {
               if (platillo.id === id && !tipo) {
                    platillo.cantidad++;
               } else if (platillo.id === id && tipo) {
                    platillo.cantidad--;
               }
               return platillo;
          }).filter(platillo => platillo.cantidad > 0);

          sincronizarStorage('platillos', platillosAgregados);
     }

     function todosLosPlatillosRestaurante(platilloActual) {
          const platilloExistente = todosLosPlatillos.find(platillo => platillo.id === platilloActual.id);

          if (platilloExistente) {
               // Actualizar el platillo existente
               todosLosPlatillos = todosLosPlatillos.map(platillo =>
                    platillo.id === platilloActual.id ? platilloActual : platillo);
          } else {
               // Insertar el nuevo platillo
               todosLosPlatillos = [...todosLosPlatillos, platilloActual];
          }

          sincronizarStorage('total-platillos', todosLosPlatillos);
     }


     function sincronizarTodosLosPlatillos() {
          platillosData.forEach(platilloActual => {
               todosLosPlatillosRestaurante(platilloActual);
          });

     }


     function agregarSugerencia(e) {
          e.preventDefault();

          const sugerencia = document.querySelector('#modal-sugerencia .modal-body textarea').value;

          // Obtenemos el id
          const id = Number(e.target.dataset.id);

          if (validarCamposVacios([sugerencia])) {
               ui.alerta("Campo requerido", 'error');
               return;
          }

          platillosAgregados = platillosAgregados.map(platillo => {
               if (platillo.id === id) {
                    return { ...platillo, sugerencia };
               }
               return platillo;
          });

          ui.alerta('Sugerencia agregada correctamente')

          sincronizarStorage('platillos', platillosAgregados);

     }


     function mostrarSugerenciaAgregado(e) {
          const sugerenciaEstablecida = document.querySelector('#modal-sugerencia .modal-body textarea');

          if (e.target.classList.contains('agregar-sugerencia')) {
               const id = Number(e.target.dataset.id)

               const { sugerencia } = platillosAgregados.find(platillo => platillo.id === id);

               // Si el usuario hizo alguna sugerencia los mostramos, de los contrario establecemos un string vacio
               sugerenciaEstablecida.value = sugerencia ?? '';

               // Agregamos DATA ID para poder agregar la sugerencia a un platillo en espeficifico
               btnAgregarSugerencia.dataset.id = id;

          };

     }








})();