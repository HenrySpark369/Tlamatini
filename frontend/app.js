/**
 * TalentMX - Frontend App (Vanilla JS)
 * Modo Simulación: Si API falla, usa mock data
 */

// ============ CONFIGURACIÓN ============
const API_URL = "http://localhost:8000";
const MOCK_ENABLED = true; // Activar modo simulación

let estudianteActual = null;
let ofertasCache = [];
let estudiantesCache = [];

// ============ MOCK DATA ============
const MOCK_ESTUDIANTES = [
    {
        id: "E001",
        nombre: "Carlos Mendoza",
        carrera: "Ingeniería en Electrónica",
        semestre: 8,
        competencias: ["Python", "Control de procesos", "Electrónica", "PCB design"],
        sector_interes: "semiconductores"
    },
    {
        id: "E002",
        nombre: "Ana García",
        carrera: "Ingeniería Mecatrónica",
        semestre: 6,
        competencias: ["C++", "Robótica", "PLC", "Automatización industrial"],
        sector_interes: "automotriz"
    },
    {
        id: "E003",
        nombre: "Miguel López",
        carrera: "Ingeniería Aeronáutica",
        semestre: 9,
        competencias: ["CATIA", "Dinámica de fluidos", "Composite materials", "Análisis estructural"],
        sector_interes: "aeroespacial"
    }
];

const MOCK_OFERTAS = [
    {
        id: "O001",
        empresa: "Nexperia (Semiconductores)",
        puesto: "Ingeniero de Procesos",
        competencias_requeridas: ["Python", "Control de procesos", "Electrónica"],
        sector_estrategico: "semiconductores",
        salario_usd: 2500,
        ubicacion: "Guadalajara, Jalisco"
    },
    {
        id: "O002",
        empresa: "Tesla Manufacturing",
        puesto: "Especialista en Automatización",
        competencias_requeridas: ["C++", "PLC", "Robótica", "Automatización industrial"],
        sector_estrategico: "automotriz",
        salario_usd: 3000,
        ubicacion: "CDMX"
    },
    {
        id: "O003",
        empresa: "Airbus Mexico",
        puesto: "Ingeniero Estructural",
        competencias_requeridas: ["CATIA", "Análisis estructural", "Composite materials"],
        sector_estrategico: "aeroespacial",
        salario_usd: 3500,
        ubicacion: "Querétaro"
    }
];

// ============ FUNCIONES API ============

/**
 * Fetch genérico con fallback a mock data
 */
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`⚠️ API Error: ${error.message}. Usando mock data.`);
        setStatusOffline();
        return null;
    }
}

/**
 * Cargar lista de estudiantes
 */
async function cargarEstudiantes() {
    let data = await fetchAPI("/estudiantes");
    
    if (!data && MOCK_ENABLED) {
        data = MOCK_ESTUDIANTES;
    }
    
    if (!data) {
        mostrarError("No se pudo cargar estudiantes");
        return;
    }
    
    estudiantesCache = data;
    renderizarEstudiantes(data);
}

/**
 * Cargar lista de ofertas
 */
async function cargarOfertas() {
    let data = await fetchAPI("/ofertas");
    
    if (!data && MOCK_ENABLED) {
        data = MOCK_OFERTAS;
    }
    
    if (!data) return;
    
    ofertasCache = data;
}

/**
 * Cargar matches para un estudiante
 */
async function cargarMatches(estudianteId) {
    let data = await fetchAPI(`/matching/${estudianteId}`);
    
    if (!data && MOCK_ENABLED) {
        // Calcular matches en frontend (simulación)
        const estudiante = estudiantesCache.find(e => e.id === estudianteId);
        if (estudiante) {
            data = calcularMatchesMock(estudiante, ofertasCache);
        }
    }
    
    if (!data) {
        mostrarError("No se pudo cargar matches");
        return;
    }
    
    renderizarMatches(data);
}

/**
 * Calcular matches localmente (para mock)
 */
function calcularMatchesMock(estudiante, ofertas) {
    return ofertas
        .map(oferta => {
            const coincidentes = estudiante.competencias.filter(c => 
                oferta.competencias_requeridas.includes(c)
            );
            const faltantes = oferta.competencias_requeridas.filter(c => 
                !estudiante.competencias.includes(c)
            );
            const compatibilidad = (coincidentes.length / oferta.competencias_requeridas.length) * 100;
            
            return {
                oferta_id: oferta.id,
                empresa: oferta.empresa,
                puesto: oferta.puesto,
                compatibilidad: Math.round(compatibilidad * 10) / 10,
                competencias_coincidentes: coincidentes,
                competencias_faltantes: faltantes,
                salario_usd: oferta.salario_usd,
                ubicacion: oferta.ubicacion
            };
        })
        .filter(m => m.compatibilidad >= 30)
        .sort((a, b) => b.compatibilidad - a.compatibilidad);
}

// ============ RENDERIZACIÓN ============

/**
 * Renderizar lista de estudiantes
 */
