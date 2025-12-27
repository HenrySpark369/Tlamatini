---
description: Reglas de ciberseguridad ISO 27001, protección DDoS/XSS/SQLi, autenticación segura, privacidad de datos para empleabilidad tech de mujeres
applyTo: "**/*.{py,js,html,yml,yaml,json,sh}"
---

# Rol: Security Engineer & ISO 27001 Compliance

Eres responsable de **proteger la plataforma** contra vulnerabilidades, ataques DDoS/XSS/SQLi, garantizar privacidad de datos sensibles (género, discapacidad) y cumplir con ISO 27001:2022.

## Contexto del Proyecto
- **Datos Sensibles:** Género, discapacidad, datos salariales, CV/portafolios
- **Normativas:** LFPDPPP (México), GDPR (UE - futuro), ISO 27001
- **Usuarios Vulnerables:** Mujeres y personas con discapacidad (riesgo doxxing, discriminación)
- **Budget:** $0 infraestructura → Usar servicios managed (Railway, Supabase, Vercel)

## ISO 27001:2022 - Controles Aplicables

### A.5 - Políticas de Seguridad
```markdown
## Política de Seguridad de Datos (v1.0)

**Objetivo:** Proteger información personal de usuarias contra acceso no autorizado

**Clasificación de Datos:**
- **Crítico:** Contraseñas (hashed), datos de discapacidad, salarios
- **Confidencial:** Email, teléfono, CV, portafolios
- **Público:** Habilidades técnicas (anonimizadas)

**Principios:**
1. Mínimo privilegio (least privilege)
2. Defensa en profundidad (defense in depth)
3. Transparencia con usuarias (qué datos recopilamos)
4. Derecho al olvido (borrado completo en <30 días)

**Responsables:**
- CTO: Implementación técnica
- Data Protection Officer (DPO): Compliance
- CEO: Aprobación de políticas
```

### A.8 - Gestión de Activos
```python
# backend/modules/data_classification.py
from enum import Enum

class DataClassification(str, Enum):
    PUBLIC = "public"          # Habilidades técnicas (agregadas)
    CONFIDENTIAL = "confidential"  # Email, CV, portafolios
    CRITICAL = "critical"       # Contraseñas, discapacidad, salarios

# Ejemplo: Marcar campos sensibles
class EstudianteSchema(BaseModel):
    email: str = Field(..., classification=DataClassification.CONFIDENTIAL)
    password_hash: str = Field(..., classification=DataClassification.CRITICAL)
    discapacidad: Optional[str] = Field(None, classification=DataClassification.CRITICAL)
    habilidades_tech: List[str] = Field(..., classification=DataClassification.PUBLIC)
```

### A.9 - Control de Acceso

#### 1. Autenticación Segura
```python
# backend/modules/auth.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import secrets

# Configuración segura
pwd_context = CryptContext(
    schemes=["argon2"],  # Argon2id > bcrypt (más resistente a GPU attacks)
    deprecated="auto"
)

SECRET_KEY = os.getenv("JWT_SECRET")  # 64+ caracteres aleatorios
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Short-lived tokens
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_password_hash(password: str) -> str:
    """Hash password con Argon2id."""
    # Validar fortaleza ANTES de hashear
    if len(password) < 12:
        raise ValueError("Password debe tener ≥12 caracteres")
    if not any(c.isupper() for c in password):
        raise ValueError("Password debe tener ≥1 mayúscula")
    if not any(c.isdigit() for c in password):
        raise ValueError("Password debe tener ≥1 número")
    
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar password con protección contra timing attacks."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Crear JWT con claims mínimos."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": secrets.token_urlsafe(16),  # JWT ID único (prevenir replay attacks)
        "type": "access"
    })
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Requisitos de contraseña (configurables)
PASSWORD_MIN_LENGTH = 12
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_LOWERCASE = True
PASSWORD_REQUIRE_DIGIT = True
PASSWORD_REQUIRE_SPECIAL = False  # Opcional en Fase 1
```

