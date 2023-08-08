import Header from "./header/Header.js";
import UI from './classes/UI.js';
import Api from "./classes/Api.js";
import { sincronizarStorage, existePlatillo, validarCamposVacios } from './funciones/funciones.js';
import { localTodosLosPlatillos, localPlatillosData, localPlatillosAgregados  } from './funciones/selectores.js'

(function () {

     // VARIABLES
     const platillosContainer = document.querySelector('#platillos-diponibles .row');
     const btnBuscarPlatillo = document.querySelector('#btn-buscar');

     let todosLosPlatillos = [...localTodosLosPlatillos];
     let platillosData = [...localPlatillosData];
     let platillosAgregados = [...localPlatillosAgregados];

     // INSTANCIAS
     const ui = new UI();
     const api = new Api();

     // EVENTOS
     eventListeners();
     function eventListeners() {

          document.addEventListener('DOMContentLoaded', async () => {
               // Iniciamos la funcionalidad de header
               Header.initApp();

               // Obtenemos los platillos que ira al inicio siempre
               if(!platillosData.length) {
                    const { hits } = await api.obtenerDatos('chicken');
                    platillos(hits);
               }

               // Buscar el platillos que desemos
               btnBuscarPlatillo.addEventListener('click', buscarPlatillos);

               // Mostramos todos los platillos que tenemos
               mostrarPlatillos();

               // Ver mas infomacion sobre un platillo en especifico
               platillosContainer.addEventListener('click', verDetallesPlatillo);

               // Agregar platillos al carrito
               platillosContainer.addEventListener('click', agregarPlatillos);
          });
     }

     // FUNCIONES
     function platillos(hits) {
          if (hits.length) {

               platillosData = hits.map(hit => {

                    const { recipe: { totalWeight, label, image, totalTime, ingredientLines, healthLabels } } = hit;

                    return {
                         id: totalWeight,
                         nombre: label,
                         image: image,
                         precio: totalTime !== 0 ? totalTime : 50,
                         ingredientes: ingredientLines,
                         etiquetaSalud: healthLabels,
                         cantidad: 0

                    }

               });

               // Sicronizamos todos los platillos
               sincronizarTodosLosPlatillos('sincronizar');

               // Mostramos los platillos
               mostrarPlatillos();

               // Sincronizamos los platillos actules
               sincronizarStorage('platillosData', platillosData);

               return;
          }

          ui.alerta('No se encontraron platillos, prueba con otros terminos de busqueda', 'error');

     }

     function mostrarPlatillos() {
          ui.mostrarPlatillosHTML(platillosContainer, platillosData);
     }

     function verDetallesPlatillo(e) {
          if (e.target.classList.contains('ver-mas-informacion')) {

               // Obtenemos el ID de clada platillo
               const idPlatillo = e.target.dataset.id;

               window.location.href = `info-producto.html?id=${idPlatillo}`
          }


     }

     async function buscarPlatillos() {

          const contenidoInput = document.querySelector('#navbars input[type="search"]').value;

          if (validarCamposVacios([contenidoInput])) {
               ui.alerta('Tienes escribir un platillo', 'error');
               return;
          }

          const datos = await api.obtenerDatos(contenidoInput.trim());

          if (datos) {

               const { hits } = datos;
               
               // Obtenemos los platillos que busquemos
               platillos(hits);

          } else {
               console.log("Datos no encotrados")
          }

     }


     function agregarPlatillos(e) {
          if (e.target.classList.contains('agregar-platillos')) {

               // Obtenemos el ID de clada platillo
               const idPlatillo = e.target.dataset.id;

               // Escogemos el platillo que queremos agregar
               const platilloAgregar = platillosData.find(platillo => platillo.id === Number(idPlatillo));

               // Pasamos solo lo necesario
               const { id, cantidad, nombre, image, precio } = platilloAgregar;

               // Platillos añadidos al carrito
               agregarPlatilloCarrito({ id, cantidad, nombre, image, precio });

               ui.alerta(`Platillo: "${nombre}" agregado correctamente al carrito`)

               // Cambiar la cantidad de los platillos actuales
               platillosData = existePlatillo(platillosData, id);
               sincronizarStorage('platillosData', platillosData);

               // Sicronizamos platillosTotales
               sincronizarTodosLosPlatillos()

               // Aumentamos la cantidad total de platillos en el HEADER
               Header.cantidadPlatillosYpedidos();

               // Volvemos a crear el HTML
               mostrarPlatillos()

          }
     }

     function agregarPlatilloCarrito(nuevoPlatillo) {
          if (platillosAgregados.some(platillo => platillo.id === Number(nuevoPlatillo.id))) {
               platillosAgregados = existePlatillo(platillosAgregados, nuevoPlatillo.id)
          } else {
               platillosAgregados = [...platillosAgregados, { ...nuevoPlatillo, cantidad: 1 }];
          }

          sincronizarStorage('platillos', platillosAgregados);

     }

     function todosLosPlatillosRestaurante(platilloActual, accion) {
          const platilloExistente = todosLosPlatillos.find(platillo => platillo.id === platilloActual.id);

          if (platilloExistente) {
               // Actualizar el platillo existente
               todosLosPlatillos = todosLosPlatillos.map(platillo =>
                    platillo.id === platilloActual.id ? platilloActual : platillo);

               if (accion) {
                    // Sincronizamos la cantidad en platillosData con la cantidad actilozada en todos los platillos
                    sincronizarCantidadEnPlatillosData(platilloExistente.id, platilloExistente.cantidad);

               }
          } else {
               // Insertar el nuevo platillo
               todosLosPlatillos = [...todosLosPlatillos, platilloActual];
          }

          sincronizarStorage('total-platillos', todosLosPlatillos);

     }

     function sincronizarCantidadEnPlatillosData(id, cantidad) {
          const platilloDataIndex = platillosData.findIndex(platillo => platillo.id === id);
          if (platilloDataIndex !== -1) {
               platillosData[platilloDataIndex].cantidad = cantidad;
          }
     }

     function sincronizarTodosLosPlatillos(accion) {
          platillosData.forEach(platilloActual => {
               todosLosPlatillosRestaurante(platilloActual, accion);
          });

     }







})();