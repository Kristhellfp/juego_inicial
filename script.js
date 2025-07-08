const niveles = [
  [
    { texto: "¿Los árboles producen oxígeno?", respuesta: true },
    { texto: "¿El desierto tiene muchas plantas de agua dulce?", respuesta: false }
  ],
  [
    { texto: "¿El vidrio puede reciclarse infinitas veces?", respuesta: true },
    { texto: "¿Las bolsas de plástico se biodegradan en 1 año?", respuesta: false }
  ],
  [
    { texto: "¿La energía solar es renovable?", respuesta: true },
    { texto: "¿El carbón genera energía limpia?", respuesta: false }
  ],
  [
    { texto: "¿Las abejas son vitales para los ecosistemas?", respuesta: true },
    { texto: "¿Los lobos comen plantas acuáticas?", respuesta: false }
  ],
  [
    { texto: "¿El agua cubre más del 70% del planeta?", respuesta: true },
    { texto: "¿Podemos beber agua del mar directamente?", respuesta: false }
  ],
  [
    { texto: "¿Los gases de autos contribuyen al cambio climático?", respuesta: true },
    { texto: "¿Los residuos industriales son 100% seguros?", respuesta: false }
  ],
  [
    { texto: "¿El deshielo afecta el nivel del mar?", respuesta: true },
    { texto: "¿El cambio climático es solo un ciclo natural?", respuesta: false }
  ],
  [
    { texto: "¿Los pesticidas pueden contaminar el suelo?", respuesta: true },
    { texto: "¿Todas las semillas modificadas son ecológicas?", respuesta: false }
  ],
  [
    { texto: "¿Separar residuos ayuda al reciclaje?", respuesta: true },
    { texto: "¿La basura electrónica no contamina?", respuesta: false }
  ],
  [
    { texto: "¿Las ciudades verdes usan energía limpia?", respuesta: true },
    { texto: "¿No hacer nada es una forma de cuidar el planeta?", respuesta: false }
  ]
];

let nivelActual = 0;
let indice = 0;
let puntos = 0;
let preguntasJugadas = 0;

function mostrarPregunta() {
  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    document.getElementById("nivelLabel").textContent = `Nivel ${nivelActual + 1} / 10`;
    document.getElementById("question").textContent = preguntas[indice].texto;
    document.getElementById("feedback").textContent = "";
    document.getElementById("buttons").style.display = "flex";
  } else {
    nivelActual++;
    indice = 0;

    if (nivelActual < niveles.length) {
      document.getElementById("question").textContent = `🎉 ¡Subiste al Nivel ${nivelActual + 1}!`;
      document.getElementById("feedback").textContent = "";
      document.getElementById("buttons").style.display = "none";
      setTimeout(mostrarPregunta, 2000);
    } else {
      document.getElementById("nivelLabel").textContent = "";
      document.getElementById("question").textContent = "🎊 ¡Terminaste todos los niveles!";
      document.getElementById("buttons").style.display = "none";
      document.getElementById("feedback").textContent = `Tu puntaje final fue: ${puntos} / 20`;

      // ✅ Enviar resultado al backend
      fetch('http://localhost:3000/api/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: "jugador",                  // puedes hacerlo dinámico si agregas un input
          puntaje: puntos,
          nivel: nivelActual + 1,
          preguntas_jugadas: preguntasJugadas
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Resultado guardado en backend:", data);
      })
      .catch(err => {
        console.error("Error al guardar resultado:", err);
      });
    }
  }
}

function answer(seleccion) {
  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    const correcta = preguntas[indice].respuesta;
    const esCorrecto = seleccion === correcta;

    document.getElementById("feedback").textContent = esCorrecto
      ? "😊 ¡Correcto!"
      : "🙃 Ups... incorrecto";

    preguntasJugadas++;

    if (esCorrecto) {
      puntos++;
    }

    document.getElementById("score").textContent = `🌟 Puntos: ${puntos}`;
    indice++;
    setTimeout(mostrarPregunta, 1500);
  }
}

mostrarPregunta();