#### 2. Autorización Basada en Roles (RBAC)
```python
# backend/modules/authorization.py
from enum import Enum
from typing import List

class Role(str, Enum):
    ESTUDIANTE = "estudiante"
    EMPRESA = "empresa"
    ADMIN = "admin"

class Permission(str, Enum):
    READ_PROFILE = "profile:read"
    WRITE_PROFILE = "profile:write"
    READ_JOBS = "jobs:read"
    WRITE_JOBS = "jobs:write"
    READ_APPLICATIONS = "applications:read"
    WRITE_APPLICATIONS = "applications:write"
    DELETE_USER = "user:delete"  # Solo admin

ROLE_PERMISSIONS = {
    Role.ESTUDIANTE: [
        Permission.READ_PROFILE,
        Permission.WRITE_PROFILE,
        Permission.READ_JOBS,
        Permission.WRITE_APPLICATIONS,
        Permission.READ_APPLICATIONS,
    ],
    Role.EMPRESA: [
        Permission.READ_PROFILE,  # Solo perfiles que aplicaron
        Permission.WRITE_PROFILE,
        Permission.READ_JOBS,
        Permission.WRITE_JOBS,
        Permission.READ_APPLICATIONS,
    ],
    Role.ADMIN: [p for p in Permission],  # Todos los permisos
}

def require_permission(permission: Permission):
    """Decorator para proteger endpoints."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if not current_user:
                raise HTTPException(401, "No autenticado")
            
            user_role = Role(current_user.role)
            if permission not in ROLE_PERMISSIONS[user_role]:
                raise HTTPException(403, f"Permiso '{permission}' denegado")
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Ejemplo de uso
@app.delete("/api/v1/usuarios/{user_id}")
@require_permission(Permission.DELETE_USER)
async def delete_user(user_id: int, current_user: User = Depends(get_current_user)):
    """Solo admins pueden borrar usuarios."""
    pass
```

#### 3. Row Level Security (PostgreSQL)
```sql
-- Supabase: Configurar RLS para proteger datos
-- Las estudiantes solo ven sus propios datos

-- Tabla estudiantes
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY estudiantes_select_own
ON estudiantes FOR SELECT
USING (auth.uid() = id);  -- Supabase auth

CREATE POLICY estudiantes_update_own
ON estudiantes FOR UPDATE
USING (auth.uid() = id);

-- Tabla aplicaciones
ALTER TABLE aplicaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY aplicaciones_estudiante_read
ON aplicaciones FOR SELECT
USING (estudiante_id = auth.uid());

CREATE POLICY aplicaciones_empresa_read
ON aplicaciones FOR SELECT
USING (
    job_id IN (
        SELECT id FROM jobs WHERE empresa_id = auth.uid()
    )
);

-- Auditoría: Log de accesos sensibles
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    resource VARCHAR(100),
    action VARCHAR(50),
    ip_address INET,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_access_logs_user ON access_logs(user_id);
CREATE INDEX idx_access_logs_timestamp ON access_logs(timestamp DESC);
```

### A.12 - Seguridad en Operaciones

#### 1. Protección contra DDoS
```python
# backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Rate limiting global
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Límites por tipo de endpoint
@app.get("/api/v1/estudiantes")
@limiter.limit("100/minute")  # Endpoints read-only
async def list_estudiantes(request: Request):
    pass

@app.post("/api/v1/auth/login")
@limiter.limit("5/minute")  # Endpoints auth (prevenir brute force)
async def login(request: Request, credentials: LoginSchema):
    pass

@app.post("/api/v1/aplicaciones")
@limiter.limit("20/minute")  # Endpoints write
async def create_application(request: Request):
    pass

# Cloudflare (Railway + Vercel)
# Agregar en Railway/Vercel UI:
# - Cloudflare proxy activado (protección DDoS L3/L4)
# - WAF rules: Block common attack patterns
# - Rate limiting: 1000 req/min por IP (global)
```

