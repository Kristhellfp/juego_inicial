const nivelesCompletos = [
  [ { texto: "¿Los árboles producen oxígeno?", respuesta: true }, { texto: "¿El desierto tiene muchas plantas de agua dulce?", respuesta: false } ],
  [ { texto: "¿El vidrio puede reciclarse infinitas veces?", respuesta: true }, { texto: "¿Las bolsas de plástico se biodegradan en 1 año?", respuesta: false } ],
  [ { texto: "¿La energía solar es renovable?", respuesta: true }, { texto: "¿El carbón genera energía limpia?", respuesta: false } ],
  [ { texto: "¿Las abejas son vitales para los ecosistemas?", respuesta: true }, { texto: "¿Los lobos comen plantas acuáticas?", respuesta: false } ],
  [ { texto: "¿El agua cubre más del 70% del planeta?", respuesta: true }, { texto: "¿Podemos beber agua del mar directamente?", respuesta: false } ],
  [ { texto: "¿Los gases de autos contribuyen al cambio climático?", respuesta: true }, { texto: "¿Los residuos industriales son 100% seguros?", respuesta: false } ],
  [ { texto: "¿El deshielo afecta el nivel del mar?", respuesta: true }, { texto: "¿El cambio climático es solo un ciclo natural?", respuesta: false } ],
  [ { texto: "¿Los pesticidas pueden contaminar el suelo?", respuesta: true }, { texto: "¿Todas las semillas modificadas son ecológicas?", respuesta: false } ],
  [ { texto: "¿Separar residuos ayuda al reciclaje?", respuesta: true }, { texto: "¿La basura electrónica no contamina?", respuesta: false } ],
  [ { texto: "¿Las ciudades verdes usan energía limpia?", respuesta: true }, { texto: "¿No hacer nada es una forma de cuidar el planeta?", respuesta: false } ]
];

// Configuración del juego
let nivelesSeleccionados = [];
const nivelesRaw = localStorage.getItem("nivelesBd");

if (nivelesRaw) {
  try {
    let arr;
    if (nivelesRaw.startsWith("[")) {
      arr = JSON.parse(nivelesRaw);
    } else {
      arr = nivelesRaw.split(',').map(n => {
        const num = parseInt(n.trim());
        return isNaN(num) ? 1 : Math.max(1, Math.min(num, nivelesCompletos.length));
      });
    }
    nivelesSeleccionados = [...new Set(arr.filter(n => !isNaN(n) && n > 0 && n <= nivelesCompletos.length))];
    if (nivelesSeleccionados.length === 0) nivelesSeleccionados = [1];
  } catch (e) {
    console.warn("Error al leer nivelesBd", e);
    nivelesSeleccionados = [1];
  }
} else {
  nivelesSeleccionados = [1];
}

const niveles = nivelesSeleccionados.map(n => nivelesCompletos[n - 1]).filter(Boolean);
console.log("✅ Niveles cargados:", niveles, "Seleccionados:", nivelesSeleccionados);

// Variables del juego
let nivelActual = 0;
let indice = 0;
let puntos = 0;
let preguntasJugadas = 0;
let vidas = 3;
let tiempo = 0;
let temporizador;
let resultadosFinales = {
  nombre: "Jugador",
  puntaje: 0,
  nivelMaximo: 0,
  preguntasCorrectas: 0,
  preguntasTotales: 0,
  porcentajeExito: 0,
  fecha: ""
};

updateHearts();
mostrarPregunta();

function updateHearts() {
  const heartContainer = document.getElementById("heart-container");
  heartContainer.innerHTML = "";
  for (let i = 0; i < vidas; i++) {
    heartContainer.innerHTML += "❤️";
  }
}

