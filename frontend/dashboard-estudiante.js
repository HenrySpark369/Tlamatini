// Datos mock de ofertas
const OFERTAS = [
    {
        id: 'O001',
        empresa: 'Nexperia',
        puesto: 'Ingeniero de Procesos',
        sector: 'semiconductores',
        salario: 2500,
        ubicacion: 'Guadalajara, Jalisco',
        compatibilidad: 85,
        descripcion: 'Buscamos ingeniero especializado en control de procesos',
        imagen: 'https://via.placeholder.com/200x120?text=Nexperia'
    },
    {
        id: 'O002',
        empresa: 'Tesla Manufacturing',
        puesto: 'Especialista en Automatización',
        sector: 'automotriz',
        salario: 3000,
        ubicacion: 'CDMX',
        compatibilidad: 72,
        descripcion: 'Posición para especialista en automatización industrial',
        imagen: 'https://via.placeholder.com/200x120?text=Tesla'
    },
    {
        id: 'O003',
        empresa: 'Airbus Mexico',
        puesto: 'Ingeniero Estructural',
        sector: 'aeroespacial',
        salario: 3500,
        ubicacion: 'Querétaro',
        compatibilidad: 68,
        descripcion: 'Ingeniero para análisis estructural de componentes',
        imagen: 'https://via.placeholder.com/200x120?text=Airbus'
    }
];

const APLICACIONES = [
    { id: 1, empresa: 'Nexperia', puesto: 'Ingeniero de Procesos', fecha: '2024-12-08', estado: 'viewed' },
    { id: 2, empresa: 'Tesla', puesto: 'Especialista en Automatización', fecha: '2024-12-07', estado: 'applied' },
    { id: 3, empresa: 'Airbus', puesto: 'Ingeniero Estructural', fecha: '2024-12-06', estado: 'under_review' }
];

// Funciones de cambio de tab
function cambiarTab(tab) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('border-indigo-600', 'text-indigo-600');
        el.classList.add('border-transparent', 'text-slate-600');
    });

    // Mostrar tab seleccionado
    document.getElementById('tab-' + tab).classList.remove('hidden');
    event.target.closest('.tab-btn').classList.remove('border-transparent', 'text-slate-600');
    event.target.closest('.tab-btn').classList.add('border-indigo-600', 'text-indigo-600');
}

// Renderizar ofertas recomendadas
function renderizarOfertasRecomendadas() {
    const container = document.getElementById('ofertasRecomendadas');
    container.innerHTML = OFERTAS
        .sort((a, b) => b.compatibilidad - a.compatibilidad)
        .map(oferta => `
            <div class="match-card high">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <h3 class="font-black text-lg text-slate-900">${oferta.puesto}</h3>
                        <p class="text-sm text-slate-600 mt-1">${oferta.empresa}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-black text-emerald-600">${oferta.compatibilidad}%</div>
                        <p class="text-xs text-slate-600">Compatibilidad</p>
                    </div>
                </div>
                
                <div class="compatibility-bar mb-4">
                    <div class="compatibility-bar-fill" style="width: ${oferta.compatibilidad}%"></div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                    <div>
                        <p class="text-xs font-bold text-slate-600 uppercase">Salario</p>
                        <p class="font-bold text-emerald-600">$${oferta.salario.toLocaleString()}/mes</p>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-600 uppercase">Ubicación</p>
                        <p class="font-bold text-slate-900">${oferta.ubicacion}</p>
                    </div>
                </div>

                <div class="mb-4">
                    <span class="badge-enterprise">${oferta.sector.toUpperCase()}</span>
                </div>

                <button onclick="aplicarOferta('${oferta.id}')" class="w-full btn btn-primary">
                    <i class="fas fa-paper-plane"></i> SOLICITAR AHORA
                </button>
            </div>
        `).join('');
}

// Renderizar todas las ofertas
function renderizarTodasOfertas() {
    const container = document.getElementById('todasOfertas');
    container.innerHTML = OFERTAS.map(oferta => `
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-bold text-slate-900">${oferta.puesto}</h3>
                    <p class="text-sm text-slate-600">${oferta.empresa}</p>
                </div>
                <span class="text-xl font-bold text-emerald-600">${oferta.compatibilidad}%</span>
            </div>
            
            <p class="text-sm text-slate-600 mb-4">${oferta.descripcion}</p>
            
            <div class="flex justify-between items-center mb-4">
                <div class="flex gap-4 text-sm">
                    <span><i class="fas fa-dollar-sign"></i> $${oferta.salario}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${oferta.ubicacion}</span>
                </div>
            </div>

            <button onclick="aplicarOferta('${oferta.id}')" class="btn btn-primary">
                Aplicar
            </button>
        </div>
    `).join('');
}

// Renderizar aplicaciones
function renderizarAplicaciones() {
    const container = document.getElementById('misAplicaciones');
    container.innerHTML = APLICACIONES.map(app => {
        const estadoTexto = {
            'viewed': 'Visto',
            'applied': 'Aplicado',
            'under_review': 'En Revisión'
        };
        const estadoColor = {
            'viewed': 'bg-blue-100 text-blue-800',
            'applied': 'bg-purple-100 text-purple-800',
            'under_review': 'bg-yellow-100 text-yellow-800'
        };

        return `
            <div class="bg-white border border-slate-200 rounded-lg p-6">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-slate-900">${app.puesto}</h3>
                        <p class="text-sm text-slate-600">${app.empresa}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${estadoColor[app.estado]}">
                        ${estadoTexto[app.estado]}
                    </span>
                </div>
                
                <p class="text-xs text-slate-500 mb-4">Aplicado: ${app.fecha}</p>
                
                <button class="text-indigo-600 font-semibold hover:text-indigo-700">
                    Ver Detalles →
                </button>
            </div>
        `;
    }).join('');
}

// Función para aplicar a oferta
function aplicarOferta(ofertaId) {
    // Mostrar notificación
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 slide-in';
    notification.innerHTML = '<i class="fas fa-check-circle"></i> ¡Aplicación enviada! Espera noticias en 24h.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función de logout
function logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('studentId');
    window.location.href = 'login.html';
}

// Verificar autenticación
function verificarAutenticacion() {
    const userType = localStorage.getItem('userType');
    if (!userType || userType !== 'estudiante') {
        window.location.href = 'login.html';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    renderizarOfertasRecomendadas();
    renderizarTodasOfertas();
    renderizarAplicaciones();
});
