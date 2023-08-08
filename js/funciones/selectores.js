// SELECTORES PARA RESERVAR
export const containerModalReserva = document.querySelector('#modal-reserva .modal-body');
export const btnReservar = document.querySelector('#modal-reserva .modal-footer button');
export const modalAccionRealizar = document.querySelector('#modal-datos .modal-content');
export const modalAnunciosContainer = document.querySelector('#modal-anuncios .modal-content');

// SELECTOR PARA CARRITO
export const containerPlatillosAgregados = document.querySelector('#navbars .carrito');

// SELECTOR PARA PEDIDOS
export const containerPedidosRealizados = document.querySelector('#navbars .pedidos');

// SELECTORES PARA COMENTAR
export const modalComentariosContainer = document.querySelector('#modal-comentarios .modal-body');
export const btnEnviarComentario = document.querySelector('#modal-comentarios .modal-footer button');
export const comentariosContainer = document.querySelector('#comentarios .row');

// VABIABLES DEL LOCAL STORAGE
export let localPlatillosData = JSON.parse(localStorage.getItem('platillosData')) ?? [];
export let localTodosLosPlatillos = JSON.parse(localStorage.getItem('total-platillos')) ?? [];
export let localPlatillosAgregados = JSON.parse(localStorage.getItem('platillos')) ?? [];
export let localUsuariosReservados = JSON.parse(localStorage.getItem('usuarios-reserva')) ?? [];
export let localPedidosRealizados = JSON.parse(localStorage.getItem('pedidos')) ?? [];
export let localComentarios = JSON.parse(localStorage.getItem('comentarios')) ?? [];
export let localMesasDisponibles = JSON.parse(localStorage.getItem('mesas-disponibles')) ?? [];