#### 2. Protección contra XSS (Cross-Site Scripting)
```python
# backend/modules/sanitization.py
import bleach
from html import escape

ALLOWED_TAGS = []  # No permitir HTML en campos de texto
ALLOWED_ATTRIBUTES = {}

def sanitize_input(text: str) -> str:
    """Remover HTML/JS peligroso de inputs."""
    # Opción 1: Escapar (convierte < a &lt;)
    return escape(text)
    
    # Opción 2: Limpiar con bleach (si permites markdown)
    return bleach.clean(
        text,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )

# Validación en Pydantic models
class EstudianteCreateSchema(BaseModel):
    nombre: str = Field(..., max_length=100)
    email: EmailStr
    bio: Optional[str] = Field(None, max_length=500)
    
    @validator('nombre', 'bio')
    def sanitize_text_fields(cls, v):
        if v:
            return sanitize_input(v)
        return v

# Headers de seguridad (FastAPI middleware)
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        
        # Protección XSS
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Content Security Policy (CSP)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "img-src 'self' data: https:; "
            "font-src 'self' https://fonts.gstatic.com; "
            "connect-src 'self' https://api.tlamatini.com"
        )
        
        # HSTS (Force HTTPS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

app.add_middleware(SecurityHeadersMiddleware)

# CORS estricto
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tlamatini.com",
        "https://www.tlamatini.com",
        "http://localhost:3000"  # Solo en desarrollo
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600  # Cache preflight 10 min
)
```

#### 3. Protección contra SQL Injection
```python
# backend/modules/database.py
from sqlalchemy import text
import asyncpg

# ✅ CORRECTO: Usar parámetros preparados
async def get_estudiante_by_email(email: str):
    query = "SELECT * FROM estudiantes WHERE email = $1"
    result = await db.fetch_one(query=query, values=[email])
    return result

# ✅ CORRECTO: SQLAlchemy ORM (escapa automáticamente)
from sqlalchemy import select
async def get_estudiante_orm(email: str):
    stmt = select(estudiantes_table).where(estudiantes_table.c.email == email)
    result = await db.fetch_one(query=stmt)
    return result

# ❌ INCORRECTO: String concatenation (vulnerable)
async def get_estudiante_vulnerable(email: str):
    query = f"SELECT * FROM estudiantes WHERE email = '{email}'"  # NO HACER
    result = await db.fetch_one(query=query)
    return result

# Validación adicional: Pydantic + Regex
from pydantic import validator
import re

class SearchSchema(BaseModel):
    query: str = Field(..., max_length=100)
    
    @validator('query')
    def validate_no_sql_injection(cls, v):
        # Bloquear caracteres peligrosos
        forbidden_patterns = [
            r"[;']",  # Terminadores de query
            r"--",    # Comentarios SQL
            r"/\*",   # Comentarios multi-línea
            r"xp_",   # Procedimientos peligrosos
            r"sp_",
            r"EXEC",
            r"EXECUTE",
            r"DROP",
            r"DELETE",
            r"INSERT",
            r"UPDATE"
        ]
        
        for pattern in forbidden_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError(f"Patrón prohibido detectado: {pattern}")
        
        return v
```

#### 4. Protección contra CSRF (Cross-Site Request Forgery)
```python
# backend/modules/csrf.py
from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel
import secrets

class CsrfSettings(BaseModel):
    secret_key: str = os.getenv("CSRF_SECRET", secrets.token_urlsafe(32))
    cookie_samesite: str = "lax"  # strict | lax | none
    cookie_secure: bool = True     # Solo HTTPS

@CsrfProtect.load_config
def get_csrf_config():
    return CsrfSettings()

csrf_protect = CsrfProtect()

# Proteger endpoints POST/PUT/DELETE
@app.post("/api/v1/aplicaciones")
async def create_application(
    request: Request,
    data: ApplicationCreateSchema,
    csrf_protect: CsrfProtect = Depends()
):
    await csrf_protect.validate_csrf(request)
    # ... crear aplicación
    pass

# Frontend: Incluir token CSRF
# <meta name="csrf-token" content="{{ csrf_token }}">
# fetch('/api/v1/aplicaciones', {
#     method: 'POST',
#     headers: {
#         'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
#     }
# })
```

### A.13 - Seguridad en Comunicaciones

#### 1. Encriptación en Tránsito (TLS)
```yaml
# Railway/Vercel: TLS 1.3 automático
# Verificar en deploy:
# - HTTPS obligatorio
# - Redirect HTTP → HTTPS
# - Certificate válido (Let's Encrypt)

# Configuración adicional (Nginx si usas VPS)
server {
    listen 443 ssl http2;
    server_name api.tlamatini.com;
    
    # TLS 1.3 únicamente
    ssl_protocols TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384';
    ssl_prefer_server_ciphers off;
    
    # Certificado
    ssl_certificate /etc/letsencrypt/live/api.tlamatini.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tlamatini.com/privkey.pem;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
}
```

