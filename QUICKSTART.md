# 🚀 Guía Rápida: Iniciar TalentMX MVP

## Requisitos Previos

- Python 3.9+
- Node.js (opcional, para servidor de desarrollo)
- Git

---

## 🏃 Inicio Rápido (5 minutos)

### 1. Clonar y Navegar

```powershell
git clone https://github.com/HenrySpark369/Tlamatini.git
cd Tlamatini
```

### 2. Configurar Backend (FastAPI)

```powershell
# Crear entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instalar dependencias
cd backend
pip install -r requirements.txt

# Iniciar API (puerto 8000)
uvicorn main:app --reload
```

✅ El backend estará disponible en: `http://localhost:8000`  
📚 Documentación interactiva (Swagger): `http://localhost:8000/docs`

### 3. Abrir Frontend (HTML/JS)

**Opción A: Navegador directo**
```powershell
# En otra terminal (desde raíz del proyecto)
cd frontend
# Abre index.html directamente con el navegador
```

**Opción B: Servidor simple Python**
```powershell
# En la carpeta frontend/
python -m http.server 8001
```

✅ Frontend disponible en: `http://localhost:8001`

---

## 📊 Endpoints Principales de la API

### Health Check
```
GET /
```

### Listar Estudiantes
```
GET /estudiantes
GET /estudiantes/{id}
```

### Listar Ofertas
```
GET /ofertas
GET /ofertas/{id}
```

### **Algoritmo de Matching** (principal)
```
GET /matching/{estudiante_id}
```
Retorna las mejores 3 ofertas para un estudiante con compatibilidad > 30%.

### Calcular Score Manual
```
POST /matching/score?estudiante_id=E001&oferta_id=O001
```

### Estadísticas
```
GET /stats
```

---

## 🧪 Probar con cURL

```powershell
# Obtener todos los estudiantes
curl -X GET "http://localhost:8000/estudiantes" -H "accept: application/json"

# Obtener matches para Carlos Mendoza (E001)
curl -X GET "http://localhost:8000/matching/E001" -H "accept: application/json"

# Ver documentación interactiva
start http://localhost:8000/docs
```

---

## 📁 Estructura del Proyecto

```
Tlamatini/
├── backend/
│   ├── main.py                 # API principal (FastAPI)
│   ├── requirements.txt         # Dependencias Python
│   └── modules/
│       ├── data_models.py       # Modelos Pydantic
│       ├── matching.py          # Algoritmo de matching (Scikit-learn)
│       └── __init__.py
├── frontend/
│   ├── index.html              # Dashboard web
│   ├── app.js                  # Lógica frontend (Vanilla JS)
│   └── styles.css              # Estilos (Tailwind via CDN)
├── data/
│   ├── students.csv            # Datos de estudiantes
│   ├── jobs.csv                # Datos de ofertas
│   └── analysis.ipynb          # (Opcional) Análisis con Pandas
├── docs/
│   └── PITCH.md                # Script de presentación
└── README.md                   # Documentación principal
```

---

## 🔧 Modo Simulación (Sin API)

Si la API no está disponible, el frontend **automáticamente cambia a modo simulación** con datos mock locales. ✅

**Indicador en pantalla:** "Modo Simulación (sin API)" en rojo

---

## 📝 Datos Iniciales (Mock)

### Estudiantes
- 🎓 **Carlos Mendoza** (E001) - Ingeniería en Electrónica, interés: semiconductores
- 🎓 **Ana García** (E002) - Ingeniería Mecatrónica, interés: automotriz  
- 🎓 **Miguel López** (E003) - Ingeniería Aeronáutica, interés: aeroespacial

### Ofertas
- 💼 **Nexperia** - Ingeniero de Procesos (Semiconductores, $2,500/mes)
- 💼 **Tesla Manufacturing** - Especialista en Automatización (Automotriz, $3,000/mes)
- 💼 **Airbus Mexico** - Ingeniero Estructural (Aeroespacial, $3,500/mes)

---

## 🎯 Próximos Pasos (Post-Hackathón)

- [ ] Conectar a PostgreSQL real
- [ ] Agregar autenticación (OAuth con Google)
- [ ] Implementar sistema de notificaciones (email)
- [ ] Mobile app (React Native)
- [ ] Dashboard de empresas para ver candidatos
- [ ] Analytics y reportes de impacto

---

## ❓ Troubleshooting

### Error: `ModuleNotFoundError: No module named 'fastapi'`
```powershell
cd backend
pip install -r requirements.txt
```

### Error: `Port 8000 already in use`
```powershell
# Usar puerto diferente
uvicorn main:app --reload --port 8001
```

### Frontend no conecta a API
✅ Es normal. Usa **Modo Simulación** (ver datos mock en console)

### CORS Error
✅ Ya está configurado en `main.py`. Si persiste, revisar logs en navegador (F12).

---

## 🤝 Contribuir

1. Fork el repo
2. Crea rama: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -am 'Agregar feature'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Pull Request

---

## 📧 Contacto

**Equipo:** Universidad Rosario Castellanos x Plan México  
**Email:** talent.mx@urca.edu.mx  
**Hackathón:** Diciembre 2024

---

**¡Listo para el Hackathón! 🚀** 

Si tienes dudas, abre un Issue en GitHub.
