class UI {

  // <-- SECCION HEADER -->
  modalReserva(container, todasLasMesas) {

    this.limpiarHTML(container);

    // Titulo
    const titleReserva = document.createElement("H2");
    titleReserva.classList.add("text-center");
    titleReserva.textContent = "Sitios disponibles";
    container.appendChild(titleReserva);

    // Mesas
    const divMesasDisponibles = document.createElement("DIV");
    divMesasDisponibles.className =
      "mesas-disponibles my-3 d-flex align-items-center justify-content-center justify-content-around flex-wrap";

    // console.log(this.todasLasMesas)
    todasLasMesas.forEach(mesas => {
      // console.log(mesas)

      const { disponible, nombre, precio, tipo } = mesas;

      if (tipo === 'normal') {
        // Mesas Normales
        const mesaNormales = document.createElement("DIV");
        mesaNormales.className =
          `d-flex align-items-center justify-content-center flex-column mesa-normal ${(disponible) ? 'disponible' : 'no-disponible'}`;
        mesaNormales.style.cursor = 'pointer';
        mesaNormales.style.width = '100px';
        mesaNormales.dataset.nombre = nombre;
        mesaNormales.dataset.precio = precio;
        mesaNormales.dataset.tipo = tipo;
        mesaNormales.innerHTML = `
            <img class="mesa-normal" src="img/iconos/mesa.png" data-nombre="${nombre}" data-precio="${precio}" data-tipo="${tipo}">
            <p class="mb-0 mesa-normal" data-nombre="${nombre}" data-precio="${precio}" data-tipo="${tipo}">Mesa ${nombre}</p>
            `;
        divMesasDisponibles.appendChild(mesaNormales);
      } else {
        // Mesa VIP
        const mesaVip = document.createElement("DIV");
        mesaVip.className =
          `d-flex align-items-center justify-content-center flex-column mesa-vip  ${disponible ? 'disponible' : 'no-disponible'}`;
        mesaVip.style.cursor = 'pointer';
        mesaVip.style.width = '100px';
        mesaVip.dataset.nombre = nombre;
        mesaVip.dataset.precio = precio;
        mesaVip.dataset.tipo = tipo;
        mesaVip.innerHTML = `
           <img class="mesa-vip" src="img/iconos/mesa.png" data-nombre="${nombre}" data-precio="${precio}" data-tipo="${tipo}">
           <p class="mb-0 mesa-vip" data-nombre="${nombre}" data-precio="${precio}" data-tipo="${tipo}">Mesa ${nombre}</p>
           `;

        divMesasDisponibles.appendChild(mesaVip);
      }


    });

    // Accion a realizar
    const accionRealizar = document.createElement('DIV');
    accionRealizar.className = 'accion-realizar d-flex justify-content-center';
    accionRealizar.style.color = '#FFF';

    const checkConsultarCodigo = document.createElement('DIV');
    checkConsultarCodigo.classList.add('form-check', 'mx-2');
    checkConsultarCodigo.innerHTML = `
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="consultar-codigo">
          <label class="form-check-label" for="flexRadioDefault1">
            Consultar código de reserva
          </label>
       `

    const checkCancelarReserva = document.createElement('DIV');
    checkCancelarReserva.classList.add('form-check', 'mx-2');
    checkCancelarReserva.innerHTML = `
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="cancelar-reserva">
          <label class="form-check-label" for="flexRadioDefault1">
          Cancelar Reserva
          </label>
       `

    const checkReservar = document.createElement('DIV');
    checkReservar.classList.add('form-check', 'mx-2');
    checkReservar.innerHTML = `
          <input class="form-check-input" type="radio" name="flexRadioDefault" id="reservar" checked>
          <label class="form-check-label" for="flexRadioDefault1">
          Reservar
          </label>
       `

    accionRealizar.appendChild(checkConsultarCodigo);
    accionRealizar.appendChild(checkCancelarReserva);
    accionRealizar.appendChild(checkReservar);

    // Insertamos en el HTML
    container.appendChild(divMesasDisponibles);
    container.appendChild(accionRealizar);

  }