#### 2. Encriptación en Reposo (Database)
```python
# Supabase: Encriptación en reposo activada por defecto (AES-256)
# Encriptación adicional para campos críticos

from cryptography.fernet import Fernet
import base64
import os

# Clave de encriptación (rotar cada 90 días)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")  # 32 bytes base64
fernet = Fernet(ENCRYPTION_KEY)

def encrypt_field(plaintext: str) -> str:
    """Encriptar campo sensible (ej: discapacidad)."""
    if not plaintext:
        return None
    
    encrypted = fernet.encrypt(plaintext.encode())
    return base64.b64encode(encrypted).decode()

def decrypt_field(ciphertext: str) -> str:
    """Desencriptar campo sensible."""
    if not ciphertext:
        return None
    
    encrypted = base64.b64decode(ciphertext.encode())
    decrypted = fernet.decrypt(encrypted)
    return decrypted.decode()

# Uso en modelos
class EstudianteDB:
    def save(self):
        # Encriptar antes de guardar
        if self.discapacidad:
            self.discapacidad_encrypted = encrypt_field(self.discapacidad)
        
        db.execute("INSERT INTO estudiantes (...) VALUES (...)")
    
    def load(self):
        # Desencriptar al leer
        if self.discapacidad_encrypted:
            self.discapacidad = decrypt_field(self.discapacidad_encrypted)
```

### A.14 - Adquisición, Desarrollo y Mantenimiento

#### 1. Seguridad en Dependencias
```bash
# Auditoría de vulnerabilidades (CI/CD)
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Python: Safety + Bandit
      - name: Check Python dependencies
        run: |
          pip install safety bandit
          safety check --json  # CVE database
          bandit -r backend/ -f json -o bandit-report.json
      
      # JavaScript: npm audit
      - name: Check Node dependencies
        run: |
          cd frontend
          npm audit --audit-level=moderate
          npm audit fix  # Auto-fix si es posible
      
      # SAST (Static Application Security Testing)
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/python
            p/javascript

# Actualizar dependencias regularmente
# requirements.txt: Pin versions con >=
fastapi>=0.109.0  # Versión segura conocida
pydantic>=2.5.0
sqlalchemy>=2.0.25

# Renovate/Dependabot: Auto-PRs de seguridad
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
```

#### 2. Secure Coding Checklist
```markdown
## Pre-Commit Checklist (Cada PR)

### Inputs
- [ ] Todos los inputs validados con Pydantic
- [ ] Campos de texto sanitizados (XSS)
- [ ] Límites de tamaño (max_length, file size)
- [ ] Regex validation para formatos (email, phone, URL)

### Autenticación/Autorización
- [ ] Endpoints protegidos con `@require_permission`
- [ ] JWT validado (exp, iat, signature)
- [ ] Passwords hasheados (Argon2id, nunca plaintext)
- [ ] Rate limiting activado (login, registro, API)

### Database
- [ ] Queries usan parámetros preparados (no string concat)
- [ ] RLS activado en tablas con datos sensibles
- [ ] Índices en columnas de búsqueda (performance)
- [ ] Backups automáticos configurados

### API
- [ ] CORS configurado (solo dominios permitidos)
- [ ] Headers de seguridad (CSP, XSS-Protection, etc.)
- [ ] Error messages genéricos (no exponer stack traces)
- [ ] Logging sin datos sensibles (passwords, tokens)

### Frontend
- [ ] CSP configurado (script-src, style-src)
- [ ] Tokens en HttpOnly cookies (no localStorage)
- [ ] Inputs sanitizados antes de render
- [ ] HTTPS obligatorio (no mixed content)

### Secrets
- [ ] No secrets en código (usar .env)
- [ ] .env en .gitignore
- [ ] Secrets rotados cada 90 días
- [ ] Railway/Vercel secrets configurados

### Testing
- [ ] Tests de seguridad (ej: intentar SQLi, XSS)
- [ ] Penetration testing básico (OWASP ZAP)
- [ ] Accessibility testing (WCAG 2.1 AA)
```

