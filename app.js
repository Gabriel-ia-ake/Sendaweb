// Controles de Accesibilidad Directos (Escalado de fuente y Contraste)
let tamanoFuente = 100; 

function cambiarTamanoLetra(cambio) {
    tamanoFuente += cambio;
    if (tamanoFuente < 50) tamanoFuente = 50; 
    document.documentElement.style.fontSize = tamanoFuente + '%';
    if(cambio > 0) leerTexto("Texto agrandado");
    else leerTexto("Texto reducido");
}

function toggleAltoContraste() {
    document.documentElement.classList.toggle('tema-oscuro');
    if (document.documentElement.classList.contains('tema-oscuro')) leerTexto("Modo de alto contraste activado");
    else leerTexto("Modo de colores suaves activado");
}

// Lectura de Texto con Feedback Visual Sincronizado
function leerTexto(texto, idTarjeta = null) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        
        const todasLasTarjetas = document.querySelectorAll('.tarjeta-leyendo');
        todasLasTarjetas.forEach(t => t.classList.remove('tarjeta-leyendo'));

        const mensaje = new SpeechSynthesisUtterance(texto);
        mensaje.lang = 'es-ES'; 
        mensaje.rate = 0.9; 
        
        if (idTarjeta) {
            const tarjetaTarget = document.getElementById(idTarjeta);
            if(tarjetaTarget) {
                mensaje.onstart = function() { tarjetaTarget.classList.add('tarjeta-leyendo'); };
                mensaje.onend = function() { tarjetaTarget.classList.remove('tarjeta-leyendo'); };
            }
        }

        window.speechSynthesis.speak(mensaje);
    }
}

// Reconocimiento de Voz Inteligente con Estado Visual Activo
function iniciarMicrofono() {
    const cajaResultado = document.getElementById('caja-resultado-voz');
    const resultadoTexto = document.getElementById('resultado-voz');
    const botonMicro = document.getElementById('btn-micro');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES'; 
        
        recognition.onstart = function() {
            cajaResultado.classList.remove('oculta'); 
            botonMicro.classList.add('escuchando'); 
            resultadoTexto.innerHTML = "Escuchando... <br>Diga 'Banco' o 'Ambulancia'";
        };
        
        recognition.onresult = function(event) {
            botonMicro.classList.remove('escuchando'); 
            const transcripcion = event.results[0][0].transcript.toLowerCase();
            resultadoTexto.innerHTML = "Usted dijo: <br> <span style='color: #ffeb3b; font-weight: bold;'>" + transcripcion + "</span>";
            
            let destinoId = "";
            let mensajeVoz = "";

            if (transcripcion.includes("ambulancia") || transcripcion.includes("samu") || transcripcion.includes("emergencia")) {
                destinoId = "seccion-samu";
                mensajeVoz = "Llevándote a la sección de ambulancias";
            } else if (transcripcion.includes("bombero") || transcripcion.includes("incendio") || transcripcion.includes("accidente")) {
                destinoId = "seccion-bomberos";
                mensajeVoz = "Llevándote a los bomberos";
            } else if (transcripcion.includes("salud") || transcripcion.includes("essalud") || transcripcion.includes("médico") || transcripcion.includes("medico")) {
                destinoId = "seccion-essalud";
                mensajeVoz = "Llevándote a Es Salud";
            } else if (transcripcion.includes("farmacia") || transcripcion.includes("medicamento") || transcripcion.includes("pastilla")) {
                destinoId = "seccion-farmacia";
                mensajeVoz = "Llevándote a la farmacia";
            } else if (transcripcion.includes("banco") || transcripcion.includes("nación") || transcripcion.includes("nacion") || transcripcion.includes("cobrar")) {
                destinoId = "seccion-banco";
                mensajeVoz = "Llevándote al Banco de la Nación";
            } else if (transcripcion.includes("pensión") || transcripcion.includes("pension") || transcripcion.includes("65")) {
                destinoId = "seccion-pension";
                mensajeVoz = "Llevándote a Pensión 65";
            }

            if (destinoId !== "") {
                leerTexto(mensajeVoz, destinoId);
                setTimeout(() => {
                    document.getElementById(destinoId).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => { cajaResultado.classList.add('oculta'); }, 4000);
                }, 800); 
            } else {
                leerTexto("No encontré información sobre eso.");
                setTimeout(() => { cajaResultado.classList.add('oculta'); }, 4000);
            }
        };

        recognition.onerror = function() {
            botonMicro.classList.remove('escuchando');
            resultadoTexto.innerHTML = "No escuché bien. Intente de nuevo.";
            leerTexto("No pude escuchar bien.");
            setTimeout(() => { cajaResultado.classList.add('oculta'); }, 4000);
        };
        recognition.start();
    } else {
        cajaResultado.classList.remove('oculta');
        resultadoTexto.innerHTML = "Use Google Chrome para activar el micrófono.";
    }
}

// Lógica del Carrusel
let indiceSlide = 0;
function moverCarrusel(direccion) {
    const slides = document.querySelectorAll('.slide');
    slides[indiceSlide].classList.remove('activa');
    
    indiceSlide += direccion;
    
    if (indiceSlide >= slides.length) indiceSlide = 0;
    if (indiceSlide < 0) indiceSlide = slides.length - 1;
    
    slides[indiceSlide].classList.add('activa');
    
    const descripcionImagen = slides[indiceSlide].getAttribute('alt');
    leerTexto("Imagen sobre: " + descripcionImagen, 'seccion-carrusel');
}

// Botón de Emergencia (SOS WhatsApp)
function enviarAlertaSOS() {
    leerTexto("Abriendo WhatsApp para enviar mensaje de emergencia a un familiar.");
    const mensaje = "¡Hola! Soy un adulto mayor usando SendaFácil. Necesito ayuda rápida, por favor comunícate conmigo.";
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    
    setTimeout(() => { window.open(urlWhatsApp, '_blank'); }, 2000); 
}

// Asistente Proactivo (Por si hay inactividad)
let tiempoInactividad;
function reiniciarTemporizador() {
    clearTimeout(tiempoInactividad);
    tiempoInactividad = setTimeout(() => {
        leerTexto("He notado que no hay movimiento. ¿Necesita ayuda? Recuerde que puede tocar el botón azul de micrófono en la esquina para buscar algo.");
    }, 30000); 
}

window.onload = reiniciarTemporizador;
document.onmousemove = reiniciarTemporizador;
document.onkeypress = reiniciarTemporizador;
document.ontouchstart = reiniciarTemporizador; 
document.onscroll = reiniciarTemporizador;

// Tutorial de Bienvenida
function iniciarTutorial() {
    clearTimeout(tiempoInactividad); 
    const mensajeTutorial = "Bienvenido a Senda Fácil. Esta página está diseñada para ayudarle a encontrar números importantes rápidamente. " +
                            "Deslice su dedo hacia arriba para ver los teléfonos. " +
                            "Toque el botón verde para escuchar un número en voz alta. " +
                            "Si tiene una emergencia, toque el botón rojo S O S en la esquina. " +
                            "O toque el botón azul del micrófono para buscar algo usando su voz.";
    leerTexto(mensajeTutorial, 'seccion-tutorial');
    setTimeout(reiniciarTemporizador, 30000); 
}