function renderizarEstudiantes(estudiantes) {
    const container = document.getElementById("estudiantesList");
    container.innerHTML = estudiantes.map(est => `
        <div class="student-item" onclick="seleccionarEstudiante('${est.id}')">
            <div class="font-semibold text-gray-900">${est.nombre}</div>
            <div class="text-xs text-gray-500">${est.carrera}</div>
        </div>
    `).join("");
}

/**
 * Seleccionar un estudiante y cargar sus matches
 */
function seleccionarEstudiante(estudianteId) {
    const estudiante = estudiantesCache.find(e => e.id === estudianteId);
    if (!estudiante) return;
    
    estudianteActual = estudiante;
    
    // Actualizar vista de perfil
    document.getElementById("perfilEstudiante").classList.remove("hidden");
    document.getElementById("nombreEstudiante").textContent = estudiante.nombre;
    document.getElementById("carreraEstudiante").textContent = estudiante.carrera;
    document.getElementById("semestreEstudiante").textContent = estudiante.semestre;
    document.getElementById("sectorEstudiante").textContent = estudiante.sector_interes || "N/A";
    
    // Competencias
    const competenciasDiv = document.getElementById("competenciasEstudiante");
    competenciasDiv.innerHTML = estudiante.competencias
        .map(c => `<span class="badge">${c}</span>`)
        .join("");
    
    // Actualizar interfaz
    document.querySelectorAll(".student-item").forEach(el => el.classList.remove("active"));
    event.target.closest(".student-item")?.classList.add("active");
    
    // Cargar matches
    document.getElementById("matchingResults").innerHTML = '<div class="loading"></div> Calculando matches...';
    cargarMatches(estudianteId);
}

/**
 * Renderizar resultados de matching
 */
function renderizarMatches(matches) {
    const container = document.getElementById("matchingResults");
    
    if (matches.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay matches disponibles</p>';
        return;
    }
    
    container.innerHTML = matches.map(match => {
        const compatLevel = match.compatibilidad >= 70 ? "high" : 
                          match.compatibilidad >= 50 ? "medium" : "low";
        
        return `
            <div class="match-card ${compatLevel}">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-gray-900">${match.puesto}</h3>
                        <p class="text-sm text-gray-600">${match.empresa}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-indigo-600">${match.compatibilidad}%</div>
                        <div class="compatibility-bar">
                            <div class="compatibility-bar-fill" style="width: ${match.compatibilidad}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                        <p class="text-gray-600">💰 Salario</p>
                        <p class="font-semibold text-green-600">$${match.salario_usd.toLocaleString()}/mes</p>
                    </div>
                    <div>
                        <p class="text-gray-600">📍 Ubicación</p>
                        <p class="font-semibold text-gray-900">${match.ubicacion}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <p class="text-xs font-semibold text-green-700 mb-1">✓ Competencias Match</p>
                        <div class="flex flex-wrap gap-1">
                            ${match.competencias_coincidentes.map(c => `<span class="badge success">${c}</span>`).join("")}
                        </div>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-amber-700 mb-1">⚠️ A Desarrollar</p>
                        <div class="flex flex-wrap gap-1">
                            ${match.competencias_faltantes.map(c => `<span class="badge" style="background-color: #f59e0b;">${c}</span>`).join("")}
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary w-full text-sm" onclick="aplicarOferta('${match.oferta_id}')">
                    Solicitar Oportunidad
                </button>
            </div>
        `;
    }).join("");
}

/**
 * Cargar estadísticas
 */
async function cargarEstadisticas() {
    let data = await fetchAPI("/stats");
    
    if (!data && MOCK_ENABLED) {
        data = {
            total_estudiantes: MOCK_ESTUDIANTES.length,
            total_ofertas: MOCK_OFERTAS.length,
            salario_promedio_usd: 3000
        };
    }
    
    if (data) {
        document.getElementById("statEstudiantes").textContent = data.total_estudiantes;
        document.getElementById("statOfertas").textContent = data.total_ofertas;
        document.getElementById("statSalario").textContent = `$${data.salario_promedio_usd}`;
    }
}

// ============ UTILIDADES ============

function setStatusOnline() {
    document.getElementById("status").className = "status-online font-semibold";
    document.getElementById("status").textContent = "API Conectada ✓";
}

function setStatusOffline() {
    document.getElementById("status").className = "status-offline font-semibold";
    document.getElementById("status").textContent = "Modo Simulación (sin API)";
}

function mostrarError(mensaje) {
    const container = document.getElementById("matchingResults");
    container.innerHTML = `<div class="text-red-600 text-center py-4">❌ ${mensaje}</div>`;
}

function aplicarOferta(ofertaId) {
    alert(`✅ Solicitud enviada para oferta ${ofertaId}. Tu solicitud será revisada en 24 horas.`);
}

// ============ INICIALIZACIÓN ============

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 TalentMX iniciando...");
    
    // Mostrar URL de API
    document.getElementById("apiUrl").textContent = API_URL;
    
    // Cargar datos
    await cargarEstudiantes();
    await cargarOfertas();
    await cargarEstadisticas();
    
    setStatusOnline();
    
    console.log("✅ TalentMX lista");
});