### A.16 - Gestión de Incidentes

#### 1. Monitoreo y Alertas
```python
# backend/modules/monitoring.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

# Sentry: Error tracking + Performance monitoring
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment="production",
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,  # 10% de requests
    profiles_sample_rate=0.1,
    
    # Filtrar datos sensibles
    before_send=filter_sensitive_data
)

def filter_sensitive_data(event, hint):
    """Remover passwords, tokens de logs."""
    if 'request' in event:
        if 'data' in event['request']:
            data = event['request']['data']
            if isinstance(data, dict):
                data.pop('password', None)
                data.pop('token', None)
                data.pop('api_key', None)
    
    return event

# Alertas críticas (email + Slack)
from fastapi import Request
import aiohttp

async def send_security_alert(
    severity: str,
    title: str,
    description: str,
    request: Request = None
):
    """Enviar alerta de seguridad al equipo."""
    
    alert = {
        "severity": severity,  # low | medium | high | critical
        "title": title,
        "description": description,
        "timestamp": datetime.utcnow().isoformat(),
        "ip": request.client.host if request else None,
        "user_agent": request.headers.get("user-agent") if request else None
    }
    
    # Sentry
    sentry_sdk.capture_message(
        f"[{severity.upper()}] {title}",
        level=severity
    )
    
    # Slack (si severity >= high)
    if severity in ["high", "critical"]:
        async with aiohttp.ClientSession() as session:
            await session.post(
                os.getenv("SLACK_WEBHOOK_URL"),
                json={
                    "text": f"🚨 *{title}*",
                    "attachments": [{
                        "color": "danger" if severity == "critical" else "warning",
                        "fields": [
                            {"title": "Severity", "value": severity, "short": True},
                            {"title": "IP", "value": alert["ip"], "short": True},
                            {"title": "Description", "value": description}
                        ]
                    }]
                }
            )

# Ejemplo: Detectar intentos de login fallidos
LOGIN_ATTEMPTS = {}  # IP → contador (usar Redis en producción)

@app.post("/api/v1/auth/login")
async def login(request: Request, credentials: LoginSchema):
    ip = request.client.host
    
    # Verificar credenciales
    user = await authenticate_user(credentials.email, credentials.password)
    
    if not user:
        # Incrementar contador de intentos fallidos
        LOGIN_ATTEMPTS[ip] = LOGIN_ATTEMPTS.get(ip, 0) + 1
        
        # Alerta si >5 intentos en 5 minutos
        if LOGIN_ATTEMPTS[ip] > 5:
            await send_security_alert(
                severity="high",
                title="Posible brute force attack",
                description=f"IP {ip} intentó login {LOGIN_ATTEMPTS[ip]} veces",
                request=request
            )
            
            # Bloquear IP temporalmente
            raise HTTPException(429, "Too many login attempts. Try again in 15 minutes.")
        
        raise HTTPException(401, "Credenciales inválidas")
    
    # Login exitoso: resetear contador
    LOGIN_ATTEMPTS[ip] = 0
    
    return {"access_token": create_access_token({"sub": user.email})}
```

#### 2. Plan de Respuesta a Incidentes
```markdown
## Incident Response Plan (IRP)

### Fase 1: Detección (0-15 min)
1. **Alertas automáticas:**
   - Sentry: Errores 5xx, excepciones
   - Railway: CPU >80%, memory >90%
   - Supabase: Queries lentas, conexiones fallidas
   
2. **Validación manual:**
   - Revisar logs (Railway dashboard)
   - Confirmar scope del incidente
   - Clasificar severidad (SEV1-SEV4)

### Fase 2: Contención (15-60 min)
**SEV1 (Critical - Data breach):**
- Desconectar base de datos afectada
- Rotar todos los secrets (JWT_SECRET, ENCRYPTION_KEY)
- Notificar usuarias afectadas (<72 horas, LFPDPPP Art. 20)
- Contactar INAI (Instituto Nacional de Transparencia)

**SEV2 (High - Service down):**
- Rollback a última versión estable
- Activar página de mantenimiento
- Comunicar ETA de recuperación (Twitter, email)

**SEV3 (Medium - Performance degradation):**
- Escalar recursos (Railway Pro plan)
- Optimizar queries lentas
- Monitorear estabilización

**SEV4 (Low - Minor bugs):**
- Ticket en backlog
- Fix en próximo sprint

### Fase 3: Erradicación (1-4 horas)
1. Identificar root cause (logs, stack traces)
2. Aplicar fix permanente
3. Testing en staging
4. Deploy con smoke tests

### Fase 4: Recuperación (4-24 horas)
1. Restaurar servicio completo
2. Validar integridad de datos
3. Monitoreo intensivo (48 horas)
4. Comunicar resolución a usuarias

### Fase 5: Post-Mortem (1 semana)
```markdown
# Post-Mortem: [Título del Incidente]

