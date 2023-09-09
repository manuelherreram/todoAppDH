// Utilizamos 'DOMContentLoaded' en lugar de 'load' para que el código se ejecute cuando el DOM esté listo.
document.addEventListener('DOMContentLoaded', () => {
    /* ---------------------- Obtenemos elementos DOM ---------------------- */
    const form = document.querySelector('form');
    const email = document.querySelector('#inputEmail');
    const password = document.querySelector('#inputPassword');
    const url = 'https://todo-api.ctd.academy/v1';
  
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el evento submit y preparamos el envío     */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // Creamos el cuerpo de la solicitud (petición al servidor)
      const payload = {
        email: email.value,
        password: password.value,
      };
  
      // Mostramos el objeto que recibimos del formulario en la consola
      console.log(payload);
  
      // Configuramos la solicitud Fetch
      const settings = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      try {
        // Realizamos la consulta de inicio de sesión a la API y esperamos la respuesta.
        const data = await realizarLogin(settings);
        console.log('Promesa cumplida💍');
        console.log(data);
  
        if (data.jwt) {
          // Guardamos el token JWT en el almacenamiento local (este token de autenticación)
          localStorage.setItem('jwt', JSON.stringify(data.jwt));
  
          // Redireccionamos a nuestro panel de tareas
          // window.location.replace('./mis-tareas.html');
        }
      } catch (error) {
        console.warn('Promesa rechazada');
        console.error(error);
  
        if (error.status === 400) {
          console.warn('Contraseña incorrecta');
          alert('Contraseña incorrecta');
        } else if (error.status === 404) {
          console.warn('El usuario no existe');
          alert('El usuario no existe');
        } else {
          console.error('Error del servidor | URL no existe');
          alert('Error del servidor | URL no existe');
        }
      }
  
      // Limpiamos el formulario
      form.reset();
    });
  
    /* -------------------------------------------------------------------------- */
    /*                FUNCIÓN 2: Realizar el inicio de sesión [POST]              */
    /* -------------------------------------------------------------------------- */
    async function realizarLogin(settings) {
      console.log('Lanzando la consulta a la API...');
      const response = await fetch(`${url}/users/login`, settings);
  
      if (!response.ok) {
        throw {
          status: response.status,
          message: 'Error en la solicitud de inicio de sesión',
        };
      }
  
      return response.json();
    }
  });
  