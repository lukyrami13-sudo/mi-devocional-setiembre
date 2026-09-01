// =====================================================
// CONFIGURACIÓN
// =====================================================

// true = usamos una fecha manual para probar
// false = usamos automáticamente la fecha real

const MODO_PRUEBA = false;


// =====================================================
// FECHA DE PRUEBA
// =====================================================

// Cambiá solamente esta fecha cuando quieras probar otro día.

const FECHA_PRUEBA = "2026-09-08";


// =====================================================
// CARGAR DEVOCIONALES
// =====================================================

fetch("devocional/septiembre.json")

    .then(respuesta => {

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo encontrar septiembre.json"
            );

        }

        return respuesta.json();

    })

    .then(devocionales => {


        // =================================================
        // FECHA ACTUAL
        // =================================================

        let fechaHoy;


        if (MODO_PRUEBA) {

            // IMPORTANTE:
            // No usamos new Date() para evitar problemas
            // con la zona horaria de Uruguay.

            fechaHoy = FECHA_PRUEBA;

        } else {

            const fechaActual = new Date();

            const año =
                fechaActual.getFullYear();

            const mes =
                String(
                    fechaActual.getMonth() + 1
                ).padStart(2, "0");

            const dia =
                String(
                    fechaActual.getDate()
                ).padStart(2, "0");

            fechaHoy =
                `${año}-${mes}-${dia}`;

        }


        console.log("Fecha que está buscando:", fechaHoy);


        // =================================================
        // ELEMENTOS HTML
        // =================================================

        const fechaElemento =
            document.getElementById("fecha");

        const tituloElemento =
            document.getElementById("titulo");

        const pasajeElemento =
            document.getElementById("pasaje");

        const reflexionElemento =
            document.getElementById("reflexion");

        const cartaSorpresa =
            document.getElementById("carta-sorpresa");

        const botonAnteriores =
            document.getElementById("anteriores");

        const listaAnteriores =
            document.getElementById("lista-anteriores");

        const botonVolverHoy =
            document.getElementById("volver-hoy");

        const botonCompartir =
            document.getElementById("compartir");

        const botonDescargar =
            document.getElementById("descargar");

        const devocionalPrincipal =
            document.querySelector(
                ".devocional-principal"
            );


        // =================================================
        // BUSCAR DEVOCIONAL DE HOY
        // =================================================

        const devocionalHoy =
            devocionales.find(
                item =>
                    item.fecha === fechaHoy
            );


        console.log(
            "Devocional encontrado:",
            devocionalHoy
        );


        // =================================================
        // DEVOCIONAL MOSTRADO
        // =================================================

        let devocionalMostrado = null;


        // =================================================
        // FORMATEAR FECHA
        // =================================================

        function formatearFecha(fecha) {

            const partes =
                fecha.split("-");

            if (partes.length !== 3) {

                return fecha;

            }

            const año =
                Number(partes[0]);

            const mes =
                Number(partes[1]) - 1;

            const dia =
                Number(partes[2]);

            const fechaFormateada =
                new Date(
                    año,
                    mes,
                    dia
                );

            return fechaFormateada.toLocaleDateString(
                "es-UY",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        }


        // =================================================
        // OBTENER IMAGEN
        // =================================================

        function obtenerImagen(devocional) {

            // Primero usamos la imagen indicada
            // directamente en el JSON.

            if (devocional.imagen) {

                return devocional.imagen;

            }


            // Si por algún motivo no existe,
            // intentamos construirla.

            const partes =
                devocional.fecha.split("-");

            if (partes.length !== 3) {

                return null;

            }

            const numeroDia =
                partes[2];

            return `img.devocional/${numeroDia}.jpeg`;

        }


        // =================================================
        // MOSTRAR DEVOCIONAL
        // =================================================

        function mostrarDevocional(devocional) {

            devocionalMostrado =
                devocional;


            // =================================================
            // FECHA
            // =================================================

            fechaElemento.textContent =
                formatearFecha(
                    devocional.fecha
                );


            // =================================================
            // TÍTULO
            // =================================================

            tituloElemento.textContent =
                devocional.titulo;


            // =================================================
            // PASAJE
            // =================================================

            pasajeElemento.textContent =
                devocional.pasaje;


            // =================================================
            // REFLEXIÓN
            // =================================================

            reflexionElemento.textContent =
                devocional.reflexion;


            // =================================================
            // IMAGEN
            // =================================================

            if (devocionalPrincipal) {

                const imagen =
                    obtenerImagen(
                        devocional
                    );

                console.log(
                    "Imagen utilizada:",
                    imagen
                );


                if (imagen) {

                    devocionalPrincipal.style.backgroundImage =
                        `
                        linear-gradient(
                            to bottom,
                            rgba(0, 0, 0, 0.65) 0%,
                            rgba(0, 0, 0, 0.20) 25%,
                            rgba(0, 0, 0, 0.20) 65%,
                            rgba(0, 0, 0, 0.90) 100%
                        ),
                        url("${imagen}")
                        `;

                }

            }


            // =================================================
            // CARTA
            // =================================================

            cartaSorpresa.innerHTML = "";


            if (
                devocional.carta &&
                devocional.carta.trim() !== ""
            ) {

                cartaSorpresa.innerHTML =
                    `
                    <div class="carta">

                        <h2>
                            💌 Una carta para vos
                        </h2>

                        <p>
                            ${devocional.carta}
                        </p>

                    </div>
                    `;

            }

        }


        // =================================================
        // MOSTRAR DEVOCIONAL DE HOY
        // =================================================

        if (devocionalHoy) {

            mostrarDevocional(
                devocionalHoy
            );

        } else {

            fechaElemento.textContent =
                formatearFecha(
                    fechaHoy
                );

            tituloElemento.textContent =
                "Devocional no disponible";

            pasajeElemento.textContent =
                "Todavía no hay un devocional disponible para este día.";

            reflexionElemento.textContent =
                "";

            cartaSorpresa.innerHTML =
                "";

        }


        // =================================================
        // BOTÓN VOLVER AL DÍA DE HOY
        // =================================================

        if (botonVolverHoy) {

            botonVolverHoy.addEventListener(
                "click",
                () => {

                    if (!devocionalHoy) {

                        return;

                    }

                    mostrarDevocional(
                        devocionalHoy
                    );

                    botonVolverHoy.classList.remove(
                        "visible"
                    );

                    const seccion =
                        document.getElementById(
                            "devocional-del-dia"
                        );

                    if (seccion) {

                        seccion.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        }


        // =================================================
        // DEVOCIONALES ANTERIORES
        // =================================================

        const anteriores =
            devocionales
                .filter(
                    item =>
                        item.fecha < fechaHoy
                )
                .sort(
                    (a, b) =>
                        b.fecha.localeCompare(
                            a.fecha
                        )
                );


        // =================================================
        // BOTÓN DEVOCIONALES ANTERIORES
        // =================================================

        if (
            botonAnteriores &&
            listaAnteriores
        ) {

            botonAnteriores.addEventListener(
                "click",
                () => {

                    if (
                        listaAnteriores.classList.contains(
                            "visible"
                        )
                    ) {

                        listaAnteriores.classList.remove(
                            "visible"
                        );

                        return;

                    }


                    listaAnteriores.innerHTML =
                        "";


                    if (
                        anteriores.length === 0
                    ) {

                        listaAnteriores.innerHTML =
                            `
                            <p class="sin-anteriores">
                                Todavía no hay
                                devocionales anteriores.
                            </p>
                            `;

                        listaAnteriores.classList.add(
                            "visible"
                        );

                        return;

                    }


                    anteriores.forEach(
                        devocional => {

                            const tarjeta =
                                document.createElement(
                                    "div"
                                );

                            tarjeta.classList.add(
                                "devocional-anterior"
                            );

                            tarjeta.innerHTML =
                                `
                                <span class="fecha-anterior">
                                    ${formatearFecha(
                                        devocional.fecha
                                    )}
                                </span>

                                <strong>
                                    ${devocional.titulo}
                                </strong>

                                <span class="flecha-anterior">
                                    →
                                </span>
                                `;


                            tarjeta.addEventListener(
                                "click",
                                () => {

                                    mostrarDevocional(
                                        devocional
                                    );


                                    if (
                                        botonVolverHoy
                                    ) {

                                        botonVolverHoy.classList.add(
                                            "visible"
                                        );

                                    }


                                    listaAnteriores.classList.remove(
                                        "visible"
                                    );


                                    const seccion =
                                        document.getElementById(
                                            "devocional-del-dia"
                                        );


                                    if (seccion) {

                                        seccion.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start"
                                        });

                                    }

                                }
                            );


                            listaAnteriores.appendChild(
                                tarjeta
                            );

                        }
                    );


                    listaAnteriores.classList.add(
                        "visible"
                    );

                }
            );

        }


        // =================================================
        // COMPARTIR
        // =================================================

        if (botonCompartir) {

            botonCompartir.addEventListener(
                "click",
                async () => {

                    if (!devocionalMostrado) {

                        alert(
                            "No hay un devocional disponible para compartir."
                        );

                        return;

                    }


                    const textoCompartir =
                        `
${devocionalMostrado.titulo}

${devocionalMostrado.pasaje}

${devocionalMostrado.reflexion}

Mi Devocional
                        `.trim();


                    if (navigator.share) {

                        try {

                            await navigator.share({

                                title:
                                    devocionalMostrado.titulo,

                                text:
                                    textoCompartir,

                                url:
                                    window.location.href

                            });

                        } catch (error) {

                            console.log(
                                "Compartir cancelado."
                            );

                        }

                    } else {

                        try {

                            await navigator.clipboard.writeText(
                                textoCompartir
                            );

                            alert(
                                "El devocional fue copiado. Ahora podés compartirlo."
                            );

                        } catch (error) {

                            alert(
                                "No se pudo copiar el devocional."
                            );

                        }

                    }

                }
            );

        }


        // =====================================================
        // DESCARGAR DEVOCIONAL COMO IMAGEN
        // =====================================================

        if (botonDescargar) {

            botonDescargar.addEventListener(
                "click",
                async () => {

                    if (!devocionalMostrado) {

                        alert(
                            "No hay un devocional disponible para descargar."
                        );

                        return;
                    }


                    try {

                        botonDescargar.textContent =
                            "Creando imagen...";


                        const tarjetaImagen =
                            document.createElement("div");


                        tarjetaImagen.style.position =
                            "fixed";

                        tarjetaImagen.style.left =
                            "-10000px";

                        tarjetaImagen.style.top =
                            "0";

                        tarjetaImagen.style.width =
                            "1080px";

                        tarjetaImagen.style.height =
                            "1350px";

                        tarjetaImagen.style.overflow =
                            "hidden";

                        tarjetaImagen.style.display =
                            "flex";

                        tarjetaImagen.style.flexDirection =
                            "column";

                        tarjetaImagen.style.justifyContent =
                            "center";

                        tarjetaImagen.style.alignItems =
                            "center";

                        tarjetaImagen.style.textAlign =
                            "center";

                        tarjetaImagen.style.padding =
                            "100px";

                        tarjetaImagen.style.boxSizing =
                            "border-box";

                        tarjetaImagen.style.color =
                            "#ffffff";

                        tarjetaImagen.style.fontFamily =
                            'Georgia, "Times New Roman", serif';


                        // =================================================
                        // IMAGEN DE FONDO
                        // =================================================

                        tarjetaImagen.style.backgroundImage =
                            `
                            linear-gradient(
                                rgba(0,0,0,0.45),
                                rgba(0,0,0,0.82)
                            ),
                            url("${obtenerImagen(
                                devocionalMostrado
                            )}")
                            `;

                        tarjetaImagen.style.backgroundSize =
                            "cover";

                        tarjetaImagen.style.backgroundPosition =
                            "center";


                        // =================================================
                        // CONTENIDO
                        // =================================================

                        tarjetaImagen.innerHTML =
                            `
                            <div style="
                                width: 100%;
                                position: relative;
                                z-index: 2;
                            ">

                                <div style="
                                    font-family: Arial, sans-serif;
                                    font-size: 26px;
                                    letter-spacing: 4px;
                                    text-transform: uppercase;
                                    color: #d4b779;
                                    margin-bottom: 35px;
                                ">
                                    ${formatearFecha(
                                        devocionalMostrado.fecha
                                    )}
                                </div>


                                <div style="
                                    width: 80px;
                                    height: 2px;
                                    background: #c7a76a;
                                    margin: 0 auto 40px;
                                "></div>


                                <h1 style="
                                    font-size: 65px;
                                    line-height: 1.15;
                                    font-weight: normal;
                                    margin: 0 0 45px;
                                    text-shadow:
                                        0 4px 20px rgba(0,0,0,0.8);
                                ">
                                    ${devocionalMostrado.titulo}
                                </h1>


                                <p style="
                                    font-size: 34px;
                                    line-height: 1.6;
                                    font-style: italic;
                                    color: #eee8dc;
                                    margin: 0 auto;
                                    max-width: 850px;
                                ">
                                    ${devocionalMostrado.pasaje}
                                </p>

                            </div>


                            <div style="
                                position: absolute;
                                bottom: 55px;
                                left: 0;
                                width: 100%;
                                text-align: center;
                                font-family: Arial, sans-serif;
                                font-size: 22px;
                                letter-spacing: 2px;
                                color: #c7a76a;
                            ">
                                Mi Devocional
                            </div>
                            `;


                        document.body.appendChild(
                            tarjetaImagen
                        );


                        await new Promise(
                            resolve =>
                                setTimeout(
                                    resolve,
                                    300
                                )
                        );


                        const canvas =
                            await html2canvas(
                                tarjetaImagen,
                                {
                                    width: 1080,
                                    height: 1350,
                                    scale: 1,
                                    useCORS: true,
                                    allowTaint: false,
                                    backgroundColor:
                                        "#000000",
                                    logging: false
                                }
                            );


                        const enlace =
                            document.createElement("a");


                        enlace.download =
                            `devocional-${devocionalMostrado.fecha}.png`;


                        enlace.href =
                            canvas.toDataURL(
                                "image/png"
                            );


                        document.body.appendChild(
                            enlace
                        );


                        enlace.click();


                        document.body.removeChild(
                            enlace
                        );


                        document.body.removeChild(
                            tarjetaImagen
                        );


                    } catch (error) {

                        console.error(
                            "Error al crear la imagen:",
                            error
                        );

                        alert(
                            "No se pudo crear la imagen del devocional."
                        );

                    }


                    botonDescargar.textContent =
                        "Descargar devocional";

                }
            );

        }

    })

    // =====================================================
    // ERROR GENERAL
    // =====================================================

    .catch(error => {

        console.error(
            "No se pudo cargar el devocional:",
            error
        );

    });