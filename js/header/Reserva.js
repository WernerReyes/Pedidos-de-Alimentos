import { containerModalReserva, btnReservar, modalAccionRealizar, modalAnunciosContainer, localUsuariosReservados } from "../funciones/selectores.js";
import UI from "../classes/UI.JS";
import Header from "./Header.js";
import {
  validarCamposVacios, validarDNI, generarCodigo, existeDNI, validarUsuarioExistente,
  verificarUsuario, sincronizarStorage, expirarReservasClientes, crearMesasNormales, crearMesasVIP
} from '../funciones/funciones.js';

class Reserva {
  constructor() {
    this.usuariosReserva = [...localUsuariosReservados];
    this.todasLasMesas = [...crearMesasNormales(18), ...crearMesasVIP(6)];

    this.ui = new UI();

    this.mesaSeleccionada;
  }

  mesasHMTL() {
    const mesasDisponibles = JSON.parse(localStorage.getItem('mesas-disponibles'));

    // Crear las mesas dispniles
    this.ui.modalReserva(containerModalReserva, mesasDisponibles ?? this.todasLasMesas);

    // Escogemos que accion queremos realizar 
    const btnsInputsRadios = containerModalReserva.querySelectorAll('.accion-realizar input');
    btnsInputsRadios.forEach(btn => {
      btn.addEventListener('change', this.accionRealizar);
    })

  }

  desabilitarMesasReservadas() {

    const mesasActualizadas = this.todasLasMesas.map(mesa => {
      // Verificamos si alguna reserva corresponde a la mesa actual
      const algunaReservaCorresponde = this.usuariosReserva.some(
        usuario => usuario.reservas.some(reserva => reserva.nombreMesa === mesa.nombre)
      );

      if (algunaReservaCorresponde) {
        return { ...mesa, disponible: false }; // Creamos un nuevo objeto con "disponible" actualizado
      }
      return mesa; // Mantenemos el objeto original sin cambios

    });

    return mesasActualizadas;
  }

  mesaEscogido(container) {
    let botonPrevio;

    container.addEventListener("click", e => {
      if (
        e.target.classList.contains("mesa-normal") ||
        e.target.classList.contains("mesa-vip")
      ) {
        const precioMesa = e.target.dataset.precio;
        const nombreMesa = e.target.dataset.nombre
        const tipoMesa = e.target.dataset.tipo;

        this.mesaSeleccionada = { precioMesa, nombreMesa, tipoMesa };

        if (botonPrevio) {
          botonPrevio.style.background = "";
        }

        const divMesa = container.querySelector(
          `.d-flex[data-nombre="${nombreMesa}"]`
        )
        divMesa.style.background = "#1f2327";
        divMesa.style.opacity = 0.8

        botonPrevio = container.querySelector(
          `.d-flex[data-nombre="${nombreMesa}"]`
        );
      }
    });

  }

  accionRealizar(e) {
    const accionRealizar = e.target.getAttribute('id');

    switch (accionRealizar) {
      case 'consultar-codigo':
        btnReservar.textContent = 'Consultar'
        break;

      case 'cancelar-reserva':
        btnReservar.textContent = 'Cancelar'
        break;

      default:
        btnReservar.textContent = 'Reservar'
        break;
    }
  }

  reservarMesa(e) {
    e.preventDefault();

    // Modal
    const modal = new bootstrap.Modal(modalAccionRealizar.parentElement.parentElement);

    const accionRealizar = containerModalReserva.querySelector('.accion-realizar input:checked').getAttribute('id');



    switch (accionRealizar) {
      case 'reservar':

        if (!this.mesaSeleccionada) {
          this.ui.alerta("Por favor, seleccione una mesa antes de reservar.", 'error')
          return;
        }

        this.ui.modalAccionRealizar(modalAccionRealizar, 'reserva');
        modal.show();

        // Validamos de que el usuario cumpla con los requisitos
        const btnReservar = modalAccionRealizar.querySelector('.modal-footer button')

        btnReservar.onclick = e => this.validarCampos(e, modalAccionRealizar, modal);

        break;

      case 'consultar-codigo':

        this.ui.modalAccionRealizar(modalAccionRealizar);
        modal.show();

        // Validamos de que el usuario cumpla con los requisitos
        const btnConsultar = modalAccionRealizar.querySelector('.modal-footer button')
        btnConsultar.onclick = e => this.validarCampos(e, modalAccionRealizar, modal);


        break;

      default:
        this.ui.modalAccionRealizar(modalAccionRealizar, 'cancelar');
        modal.show();

        // Validamos de que el usuario cumpla con los requisitos
        const btnCanceltar = modalAccionRealizar.querySelector('.modal-footer button')
        btnCanceltar.onclick = e => this.validarCampos(e, modalAccionRealizar, modal);

        break;
    }

  }


