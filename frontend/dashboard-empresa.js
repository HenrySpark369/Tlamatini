// Datos mock de ofertas
const OFERTAS_EMPRESA = [
    {
        id: 'O001',
        puesto: 'Ingeniero de Procesos',
        competencias: ['Python', 'Control de procesos', 'Electrónica'],
        salario: 2500,
        ubicacion: 'Guadalajara',
        estado: 'active',
        aplicaciones: 8,
        fechaPublicacion: '2024-12-05'
    },
    {
        id: 'O002',
        puesto: 'Técnico en Manufactura',
        competencias: ['Mecánica', 'CAD', 'Calidad'],
        salario: 1800,
        ubicacion: 'Guadalajara',
        estado: 'active',
        aplicaciones: 5,
        fechaPublicacion: '2024-12-03'
    },
    {
        id: 'O003',
        puesto: 'Asistente de Ingeniería',
        competencias: ['Excel', 'Análisis técnico', 'Comunicación'],
        salario: 1500,
        ubicacion: 'Guadalajara',
        estado: 'paused',
        aplicaciones: 3,
        fechaPublicacion: '2024-11-28'
    }
];

const APLICACIONES_EMPRESA = [
    { 
        id: 1, 
        estudiante: 'Carlos Mendoza', 
        puesto: 'Ingeniero de Procesos', 
        fecha: '2024-12-08', 
        estado: 'new',
        compatibilidad: 85,
        carrera: 'Ingeniería en Electrónica'
    },
    { 
        id: 2, 
        estudiante: 'Ana García', 
        puesto: 'Técnico en Manufactura', 
        fecha: '2024-12-07', 
        estado: 'reviewing',
        compatibilidad: 72,
        carrera: 'Ingeniería Mecatrónica'
    },
    { 
        id: 3, 
        estudiante: 'Miguel López', 
        puesto: 'Asistente de Ingeniería', 
        fecha: '2024-12-06', 
        estado: 'accepted',
        compatibilidad: 68,
        carrera: 'Ingeniería Aeronáutica'
    }
];

const CANDIDATOS = [
    { 
        id: 1, 
        nombre: 'Carlos Mendoza', 
        carrera: 'Ingeniería en Electrónica',
        semestre: 8,
        competencias: ['Python', 'Control de procesos', 'Electrónica'],
        sector: 'semiconductores',
        estado: 'interesado'
    },
    { 
        id: 2, 
        nombre: 'Ana García', 
        carrera: 'Ingeniería Mecatrónica',
        semestre: 6,
        competencias: ['C++', 'Robótica', 'PLC'],
        sector: 'automotriz',
        estado: 'activo'
    },
    { 
        id: 3, 
        nombre: 'Miguel López', 
        carrera: 'Ingeniería Aeronáutica',
        semestre: 9,
        competencias: ['CATIA', 'Análisis estructural', 'Composite'],
        sector: 'aeroespacial',
        estado: 'activo'
    }
];

// Funciones de cambio de tab
function cambiarTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('border-emerald-600', 'text-emerald-600');
        el.classList.add('border-transparent', 'text-slate-600');
    });

    document.getElementById('tab-' + tab).classList.remove('hidden');
    event.target.closest('.tab-btn').classList.remove('border-transparent', 'text-slate-600');
    event.target.closest('.tab-btn').classList.add('border-emerald-600', 'text-emerald-600');
}