function mostrarPregunta() {
  clearInterval(temporizador);

  if (nivelActual >= niveles.length) {
    finalizarJuego();
    return;
  }

  const preguntas = niveles[nivelActual];
  
  if (!preguntas || !Array.isArray(preguntas)) {
    console.error(`⚠️ No hay preguntas para el nivel ${nivelActual}`);
    finalizarJuego();
    return;
  }

  if (indice < preguntas.length) {
    const nivelAMostrar = nivelesSeleccionados[nivelActual] || 1;
    document.getElementById("nivelLabel").textContent = `Nivel ${nivelAMostrar}`;
    
    document.getElementById("question").textContent = preguntas[indice].texto;
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "";
    document.getElementById("buttons").style.display = "flex";

    let tiempoGuardado = localStorage.getItem("tiempoBd");
    let tiempoBase = parseInt(JSON.parse(tiempoGuardado));
    if (isNaN(tiempoBase) || tiempoBase <= 0) tiempoBase = 20;

    tiempo = tiempoBase;
    document.getElementById("tiempo").textContent = `⏱️ ${tiempo} segundos`;

    temporizador = setInterval(() => {
      tiempo--;
      document.getElementById("tiempo").textContent = `⏱️ ${tiempo} segundos`;
      if (tiempo <= 0) {
        clearInterval(temporizador);
        answer(null);
      }
    }, 1000);
  } else {
    indice = 0;
    nivelActual++;

    if (nivelActual < niveles.length) {
      const siguienteNivel = nivelesSeleccionados[nivelActual] || nivelActual + 1;
      document.getElementById("question").textContent = `🎉 ¡Subiste al Nivel ${siguienteNivel}!`;
      document.getElementById("feedback").textContent = "";
      document.getElementById("buttons").style.display = "none";
      
      setTimeout(mostrarPregunta, 2000);
    } else {
      finalizarJuego();
    }
  }
}

function answer(seleccion) {
  clearInterval(temporizador);

  const preguntas = niveles[nivelActual];

  if (!preguntas || !preguntas[indice]) {
    console.warn("❌ No hay pregunta válida en el índice actual");
    return;
  }
  const correcta = preguntas[indice].respuesta;
  const esCorrecto = seleccion === correcta;

  const feedbackElement = document.getElementById("feedback");
  feedbackElement.textContent = seleccion === null
    ? "⏰ ¡Tiempo agotado!"
    : esCorrecto
      ? "✅ ¡Correcto!"
      : "❌ Incorrecto";
  
  feedbackElement.className = esCorrecto ? "correcto" : "incorrecto";
  feedbackElement.classList.add("pulse");

  preguntasJugadas++;
  if (esCorrecto) {
    puntos++;
  } else {
    vidas--;
    updateHearts();
    if (vidas <= 0) {
      setTimeout(finalizarJuego, 1500);
      return;
    }
  }

  document.getElementById("score").textContent = `Puntos: ${puntos}`;
  indice++;
  setTimeout(mostrarPregunta, 1500);
}

// Función finalizada, muestra resumen + lugar obtenido
function finalizarJuego() {
  const nivelMaximoAlcanzado = nivelesSeleccionados[Math.min(nivelActual, nivelesSeleccionados.length - 1)] || 1;
  
  resultadosFinales = {
    nombre: "Jugador",
    puntaje: puntos,
    nivelMaximo: nivelMaximoAlcanzado,
    preguntasCorrectas: puntos,
    preguntasTotales: preguntasJugadas,
    porcentajeExito: preguntasJugadas > 0 ? Math.round((puntos / preguntasJugadas) * 100) : 0,
    fecha: new Date().toLocaleString()
  };

  document.getElementById("game-container").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  
  const finalStats = document.getElementById("final-stats");
  finalStats.innerHTML = `
    <p><strong>${resultadosFinales.nombre}</strong>, estos son tus resultados:</p>
    <p>🏆 Puntos obtenidos: ${resultadosFinales.puntaje}</p>
    <p>📊 Nivel máximo alcanzado: ${resultadosFinales.nivelMaximo}</p>
    <p>✅ Preguntas correctas: ${resultadosFinales.preguntasCorrectas} de ${resultadosFinales.preguntasTotales}</p>
    <p>🎯 Porcentaje de éxito: ${resultadosFinales.porcentajeExito}%</p>
    <p>📅 Fecha: ${resultadosFinales.fecha}</p>
    <p id="ranking-info">📍 Calculando lugar en el ranking...</p>
    <div id="server-feedback"></div>
  `;

  enviarResultadosAlServidor();
}

