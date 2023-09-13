// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

if (!localStorage.jwt) {
  console.log("no tengo la propiedad jwt");
  location.replace("./index.html");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.getElementById("closeApp");
  const formCrearTarea = document.forms[0];
  const url = "https://todo-api.ctd.academy/v1";
  const urlTareas = `${url}/tasks`;
  const token = JSON.parse(localStorage.jwt);
  const username = document.querySelector(".user-info p ");
  const tareacreada = document.getElementById("nuevaTarea");

  //llamada a la función
  obtenerNombreUsuario();
 

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    if (confirm("¿Está seguro que quiere cerrar sesión?")) {
      localStorage.clear();
      location.replace("./index.html");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */
  function obtenerNombreUsuario() {
    const settings = {
      method: "GET",
      headers: {
        authorization: token,
      },
    };
    fetch(`${url}/users/getMe`, settings)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data.firstName);
        username.textContent = data.firstName;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */
  
  function consultarTareas() {
    const settings = {
      method: "GET",
      headers: {
        authorization: token,
      },
    };
    console.log("consultando tareas");
    fetch(urlTareas, settings)
      .then((response) => response.json())
      .then((tareas) => {
        console.log("tareas del usuario");
        console.log(tareas);

        renderizarTareas(tareas);
        botonesCambioEstado();
        botonBorrarTarea();
      })

      .catch((err) => console.log(err));
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();

    const payload = {
      description: tareacreada.value.trim(),
      completed:false
    };
    const settings = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    };
    console.log("creo una nueva tarea");

    fetch(urlTareas, settings)
      .then((response) => response.json())
      .then((quehacer) => {
        console.log(quehacer);
        consultarTareas();
      })

      .catch((err) => console.log(err));

    formCrearTarea.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(tareas) {
    const tareasPendientes = document.querySelector(".tareas-pendientes");
    const tareasTerminadas = document.querySelector(".tareas-terminadas");
    tareasPendientes.innerHTML = " ";
    tareasTerminadas.innerHTML = " ";
    const cantFinalizadas = document.getElementById("cantidad-finalizadas");
    
    let contador = 0;
    cantFinalizadas.textContent = contador;
    
   //<h2>Tareas pendientes <span id="cantidad-pendientes">0</span></h2> AGREGAR
    tareas.forEach((tarea) => {
      let fecha = new Date(tarea.createdAt);

      if (tarea.completed) {
        contador++
        tareasTerminadas.innerHTML += `
          <li class="tarea">
            <div class="hecha">
                <i class="fa-regular fa-cicle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}"><i class="fa-solid fa-rotate"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
         </li>`;
        }else {
        tareasPendientes.innerHTML += `
        <li class="tarea">
          <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${fecha.toLocaleDateString()}</p>
      </div>
    </li>`;
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btncambioEstado = document.querySelectorAll(".change")
    btncambioEstado.forEach(btn =>{
      btn.addEventListener("click",(ev)=>{
        console.log("cambiando estado de la tarea")
        console.log(ev);
        console.log(ev.target.id);

        const id= ev.target.id
        const url= `${urlTareas}/${id}`
        const payload ={}
        if(ev.target.classList.contains("incompleta")){
          payload.completed= false
        }else{
          payload.completed= true
        }

        const settingsCambio={
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
          body: JSON.stringify(payload),
        }
        fetch(url,settingsCambio)
        .then(response=> {
          console.log(response.status);
          consultarTareas()
        })
        .catch(err => {
          console.warn("Promesa rechazada");
          console.log(err);
          if (err.status == 400) {
              console.warn("id inválido")
              alert("id inválido")
          }else if (err.status == 401) {
                console.warn("Requiere Autorización")
                alert("Requiere Autorización")
          } else if (err.status == 404) {
              console.warn("Tarea inexistente")
              alert("Tarea inexistente")
          } else {
              console.error("Error del servidor")
              alert("Error del servidor")
          }
      })
      
      })

    })
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const btnBorrarTarea=document.querySelectorAll(".borrar")
    btnBorrarTarea.forEach(boton => {
      boton.addEventListener("click",(e)=>{
        e.preventDefault()

        const id= e.target.id
        const url= `${urlTareas}/${id}`
                

        const settingsDelete={
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        }
        fetch(url,settingsDelete)
        .then(response=>{
           console.log(response.status)
           alert("Tarea eliminada satisfactoriamente");
          consultarTareas()})
        .catch(err => {
            console.warn("Promesa rechazada");
            console.log(err);
            if (err.status == 400) {
                console.warn("id inválido")
                alert("id inválido")
            }else if (err.status == 401) {
                  console.warn("Requiere Autorización")
                  alert("Requiere Autorización")
            } else if (err.status == 404) {
                console.warn("Tarea inexistente")
                alert("Tarea inexistente")
            } else {
                console.error("Error del servidor")
                alert("Error del servidor")
            }
        })


      
    });
   
    })
  }
});
