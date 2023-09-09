// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

if (!localStorage.jwt) {
  console.log("no tengo la propiedad jwt");
  location.replace("./index.html")
  
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.getElementById("closeApp");
  const formCrearTarea = document.forms[0];
  const url ="https://todo-api.ctd.academy/v1";
  const urlTareas= "https://todo-api.ctd.academy/v1/taks";
  const token = JSON.parse(localStorage.jwt);


 const username =document.querySelector("p")
 const tarea =document.getElementById("nuevaTarea")
 obtenerNombreUsuario()

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    if(confirm("¿Está seguro que quiere cerrar sesión?")){
      localStorage.clear();
      location.replace("./index.html");}
  })
  

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

    

  function obtenerNombreUsuario() {
    const settings={
      method: "GET",
      headers: {
      authorization: token
      }
    }
    fetch(`${url}/users/getMe`,settings)

      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data=> {
        
  console.log(data);

      
      })
      .catch(error=> {
        console.error(error);
      });
  }
  //para agregarlo en pantalla cuando tenga la const datos de usuario

      
      username.textContent= `${token.firstname}`

      obtenerNombreUsuario()



  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const settings ={
      method: "GET",
      headers:{
        authorization: token
      }
     }
     console.log("consultando tareas");
     fetch(urlTareas, settings)
     .then (response=> response.json)
     .then (tareas=>{
      console.log("tareas del usuario");
      renderizarTareas()
      botonesCambioEstado()
      botonBorrarTarea()
     })
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();


    const payload={
      description	:tarea.value.trim(),
    }
    const settings={
      method: "POST",
      body:JSON.stringify(payload),
      headers: {
        "content-type":"aplication /json",
      authorization: token
      }
    }

    fetch (urlTareas, settings)
      .then(response=>response)
    

    const tareasPendientes=document.querySelector('.tareas-pendientes')
    console.log(tareasPendientes);
    

  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {}

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {}

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {}
});
