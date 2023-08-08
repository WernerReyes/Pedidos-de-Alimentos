class Api {

    async obtenerDatos(platillo) {

      try {  
        const appId = 'f0d1f2d5'; // Reemplaza con tu ID de aplicación de Edamam
        const appKey = '9867f6668835eb4ded8efde599d71fef'; // Reemplaza con tu clave de aplicación de Edamam

        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${platillo}&app_id=${appId}&app_key=${appKey}`;

       const respuesta = await fetch(url);
       const datos = await respuesta.json();

       return datos;

      } catch(error) {
        console.log("Error al obtener los datos: ", error );
        return null;
      }
    }





}

export default Api;