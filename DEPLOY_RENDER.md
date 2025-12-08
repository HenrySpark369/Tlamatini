# 🚀 GUÍA DE DEPLOY EN RENDER

## Estructura del Proyecto

```
TalentMX/
├── backend/           # API FastAPI
│   ├── main.py       # Sirve API + archivos estáticos del frontend
│   └── modules/
├── frontend/         # HTML, CSS, JS estáticos
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   └── ...
├── data/             # CSVs con datos
├── Procfile          # Configuración para Render
├── build.sh          # Script de construcción
└── requirements.txt  # Dependencias Python
```

## Pasos para Deployar en Render

### 1️⃣ **Verificar que Git esté sincronizado**

```bash
cd c:\Users\Rafael\Desktop\hakaton\Tlamatini
git status
git add .
git commit -m "Configuración para deploy en Render"
git push origin main
```

### 2️⃣ **Ir a Render.com**

- Abre https://render.com
- Inicia sesión con GitHub
- Click en "New Web Service"

### 3️⃣ **Conectar el Repositorio**

- Selecciona tu repositorio `Tlamatini`
- Elige la rama (main o tu rama actual)
- Render detectará automáticamente que es Python

### 4️⃣ **Configurar Deploy**

- **Name:** `tlamatini-api`
- **Environment:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Selecciona Free

### 5️⃣ **Deploy**

Click en "Deploy" y espera 3-5 minutos. Render construirá e iniciará tu app.

## 🎯 Resultado

Tu aplicación estará disponible en:

```
https://tlamatini-api.onrender.com
```

Con todo funcionando:

- ✅ **Backend API:** `https://tlamatini-api.onrender.com/docs` (Swagger)
- ✅ **Frontend:** `https://tlamatini-api.onrender.com/static/index.html`
- ✅ **Endpoints de Matching:** `https://tlamatini-api.onrender.com/api/matching/...`

## 📝 Notas Importantes

1. **Primer Deploy:** Puede tardar 5-10 minutos mientras instala dependencias
2. **Plan Gratuito:** Se reinicia después de 15 minutos de inactividad
3. **Base de Datos:** Actualmente usa localStorage (frontend) - en producción usa PostgreSQL
4. **Archivos CSV:** Se cargan desde `/data/` en el servidor

## 🔧 Troubleshooting

### Error: "ModuleNotFoundError"
- Verifica que `requirements.txt` tiene todas las dependencias
- Ejecuta localmente: `pip install -r requirements.txt`

### Frontend no se ve
- Verifica que carpeta `frontend/` existe
- Accede directamente: `https://tlamatini-api.onrender.com/static/login.html`

### API lenta
- Plan gratuito de Render se reinicia con inactividad
- Considera upgrade a plan Pro para producción

## 📚 Recursos

- [Documentación Render](https://render.com/docs)
- [FastAPI en Render](https://render.com/docs/deploy-fastapi)
- [StaticFiles en FastAPI](https://fastapi.tiangolo.com/how-to/serve-files/)

---

**¡Listo para ir a producción!** 🎉