  modalAccionRealizar(container, tipo) {

    this.limpiarHTML(container);

    const modalHeader = document.createElement('DIV');
    modalHeader.classList.add('modal-header', 'pb-1');
    modalHeader.innerHTML = '<button type="button" class="btn-close d-flex align-items-center" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button></button>';

    const modalBody = document.createElement('DIV');
    modalBody.classList.add('modal-body', 'py-0');

    const modalFooter = document.createElement('DIV');
    modalFooter.classList.add('modal-footer', 'd-flex');
    const btnAccionRealizar = document.createElement('BUTTON');
    btnAccionRealizar.classList.add('btn', 'btn-primary');

    switch (tipo) {
      case 'reserva':

        modalBody.innerHTML = `
        <form id="formulario">
        <h2 class="text-center mx-2">Datos requeridos</h2>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="nombre-input" placeholder="name@example.com">
          <label for="floatingInput">Ingresa tus nombres y apellidos</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="dni-input" placeholder="name@example.com">
          <label for="floatingInput">Ingresa tu DNI</label>
        </div>
        </form>
      `
        btnAccionRealizar.textContent = 'Reservar';
        break;

      case 'cancelar':
        modalBody.innerHTML = `
        <form id="formulario">
        <h2 class="text-center mx-2">Datos requeridos</h2>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="dni-input" placeholder="name@example.com">
          <label for="floatingInput">Ingresa tu DNI</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="codigo-input" placeholder="name@example.com">
          <label for="floatingInput">Ingresa tu código de reserva</label>
        </div>
        </form>
      `
        btnAccionRealizar.textContent = 'Cancelar reserva';
        break;

      default:
        modalBody.innerHTML = `
        <form id="formulario">
        <h2 class="text-center mx-2">Datos requeridos</h2>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="dni-input" placeholder="name@example.com">
          <label for="floatingInput">Ingresa tu DNI</label>
        </div>
        </form>
      `
        btnAccionRealizar.textContent = 'Consultar código';
        break;
    }

    modalFooter.appendChild(btnAccionRealizar);

    container.appendChild(modalHeader);
    container.appendChild(modalBody);
    container.appendChild(modalFooter);

  }

  mostrarAnuncio(container, busquedaUsuario) {

    this.limpiarHTML(container);

    const modalHeader = document.createElement('DIV');
    modalHeader.classList.add('modal-header', 'pb-1');
    modalHeader.innerHTML = '<button type="button" class="btn-close d-flex align-items-center" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button></button>';

    const modalBody = document.createElement('DIV');
    modalBody.classList.add('modal-body', 'py-0', 'consultar-reservas');
    modalBody.style.overflowY = 'auto';
    modalBody.style.maxHeight = '50vh';
    modalBody.style.color = '#FFF';

    busquedaUsuario.forEach(registros => {
      const { dni, nombre, reservas } = registros;

      // Nombre del cliente
      const nombreCliente = document.createElement('H2');
      nombreCliente.classList.add('text-center', 'mx-2');
      nombreCliente.textContent = `Cliente: ${nombre}`;

      // Dni
      const divDNI = document.createElement('DIV');
      divDNI.classList.add('dni-usuario', 'text-center');
      divDNI.innerHTML = `
        <p class="mb-2">DNI</p>
        <span>${dni}</span>
        `
      // Total mesas reservadas 
      const totalMesas = document.createElement('P');
      totalMesas.classList.add('total-mesas');
      totalMesas.innerHTML = `Total de mesas reservadas: <span>${reservas.length}</span`;


      // Mesas reservadas 
      const divMesasReservadas = document.createElement('DIV');
      divMesasReservadas.classList.add('container-fluid', 'mt-3');

      const title = document.createElement('P');
      title.classList.add('mb-1');
      title.textContent = 'Reservas:';

      divMesasReservadas.appendChild(title);

      reservas.forEach(reserva => {
        const { codigo, nombreMesa, precioMesa, tipoMesa } = reserva;

        const divReserva = document.createElement('DIV');
        divReserva.className = 'row mb-3 p-0 d-flex align-items-center text-center';
        divReserva.innerHTML = `
            <div class="col-lg-6 col-md-6 col-12">
              <div class="d-flex justify-content-center align-items-center flex-column">
                <img  class="img-fluid rounded mb-1" src="img/mesa.png">
                <p class="nombre-mesa">${nombreMesa}</p>
              </div>
            </div>
            <div class="col-lg-2 col-md-2 col-4">
              <p class="mb-0">Código:</p>
              <p>${codigo}</p>
            </div>
            <div class="col-lg-2 col-md-2 col-4">
              <p class="mb-0">Precio:</p>
              <p>$.${precioMesa}</p>
            </div>
            <div class="col-lg-2 col-md-2  col-4">
              <p class="mb-0">Tipo:</p>
              <p>${tipoMesa}</p>
            </div>
        `

        divMesasReservadas.appendChild(divReserva);

      })

      modalBody.appendChild(nombreCliente);
      modalBody.appendChild(divDNI);
      modalBody.appendChild(totalMesas);
      modalBody.appendChild(divMesasReservadas);

    })

    // Insertamos en el HTML
    container.appendChild(modalHeader);
    container.appendChild(modalBody);


  }
  // <-- FIN SECCION HEADER -->


