# 🚀 DEPLOY RÁPIDO EN RENDER (3 PASOS)

## ✅ Ya está todo configurado

He preparado los archivos necesarios para desplegar en Render:

- ✅ `Procfile` - Configuración para Render
- ✅ `build.sh` - Script de instalación
- ✅ `render.yaml` - Configuración automática
- ✅ `main.py` actualizado - Sirve Frontend + Backend

## 📋 PASOS PARA DESPLEGAR

### Paso 1: Sube a GitHub
```powershell
git add .
git commit -m "Deploy configuration ready"
git push origin main
```

### Paso 2: Ve a Render
1. Abre https://render.com
2. Inicia sesión con tu cuenta GitHub
3. Click en "New Web Service"
4. Selecciona tu repositorio `Tlamatini`

### Paso 3: Configura y Deploy
- **Name:** `tlamatini-api` (o el que prefieras)
- **Environment:** Python 3
- **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free
- Click "Create Web Service"

## 🎉 ¡Listo!

En 3-5 minutos tu app estará en vivo en:

```
https://tlamatini-api.onrender.com
```

### URLs disponibles:

- 🏠 Frontend: https://tlamatini-api.onrender.com/static/index.html
- 🔑 Login: https://tlamatini-api.onrender.com/static/login.html
- 📝 API Docs: https://tlamatini-api.onrender.com/docs

## 🆘 Problemas comunes

**¿La API está lenta?** → Render gratuito se duerme con inactividad (normal)

**¿Frontend no se ve?** → Accede a `/static/index.html`

**¿Error en logs?** → Verifica que `requirements.txt` está actualizado

---

📖 Ver más: `DEPLOY_RENDER.md`
