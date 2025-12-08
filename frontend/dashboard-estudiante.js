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

// Variables de estado
let algoritmoActual = 'nlp'; // 'nlp' o 'svd'
let matchesCache = {
    nlp: null,
    svd: null,
    comparativa: null
};

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

// ============ FUNCIONES DE ALGORITMO ============

/**
 * Cambiar entre NLP y SVD
 */
function cambiarAlgoritmo(algoritmo) {
    algoritmoActual = algoritmo;
    
    // Actualizar botones
    document.querySelectorAll('.algoritmo-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white', 'bg-purple-600');
        btn.classList.add('text-slate-600', 'hover:bg-slate-200');
    });
    
    const btnActivo = document.getElementById(`btn-${algoritmo}`);
    btnActivo.classList.add('active');
    btnActivo.classList.remove('text-slate-600', 'hover:bg-slate-200');
    
    if (algoritmo === 'nlp') {
        btnActivo.classList.add('bg-blue-600', 'text-white');
        document.getElementById('algoritmoTexto').textContent = 'Usando NLP (TF-IDF) - Análisis textual de competencias basado en similitud de caracteres';
    } else {
        btnActivo.classList.add('bg-purple-600', 'text-white');
        document.getElementById('algoritmoTexto').textContent = 'Usando SVD (Descomposición en Valores Singulares) - Detecta competencias relacionadas en espacio latente (10x más rápido)';
    }
    
    // Renderizar matches del algoritmo seleccionado
    const matches = algoritmo === 'nlp' ? matchesCache.nlp : matchesCache.svd;
    if (matches) {
        renderizarOfertasConAlgoritmo(matches, algoritmo);
    }
}

/**
 * Renderizar ofertas con badge del algoritmo
 */
function renderizarOfertasConAlgoritmo(matches, algoritmo) {
    const container = document.getElementById('ofertasRecomendadas');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-slate-600"><i class="fas fa-search text-3xl mb-3"></i><p>No hay matches con este algoritmo</p></div>';
        return;
    }
    
    container.innerHTML = matches
        .sort((a, b) => b.compatibilidad - a.compatibilidad)
        .map((oferta, idx) => {
            const badge = algoritmo === 'nlp' 
                ? '<span class="badge bg-blue-100 text-blue-800"><i class="fas fa-text-height mr-1"></i>NLP</span>'
                : '<span class="badge bg-purple-100 text-purple-800"><i class="fas fa-cube mr-1"></i>SVD</span>';
            
            return `
                <div class="match-card high" style="position: relative;">
                    ${badge}
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <h3 class="font-black text-lg text-slate-900">${oferta.puesto}</h3>
                            <p class="text-sm text-slate-600 mt-1">${oferta.empresa}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-black text-emerald-600">${oferta.compatibilidad.toFixed(1)}%</div>
                            <p class="text-xs text-slate-600">Compatibilidad</p>
                        </div>
                    </div>
                    
                    <div class="compatibility-bar mb-4">
                        <div class="compatibility-bar-fill" style="width: ${oferta.compatibilidad}%"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                        <div>
                            <p class="text-xs font-bold text-slate-600 uppercase">Salario</p>
                            <p class="font-bold text-emerald-600">$${oferta.salario_usd.toLocaleString()}/mes</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-600 uppercase">Ubicación</p>
                            <p class="font-bold text-slate-900">${oferta.ubicacion}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p class="text-xs font-semibold text-slate-700 mb-2">
                                <i class="fas fa-check-circle text-green-600 mr-1"></i>Coinciden
                            </p>
                            <div class="flex flex-wrap gap-1">
                                ${oferta.competencias_coincidentes.length > 0 
                                    ? oferta.competencias_coincidentes.map(c => `<span class="badge bg-green-100 text-green-800 text-xs">${c}</span>`).join('')
                                    : '<span class="text-xs text-slate-500">Ninguna</span>'
                                }
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-slate-700 mb-2">
                                <i class="fas fa-book text-amber-600 mr-1"></i>A Desarrollar
                            </p>
                            <div class="flex flex-wrap gap-1">
                                ${oferta.competencias_faltantes.map(c => `<span class="badge bg-amber-100 text-amber-800 text-xs">${c}</span>`).join('')}
                            </div>
                        </div>
                    </div>

                    <button onclick="aplicarOferta('${oferta.oferta_id}')" class="w-full btn btn-primary">
                        <i class="fas fa-paper-plane"></i> SOLICITAR AHORA
                    </button>
                </div>
            `;
        }).join('');
}

/**
 * Mostrar modal de comparativa
 */
async function mostrarComparativa() {
    const estudianteId = localStorage.getItem('studentId') || 'E001';
    
    try {
        const response = await fetch(`http://localhost:8000/matching/compare/${estudianteId}`);
        
        if (!response.ok) {
            alert('Error al cargar comparativa');
            return;
        }
        
        const data = await response.json();
        matchesCache.comparativa = data;
        
        // Renderizar modal
        renderizarModalComparativa(data);
        document.getElementById('modalComparativa').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error:', error);
        // Fallback: mostrar comparativa con datos en caché
        if (matchesCache.nlp && matchesCache.svd) {
            renderizarModalComparativaLocal(matchesCache.nlp, matchesCache.svd);
            document.getElementById('modalComparativa').classList.remove('hidden');
        }
    }
}