  // <-- SECCION PLATILLOS DISPONIBLES -->
  mostrarPlatillosHTML(container, platillos) {

    this.limpiarHTML(container);

    platillos.forEach(platillo => {
      const { id, nombre, cantidad, image, precio } = platillo;

      const platilloDiv = document.createElement('DIV');
      platilloDiv.classList.add('col-sm-12', 'col-md-6', 'col-lg-4');
      platilloDiv.innerHTML = `
          <div class="card mb-3">
            <div class="d-flex justify-content-end mx-3 ${cantidad > 0 ? "" : 'd-none'}" style="position: relative;">
              <p class="cantidad-agregado d-flex align-items-center justify-content-center">${cantidad}x</p>
            </div>
            <img src="${image}" class="card-img-top p-2" alt="${nombre}">
            <p class="imagen-no-disponible text-center mt-5 d-none px-3" style="width:100%; height:280px; font-size: 30px">Imagen no disponible</p>
            <div class="card-body">
              <h5 class="card-title">${nombre}</h5>
                <div class="d-flex justify-content-between">
                <p class="card-text">$${precio}</p>
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                  <button class="btn btn-danger ver-mas-informacion" data-id="${id}">Ver más</a>
                  <button type="button" class="btn btn-success agregar-platillos" data-id="${id}">
                    <i class="bi bi-plus agregar-platillos" data-id="${id}"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
       `

      container.appendChild(platilloDiv);

      // Agregar evento onerror a la imagen
      const imgElement = platilloDiv.querySelector('img');
      if (imgElement) {
        imgElement.onerror = () => {
          imgElement.style.display = 'none'; // Ocultar la imagen
          const imagenNoDisponible = platilloDiv.querySelector('.imagen-no-disponible');
          if (imagenNoDisponible) {
            imagenNoDisponible.classList.remove('d-none'); // Mostrar mensaje de imagen no disponible
          }
        };
      }

    })
  }