function enviarResultadosAlServidor() {
  const datosParaEnviar = {
    nombre: resultadosFinales.nombre || "Anónimo",
    puntaje: Number(resultadosFinales.puntaje),
    nivel: Number(resultadosFinales.nivelMaximo),
    preguntas_jugadas: Number(resultadosFinales.preguntasTotales)
  };

  console.log("Enviando al servidor:", datosParaEnviar);

  fetch('https://backend-rocket-k6wn.onrender.com/api/resultados', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(datosParaEnviar)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("✅ Resultado guardado:", data);
    const posicion = data.posicion; // espera la posición del backend

    const lugarTexto = typeof posicion === "number"
      ? `📍 ¡Quedaste en el puesto #${posicion}!`
      : `📍 Lugar en ranking desconocido.`;

    document.getElementById("server-feedback").textContent = "✔️ Resultado guardado correctamente.";
    document.getElementById("ranking-info").textContent = lugarTexto;
  })
  .catch(err => {
    console.error("❌ Error al guardar resultado:", err);
    document.getElementById("server-feedback").textContent = "❌ No se pudo guardar el resultado.";
    document.getElementById("ranking-info").textContent = "📍 No se pudo obtener el lugar en el ranking.";
  });
}

function restartGame() {
  nivelActual = 0;
  indice = 0;
  puntos = 0;
  preguntasJugadas = 0;
  vidas = 3;
  
  document.getElementById("game-container").style.display = "block";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("score").textContent = "Puntos: 0";
  updateHearts();
  mostrarPregunta();
}
// --- FUNCIÓN PARA DESCARGAR RESULTADOS ---

function descargarResultados() {
  const texto = [
    "🎮 RESULTADOS DEL JUEGO DE PREGUNTAS",
    "===============================",
    `Nombre: ${resultadosFinales.nombre}`,
    `Puntaje: ${resultadosFinales.puntaje}`,
    `Nivel máximo alcanzado: ${resultadosFinales.nivelMaximo}`,
    `Preguntas correctas: ${resultadosFinales.preguntasCorrectas} de ${resultadosFinales.preguntasTotales}`,
    `Porcentaje de éxito: ${resultadosFinales.porcentajeExito}%`,
    `Fecha: ${resultadosFinales.fecha}`,
    "",
    "¡Gracias por jugar!"
  ].join("\n");

  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `resultados_preguntas_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- CREAR BOTÓN DE DESCARGA DINÁMICAMENTE EN LA PANTALLA DE RESULTADOS ---

function mostrarBotonDescarga() {
  let btn = document.getElementById("btn-descargar-resultados");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btn-descargar-resultados";
    btn.textContent = "⬇️ Descargar Resultados";
    btn.style.padding = "10px 20px";
    btn.style.marginTop = "15px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.onclick = descargarResultados;
    document.getElementById("result-screen").appendChild(btn);
  }
}

// Modifica tu función finalizarJuego para llamar a mostrarBotonDescarga:

function finalizarJuego() {
  const nivelMaximoAlcanzado = nivelesSeleccionados[Math.min(nivelActual, nivelesSeleccionados.length - 1)] || 1;
  
  resultadosFinales = {
    nombre: "Jugador",
    puntaje: puntos,
    nivelMaximo: nivelMaximoAlcanzado,
    preguntasCorrectas: puntos,
    preguntasTotales: preguntasJugadas,
    porcentajeExito: preguntasJugadas > 0 ? Math.round((puntos / preguntasJugadas) * 100) : 0,
    fecha: new Date().toLocaleString()
  };

  document.getElementById("game-container").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  
  const finalStats = document.getElementById("final-stats");
  finalStats.innerHTML = `
    <p><strong>${resultadosFinales.nombre}</strong>, estos son tus resultados:</p>
    <p>🏆 Puntos obtenidos: ${resultadosFinales.puntaje}</p>
    <p>📊 Nivel máximo alcanzado: ${resultadosFinales.nivelMaximo}</p>
    <p>✅ Preguntas correctas: ${resultadosFinales.preguntasCorrectas} de ${resultadosFinales.preguntasTotales}</p>
    <p>🎯 Porcentaje de éxito: ${resultadosFinales.porcentajeExito}%</p>
    <p>📅 Fecha: ${resultadosFinales.fecha}</p>
    <p id="ranking-info">📍 Calculando lugar en el ranking...</p>
    <div id="server-feedback"></div>
  `;

  enviarResultadosAlServidor();

  mostrarBotonDescarga(); // <-- Aquí agregamos el botón para descargar
}
