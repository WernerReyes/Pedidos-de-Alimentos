import { modalComentariosContainer, modalAnunciosContainer, comentariosContainer, localComentarios } from '../funciones/selectores.js';
import { validarCamposVacios, sincronizarStorage } from '../funciones/funciones.js';
import UI from '../classes/UI.js';

class Comentarios {
    constructor() {
        this.comentarios = [...localComentarios];
        
        this.ui = new UI();

        this.puntajeSeleccionado;
        this.puntajeLLeno();
    }


    validarCampos(e) {
        e.preventDefault();

        // Modal de anuncios
        const modalAnuncios = new bootstrap.Modal(modalAnunciosContainer.parentElement.parentElement);


        const campos = this.datosLlenos();

        // Validamos
        if (validarCamposVacios(Object.values(campos))) {
            this.ui.alerta("Todos los campos estan vacios",'error')
            return;
        }

        this.comentarios = [...this.comentarios, campos ];
        sincronizarStorage('comentarios', this.comentarios);

        this.ui.mostrarAviso(modalAnunciosContainer, `¡Gracias ${campos.nombre}! Tú comentario fue registrado correctamente`)

        // Abrimos el modal
        modalAnuncios.show();

        setTimeout( () => modalAnuncios.hide(), 3000 ); // Despues de 3 segundo cerramos el modal

        // Resetemos el formulario
        modalComentariosContainer.querySelector('#form-puntaje').reset();

        // Y si estamos en la pestaña de comentarios de agregara en tiempo real
        if(comentariosContainer) {
            this.ui.mostrarComentarios(comentariosContainer,this.comentarios);
        }

    }

    puntajeLLeno() {
        const inputsRadio = modalComentariosContainer.querySelectorAll('#form-puntaje input[type="radio"]');
        inputsRadio.forEach(btn => {
            btn.addEventListener('change', e => {
                this.puntajeSeleccionado = e.target.value;
            });
        });
    }

    datosLlenos() {
        const campos = {
            nombre: modalComentariosContainer.querySelector('#nombre-input').value,
            comentario: modalComentariosContainer.querySelector('textarea').value,
            puntaje: this.puntajeSeleccionado,
            fecha: new Date().toLocaleString('en-US', { hour12: true })
        };

        return campos;
    }

}

export default Comentarios;