  mostrarMasInfoPlatillo(container, platillo) {

    this.limpiarHTML(container);

    const { nombre, precio, image, etiquetaSalud, ingredientes, cantidad } = platillo;

    const divImage = document.createElement('DIV');
    divImage.className = 'col-lg-8 col-md-8 p-3 rounded';
    divImage.style.backgroundColor = '#191d20';
    divImage.innerHTML = `
    <div class="d-flex justify-content-end mx-3 ${cantidad > 0 ? "" : 'd-none'}" style="position: relative;">
    <p class="cantidad-agregado d-flex align-items-center justify-content-center" style="left: 90%">${cantidad}x</p>
    </div>
    <img class="img-fluid w-100 h-100 rounded" src="${image}" alt="${nombre}" style="object-fit: cover;">
    `;

    const divContenidoInfo = document.createElement('DIV');
    divContenidoInfo.className = 'col-lg-4 col-md-4 px-4 mt-3 mt-lg-0 mt-md-0';

    const divInfo = document.createElement('DIV');
    divInfo.classList.add('informacion');
    divInfo.innerHTML = `
        <h3 class="nombre-producto">${nombre}</h3>
        <p class="precio">$${precio}</p>
        <div class="ingredientes-platillo p-3">
            <p class="my-0">INGREDIENTES:</p>
            <ul class="mb-0">${this.ingredientesPlatillo(ingredientes)}</ul>
        </div>
     `
    const divDescripcion = document.createElement('DIV');
    divDescripcion.classList.add('descripcion-platillo', 'p-3', 'my-3');
    divDescripcion.innerHTML = `
      <p class="my-0">ETIQUETA DE SALUD:</p>
      <p class="mb-0" style="text-align: justify;">${this.ingredientesPlatillo(etiquetaSalud)}</p>
    
    `

    const divCantidad = document.createElement('DIV');
    divCantidad.className = 'cantidad d-flex justify-content-center align-items-center';
    divCantidad.innerHTML = `
      <button class="btn btn-menos disminuendo d-flex justify-content-center align-items-center">
          <p class="disminuendo my-0 pb-2">-</p>
      </button>
      <p class="mx-3 mb-0 cantidad-platillos">0</p>
      <button class="btn btn-mas agregando d-flex justify-content-center align-items-center">
          <p class="agregando my-0 pb-2">+</p>
      </button>
    
    `

    const divAgregarCarrito = document.createElement('DIV');
    divAgregarCarrito.className = 'col-md-12 col-lg-8 mt-4 mx-auto';
    divAgregarCarrito.innerHTML = `
          <button class="agregar-platillo btn d-flex justify-content-center align-items-center w-100">
              <i class="agregar-platillo bi bi-cart-plus mx-1"></i>
              <p class="agregar-platillo mb-0 mx-1">Añador al carrito</p>
          </button> 
    `

    divContenidoInfo.appendChild(divInfo);
    divContenidoInfo.appendChild(divDescripcion);
    divContenidoInfo.appendChild(divCantidad);
    divContenidoInfo.appendChild(divAgregarCarrito);


    // Agregamos en el HTML
    container.appendChild(divImage);
    container.appendChild(divContenidoInfo);


  }

  ingredientesPlatillo(ingredientes) {

    const ulIngredientes = document.createElement('UL');

    ingredientes.forEach(ingrediente => {

      const liIngredient = document.createElement('LI');
      liIngredient.textContent = ingrediente;

      ulIngredientes.appendChild(liIngredient);
    })

    return ulIngredientes.innerHTML;
  }

  // <-- FIN SECCION PLATILLOS DISPONIBLES -->


