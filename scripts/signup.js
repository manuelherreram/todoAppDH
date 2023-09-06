window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form= document.forms[0]
    const firstName=document.getElementById("inputNombre")
    const lastName=document.getElementById("inputApellido")
    const email=document.getElementById("inputEmail")
    const password= document.getElementById("inputPassword")
    const url="https://todo-api.ctd.academy/v1"
    const btn=document.querySelector("button")
    const passwordrep=document.getElementById("inputPasswordRepetida")

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        
        
        const payload = {
            firstName:firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        }
        console.log(payload);
        const settings = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        // Lanzamos la consulta del login a la API
        realizarRegister(settings)
        
        // Limpiamos el formulario
        form.reset()
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        console.log("Lanzar la consulta a la API...");

        fetch(`${url}/users`, settings)
            .then(response => {
                console.log(response);

                // manejar el error de la request.
                return response.json()

            })
            .then(data => {
                console.log("Its works");
                console.log(data);

                if (data.jwt) {
                    // Guardamos el dato jwt en el local storage (este token de autenticación)
                    localStorage.setItem("jwt", JSON.stringify(data.jwt))

                    // redireccionamos a nuestro dashboard de todo
                    location.replace("./mis-tareas.html")
                }

            })
            .catch(err => {
                console.warn("Promesa rechazada ");
                console.log(err);
                if (err.status == 400) {
                    console.warn("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto")
                    alert("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto")
                } else {
                    console.error("Error del servidor | url no existe")
                    alert("Error del servidor | url no existe")
                }
            })



        




    };


});