import Header from "./header/Header.js";
import UI from "./classes/UI.js";
import { sincronizarStorage, expirarReservasClientes } from './funciones/funciones.js'
import { localPedidosRealizados, localUsuariosReservados, localMesasDisponibles } from './funciones/selectores.js'

(function () {

     // VARIABLES
     const containerPedidosRealizados = document.querySelector('#pedidos-realizados tbody');
     const containerModalPedido = document.querySelector('#modal-datos-completos .modal-body');
     const inputBuscar = document.querySelector('#navbars input[type="search"]')

     let pedidosRealizados = [...localPedidosRealizados];
     let usuariosReservados = [...localUsuariosReservados];
     let mesasDisponibles = [...localMesasDisponibles];


     // INSTANCIAS
     const ui = new UI();

     // EVENTOS
     eventListeners();
     function eventListeners() {

          document.addEventListener('DOMContentLoaded', () => {
               // Iniciamos la funcionalidad de header
               Header.initApp();

               // Creamos el HTML
               crearPedidosHTML();

               // Podemos ver cada pedido a detalle
               containerPedidosRealizados.addEventListener('click', verPedidosRealizados);

               // Podemos eliminar un pedidos
               containerPedidosRealizados.addEventListener('click', eliminarPedidos);

               // En caso el pedido ya esta listo podemos presionar dicho bton de completado
               containerPedidosRealizados.addEventListener('click', pedidoCompletado);
               
               // Filtrar los platillos por busqueda
               inputBuscar.addEventListener('input', filtrarPlatillos);

          });
     }

     // FUNCIONES
     function crearPedidosHTML() {

          ui.pedidosHTML(containerPedidosRealizados, pedidosRealizados);

          // Total generado y total pedidos
          totalGeneradoYtotalPedidos()

     }

     function filtrarPlatillos(e) {
          const filtrado = pedidosRealizados.filter( pedido => {
               console.log(pedido)
               const letraBusqueda = e.target.value.toLowerCase().trimStart()[0];
                if(e.target.value) {
                    return pedido.nombres.toLowerCase().startsWith(letraBusqueda) && 
                    pedido.nombres.toLowerCase().includes(e.target.value.toLowerCase().trim());
                }

                return pedido
          } )
          

          ui.pedidosHTML(containerPedidosRealizados, filtrado );
            

     }

     function verPedidosRealizados(e) {

          if (e.target.classList.contains('ver-pedidos')) {
               const codigo = e.target.dataset.cod;

               // Mostramos en el modal la informacion del pedido seleccionaod
               const pedidoSeleccionado = pedidosRealizados.find(pedido => pedido.codigo === codigo);

               // Mostramos la informacion del pedido de un cliente en especifico en un MODAL
               ui.modalPedidos(containerModalPedido, pedidoSeleccionado);
          }
     }

     async function eliminarPedidos(e) {
          if (e.target.classList.contains('eliminar-pedidos')) {
               const codigo = e.target.dataset.cod;
               const nameMesa = e.target.dataset.mesa;

               try {

                    const confirmar = await ui.alertaConfirmar('¿Estas seguro que deseas elimar el pedido?', 'Pedido eliminado correctamente');

               if (confirmar) {
                    pedidosRealizados = pedidosRealizados.filter(pedido => pedido.codigo !== codigo);

                    sincronizarStorage('pedidos', pedidosRealizados);

                    // Volvemos a crear el HTML
                    crearPedidosHTML();

                    // Expiramos las reservas
                    expirarReservasClientes(usuariosReservados, codigo);

                    // Habilitamos las mesas que fueron reservadas
                    habilitarMesasReservadas(nameMesa);

                    // Volvemos a iniciar la aplicación
                    Header.initApp();

               }

          } catch(error) {
               console.log(error);
          }


          }
     }


     async function pedidoCompletado(e) {

          if (e.target.classList.contains('form-check-input')) {

               // Obtenemos el codigo y el nombre de la mesa
               const nameMesa = e.target.dataset.mesa;
               const codigo = e.target.dataset.cod;


               if (e.target.checked) {
                    try {
                         
                         const confirmar = await ui.alertaConfirmar('¿Estas seguro que deseas confirmar el pedido como: "COMPLETADO"?', 'Pedido completado correctamente');

                         if (confirmar) {
                              // Popover
                              const popover = new bootstrap.Popover(e.target, {
                                   content: 'Pedido Completado',
                                   placement: 'right'
                              });
                              
                              pedidosRealizados = pedidosRealizados.map(pedido => {
                                   if (pedido.codigo === codigo) {
                                        return { ...pedido, completado: true };
                                   }
                                   return pedido;
                              });

                              sincronizarStorage('pedidos', pedidosRealizados);

                              // Abrimos el popover
                              popover.show();

                              // Ocultar el popover después de unos segundos (por ejemplo, 1.5 segundos)
                              setTimeout(() => {
                                   popover.hide();

                                   // Volvemos a crear el HTML
                                   crearPedidosHTML();

                                   // Expiramos las reservas
                                   expirarReservasClientes(usuariosReservados, codigo);

                                   // Habilitamos las mesas que fueron reservadas
                                   habilitarMesasReservadas(nameMesa);

                                   // Volvemos a iniciar la aplicación
                                   Header.initApp();

                              }, 1500);

                         } else {
                              // Si el usuario cancela la confirmación, desmarcamos el checkbox
                              e.target.checked = false;
                         }
                    } catch (error) {
                         console.log(error);
                    }
               }

          }
     }

     function habilitarMesasReservadas(nameMesa) {
          const nuevasMesasDiponibles = mesasDisponibles.map(mesa => {
               if (mesa.nombre === nameMesa) {
                    mesa.disponible = true;
               }
               return mesa;
          })

          sincronizarStorage('mesas-disponibles', nuevasMesasDiponibles);
     }


     function totalGeneradoYtotalPedidos() {

          const totalPedidos = pedidosRealizados.reduce((total, pedido) => {
               if (!pedido.completado) {
                    total += pedido.totalPlatillos;
               }
               return total;
          }, 0);

          const totalGenerado = pedidosRealizados.reduce((total, pedido) => {
               if (pedido.completado) {
                    total += Number(pedido.montoTotal)
               }
               return total;
          }, 0);
          // Lo insertamos en el HTML
          document.querySelector('#pedidos-realizados h3').textContent = `Pedidos realizados: ${totalPedidos}`

          document.querySelector('.total-pagar').textContent = `Total generado: $${totalGenerado}` // Total generado


     }

})();