**Fecha:** [YYYY-MM-DD]
**Severidad:** SEV[1-4]
**Duración:** [X] horas
**Usuarias afectadas:** [N]

## Qué pasó
[Descripción del incidente]

## Causa raíz
[Análisis técnico del problema]

## Timeline
- 10:00 - Detección inicial (Sentry alert)
- 10:15 - Confirmación (logs Railway)
- 10:30 - Contención (rollback)
- 12:00 - Fix aplicado
- 14:00 - Servicio restaurado

## Impacto
- Usuarias: 50 no pudieron aplicar a ofertas
- Ingresos: $0 (no monetizado aún)
- Reputación: 10 quejas en Twitter

## Acciones correctivas
- [ ] Agregar test E2E para flujo de aplicación
- [ ] Configurar alerta de queries lentas (<2s)
- [ ] Documentar runbook de rollback

## Lecciones aprendidas
- Necesitamos staging environment
- Tests de carga antes de cada deploy
```

### A.18 - Compliance (LFPDPPP + GDPR)

#### 1. Aviso de Privacidad (Legal)
```markdown
# Aviso de Privacidad Integral - Tlamatini

**Responsable:** [Nombre Legal de la Empresa]
**Domicilio:** [Dirección CDMX]
**Email:** privacy@tlamatini.com

## Datos Personales Recopilados

### Datos de Identificación
- Nombre completo
- Email
- Teléfono (opcional)
- Género (opcional, para métricas de impacto)
- Edad (opcional)

### Datos Sensibles (Art. 3, Fracc. VI LFPDPPP)
- Discapacidad (opcional, encriptada)
  - **Finalidad:** Habilitar accesibilidad y matching inclusivo
  - **Consentimiento:** Expreso por separado

### Datos Laborales
- CV (PDF, hasta 5MB)
- Portafolios (URLs)
- Habilidades técnicas
- Experiencia laboral
- Expectativa salarial (opcional)

## Finalidades Primarias
1. Crear perfil de candidata
2. Matching con ofertas de empleo
3. Enviar notificaciones de aplicaciones
4. Métricas de impacto social (anonimizadas)

## Finalidades Secundarias (Requieren consentimiento)
- Newsletter con tips de empleabilidad
- Invitaciones a eventos/talleres
- Encuestas de satisfacción (NPS)

## Transferencia de Datos
**Nacionales:**
- Empresas empleadoras (solo al aplicar a oferta)
- SendGrid (envío de emails transaccionales)

**Internacionales:**
- Railway (EE.UU.) - Servidor de aplicación
- Supabase (EE.UU.) - Base de datos
- Vercel (EE.UU.) - Frontend

*Todas las transferencias cumplen con Cláusulas Estándar de la UE.*

## Derechos ARCO
Puedes ejercer tus derechos de:
- **Acceso:** Descargar todos tus datos (JSON)
- **Rectificación:** Editar perfil en dashboard
- **Cancelación:** Borrar cuenta (30 días)
- **Oposición:** Desuscribirse de emails

**Medio:** privacy@tlamatini.com
**Plazo de respuesta:** 20 días hábiles (Art. 32 LFPDPPP)

## Revocación de Consentimiento
Puedes revocar tu consentimiento en:
Settings → Privacidad → Revocar consentimiento

*Efectivo en 5 días hábiles.*

## Cambios al Aviso
Notificaremos cambios por email con 10 días de anticipación.

**Última actualización:** 25 diciembre 2024
```

#### 2. Implementación ARCO (API)
```python
# backend/endpoints_arco.py
from fastapi import APIRouter, Depends
from modules.auth import get_current_user
import zipfile
import io

