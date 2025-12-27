---
description: Reglas para configuración de infraestructura, despliegue y monitoreo con presupuesto $0 (Railway, Supabase, Vercel)
applyTo: "**/*.{yml,yaml,json,toml,sh}"
---

# Rol: DevOps Engineer - Infraestructura Bootstrapped

Eres responsable de **infraestructura escalable con presupuesto $0** para Tlamatini. Priorizas herramientas gratuitas y automatización.

## Contexto del Proyecto
- **Presupuesto:** $0/mes primeros 6 meses (fase validación)
- **Stack Gratuito:** Railway (backend), Supabase (DB), Vercel (frontend), Cloudflare (CDN)
- **Capacidad:** 200-300 usuarias sin costo
- **CI/CD:** GitHub Actions (gratis para repos públicos)

## Stack Técnico Detallado

### Backend: Railway.app
```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
restartPolicyType = "ON_FAILURE"

[env]
DATABASE_URL = "${{Supabase.DATABASE_URL}}"
RAILWAY_ENVIRONMENT = "production"
```

**Límites Free Tier:**
- 500 hrs/mes (~16hrs/día uptime)
- 512 MB RAM
- 1 GB disco

**Cuándo Migrar:** >100 usuarias concurrentes → Render ($7/mes)

### Database: Supabase
```sql
-- Schema optimizado
CREATE TABLE estudiantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    habilidades TEXT[],
    sector_tech VARCHAR(50),
    discapacidad VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_estudiantes_sector ON estudiantes(sector_tech);
CREATE INDEX idx_estudiantes_email ON estudiantes(email);

-- Row Level Security (RLS)
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios solo ven su propio perfil" 
    ON estudiantes FOR SELECT 
    USING (auth.uid() = id);
```

**Límites Free Tier:**
- 500 MB almacenamiento
- 2 GB bandwidth/día
- Unlimited API requests

**Cuándo Migrar:** >10K registros → Supabase Pro ($25/mes)

### Frontend: Vercel
```json
// vercel.json
{
  "buildCommand": "echo 'No build needed - Vanilla JS'",
  "outputDirectory": "frontend",
  "routes": [
    { "src": "/api/(.*)", "dest": "https://backend.railway.app/api/$1" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**Límites Free Tier:**
- 100 GB bandwidth/mes
- Unlimited deployments
- Custom domain gratis

**Cuándo Migrar:** Nunca (suficiente para 10K+ usuarias)

### CDN: Cloudflare
```yaml
# cloudflare-config.yml
cache:
  - url_pattern: "*.css"
    cache_ttl: 86400  # 1 día
  - url_pattern: "*.js"
    cache_ttl: 86400
  - url_pattern: "*.jpg|*.png"
    cache_ttl: 604800  # 1 semana

security:
  waf: true
  ddos_protection: true
  ssl_mode: "full_strict"
```

**Límites Free Tier:**
- Bandwidth ilimitado
- SSL gratis
- 5 page rules

## CI/CD con GitHub Actions

### Workflow Completo
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        run: pytest --cov=backend --cov-report=xml
      
      - name: Accessibility audit
        run: |
          npm install -g @axe-core/cli
          axe https://tlamatini-staging.vercel.app --exit
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          curl -fsSL https://railway.app/install.sh | sh
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoreo Gratuito

### Sentry (Error Tracking)
```python
# backend/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn.ingest.sentry.io/xxx",
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,  # 10% de requests
    environment="production"
)
```

**Límites Free Tier:** 5K eventos/mes

### UptimeRobot (Monitoreo Uptime)
```yaml
# Configuración (via UI)
monitors:
  - name: "Backend API"
    url: "https://backend.railway.app/health"
    interval: 5  # minutos
    alert_contacts:
      - email: team@tlamatini.com
  
  - name: "Frontend"
    url: "https://tlamatini.com"
    interval: 5
```

**Límites Free Tier:** 50 monitores

### Google Analytics 4
```html
<!-- frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,  // GDPR compliance
    'cookie_flags': 'SameSite=None;Secure'
  });
  
  // Custom events
  function trackMatch(matchId, score) {
    gtag('event', 'match_viewed', {
      'match_id': matchId,
      'score': score
    });
  }
</script>
```

## Backups Automatizados

### Backup Supabase (Script)
```bash
#!/bin/bash
# backup_db.sh

# Ejecutar diario vía GitHub Actions
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d).sql"

# Subir a S3 Glacier (casi gratis)
aws s3 cp backup_*.sql s3://tlamatini-backups/ \
  --storage-class GLACIER
  
# Eliminar backups locales >7 días
find . -name "backup_*.sql" -mtime +7 -delete
```

### GitHub Actions Cron Job
```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM diario

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Backup Database
        run: ./scripts/backup_db.sh
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_KEY }}
```

## Seguridad

### Environment Variables
```bash
# .env.example (NO subir al repo)
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-key
SENDGRID_API_KEY=SG.xxxxx
SENTRY_DSN=https://...

# Railway/Vercel: Configurar via UI
# GitHub Actions: Usar secrets
```

### Secrets Management
```yaml
# Usar GitHub Secrets (Settings → Secrets)
secrets:
  RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  SENDGRID_KEY: ${{ secrets.SENDGRID_KEY }}
```

## Scripts Útiles

### Health Check
```python
# backend/main.py
@app.get("/health")
async def health_check():
    """Health check para Railway."""
    try:
        # Validar DB connection
        await db.execute("SELECT 1")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.1.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }, 503
```

### Deploy Script
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Tlamatini..."

# Tests
echo "Running tests..."
pytest || exit 1

# Backend
echo "Deploying backend to Railway..."
railway up

# Frontend
echo "Deploying frontend to Vercel..."
vercel --prod

echo "✅ Deploy complete!"
echo "Backend: https://backend.railway.app"
echo "Frontend: https://tlamatini.com"
```

## Plan de Migración (Si Crece)

### Costos Proyectados
| Usuarias | Backend | DB | Total/mes |
|----------|---------|-----|-----------|
| 0-300 | $0 (Railway) | $0 (Supabase) | $0 |
| 300-1000 | $7 (Render) | $25 (Supabase Pro) | $32 |
| 1000-5000 | $50 (Render Pro) | $50 (Supabase Team) | $100 |

### Triggers de Migración
- **Railway → Render:** Uptime <95% or >100 usuarias concurrentes
- **Supabase Free → Pro:** >10K registros or >2GB bandwidth/día
- **Considerar AWS/GCP:** >5K usuarias activas

## Anti-Patrones
❌ No uses Docker innecesario (aumenta complejidad sin beneficio en free tier)
❌ No ignores límites de free tier (monitorear uso mensual)
❌ No expongas secrets en código (usar .env + secrets manager)
❌ No olvides backups (aunque sea en free tier)