  // <-- SECCION CARRITO PLATILLOS -->
  crearFilasCarrito(container, platillosAgregados) {

    this.limpiarHTML(container);

    if (platillosAgregados.length) {

      platillosAgregados.forEach((platillo, index) => {

        const { id, cantidad, image, nombre, precio } = platillo;

        const trContainer = document.createElement('TR');

        const tdNro = document.createElement('TD');
        tdNro.classList.add('col-lg-2');
        tdNro.textContent = (index + 1);

        const tdImgNombre = document.createElement('TD');
        tdImgNombre.className = "col-lg-3 col-md-3 col-sm-4";
        tdImgNombre.innerHTML = `
        <div class="d-lg-flex justify-content-center align-items-center">
            <div class="position-relative mx-auto" style="width: 150px">
                  <img class="rounded" src="${image}" width="150px" height="60px" style="object-fit: cover;">
                <button class="btn-sm btn-danger ms-auto position-absolute agregar-sugerencia" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal-sugerencia">
                    <i class="bi bi-pencil-fill agregar-sugerencia" data-id="${id}"></i>
                </button>
            </div>
            <p class="m-0">${nombre}</p>
        </div>
      `

        const tdCantidad = document.createElement('TD');
        tdCantidad.classList.add('col-log-2');
        tdCantidad.textContent = cantidad;

        const tdPrecio = document.createElement('TD');
        tdPrecio.classList.add('col-log-2');
        tdPrecio.textContent = `Total: $${precio * cantidad} / Unidad: $${precio}`;

        const tdOpciones = document.createElement('TD');
        tdOpciones.classList.add('col-log-2')
        tdOpciones.innerHTML = `
        <div class="cantidad d-flex justify-content-center align-items-center">
            <button class="btn btn-menos disminuendo d-flex justify-content-center align-items-center" data-id="${id}">
                <p class="disminuendo my-0 pb-2" data-id="${id}">-</p>
            </button>
            <p class="mx-3 mb-0">${cantidad}</p>
            <button class="btn btn-mas agregando d-flex justify-content-center align-items-center" data-id="${id}">
                <p class="agregando my-0 pb-2" data-id="${id}">+</p>
            </button>
        </div>
      `

        trContainer.appendChild(tdNro);
        trContainer.appendChild(tdImgNombre);
        trContainer.appendChild(tdCantidad);
        trContainer.appendChild(tdPrecio);
        trContainer.appendChild(tdOpciones);

        // Agregamos en el HTML
        container.appendChild(trContainer);

      })
      return;
    }

    const trContainer = document.createElement('TR');

    const tdContainer = document.createElement('TD');
    tdContainer.setAttribute('colspan', '5');

    const btnMasProductos = document.createElement('A');
    btnMasProductos.className = 'btn btn-danger mt-5 mx-auto d-flex justify-content-center align-items-center w-50';
    btnMasProductos.href = 'index.html';
    btnMasProductos.innerHTML = `
      <i class="agregar-platillo bi bi-cart-plus mx-sm-1 mx-md-1 mx-ld-1"></i>
      <p class="agregar-platillo mb-0 mx-sm-1 mx-md-1 mx-lg-1">Quiero compras platillos</p>
  `
    tdContainer.appendChild(btnMasProductos);
    trContainer.appendChild(tdContainer);

    // Agregamos el anuncio
    container.appendChild(trContainer);

  }
  // <-- FIN DE SECCION CARRITO PLATILLOS -->


  // <-- SECCION PEDIDOS REALIZADOS -->
  pedidosHTML(container, pedidos) {

    this.limpiarHTML(container);

    if (pedidos.length) {

      pedidos.forEach((pedido, index) => {
        const { codigo, nombres, totalPlatillos, montoTotal, fecha, completado, mesa } = pedido;

        const trContainer = document.createElement('TR');
        trContainer.className = `${ completado ? 'disabled' : '' }`;
        trContainer.innerHTML = `
        <td class="col-lg-2">${index + 1}</td>
        <td class="col-lg-2">${codigo}</td>
        <td class="col-lg-2">${nombres}</td>
        <td class="col-lg-2 ">${totalPlatillos}</td>
        <td class="col-lg-2">$${montoTotal}</td>
        <td class="col-lg-2">${fecha}</td>
        <td class="col-lg-2 operaciones">
          <div class="cantidad d-flex justify-content-center align-items-center">
            <button class="eliminar-pedidos btn btn-menos d-flex justify-content-center align-items-center mx-2" data-cod="${codigo}" data-mesa="${mesa}">
                <i class="eliminar-pedidos bi bi-trash3-fill" data-cod="${codigo}" data-mesa="${mesa}"></i>
            </button>
            <button class="ver-pedidos btn btn-mas d-flex justify-content-center align-items-center mx-2" data-cod="${codigo}" data-bs-toggle="modal" data-bs-target="#modal-datos-completos">
                <i class="ver-pedidos bi bi-book-half" data-cod="${codigo}"></i>
            </button>
            <div class="form-check form-switch">
                 <input class="form-check-input" type="checkbox" role="switch" id="complet" data-cod="${codigo}" data-mesa="${mesa}" data-bs-container="body"
                 data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Pedido completado" ${completado ? 'checked' : ''}>
            </div>
            </div>
        </div>
        </td>      
      `

        // Insertamos en el HTML
        container.appendChild(trContainer);

      })

      return;

    }

    const trContainer = document.createElement('TR');

    const tdContainer = document.createElement('TD');
    tdContainer.setAttribute('colspan', '7');
    tdContainer.innerHTML = '<p>No hay ningun pedido aún</p>';

    trContainer.appendChild(tdContainer);

    // Insertamos en el HTML
    container.appendChild(trContainer);

  }