/**
 * Renderizar modal de comparativa con datos de API
 */
function renderizarModalComparativa(data) {
    // Resumen
    const resumen = data.comparativa;
    document.getElementById('resumenComparativa').innerHTML = `
        <div class="bg-blue-100 rounded-lg p-6 border-2 border-blue-400">
            <div class="text-3xl font-black text-blue-900 mb-1">${resumen.total_nlp}</div>
            <div class="text-sm text-blue-700 font-semibold">Matches NLP</div>
        </div>
        <div class="bg-purple-100 rounded-lg p-6 border-2 border-purple-400">
            <div class="text-3xl font-black text-purple-900 mb-1">${resumen.total_svd}</div>
            <div class="text-sm text-purple-700 font-semibold">Matches SVD</div>
        </div>
        <div class="bg-green-100 rounded-lg p-6 border-2 border-green-400">
            <div class="text-3xl font-black text-green-900 mb-1">${resumen.diferencia_promedio_pct}%</div>
            <div class="text-sm text-green-700 font-semibold">Dif. Promedio</div>
        </div>
    `;
    
    // NLP matches
    document.getElementById('comparativaNLP').innerHTML = data.nlp_matches.map(m => `
        <div class="bg-white p-3 rounded border border-blue-200">
            <div class="font-bold text-slate-900">${m.puesto}</div>
            <div class="text-xs text-slate-600 mt-1">${m.empresa}</div>
            <div class="text-sm font-bold text-blue-600 mt-2">${m.compatibilidad.toFixed(1)}%</div>
        </div>
    `).join('');
    
    // SVD matches
    document.getElementById('comparativaSVD').innerHTML = data.svd_matches.map(m => `
        <div class="bg-white p-3 rounded border border-purple-200">
            <div class="font-bold text-slate-900">${m.puesto}</div>
            <div class="text-xs text-slate-600 mt-1">${m.empresa}</div>
            <div class="text-sm font-bold text-purple-600 mt-2">${m.compatibilidad.toFixed(1)}%</div>
        </div>
    `).join('');
}

/**
 * Renderizar modal comparativa con datos locales (fallback)
 */
function renderizarModalComparativaLocal(nlpMatches, svdMatches) {
    document.getElementById('resumenComparativa').innerHTML = `
        <div class="bg-blue-100 rounded-lg p-6 border-2 border-blue-400">
            <div class="text-3xl font-black text-blue-900 mb-1">${nlpMatches.length}</div>
            <div class="text-sm text-blue-700 font-semibold">Matches NLP</div>
        </div>
        <div class="bg-purple-100 rounded-lg p-6 border-2 border-purple-400">
            <div class="text-3xl font-black text-purple-900 mb-1">${svdMatches.length}</div>
            <div class="text-sm text-purple-700 font-semibold">Matches SVD</div>
        </div>
    `;
    
    document.getElementById('comparativaNLP').innerHTML = nlpMatches.map(m => `
        <div class="bg-white p-3 rounded border border-blue-200">
            <div class="font-bold text-slate-900">${m.puesto}</div>
            <div class="text-xs text-slate-600 mt-1">${m.empresa}</div>
            <div class="text-sm font-bold text-blue-600 mt-2">${m.compatibilidad.toFixed(1)}%</div>
        </div>
    `).join('');
    
    document.getElementById('comparativaSVD').innerHTML = svdMatches.map(m => `
        <div class="bg-white p-3 rounded border border-purple-200">
            <div class="font-bold text-slate-900">${m.puesto}</div>
            <div class="text-xs text-slate-600 mt-1">${m.empresa}</div>
            <div class="text-sm font-bold text-purple-600 mt-2">${m.compatibilidad.toFixed(1)}%</div>
        </div>
    `).join('');
}

/**
 * Cerrar modal comparativa
 */
function cerrarComparativa() {
    document.getElementById('modalComparativa').classList.add('hidden');
}

// Renderizar ofertas recomendadas
function renderizarOfertasRecomendadas() {
    const container = document.getElementById('ofertasRecomendadas');
    
    // Simular datos de API
    const matches = OFERTAS
        .sort((a, b) => b.compatibilidad - a.compatibilidad)
        .map(oferta => ({
            oferta_id: oferta.id,
            empresa: oferta.empresa,
            puesto: oferta.puesto,
            compatibilidad: oferta.compatibilidad,
            competencias_coincidentes: [],
            competencias_faltantes: [],
            salario_usd: oferta.salario,
            ubicacion: oferta.ubicacion
        }));
    
    matchesCache.nlp = matches;
    matchesCache.svd = matches;
    
    renderizarOfertasConAlgoritmo(matches, 'nlp');
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
