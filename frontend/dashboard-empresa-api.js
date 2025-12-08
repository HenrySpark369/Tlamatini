/**
 * Dashboard Empresa - Conectado a API Real
 * Muestra candidatos que han aplicado a las ofertas
 */

const API_URL = "http://localhost:8000";

// Datos de ofertas (mock para referencia)
const OFERTAS_EMPRESA = [
    {
        id: 'O001',
        puesto: 'Ingeniero de Procesos',
        competencias: ['Python', 'Control de procesos', 'Electrónica'],
        salario: 2500,
        ubicacion: 'Guadalajara',
        estado: 'active',
        fechaPublicacion: '2024-12-05'
    },
    {
        id: 'O002',
        puesto: 'Especialista en Automatización',
        competencias: ['C++', 'PLC', 'Robótica', 'Automatización industrial'],
        salario: 3000,
        ubicacion: 'CDMX',
        estado: 'active',
        fechaPublicacion: '2024-12-03'
    },
    {
        id: 'O003',
        puesto: 'Ingeniero Estructural',
        competencias: ['CATIA', 'Análisis estructural', 'Composite materials'],
        salario: 3500,
        ubicacion: 'Querétaro',
        estado: 'active',
        fechaPublicacion: '2024-12-01'
    }
];

let ofertaActualSeleccionada = 'O001';

// ============ FUNCIONES API ============

/**
 * Cargar últimas aplicaciones de todas las ofertas
 */
async function cargarUltimasAplicaciones() {
    try {
        const response = await fetch(`${API_URL}/aplicaciones`);
        const data = await response.json();
        
        const container = document.getElementById('ultimasAplicaciones');
        
        if (data.aplicaciones.length === 0) {
            container.innerHTML = '<p class="text-slate-600 text-center py-8">No hay aplicaciones aún</p>';
            return;
        }
        
        // Mostrar las últimas 5
        container.innerHTML = data.aplicaciones
            .slice(-5)
            .reverse()
            .map(app => {
                const estadoColor = {
                    'new': 'bg-blue-100 text-blue-800',
                    'reviewing': 'bg-yellow-100 text-yellow-800',
                    'accepted': 'bg-emerald-100 text-emerald-800'
                };
                
                return `
                    <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h3 class="font-bold text-slate-900">${app.estudiante_nombre}</h3>
                                <p class="text-sm text-slate-600">${app.puesto}</p>
                                <p class="text-xs text-slate-500 mt-1">${new Date(app.timestamp).toLocaleString('es-MX')}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                                ${app.compatibilidad}% compatible
                            </span>
                        </div>
                    </div>
                `;
            })
            .join('');
    } catch (error) {
        console.error("Error cargando aplicaciones:", error);
        document.getElementById('ultimasAplicaciones').innerHTML = 
            '<p class="text-red-600 text-center py-8">Error al cargar aplicaciones</p>';
    }
}

/**
 * Cargar candidatos de una oferta específica
 */
async function cargarCandidatosOferta(ofertaId) {
    ofertaActualSeleccionada = ofertaId;
    
    try {
        const response = await fetch(`${API_URL}/aplicaciones/oferta/${ofertaId}`);
        const data = await response.json();
        
        const container = document.getElementById('candidatos');
        
        if (data.total_candidatos === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-inbox text-3xl text-slate-300 mb-3"></i>
                    <p class="text-slate-600">Sin candidatos para esta oferta aún</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = data.candidatos
            .map(cand => `
                <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <h3 class="font-bold text-slate-900">${cand.estudiante_nombre}</h3>
                            <p class="text-sm text-slate-600">${cand.puesto}</p>
                            <p class="text-xs text-slate-500 mt-1">${new Date(cand.timestamp).toLocaleString('es-MX')}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-sm font-semibold 
                            ${cand.compatibilidad >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${cand.compatibilidad}%
                        </span>
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="alert('Perfil: ${cand.estudiante_nombre}\\nCompatibilidad: ${cand.compatibilidad}%')" 
                                class="flex-1 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 py-2 rounded transition">
                            <i class="fas fa-user-circle mr-1"></i> Ver Perfil
                        </button>
                        <button onclick="alert('Oferta enviada a ${cand.estudiante_nombre}')" 
                                class="flex-1 border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 py-2 rounded transition">
                            <i class="fas fa-envelope mr-1"></i> Contactar
                        </button>
                    </div>
                </div>
            `)
            .join('');
    } catch (error) {
        console.error("Error cargando candidatos:", error);
        document.getElementById('candidatos').innerHTML = 
            '<p class="text-red-600 text-center py-8">Error al cargar candidatos</p>';
    }
}

/**
 * Renderizar mis ofertas
 */
function renderizarMisOfertas() {
    const container = document.getElementById('misOfertas');
    container.innerHTML = OFERTAS_EMPRESA.map(oferta => `
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="font-bold text-slate-900">${oferta.puesto}</h3>
                    <p class="text-sm text-slate-600">${oferta.ubicacion}</p>
                    <p class="text-xs text-slate-500 mt-1">Publicada: ${oferta.fechaPublicacion}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                    ${oferta.estado === 'active' ? 'Activa' : 'Pausada'}
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4 text-sm pb-4 border-b border-slate-200">
                <div>
                    <p class="text-slate-600 font-medium mb-1"><i class="fas fa-dollar-sign mr-1"></i>Salario</p>
                    <p class="font-semibold">$${oferta.salario}</p>
                </div>
                <div>
                    <p class="text-slate-600 font-medium mb-1"><i class="fas fa-briefcase mr-1"></i>Aplicantes</p>
                    <p class="font-semibold">-</p>
                </div>
            </div>
            
            <div class="mb-4">
                <p class="text-xs font-semibold text-slate-700 mb-2">Competencias Requeridas:</p>
                <div class="flex flex-wrap gap-1">
                    ${oferta.competencias.map(c => `<span class="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded">${c}</span>`).join('')}
                </div>
            </div>
            
            <div class="flex gap-2">
                <button class="flex-1 text-emerald-600 font-semibold hover:bg-emerald-50 py-2 rounded transition">
                    <i class="fas fa-edit mr-1"></i> Editar
                </button>
                <button onclick="cargarCandidatosOferta('${oferta.id}')" class="flex-1 border border-slate-300 font-semibold hover:bg-slate-100 py-2 rounded transition">
                    <i class="fas fa-users mr-1"></i> Ver Candidatos
                </button>
            </div>
        </div>
    `).join('');
}

// ============ MANEJO DE TABS ============

function cambiarTab(tab) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    // Mostrar tab seleccionado
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    
    // Actualizar estilos de botones
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active', 'border-b-2', 'border-red-900', 'text-red-900');
    });
    document.querySelector(`[onclick="cambiarTab('${tab}')"]`).classList.add('active', 'border-b-2', 'border-red-900', 'text-red-900');
}

function logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        window.location.href = 'login.html';
    }
}

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
    console.log("📊 Dashboard Empresa inicializando...");
    
    // Cargar datos
    cargarUltimasAplicaciones();
    renderizarMisOfertas();
    cargarCandidatosOferta('O001');
    
    // Auto-refresh cada 10 segundos
    setInterval(() => {
        cargarUltimasAplicaciones();
        cargarCandidatosOferta(ofertaActualSeleccionada);
    }, 10000);
    
    console.log("✅ Dashboard Empresa lista");
});
