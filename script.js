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
let tiempoRestante = 10;
let temporizador;

function iniciarTemporizador() {
  clearInterval(temporizador);
  tiempoRestante = 10;
  document.getElementById("tiempo").textContent = `⏱️ ${tiempoRestante} segundos`;

  temporizador = setInterval(() => {
    tiempoRestante--;
    document.getElementById("tiempo").textContent = `⏱️ ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      document.getElementById("feedback").textContent = "⏰ Tiempo agotado";
      preguntasJugadas++;
      indice++;
      setTimeout(mostrarPregunta, 1500);
    }
  }, 1000);
}

function mostrarPregunta() {
  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    document.getElementById("nivelLabel").textContent = `Nivel ${nivelActual + 1} / ${niveles.length}`;
    document.getElementById("question").textContent = preguntas[indice].texto;
    document.getElementById("feedback").textContent = "";
    document.getElementById("buttons").style.display = "flex";
    iniciarTemporizador();
  } else {
    nivelActual++;
    indice = 0;

    if (nivelActual < niveles.length) {
      document.getElementById("question").textContent = `🎉 ¡Subiste al Nivel ${nivelActual + 1}!`;
      document.getElementById("feedback").textContent = "";
      document.getElementById("buttons").style.display = "none";
      setTimeout(mostrarPregunta, 2000);
    } else {
      clearInterval(temporizador);
      document.getElementById("nivelLabel").textContent = "";
      document.getElementById("question").textContent = "🎊 ¡Terminaste todos los niveles!";
      document.getElementById("buttons").style.display = "none";

      // ✅ Enviar datos al backend y mostrar resumen visual
      fetch('http://localhost:3000/api/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: "jugador",
          puntaje: puntos,
          nivel: nivelActual + 1,
          preguntas_jugadas: preguntasJugadas
        })
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById("tiempo").style.display = "none";
        document.getElementById("score").style.display = "none";

        const resumenHTML = `
          <div style="
            background: linear-gradient(135deg, #fff0f6, #f0fff4);
            border: 2px solid #e4c1f9;
            border-radius: 15px;
            padding: 20px;
            font-family: 'Segoe UI', sans-serif;
            color: #4a4a4a;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 20px auto;
            animation: fadeIn 0.6s ease-in-out;
          ">
            <h3 style="color: #ff70a6; margin-bottom: 12px;">🌼 Resumen de Partida 🌼</h3>
            <p><strong>📚 Preguntas jugadas:</strong> ${preguntasJugadas}</p>
            <p><strong>💎 Puntos acumulados:</strong> ${puntos}</p>
            <p><strong>🚀 Nivel alcanzado:</strong> ${nivelActual}</p>
            <p><strong>🏅 Posición en el ranking:</strong> ${data.posicion}</p>
            <p style="margin-top: 15px; font-size: 16px; color: #ffa6c1;">
              🎉 ¡Gracias por jugar, <strong>${data.nombre || "jugador"}</strong>! 🌸
            </p>
          </div>
        `;
        document.getElementById("feedback").innerHTML = resumenHTML;
      })
      .catch(err => {
        console.error("Error al guardar resultado:", err);
        document.getElementById("feedback").textContent = `
⚠️ No se pudo guardar el resultado, pero aquí está tu resumen:

🧾 Resumen de Partida:
• Preguntas jugadas: ${preguntasJugadas}
• Puntos acumulados: ${puntos}
• Nivel alcanzado: ${nivelActual}
        `;
      });
    }
  }
}


function answer(seleccion) {
  clearInterval(temporizador);

  const preguntas = niveles[nivelActual];

  if (indice < preguntas.length) {
    const correcta = preguntas[indice].respuesta;
    const esCorrecto = seleccion === correcta;

    document.getElementById("feedback").textContent = esCorrecto
      ? "😊 ¡Correcto!"
      : "🙃 Ups... incorrecto";

    if (esCorrecto) puntos++;
    preguntasJugadas++;

    document.getElementById("score").textContent = `🌟 Puntos: ${puntos}`;
    indice++;
    setTimeout(mostrarPregunta, 1500);
  }
}

function restartGame() {
  nivelActual = 0;
  indice = 0;
  puntos = 0;
  preguntasJugadas = 0;
  document.getElementById("score").textContent = `🌟 Puntos: 0`;
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  mostrarPregunta();
}

mostrarPregunta();
