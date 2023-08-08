import Reserva from './Reserva.js';
import Comentarios from './Comentarios.js';
import { containerModalReserva, btnReservar, btnEnviarComentario, 
  containerPlatillosAgregados, containerPedidosRealizados } from '../funciones/selectores.js'
import { obtenerCantidadTotal } from '../funciones/funciones.js'

class Header {

    static initApp() {
        // <!-- RESERVA -->
        // Instanciamos el objeto
        const reserva = new Reserva();
        // Mostramos las mesas en el HTML
        reserva.mesasHMTL();
        // El cliente tiene la opcion de reservar la mesa que guste
        reserva.mesaEscogido(containerModalReserva);
        // Realizamos la accion que necesitemos
        btnReservar.addEventListener('click', e => reserva.reservarMesa(e));
        // <!-- FIN DE RESERVA -->


        // <!-- CANTIDAD TOTAL DE PLATILLOS -->
        Header.cantidadPlatillosYpedidos()
        // <!-- FIN DE CANTIDAD TOTAL DE PLATILLOS -->

        // <!-- COMENTARIOS -->
        const comentarios = new Comentarios();
        // Validamos que los campos no esten vacios
        btnEnviarComentario.addEventListener('click', e => comentarios.validarCampos(e));

        // <!--FIN COMENTARIOS -->



    }

    static cantidadPlatillosYpedidos() {
        // Platillos agregados al carrito
        const platillosAgregados = JSON.parse(localStorage.getItem('platillos')) ?? [];
        const platillosTotales = obtenerCantidadTotal(platillosAgregados);
        containerPlatillosAgregados.textContent = platillosTotales;
        containerPlatillosAgregados.classList.toggle('d-none', platillosTotales === 0);

        // Pedidos realizados
        const pedidosRealizados = JSON.parse(localStorage.getItem('pedidos')) ?? [];
        const pedidosTotales = pedidosRealizados.reduce( (total, pedido) => {
          if(!pedido.completado) {
            total += 1;
          }
          return total;
        }, 0 )
        containerPedidosRealizados.textContent = pedidosTotales;
        containerPedidosRealizados.classList.toggle('d-none', pedidosTotales === 0);
      }
      

}

export default Header;

