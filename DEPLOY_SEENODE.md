# 🚀 GUÍA DE DEPLOY EN SEENODE

## Estructura del Proyecto

```
Tlamatini/
├── backend/           # API FastAPI
│   ├── main.py       # Sirve API + archivos estáticos del frontend
│   └── modules/
├── frontend/         # HTML, CSS, JS estáticos
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   └── ...
├── data/             # CSVs con datos
├── build.sh          # Script de construcción
└── requirements.txt  # Dependencias Python
```

## Pasos para Deployar en Seenode

### 1️⃣ **Verificar que Git esté sincronizado**

```bash
cd /Users/sparkmachine/Projects/Tlamatini
git status
git add .
git commit -m "Configuración para deploy en Seenode"
git push origin main
```

### 2️⃣ **Ir a Seenode Dashboard**

- Abre https://cloud.seenode.com
- Inicia sesión con GitHub o GitLab
- Click en "New" → "Web Service"

### 3️⃣ **Conectar el Repositorio**

- Selecciona tu repositorio `Tlamatini`
- Elige la rama (main o tu rama actual)
- Seenode detectará automáticamente que es Python

### 4️⃣ **Configurar Deploy**

- **Name:** `tlamatini-api`
- **Build Command:** `pip install -r requirements.txt` (auto-detectado)
- **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port 80`
- **Port:** `80` (⚠️ **IMPORTANTE**: Seenode requiere que configures el puerto explícitamente)
- **Pricing Tier:** Selecciona tu plan preferido

### 5️⃣ **Deploy**

Click en "Create Web Service" y espera 1-5 minutos. Seenode construirá e iniciará tu app.

## 🎯 Resultado

Tu aplicación estará disponible en:

```
https://tlamatini-api.seenode.app
```

Con todo funcionando:

- ✅ **Backend API:** `https://tlamatini-api.seenode.app/docs` (Swagger)
- ✅ **Frontend:** `https://tlamatini-api.seenode.app/static/index.html`
- ✅ **Endpoints de Matching:** `https://tlamatini-api.seenode.app/api/matching/...`

## 📝 Notas Importantes

1. **Primer Deploy:** Puede tardar 1-5 minutos mientras instala dependencias
2. **Puerto:** Debes configurar explícitamente el puerto a `80` en el dashboard
3. **Base de Datos:** Actualmente usa localStorage (frontend) - en producción usa PostgreSQL o MySQL
4. **Archivos CSV:** Se cargan desde `/data/` en el servidor
5. **SSL Automático:** Seenode proporciona certificados SSL gratis para HTTPS

## 🔧 Troubleshooting

### Error: "ModuleNotFoundError"
- Verifica que `requirements.txt` tiene todas las dependencias
- Ejecuta localmente: `pip install -r requirements.txt`
- Revisa los logs de compilación en la pestaña "Logs"

### 502 Bad Gateway
- **Causa más común:** El puerto configurado no coincide con el puerto de la app
- Verifica que el campo "Port" en configuración esté en `80`
- Asegúrate que el comando de inicio use `--port 80`
- Revisa los logs de runtime en "Logs"

### Frontend no se ve
- Verifica que carpeta `frontend/` existe
- Accede directamente: `https://tlamatini-api.seenode.app/static/login.html`
- Verifica que `backend/main.py` monta correctamente los archivos estáticos

### Build falla
- Revisa los logs de compilación en la pestaña "Logs"
- Verifica que `requirements.txt` esté actualizado
- Asegúrate que el Build Command esté correcto

## 📚 Recursos

- [Documentación Seenode](https://seenode.com/docs)
- [FastAPI en Seenode](https://seenode.com/docs/frameworks/python/fastapi/)
- [StaticFiles en FastAPI](https://fastapi.tiangolo.com/how-to/serve-files/)
- [Configuración de Puerto](https://seenode.com/docs/guides/deployments/port-configuration/)
- [Bases de Datos](https://seenode.com/docs/services/databases/)
- [Discord Community](https://discord.com/invite/d2gATEMFSc)

---

**¡Listo para ir a producción!** 🎉