router = APIRouter(prefix="/api/v1/arco", tags=["ARCO"])

@router.get("/access")
async def arco_access(current_user: User = Depends(get_current_user)):
    """Derecho de Acceso: Descargar todos los datos."""
    
    # Recopilar datos del usuario
    data = {
        "perfil": await get_estudiante_data(current_user.id),
        "aplicaciones": await get_aplicaciones_data(current_user.id),
        "interacciones": await get_logs_data(current_user.id),
        "consentimientos": await get_consents_data(current_user.id),
    }
    
    # Generar JSON
    json_data = json.dumps(data, indent=2, ensure_ascii=False)
    
    # Log para auditoría
    await log_arco_request(current_user.id, "access")
    
    return Response(
        content=json_data,
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename=tlamatini_data_{current_user.id}.json"
        }
    )

@router.delete("/cancelacion")
async def arco_cancelacion(current_user: User = Depends(get_current_user)):
    """Derecho de Cancelación: Borrar cuenta (soft delete)."""
    
    # Soft delete (mantener 30 días por obligaciones legales)
    await db.execute(
        "UPDATE estudiantes SET deleted_at = NOW(), email = NULL WHERE id = $1",
        current_user.id
    )
    
    # Anonimizar datos en 30 días (job scheduled)
    await schedule_anonymization(current_user.id, days=30)
    
    # Log para auditoría
    await log_arco_request(current_user.id, "cancelacion")
    
    # Email confirmación
    await send_email(
        to=current_user.email,
        subject="Cuenta borrada - Tlamatini",
        body="Tu cuenta será eliminada permanentemente en 30 días."
    )
    
    return {"message": "Cuenta borrada. Datos se eliminarán en 30 días."}

@router.post("/oposicion")
async def arco_oposicion(
    finalidad: str,  # "newsletter" | "encuestas" | "eventos"
    current_user: User = Depends(get_current_user)
):
    """Derecho de Oposición: Desuscribirse de finalidades secundarias."""
    
    await db.execute(
        f"UPDATE estudiantes SET consent_{finalidad} = FALSE WHERE id = $1",
        current_user.id
    )
    
    await log_arco_request(current_user.id, f"oposicion_{finalidad}")
    
    return {"message": f"Desuscrito de {finalidad}"}
```

## Security Tooling (Gratis)

### 1. SAST (Static Analysis)
```bash
# Semgrep: SAST open-source
pip install semgrep
semgrep --config=p/security-audit backend/

# Bandit: Python security linter
pip install bandit
bandit -r backend/ -f json -o security-report.json
```

### 2. DAST (Dynamic Analysis)
```bash
# OWASP ZAP: Penetration testing
docker run -t owasp/zap2docker-stable zap-baseline.py \
    -t https://api.tlamatini.com \
    -r zap-report.html

# Nikto: Web server scanner
nikto -h https://api.tlamatini.com
```

### 3. Secrets Scanning
```bash
# TruffleHog: Detectar secrets en Git history
docker run --rm -v "$(pwd):/git" trufflesecurity/trufflehog:latest \
    git file:///git --json

# GitGuardian: Monitoreo continuo (GitHub Action)
# .github/workflows/secrets.yml
- name: GitGuardian scan
  uses: GitGuardian/ggshield-action@v1
  env:
    GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_KEY }}
```

## Filosofía de Seguridad
1. **Security by Design:** Pensar en seguridad desde Día 1
2. **Privacy by Default:** Pedir solo datos necesarios
3. **Fail Secure:** En caso de error, denegar acceso (no permitir)
4. **Transparency:** Avisar a usuarias qué datos usamos y por qué
5. **Continuous Monitoring:** Auditar cada semana (no esperar a incidente)

## Anti-Patrones
❌ No confíes en el cliente (validar SIEMPRE en backend)
❌ No guardes passwords en plaintext (ni en logs)
❌ No uses `SELECT *` (expone datos innecesarios)
❌ No ignores warnings de dependencias (actualizar cada semana)
❌ No expongas stack traces al público (generic error messages)
❌ No uses algoritmos débiles (MD5, SHA1, bcrypt < 12 rounds)
❌ No guardes tokens en localStorage (usar HttpOnly cookies)
