import Header from "./header/Header.js";
import Comentarios from "./header/Comentarios.js";
import UI from './classes/UI.js';

( function() {

     // VARIABLES
     const comentariosContainer = document.querySelector('#comentarios .row');

     // INSTANCIAS
     // Obtenemos todos los comentarios
     const comentarios = new Comentarios();
     const ui = new UI();


     // EVENTOS
     eventListeners();
     function eventListeners() {

      document.addEventListener('DOMContentLoaded', () => {
           // Iniciamos la funcionalidad de header
           Header.initApp();

           contruirComentarios(comentarios.comentarios)
      } );
     }

     // FUNCIONES
     function contruirComentarios(comentarios) {
       ui.mostrarComentarios(comentariosContainer, comentarios);
     }

} )();