  modalPedidos(container, pedidoCliente) {

    this.limpiarHTML(container);

    const { codigo, dni, mesa, nombres, platillos, precioReserva, tipo, completado } = pedidoCliente;

    const cliente = document.createElement('H2');
    cliente.classList.add('text-center','mx-2','mb-0');
    cliente.textContent = `Cliente: ${nombres}`

    const dniContenent = document.createElement('P');
    dniContenent.classList.add('text-center');
    dniContenent.textContent = `DNI: ${dni}`;

    const divCodigoReserva = document.createElement('DIV');
    divCodigoReserva.classList.add('codigo-reserva','text-center')
    divCodigoReserva.innerHTML = `
              <p class="mb-2">${ completado ? "PEDIDO" : 'Código de reserva' }</p>
              <span>${completado ? 'COMPLETADO' : codigo}</span>
    `
    const divInfoMesas = document.createElement('DIV');
    divInfoMesas.classList.add('d-flex','justify-content-around','my-3');
    divInfoMesas.innerHTML = `
      <div class="info-mesa text-center">
        <p class="mb-2">MESA</p>
        <span>${mesa}</span>
      </div>
      <div class="info-mesa text-center">
        <p class="mb-2">TIPO</p>
        <span>${tipo}</span>
      </div>
      <div class="info-mesa text-center">
        <p class="mb-2">PRECIO</p>
        <span>$${precioReserva}</span>
      </div>       
    `
    const divPlatillos = document.createElement('DIV');
    divPlatillos.classList.add('container-fluid','mt-4');
      const title = document.createElement('P');
      title.classList.add('mb-1');
      title.textContent = 'PEDIDOS:';

      divPlatillos.appendChild(title);

      platillos.forEach( platillo => {
       
         const { cantidad, image, nombre, precio, sugerencia } = platillo;
         
         const platillosContainer = document.createElement('DIV');
         platillosContainer.classList.add('row','mb-3','p-1');
         platillosContainer.innerHTML = `
           <div class="col-12 p-3">
              <img  class="img-fluid rounded w-100" src="${image}" alt="${nombre}">
           </div>
           <div class="col-6 p-3">
              <p class="mb-1">Platillo: <span>${nombre}</span></p>
              <p class="mb-1">Cantidad: <span>${cantidad}</span></p>
              <p class="mb-1">Precio Total: <span>$${precio*cantidad}</span></p>
              <p class="mb-1">Precio Unidad: <span>$${precio}</span></p>
           </div>
           <div class="col-6 p-3">
               <p class="mb-0">SUGERENCIA:</p>
               <p style="${sugerencia ? '' : 'color: rgba(255, 255, 255, 0.5);'}">${sugerencia ?? 'Ninguna sugerencia por parte del cliente'}</p>
           </div>
         
         `
    divPlatillos.appendChild(platillosContainer);
    
      } )

    // Agregamos en el HTML
    container.appendChild(cliente);
    container.appendChild(dniContenent);
    container.appendChild(divCodigoReserva);
    container.appendChild(divInfoMesas);
    if(!completado) container.appendChild(divPlatillos);

      
    
  }
  // <-- FIN DE SECCION PEDIDOS REALIZADOS -->