// Renderizar últimas aplicaciones
function renderizarUltimasAplicaciones() {
    const container = document.getElementById('ultimasAplicaciones');
    container.innerHTML = APLICACIONES_EMPRESA.map(app => {
        const estadoTexto = {
            'new': 'Nueva',
            'reviewing': 'En Revisión',
            'accepted': 'Aceptado'
        };
        const estadoColor = {
            'new': 'bg-blue-100 text-blue-800',
            'reviewing': 'bg-yellow-100 text-yellow-800',
            'accepted': 'bg-emerald-100 text-emerald-800'
        };

        return `
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-slate-900">${app.estudiante}</h3>
                        <p class="text-sm text-slate-600">${app.puesto} - ${app.carrera}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${estadoColor[app.estado]}">
                        ${estadoTexto[app.estado]}
                    </span>
                </div>
                
                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-slate-600">Compatibilidad</span>
                        <span class="text-sm font-bold text-emerald-600">${app.compatibilidad}%</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-2">
                        <div class="bg-emerald-600 h-2 rounded-full" style="width: ${app.compatibilidad}%"></div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="flex-1 text-emerald-600 font-semibold hover:bg-emerald-50 py-2 rounded transition">
                        Ver Perfil
                    </button>
                    <button class="flex-1 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 py-2 rounded transition">
                        Descargar CV
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar mis ofertas
function renderizarMisOfertas() {
    const container = document.getElementById('misOfertas');
    container.innerHTML = OFERTAS_EMPRESA.map(oferta => {
        const estadoColor = {
            'active': 'bg-emerald-100 text-emerald-800',
            'paused': 'bg-yellow-100 text-yellow-800'
        };

        return `
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-slate-900">${oferta.puesto}</h3>
                        <p class="text-sm text-slate-600">Publicada: ${oferta.fechaPublicacion}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${estadoColor[oferta.estado]}">
                        ${oferta.estado === 'active' ? 'Activa' : 'Pausada'}
                    </span>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200">
                    <div>
                        <p class="text-xs font-bold text-slate-600 uppercase">Salario</p>
                        <p class="font-bold text-emerald-600">$${oferta.salario.toLocaleString()}</p>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-600 uppercase">Ubicación</p>
                        <p class="font-bold text-slate-900">${oferta.ubicacion}</p>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-600 uppercase">Aplicaciones</p>
                        <p class="font-bold text-slate-900">${oferta.aplicaciones}</p>
                    </div>
                </div>

                <div class="mb-4">
                    <p class="text-sm font-bold text-slate-700 mb-2">Competencias Requeridas:</p>
                    <div class="flex flex-wrap gap-2">
                        ${oferta.competencias.map(c => `<span class="badge">${c}</span>`).join('')}
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="flex-1 text-emerald-600 font-semibold hover:bg-emerald-50 py-2 rounded transition">
                        Editar
                    </button>
                    <button class="flex-1 border border-slate-300 font-semibold hover:bg-slate-100 py-2 rounded transition">
                        Ver Candidatos
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar candidatos
function renderizarCandidatos() {
    const container = document.getElementById('candidatos');
    container.innerHTML = CANDIDATOS.map(candidato => {
        const estadoColor = {
            'activo': 'bg-emerald-100 text-emerald-800',
            'interesado': 'bg-blue-100 text-blue-800',
            'rechazado': 'bg-red-100 text-red-800'
        };

        return `
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-slate-900">${candidato.nombre}</h3>
                        <p class="text-sm text-slate-600">${candidato.carrera} (Sem ${candidato.semestre})</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${estadoColor[candidato.estado]}">
                        ${candidato.estado.charAt(0).toUpperCase() + candidato.estado.slice(1)}
                    </span>
                </div>

                <div class="mb-3">
                    <p class="text-sm font-bold text-slate-700 mb-2">Competencias:</p>
                    <div class="flex flex-wrap gap-1">
                        ${candidato.competencias.map(c => `<span class="badge">${c}</span>`).join('')}
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="flex-1 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 py-2 rounded transition">
                        Ver Perfil Completo
                    </button>
                    <button class="flex-1 border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 py-2 rounded transition">
                        Enviar Oferta
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Función de logout
function logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('companyId');
    window.location.href = 'login.html';
}

// Verificar autenticación
function verificarAutenticacion() {
    const userType = localStorage.getItem('userType');
    if (!userType || userType !== 'empresa') {
        window.location.href = 'login.html';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    renderizarUltimasAplicaciones();
    renderizarMisOfertas();
    renderizarCandidatos();
});
