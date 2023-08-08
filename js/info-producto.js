import Header from "./header/Header.js";
import UI from "./classes/UI.js";
import { sincronizarStorage, existePlatillo } from './funciones/funciones.js';
import { localTodosLosPlatillos, localPlatillosData, localPlatillosAgregados } from './funciones/selectores.js';

(function () {

     // VARIABLES
     const productoSelectContainer = document.querySelector('#producto-seleccionado .row');

     let todosLosPlatillos = [...localTodosLosPlatillos];

     let platillosData = [...localPlatillosData];

     let platillosAgregados = [...localPlatillosAgregados];

     let idPlatillo;

     let cantidadAgregar = 0;

     // INSTANCIAS
     const ui = new UI();


     // EVENTOS
     eventListeners();
     function eventListeners() {

          document.addEventListener('DOMContentLoaded', () => {
               // Iniciamos la funcionalidad de header
               Header.initApp();

               // Verificar si el platillos existe
               const parametrosURL = new URLSearchParams(window.location.search);
               idPlatillo = parametrosURL.get("id");
               if (idPlatillo) {
                    mostrarPlatillo(idPlatillo);
               }

               // Incrementar o disminuir la cantidad
               productoSelectContainer.addEventListener('click', incrementarOdisminuirCantidad);

               // Agregar al carrito
               productoSelectContainer.addEventListener('click', agregarCarrito);
          });
     }

     // FUNCIONES
     function mostrarPlatillo(id) {

          // Obtenemos solo el platillo que el cliente quiere ver
          const platilloInfo = platillosData.find(platillo => platillo.id === Number(id));

          ui.mostrarMasInfoPlatillo(productoSelectContainer, platilloInfo)
     }

     function incrementarOdisminuirCantidad(e) {

          if (e.target.classList.contains('agregando')) cantidadAgregar++;

          else if (e.target.classList.contains('disminuendo')) {
               if (cantidadAgregar <= 0) {
                    console.log("No pudes dismuir mas")
                    return;
               }
               cantidadAgregar--

          }

          document.querySelector('#producto-seleccionado .cantidad-platillos').textContent = cantidadAgregar;
     }

     function agregarCarrito(e) {
          if (e.target.classList.contains('agregar-platillo')) {
               if (cantidadAgregar === 0) {
                    ui.alerta("No puedes agregar 0 productos al carrito", 'error');
                    return;
               }

               // Obtenemos solo el platillo que el cliente quiere ver
               const { id, cantidad, nombre, image, precio } = platillosData.find(platillo => platillo.id === Number(idPlatillo));

               // Platillos añadidos al carrito
               agregarPlatilloCarrito({ id, cantidad, nombre, image, precio });

               // Cambiar la cantidad los platillosData
               platillosData = existePlatillo(platillosData, idPlatillo, cantidadAgregar);
               sincronizarStorage('platillosData', platillosData)

               // Aumentamos la cantidad total de platillos en el HEADER
               Header.cantidadPlatillosYpedidos();

               // Sicronizamos platillosTotales
               sincronizarTodosLosPlatillos()

               // Mostramos la alerta de exito
               ui.alerta(`Platillo: "${nombre}" agregado correctamente al carrito. Cantidad: ${cantidadAgregar}.`)

               // Mostramos nuevamente el platillo
               mostrarPlatillo(id);

               // Volvemos la cantidadPlatillos a 0
               document.querySelector('#producto-seleccionado .cantidad-platillos').textContent = 0;
               cantidadAgregar = 0;

          }
     }

     function agregarPlatilloCarrito(nuevoPlatillo) {
          if (platillosAgregados.some(platillo => platillo.id === Number(nuevoPlatillo.id))) {
               platillosAgregados = existePlatillo(platillosAgregados, idPlatillo, cantidadAgregar)
          } else {
               platillosAgregados = [...platillosAgregados, { ...nuevoPlatillo, cantidad: cantidadAgregar }];
          }

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

})();