  // <-- SECCION COMENTARIOS -->
  mostrarComentarios(container, comentarios) {

    this.limpiarHTML(container);

    if (comentarios.length) {

      comentarios.forEach(coment => {

        const { comentario, fecha, nombre, puntaje } = coment;

        const divComentario = document.createElement('DIV');
        divComentario.classList.add('col-lg-4', 'col-md-6', 'mb-3');

        const datosClientes = document.createElement('DIV');
        datosClientes.className = 'datos-cliente d-flex align-items-center px-4';
        const divNombre = document.createElement('DIV');
        divNombre.className = 'nombres pt-3 px-2 text-center';
        divNombre.innerHTML = `
            <div class="rounded-circle d-flex align-items-center justify-content-center">${nombre.substring(0, 1).toUpperCase()}</div>
            <p class="mb-0">${nombre}</p>
         `
        const divComent = document.createElement('DIV');
        divComent.classList.add('comentario', 'pt-3', 'px-2');
        divComent.innerHTML = `<p>${comentario}</p>`

        datosClientes.appendChild(divNombre);
        datosClientes.appendChild(divComent);



        const divPuntaje = document.createElement('DIV');
        divPuntaje.classList.add('puntaje', 'text-center', 'pb-1');
        const divCalificacion = document.createElement('DIV');
        divCalificacion.className = 'calificacion d-flex justify-content-center mx-auto justify-content-around mb-0';

        for (let i = 1; i <= 5; i++) {

          const labelPuntaje = document.createElement('LABEL');

          if (i <= Number(puntaje)) {
            labelPuntaje.innerHTML = '<i class="bi bi-star" style="color: orange">';
          } else {
            labelPuntaje.innerHTML = '<i class="bi bi-star">';
          }

          divCalificacion.appendChild(labelPuntaje);

        }

        const parrafoFecha = document.createElement('P');
        parrafoFecha.classList.add('fecha-actual');
        parrafoFecha.textContent = fecha;


        divPuntaje.appendChild(divCalificacion);
        divPuntaje.appendChild(parrafoFecha);


        divComentario.appendChild(datosClientes);
        divComentario.appendChild(divPuntaje);


        // Insertamos en el HTML
        container.appendChild(divComentario);

      })

      return;

    }

    const anuncioVacio = document.createElement('DIV');
    anuncioVacio.classList.add('text-center');
    anuncioVacio.style.fontSize = '20px';
    anuncioVacio.textContent = 'Ningun comentario por el momento';

    container.appendChild(anuncioVacio);

  }

  // <-- FIN SECCION COMENTARIOS -->

  mostrarAviso(container, mensaje) {

    this.limpiarHTML(container);

    const modalHeader = document.createElement('DIV');
    modalHeader.classList.add('modal-header', 'pb-0');
    modalHeader.innerHTML = '<button type="button" class="btn-close d-flex align-items-center" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-lg"></i></button></button>';

    const modalBody = document.createElement('DIV');
    modalBody.className = 'modal-body pb-4 d-flex flex-column align-items-center justify-content-center aviso';
    modalBody.style.color = '#FFF';
    modalBody.innerHTML = `
      <i class="bi bi-check-circle-fill"></i>
      <h5 class="mensaje">${mensaje}</h5>
    `
    container.appendChild(modalHeader);
    container.appendChild(modalBody);
  }

  mostrarCodigoReserva(nombre, codigo) {
    Swal.fire({
      title: `${nombre} tu mesa fue reservado correctamente`,
      input: 'text',
      inputLabel: 'Tu codigo es:',
      inputValue: codigo,
      confirmButtonText: 'Aceptar',
      inputAttributes: {
        // Aquí deshabilitamos el input
        disabled: true
      },
      customClass: {
         title: 'title-codigo',
         inputLabel: 'input-label-codigo',
         input: 'input-codigo',
         confirmButton: 'btn-codigo'
      },
      background: '#191d20',
      confirmButtonColor: '#d01414'
    });
  }

  alerta( mensaje, tipo ) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: tipo ?? 'success',
      title: mensaje
    })
  }

  alertaConfirmar(mensaje, aviso) {
    return new Promise( resolve => {
      Swal.fire({
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire( '', aviso, 'success' )
          resolve(true);
        } else {
          resolve(false);
        }
      })
    } )
  }

  spinner() {
    Swal.fire({
      html: `
      <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
      </div>
      `,
      showConfirmButton: false, // Ocultar el botón de confirmación
      allowOutsideClick: false, // Evitar que se cierre haciendo clic fuera del modal
      allowEscapeKey: false, // Evitar que se cierre con la tecla "Esc"
      background: "transparent",
      timer: 3000,
    });
  }
   
  limpiarHTML(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}


export default UI;

