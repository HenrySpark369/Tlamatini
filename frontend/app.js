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
    container.innerHTML = estudiantes.map((est, idx) => `
        <div class="student-item slide-in" data-id="${est.id}" onclick="seleccionarEstudiante('${est.id}')" style="animation-delay: ${idx * 0.05}s">
            <div class="font-bold text-slate-900">${est.nombre}</div>
            <div class="text-xs text-slate-600 mt-1 font-medium">${est.carrera}</div>
            <div class="flex gap-2 mt-2">
                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded font-semibold">Sem ${est.semestre}</span>
            </div>
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
    
    // Actualizar perfil
    document.getElementById("perfilEstudiante").classList.remove("hidden");
    document.getElementById("nombreEstudiante").textContent = estudiante.nombre;
    document.getElementById("carreraEstudiante").textContent = `${estudiante.carrera}`;
    document.getElementById("semestreEstudiante").textContent = estudiante.semestre;
    document.getElementById("sectorEstudiante").textContent = (estudiante.sector_interes || "N/A").toUpperCase();
    document.getElementById("progressBar").style.width = `${(estudiante.semestre / 12) * 100}%`;
    
    // Competencias
    const competenciasDiv = document.getElementById("competenciasEstudiante");
    competenciasDiv.innerHTML = estudiante.competencias
        .map(c => `<span class="badge">${c}</span>`)
        .join("");
    
    // Actualizar interfaz
    document.querySelectorAll(".student-item").forEach(el => el.classList.remove("active"));
    document.querySelector(`[data-id="${estudianteId}"]`)?.classList.add("active");
    
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
        container.innerHTML = '<div class="text-center py-12"><i class="fas fa-search text-3xl text-slate-300 mb-3"></i><p class="text-slate-600 text-sm">No hay matches disponibles para este perfil</p></div>';
        return;
    }
    
    container.innerHTML = matches.map((match, idx) => {
        const compatLevel = match.compatibilidad >= 70 ? "high" : 
                          match.compatibilidad >= 50 ? "medium" : "low";
        
        return `
            <div class="match-card ${compatLevel} slide-in" style="animation-delay: ${idx * 0.1}s">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-900 text-lg">${match.puesto}</h3>
                        <p class="text-sm text-slate-600 mt-1">${match.empresa}</p>
                    </div>
                    <div class="text-right ml-4">
                        <div class="text-3xl font-bold text-primary">${match.compatibilidad}%</div>
                        <p class="text-xs text-slate-600 mt-1">Compatibilidad</p>
                    </div>
                </div>
                
                <div class="compatibility-bar mb-4">
                    <div class="compatibility-bar-fill" style="width: ${match.compatibilidad}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm pb-4 border-b border-slate-200">
                    <div>
                        <p class="text-slate-600 font-medium mb-1"><i class="fas fa-dollar-sign mr-1"></i>Salario</p>
                        <p class="font-semibold text-success">$${match.salario_usd.toLocaleString()}/mes</p>
                    </div>
                    <div>
                        <p class="text-slate-600 font-medium mb-1"><i class="fas fa-map-marker-alt mr-1"></i>Ubicación</p>
                        <p class="font-semibold text-slate-900">${match.ubicacion}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                            <i class="fas fa-check-circle text-success"></i>Tus Competencias
                        </p>
                        <div class="flex flex-wrap gap-1">
                            ${match.competencias_coincidentes.length > 0 
                                ? match.competencias_coincidentes.map(c => `<span class="badge success">${c}</span>`).join("")
                                : '<span class="text-xs text-slate-600">Ninguna coincide aún</span>'
                            }
                        </div>
                    </div>
                    <div>
                        <p class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                            <i class="fas fa-book text-warning"></i>A Desarrollar
                        </p>
                        <div class="flex flex-wrap gap-1">
                            ${match.competencias_faltantes.map(c => `<span class="badge warning">${c}</span>`).join("")}
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary w-full" onclick="aplicarOferta('${match.oferta_id}')">
                    <i class="fas fa-paper-plane"></i> Solicitar Oportunidad
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
    document.getElementById("status").className = "text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700";
    document.getElementById("status").innerHTML = '<i class="fas fa-circle text-green-500 mr-1" style="font-size: 0.6rem;"></i> API Conectada';
}

function setStatusOffline() {
    document.getElementById("status").className = "text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700";
    document.getElementById("status").innerHTML = '<i class="fas fa-circle text-yellow-500 mr-1" style="font-size: 0.6rem;"></i> Modo Simulación';
}

function mostrarError(mensaje) {
    const container = document.getElementById("matchingResults");
    container.innerHTML = `<div class="text-red-600 text-center py-4">❌ ${mensaje}</div>`;
}

function aplicarOferta(ofertaId) {
    // Mostrar notificación más elegante
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-6 right-6 bg-success text-white px-6 py-3 rounded-lg shadow-elevated flex items-center gap-2 slide-in';
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Solicitud enviada. Revisaremos en 24h.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