  validarCampos(e, containter, modal) {
    e.preventDefault();

    // Modal de anuncios
    const modalAnuncios = new bootstrap.Modal(modalAnunciosContainer.parentElement.parentElement);

    const formulario = containter.querySelector('#formulario');

    if (e.target.textContent === 'Reservar') {
      const nombreInput = containter.querySelector('#nombre-input').value;
      const dniInput = containter.querySelector('#dni-input').value;

      if (validarCamposVacios([nombreInput, dniInput])) {
        this.ui.alerta("Los campos estan vacios", 'error');
        return;
      };

      if (!validarDNI(dniInput)) {
        this.ui.alerta("El DNI tiene que ser número y tener 8 dígitos", 'error');
        return;
      }

      // Agregamos el codio de reserva y si un boleano para saber si realizo el pedido o no
      this.mesaSeleccionada.codigo = generarCodigo();
      this.mesaSeleccionada.pedidoHecho = false;

      if (existeDNI(this.usuariosReserva, dniInput)) {

        if (!validarUsuarioExistente(this.usuariosReserva, dniInput, nombreInput)) {
          this.ui.alerta("El DNI ya ha sido registrado para otra reserva y el nombre no coincide.", 'error');
          return;
        }

        this.usuariosReserva = this.usuariosReserva.map(usuario => {
          if (usuario.nombre === nombreInput && usuario.dni === dniInput) {
            return { ...usuario, reservas: [...(usuario.reservas || []), this.mesaSeleccionada] };
          }
          return usuario;
        })

      } else {
        // Agregamos el usario qie registro Sincronizamos el STORAGE
        this.usuariosReserva = [...this.usuariosReserva, { nombre: nombreInput, dni: dniInput, reservas: [this.mesaSeleccionada] }];
      }

      // Sicronizamos los cambios
      sincronizarStorage('usuarios-reserva', this.usuariosReserva);
  

      // Desabilitamos las mesas que fueron reservadas
      sincronizarStorage('mesas-disponibles', this.desabilitarMesasReservadas());

      // Mostramos el spinner
      this.ui.spinner();

      const codigoReserva = this.mesaSeleccionada.codigo;

      setTimeout(() => {
        // Mostramos su codigo
        this.ui.mostrarCodigoReserva(nombreInput, codigoReserva);

        // Volvemos a crear el HTML
        this.mesasHMTL();
      }, 2000);


    } else if (e.target.textContent === 'Cancelar reserva') {
      const dniInput = containter.querySelector('#dni-input').value;
      const codigoReservaInput = containter.querySelector('#codigo-input').value;

      if (validarCamposVacios([dniInput, codigoReservaInput])) {
        this.ui.alerta("Los campos estan vacios", 'error');
        return;
      }

      if (!validarDNI(dniInput)) {
        this.ui.alerta("El DNI tiene que ser número y tener 8 dígitos", 'error');
        return;
      }

      if (!verificarUsuario(this.usuariosReserva, dniInput, codigoReservaInput)) {
        this.ui.alerta(`El usuario con el DNI ${dniInput} no existe o el código ingresado fue incorrecto`, 'error');
        return;
      }

      // Expiramos la reserva
      expirarReservasClientes(this.usuariosReserva, codigoReservaInput);

      // Habilitamos las mesas que fueron reservadas
      sincronizarStorage('mesas-disponibles', this.desabilitarMesasReservadas());

      this.ui.mostrarAviso(modalAnunciosContainer, `Tu reserva fue cancelado correctamente`);

      // Abrimos el modal
      modalAnuncios.show();

      setTimeout(() => modalAnuncios.hide(), 3000); // Despues de 3 SEGUNDOS cerramos el modal

      // Vovemos a nombrar reservar
      btnReservar.textContent = 'Reservar';

      // Volvemos a iniciar la aplicaciom
      Header.initApp();

    } else {

      const dniInput = containter.querySelector('#dni-input').value;

      if (validarCamposVacios([dniInput])) {
        this.ui.alerta("El campo es obligatorio", 'error');
        return;
      }

      if (!existeDNI(this.usuariosReserva, dniInput)) {
        this.ui.alerta(`No existe ninguna reserva realizada con el DNI: "${dniInput}"`, 'error')
        return;
      }

      const busqueda = this.usuariosReserva.filter(usuario => usuario.dni === dniInput.trim());
      this.ui.mostrarAnuncio(modalAnunciosContainer, busqueda);

      modalAnuncios.show();


    }

    // Cerramos el MODAL
    modal.toggle();

    // Reinicamos el formulario
    formulario.reset();

    // Vaciamos la mesa seleccionada
    this.mesaSeleccionada = '';


  }


}

export default Reserva;
