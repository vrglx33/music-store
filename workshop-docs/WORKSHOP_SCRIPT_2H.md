# 🎓 Workshop: AgentOps - De ChatOps a Agentes Inteligentes
## Guión Completo - 2 Horas

---

## 📋 Información del Workshop

**Duración:** 2 horas (120 minutos)  
**Formato:** Presencial/Virtual  
**Nivel:** Intermedio  
**Audiencia:** DevOps Engineers, Platform Engineers, SREs  
**Proyecto Demo:** Music Store Platform (Node.js/TypeScript + PostgreSQL + Kubernetes)

---

## 🎯 Objetivos de Aprendizaje

Al finalizar este workshop, los participantes podrán:
1. ✅ Entender el concepto de **AgentOps** y su diferencia con ChatOps
2. ✅ Usar **Pipe Pilot** para generar pipelines de Jenkins con IA
3. ✅ Operar Kubernetes con **Kagent** usando lenguaje natural
4. ✅ Crear **agentes personalizados** de Kagent para sus aplicaciones
5. ✅ Implementar una arquitectura de agentes en su infraestructura

---

## 📊 Estructura del Workshop

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 - 0:15 | Introducción: ChatOps → AgentOps | 15 min |
| 0:15 - 0:45 | Parte 1: Pipe Pilot - Agente de IA para Jenkins | 30 min |
| 0:45 - 1:15 | Parte 2: Kagent - Agentes de K8s | 30 min |
| 1:15 - 1:45 | Parte 3: Agentes Personalizados | 30 min |
| 1:45 - 2:00 | Cierre y Q&A | 15 min |

---

# 🎬 GUIÓN DETALLADO

---

## 📍 INTRODUCCIÓN Y SETUP (0:00 - 0:15) - 15 minutos

### 0:00 - 0:03 | Bienvenida (3 min)

**[SLIDE: Portada del Workshop]**

**Narración:**
> "¡Bienvenidos! Soy [tu nombre] y hoy vamos a explorar cómo la Inteligencia Artificial está transformando DevOps. No vamos a hablar de teoría, vamos a **hacer** DevOps con IA en vivo."

**Presentación personal:**
- Tu rol y experiencia
- Por qué te apasiona este tema
- Qué van a ver hoy

**[SLIDE: Agenda del Workshop]**

> "En las próximas 2 horas vamos a:
> 1. Generar pipelines de CI/CD con IA
> 2. Refactorizar código legacy
> 3. Operar Kubernetes con lenguaje natural
> 4. Y crear nuestros propios agentes de IA"

---

### 0:03 - 0:08 | El Problema (5 min)

**[SLIDE: DevOps Tradicional - Muchos Comandos]**

> "Levanten la mano si alguna vez han tenido que buscar en Google 'kubectl command to...' o 'terraform syntax for...'"

**Mostrar en terminal:**
```bash
# Ejemplo de complejidad
kubectl get pods -n production --field-selector=status.phase=Running \
  --sort-by=.metadata.creationTimestamp \
  -o custom-columns=NAME:.metadata.name,STATUS:.status.phase
```

> "Este es un comando real que probablemente nadie recuerda de memoria. Y esto es solo la punta del iceberg."

**[SLIDE: Carga Cognitiva en DevOps]**

Mostrar estadísticas:
- 100+ comandos de kubectl
- 50+ recursos de Kubernetes
- Múltiples herramientas (Helm, Terraform, ArgoCD)
- Documentación fragmentada

> "La carga cognitiva es real. Y aquí es donde entra la IA."

---

### 0:08 - 0:13 | La Solución: De ChatOps a AgentOps (5 min)

**[SLIDE: ChatOps vs AgentOps]**

```
┌─────────────────────────────────────────────────┐
│              CHATOPS (Ayer)                     │
├─────────────────────────────────────────────────┤
│  Humano → Comando → Bot → Acción               │
│  "Necesito saber los comandos exactos"         │
│  Bot ejecuta pero no razona                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              AGENTOPS (Hoy)                     │
├─────────────────────────────────────────────────┤
│  Humano → Intención → Agente → Razonamiento    │
│  "Escala mi app porque viene tráfico"          │
│  Agente verifica, actúa y confirma             │
└─────────────────────────────────────────────────┘
```

**Explicar diferencias clave:**
1. **Intención vs Comandos**: Dices QUÉ quieres, no CÓMO hacerlo
2. **Razonamiento**: El agente verifica antes de actuar
3. **Contexto**: El agente entiende tu aplicación
4. **Seguridad**: Verificación automática de impacto

---

### 0:13 - 0:15 | Proyecto Demo (2 min)

**[SLIDE: Music Store Platform]**

> "Hoy vamos a trabajar con una aplicación real: Music Store Platform."

**Mostrar arquitectura:**
```
┌─────────────────────────────────────────────┐
│         MUSIC STORE PLATFORM                │
├─────────────────────────────────────────────┤
│  Frontend: React + TypeScript               │
│  Backend: Node.js + Express                 │
│  Database: PostgreSQL 18                    │
│  ORM: Prisma                                │
│  Deploy: Kubernetes (KIND)                  │
└─────────────────────────────────────────────┘
```

**Mostrar en terminal:**
```bash
# Verificar que todo está corriendo
kubectl get pods -n music-store
```

> "Esta es una aplicación real con todos los componentes que verían en producción."

---

## 📍 PARTE 1: PIPE PILOT - AGENTE DE IA PARA JENKINS (0:15 - 0:45) - 30 minutos

### 0:15 - 0:20 | Introducción a Pipe Pilot (5 min)

**[SLIDE: ¿Qué es Pipe Pilot?]**

> "Pipe Pilot es un **agente de IA** que genera pipelines completos de Jenkins automáticamente analizando tu repositorio."

**El problema tradicional:**
```
ANTES (Manual):
1. Analizar el proyecto (15 min)
2. Escribir Jenkinsfile (30 min)
3. Configurar plugins (10 min)
4. Crear job en Jenkins (5 min)
5. Debuggear errores (20 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~80 minutos
```

**Con Pipe Pilot (Agente IA):**
```
AHORA (Automatizado):
1. python main.py <repo-url>
2. Agente analiza el código
3. Agente genera pipeline
4. Agente crea job
5. Agente instala plugins
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~3 minutos
```

**Arquitectura del Agente:**
```
┌─────────────────────────────────────────────────┐
│              PIPE PILOT AGENT                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. 🔍 ANALYZER                                │
│     ├─ Detecta lenguaje (Node.js, Python, etc) │
│     ├─ Identifica dependencias                 │
│     └─ Analiza estructura del proyecto         │
│                                                 │
│  2. 🤖 AI ENGINE (Claude/GPT-4/Llama)          │
│     ├─ Genera Jenkinsfile                      │
│     ├─ Crea job config XML                     │
│     └─ Lista plugins necesarios                │
│                                                 │
│  3. 💬 INTERACTIVE CHAT                        │
│     ├─ Refinamiento con lenguaje natural       │
│     ├─ "Add docker build stage"                │
│     └─ Mejora iterativa del pipeline           │
│                                                 │
│  4. 🚀 AUTOMATION                              │
│     ├─ Push a Git                              │
│     ├─ Crea job en Jenkins                     │
│     └─ Instala plugins faltantes               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Características clave:**
1. **Multi-LLM** - Claude, GPT-4, Llama
2. **Multi-lenguaje** - Node.js, Python, Java, Go, Rust, PHP
3. **Interactivo** - Chat para refinar el pipeline
4. **Automatizado** - De repo a pipeline en minutos
5. **Inteligente** - Solo instala plugins necesarios

---

### 0:20 - 0:25 | Demo 1: Instalar Pipe Pilot (5 min)

**[SLIDE: Instalación de Pipe Pilot]**

> "Vamos a instalar Pipe Pilot en minutos."

**[TERMINAL]**

**Paso 1: Clonar el repositorio**
```bash
# Clonar Pipe Pilot
git clone https://github.com/zim0101/pipe-pilot.git
cd pipe-pilot

# Crear entorno virtual
python3 -m venv .venv
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

**Paso 2: Configurar variables de entorno**
```bash
# Copiar ejemplo de configuración
cp .env.example .env

# Editar .env
vim .env
```

**Contenido del .env:**
```bash
# AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=anthropic/claude-3-haiku

# Jenkins Configuration
JENKINS_URL=http://localhost:8080
JENKINS_USERNAME=admin
JENKINS_TOKEN=your_jenkins_api_token
```

**Explicar:**
> "Pipe Pilot necesita:
> - **OpenRouter API Key**: Para acceder a Claude/GPT-4 (gratis en openrouter.ai)
> - **Jenkins Token**: Para crear jobs automáticamente
> 
> El agente usará estos credentials para automatizar todo el proceso."

---

### 0:25 - 0:35 | Demo 2: Generar Pipeline con Pipe Pilot (10 min)

**[SLIDE: Pipe Pilot en Acción]**

> "Ahora vamos a ver cómo Pipe Pilot genera un pipeline completo automáticamente."

**[TERMINAL]**

**Ejecutar Pipe Pilot:**
```bash
# Generar pipeline para Music Store
python main.py https://github.com/tu-usuario/music-store
```

**Observar el proceso del agente:**
```
🚀 Pipe Pilot - AI-Powered Jenkins Pipeline Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Analyzing repository...
   ✓ Detected: Node.js/TypeScript project
   ✓ Found: package.json, tsconfig.json
   ✓ Dependencies: Express, React, Prisma, PostgreSQL
   ✓ Build tool: npm
   ✓ Test framework: Jest

🤖 Generating pipeline with Claude...
   ✓ Jenkinsfile created
   ✓ Job config XML generated
   ✓ Plugin requirements identified

📋 Generated Pipeline:
   • Build stage (npm ci, npm run build)
   • Test stage (npm test)
   • Docker build stage
   • Deploy to Kubernetes stage
   • PostgreSQL migration step

🔌 Required Jenkins Plugins:
   • nodejs (16.2.1)
   • docker-workflow (563.vd5d2e5c4007f)
   • kubernetes (3909.v1f2c633e8590)
   • postgresql (42.5.4)
```

**Modo Interactivo:**
```bash
💬 Interactive Mode - Provide feedback to improve the pipeline
📝 Your feedback (or 'exit'/'ready'): 
```

**Dar feedback al agente:**
```
add security scanning with Snyk before deployment
```

**El agente actualiza el pipeline:**
```
🤖 Updating pipeline...
   ✓ Added Snyk security scan stage
   ✓ Added SNYK_TOKEN credential
   ✓ Updated plugin requirements

📋 Updated Pipeline now includes:
   • Build stage
   • Test stage
   • Security scan stage (Snyk) ← NUEVO
   • Docker build stage
   • Deploy to Kubernetes stage
```

**Finalizar:**
```
📝 Your feedback (or 'exit'/'ready'): ready
```

**Automatización completa:**
```
🚀 Deploying to Jenkins...
   ✓ Jenkinsfile committed and pushed
   ✓ Jenkins job 'music-store-pipeline' created
   ✓ Installing missing plugins...
      • snyk-security-scanner (installed)
   ✓ Job configured and ready

🏁 Your Jenkins pipeline is ready to use!
   URL: http://localhost:8080/job/music-store-pipeline
```

**Explicar lo que pasó:**
> "En menos de 3 minutos, el agente:
> 1. ✅ **Analizó** el repositorio automáticamente
> 2. ✅ **Generó** un Jenkinsfile completo con best practices
> 3. ✅ **Refinó** el pipeline con feedback en lenguaje natural
> 4. ✅ **Creó** el job en Jenkins
> 5. ✅ **Instaló** los plugins necesarios
> 
> Todo sin escribir una línea de código manualmente."

---

### 0:35 - 0:45 | Demo 3: Ver el Jenkinsfile Generado (10 min)

**[SLIDE: Jenkinsfile Generado por el Agente]**

> "Veamos el Jenkinsfile que Pipe Pilot generó automáticamente."

**[TERMINAL]**

```bash
# Ver el Jenkinsfile generado
cat Jenkinsfile
```

**Jenkinsfile generado por Pipe Pilot:**
```groovy
pipeline {
    agent any
    
    environment {
        NODEJS_VERSION = '18'
        DOCKER_REGISTRY = 'gcr.io/music-store-prod'
        IMAGE_NAME = 'music-store-platform'
        K8S_NAMESPACE = 'music-store'
    }
    
    tools {
        nodejs "NodeJS ${NODEJS_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/tu-usuario/music-store'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    snykSecurity(
                        snykInstallation: 'Snyk',
                        snykTokenId: 'SNYK_TOKEN',
                        failOnIssues: false
                    )
                }
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push()
                    docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push('latest')
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                sh '''
                    kubectl run prisma-migrate-${BUILD_NUMBER} \
                      --image=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \
                      --restart=Never \
                      --namespace=${K8S_NAMESPACE} \
                      -- npx prisma migrate deploy
                '''
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/music-store-platform \
                      music-store=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \
                      --namespace=${K8S_NAMESPACE}
                    
                    kubectl rollout status deployment/music-store-platform \
                      --namespace=${K8S_NAMESPACE}
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}
```

**Explicar las características:**
> "El agente generó un pipeline con:
> - ✅ **7 stages** bien estructurados
> - ✅ **Best practices**: npm ci, cleanWs, rollout status
> - ✅ **Security scanning** con Snyk (agregado por feedback)
> - ✅ **Database migrations** con Prisma
> - ✅ **Docker multi-stage**: build + push + tag latest
> - ✅ **Kubernetes deployment** con verificación
> - ✅ **Error handling** en post actions
> 
> Todo esto sin escribir una línea manualmente."

**[SLIDE: Resumen Parte 1]**

> "Pipe Pilot (Agente de IA para Jenkins) nos permite:
> - ✅ **Generar pipelines** en minutos vs horas
> - ✅ **Refinar con lenguaje natural** (chat interactivo)
> - ✅ **Automatizar todo**: código + job + plugins
> - ✅ **Best practices** incorporadas automáticamente
> - ✅ **Multi-lenguaje**: Node.js, Python, Java, Go, etc.
> 
> Esto es AgentOps en CI/CD: agentes que entienden tu código y generan infraestructura."

---

## 🔗 TRANSICIÓN: DESPLEGAR CON JENKINS (0:45 - 0:50) - 5 minutos

**[SLIDE: De Generación a Ejecución]**

> "Ahora que Pipe Pilot generó nuestro Jenkinsfile, vamos a usarlo para desplegar Music Store en Kubernetes."

### Crear y Ejecutar el Pipeline

**[JENKINS UI]**

1. **Crear job:**
   - New Item → "music-store-pipeline"
   - Pipeline type
   - Pipeline script from SCM → Git
   - Repository URL
   - Script Path: `Jenkinsfile`

2. **Build Now**

**[TERMINAL - Paralelo]**

```bash
# Ver Jenkins agents siendo creados dinámicamente
watch kubectl get pods -n jenkins -l jenkins=agent

# Ver el deployment de Music Store
watch kubectl get pods -n music-store
```

**Narración:**
> "Observen cómo Jenkins crea agents especializados en Kubernetes:
> - Agent con Node.js para build y tests
> - Agent con Docker para crear la imagen
> - Agent con kubectl para deployment
> 
> Cada agent es efímero: se crea, ejecuta su tarea, y se destruye.
> Esto es infraestructura como código llevada al siguiente nivel."

**[Mostrar Jenkins UI - Pipeline ejecutándose]**

Stages visibles:
- ✅ Checkout
- ✅ Build & Test
- 🔄 Docker Build & Push (en progreso)
- ⏳ Database Migration
- ⏳ Deploy to Kubernetes

---

## 📍 PARTE 2: KAGENT - AGENTES DE KUBERNETES (0:50 - 1:15) - 25 minutos

### 0:50 - 0:52 | Introducción a Kagent (2 min)

**[SLIDE: ¿Qué es Kagent?]**

> "Mientras el pipeline de Jenkins está ejecutándose, usemos Kagent para monitorear qué está pasando en Kubernetes."

**Diferencia clave:**
```
TRADICIONAL:
Humano → Comando kubectl → Kubernetes
"kubectl get pods -n music-store --field-selector=status.phase=Running"

KAGENT:
Humano → Intención → Agente → Razonamiento → Kubernetes
"Show me all running pods in music-store"
```

**Arquitectura:**
```
┌──────────────────────────────────────────┐
│           KAGENT FRAMEWORK               │
├──────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │k8s-    │  │helm-   │  │observ- │    │
│  │agent   │  │agent   │  │agent   │    │
│  └────────┘  └────────┘  └────────┘    │
│       ↓           ↓           ↓         │
│  ┌──────────────────────────────────┐  │
│  │      Kubernetes API              │  │
│  └──────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

### 0:52 - 0:58 | Demo 4: Instalar Kagent (6 min)

**[SLIDE: Instalación de Kagent]**

> "Kagent es muy fácil de instalar. Solo necesitamos el CLI y una API key de un proveedor LLM."

**[TERMINAL]**

**Paso 1: Descargar Kagent CLI**

```bash
# Para macOS (Apple Silicon)
curl -L https://github.com/kagent-dev/kagent/releases/latest/download/kagent-darwin-arm64 -o kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/

# Para macOS (Intel)
curl -L https://github.com/kagent-dev/kagent/releases/latest/download/kagent-darwin-amd64 -o kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/

# Para Linux
curl -L https://github.com/kagent-dev/kagent/releases/latest/download/kagent-linux-amd64 -o kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/

# Verificar instalación
kagent version
```

**Paso 2: Configurar API Key**

> "Kagent soporta múltiples proveedores LLM. Vamos a usar OpenAI, pero también funciona con Anthropic, Azure, Ollama, etc."

```bash
# Opción 1: OpenAI (recomendado)
export OPENAI_API_KEY="sk-..."

# Opción 2: Anthropic Claude
export ANTHROPIC_API_KEY="sk-ant-..."

# Opción 3: Azure OpenAI
export AZURE_OPENAI_API_KEY="..."
export AZURE_OPENAI_ENDPOINT="https://..."

# Opción 4: Ollama (local, gratis)
# No requiere API key, solo tener Ollama corriendo
```

**Paso 3: Instalar Kagent en Kubernetes**

```bash
# Instalar Kagent con el CLI
kagent install

# Esto despliega:
# - Kagent controller
# - Agentes pre-configurados (k8s-agent, helm-agent, etc.)
# - UI de Kagent (opcional)
# - MCP servers (Model Context Protocol)
```

**Observar el proceso:**
```
🚀 Installing Kagent...
   ✓ Creating namespace: kagent-system
   ✓ Installing CRDs (Custom Resource Definitions)
   ✓ Deploying Kagent controller
   ✓ Installing default agents:
      • k8s-agent (Kubernetes operations)
      • helm-agent (Helm management)
      • observability-agent (Monitoring)
      • promql-agent (Prometheus queries)
   ✓ Deploying MCP servers
   ✓ Installing Kagent UI (optional)

✅ Kagent installed successfully!

Next steps:
  1. Verify installation: kagent get agent
  2. Try your first command: kagent invoke --agent k8s-agent --task "list pods"
  3. Access UI: kubectl port-forward -n kagent-system svc/kagent-ui 3000:3000
```

**Paso 4: Verificar instalación**

```bash
# Ver agentes disponibles
kagent get agent -n default

# Salida esperada:
# +----+----------------------------------------+
# | #  | NAME                                   |
# +----+----------------------------------------+
# | 1  | default/k8s-agent                      |
# | 2  | default/helm-agent                     |
# | 3  | default/observability-agent            |
# | 4  | default/promql-agent                   |
# +----+----------------------------------------+

# Ver pods de Kagent
kubectl get pods -n kagent-system

# Salida esperada:
# NAME                                READY   STATUS    RESTARTS   AGE
# kagent-controller-xxx               1/1     Running   0          2m
# k8s-agent-xxx                       1/1     Running   0          2m
# helm-agent-xxx                      1/1     Running   0          2m
# kagent-ui-xxx                       1/1     Running   0          2m
```

**Explicar:**
> "En menos de 2 minutos tenemos:
> - ✅ Kagent instalado en nuestro cluster
> - ✅ 4+ agentes pre-configurados listos para usar
> - ✅ UI web para interactuar con los agentes
> - ✅ Todo conectado a nuestro proveedor LLM
> 
> Ahora podemos operar Kubernetes con lenguaje natural."

**[SLIDE: Proveedores LLM Soportados]**

| Proveedor | API Key Requerida | Costo | Recomendado Para |
|-----------|-------------------|-------|------------------|
| OpenAI | ✅ | $$ | Producción |
| Anthropic Claude | ✅ | $$ | Producción |
| Azure OpenAI | ✅ | $$$ | Enterprise |
| Ollama | ❌ | Gratis | Desarrollo/Testing |
| OpenRouter | ✅ | $ | Experimentación |

**Configuración Avanzada (Opcional):**

```bash
# Instalar con configuración personalizada
kagent install \
  --model-provider openai \
  --model gpt-4 \
  --namespace kagent-system \
  --enable-ui \
  --enable-metrics

# Configurar recursos para los agentes
kagent install --set agents.resources.requests.memory=512Mi

# Instalar solo agentes específicos
kagent install --agents k8s-agent,helm-agent
```

---

### 0:58 - 1:06 | Demo 5: Usar Kagent por Primera Vez (8 min)

**[SLIDE: Kagent Monitoreando en Tiempo Real]**

> "Vamos a usar Kagent para ver qué está pasando con nuestro deployment."

**[TERMINAL]**

**Demo 4a: Ver estado del deployment**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "What's happening with the music-store deployment right now?" \
  --stream
```

**El agente responde:**
```
Analyzing music-store deployment...

Current activity:
- Rolling update in progress
- Old pods: 3 (terminating)
- New pods: 3 (starting with image build #42)
- Strategy: RollingUpdate (maxSurge: 1, maxUnavailable: 1)

Recent events:
- Scaled up replica set music-store-platform-xyz to 3
- Started container in pod music-store-platform-xyz-abc
- Pulling image gcr.io/project/music-store:42
- Successfully pulled image

Status: Deployment is healthy and progressing normally.
ETA: 1-2 minutes for completion.
```

**Demo 4b: Verificar migración de base de datos**
```bash
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Did the database migration complete successfully?" \
  --stream
```

**El agente responde:**
```
Checking database migration status...

Migration job: prisma-migrate-42
Status: Completed ✅
Exit code: 0
Duration: 8 seconds

Logs analysis:
✓ Prisma schema loaded
✓ 5 migrations applied successfully
✓ Database is up to date

Database pod: music-store-db-postgresql-0
Status: Running (1/1 ready)
Connections: 3 active

Conclusion: Database migration completed successfully.
The application can now connect to the updated schema.
```

**Explicar:**
> "Observen cómo Kagent no solo ejecuta comandos, **razona** sobre el estado:
> - Identifica que hay un rolling update
> - Analiza los logs de la migración
> - Verifica la salud de la base de datos
> - Da un análisis contextual, no solo datos crudos
> 
> Esto es AgentOps: agentes que entienden el contexto."

**Prompt:**
```
Tengo este Jenkinsfile repetido en 10 microservicios Node.js.

Refactorízalo a Jenkins Shared Library con:
1. Función 'buildNodeApp' reutilizable
2. Función 'dockerBuildPush' parametrizable
3. Manejo de errores centralizado
4. Configuración por parámetros

El Jenkinsfile final debe ser simple
```

**Mostrar resultado:**
- Librería compartida con funciones reutilizables
- Jenkinsfile simplificado de 60 a 10 líneas
- Configuración por parámetros
- Mantenimiento centralizado

> "Beneficios:
> - Antes: 60 líneas repetidas
> - Después: 10 líneas de configuración
> - Cambios: 1 lugar en vez de 10"

---

### 1:00 - 1:10 | Demo 5: Modernizar Terraform (10 min)

**[SLIDE: Caso de Uso - Terraform Modules]**

**Prompt:**
```
Refactoriza este Terraform legacy a módulos reutilizables:
1. Módulo 'vpc' para networking
2. Módulo 'gke' para cluster
3. Variables y outputs apropiados
4. Documentación README

Sigue best practices de Terraform
```

**Mostrar:**
- Módulos reutilizables
- Estructura organizada
- Variables bien definidas
- Documentación automática

---

### 1:10 - 1:15 | Resumen Parte 2 (5 min)

**[SLIDE: Beneficios de la Refactorización]**

> "La IA no solo genera código nuevo, también mejora el existente:
> - ✅ Reduce duplicación
> - ✅ Mejora mantenibilidad
> - ✅ Aplica best practices
> - ✅ Genera documentación"

**Pausa para preguntas**

---

## 📍 PARTE 3: AGENTOPS CON KAGENT (1:15 - 1:45) - 30 minutos

### 1:15 - 1:17 | Introducción a Kagent (2 min)

**[SLIDE: ¿Qué es Kagent?]**

> "Ahora viene la parte más emocionante: **AgentOps**. Vamos a operar Kubernetes con lenguaje natural."

**Mostrar:**
```bash
# Ver agentes disponibles
kagent get agent -n default
```

> "Tenemos 11 agentes corriendo, cada uno especializado en un dominio."

---

### 1:17 - 1:25 | Demo 6: Operaciones Básicas (8 min)

**[SLIDE: Demo - Exploración]**

**Demo 1: Listar recursos**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me all pods in music-store namespace" \
  --stream
```

**Explicar:**
> "No necesité recordar `kubectl get pods -n music-store`. El agente entendió mi intención."

**Demo 2: Escalar aplicación**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale music-store-platform to 7 replicas" \
  --stream
```

**Observar juntos:**
1. El agente verifica el estado actual
2. Explica lo que va a hacer
3. Ejecuta el cambio
4. Confirma el resultado

> "Esto es más seguro que ejecutar comandos a ciegas."

**Verificar:**
```bash
kubectl get pods -n music-store | grep platform
```

---

### 1:25 - 1:33 | Demo 7: Helm y Troubleshooting (8 min)

**Demo 3: Helm releases**
```bash
kagent invoke --agent "helm-agent" --namespace default \
  --task "List all helm releases in music-store" \
  --stream
```

**Demo 4: Diagnosticar**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me logs of music-store pods from last 5 minutes" \
  --stream
```

> "El agente puede correlacionar múltiples fuentes e identificar problemas proactivamente."

---

### 1:33 - 1:40 | Demo 8: Agente Personalizado (7 min)

**[SLIDE: Crear Agentes Personalizados]**

> "Lo mejor de Kagent: pueden crear sus propios agentes."

**Mostrar el YAML:**
```bash
cat k8s/music-store-agent.yaml
```

**Explicar componentes:**
- System prompt (instrucciones)
- Tools (herramientas disponibles)
- Skills (capacidades)
- Deployment config

**Probar el agente:**
```bash
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Give me a complete health report" \
  --stream
```

**Mostrar resultado:**
- Reporte completo de salud
- Análisis de problemas
- Recomendaciones específicas

> "Este agente entiende el contexto de nuestra aplicación específica."

---

### 1:40 - 1:45 | Comparación y Resumen (5 min)

**[SLIDE: Antes vs Después]**

**Forma Tradicional:**
```bash
# 5 comandos diferentes
kubectl get pods -n music-store
kubectl get deployment music-store-platform -n music-store
kubectl scale deployment music-store-platform --replicas=7 -n music-store
kubectl get pods -n music-store -w
kubectl get events -n music-store
```

**Con Kagent:**
```bash
# 1 comando en lenguaje natural
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale music-store to 7 replicas and verify it's healthy" \
  --stream
```

**[SLIDE: Beneficios de AgentOps]**

1. **Democratización**: No necesitas ser experto
2. **Seguridad**: Verificación antes de actuar
3. **Contexto**: Respuestas con explicaciones
4. **Especialización**: Agentes expertos
5. **Extensibilidad**: Crea tus propios agentes

---

## 📍 CIERRE Y Q&A (1:45 - 2:00) - 15 minutos

### 1:45 - 1:50 | Resumen del Workshop (5 min)

**[SLIDE: Lo que Vimos Hoy]**

> "En 2 horas vimos cómo la IA transforma DevOps:
> 
> **Parte 1 - Generación:**
> - Jenkinsfile completo en minutos
> - Infraestructura Terraform
> - GitHub Actions workflows
> 
> **Parte 2 - Refactorización:**
> - Shared Libraries de Jenkins
> - Módulos de Terraform
> - Código más mantenible
> 
> **Parte 3 - AgentOps:**
> - Operaciones con lenguaje natural
> - Agentes especializados
> - Agentes personalizados"

**[SLIDE: Mensaje Clave]**

> "La IA no reemplaza al ingeniero de DevOps. Es un **copiloto**, un **acelerador** y un **agente** que reduce la carga cognitiva."

---

### 1:50 - 1:55 | Próximos Pasos (5 min)

**[SLIDE: Cómo Empezar]**

**Para empezar hoy:**
1. Prueba Workik para generar pipelines
2. Usa Claude/ChatGPT para refactorizar
3. Instala Kagent en tu cluster de dev
4. Crea tu primer agente personalizado

**Recursos:**
- 📄 Documentación: https://kagent.dev
- 💻 GitHub: https://github.com/kagent-dev/kagent
- 💬 Discord: https://discord.gg/Fu3k65f2k3
- 📧 Contacto: [tu email]

**Archivos del workshop:**
- `KAGENT_DEMO_FLOW.md` - Script de demos
- `KAGENT_CUSTOM_AGENTS_GUIDE.md` - Guía de agentes
- `k8s/music-store-agent.yaml` - Ejemplo de agente
- `WORKSHOP_SCRIPT_2H.md` - Este guión

---

### 1:55 - 2:00 | Q&A (5 min)

**[SLIDE: Preguntas]**

> "¿Preguntas?"

**Preguntas frecuentes preparadas:**

**Q: ¿Kagent funciona con otros clouds además de GCP?**
A: Sí, funciona con cualquier cluster de Kubernetes (AWS, Azure, on-prem)

**Q: ¿Qué pasa con la seguridad? ¿El agente puede hacer cambios destructivos?**
A: Los agentes siguen el principio de least privilege. Solo tienen acceso a las herramientas que les das. Además, verifican antes de actuar.

**Q: ¿Cuánto cuesta usar Kagent?**
A: Kagent es open source. Solo pagas por el LLM (OpenAI, Anthropic, etc.). Puedes usar Ollama localmente gratis.

**Q: ¿Puedo usar esto en producción?**
A: Sí, pero empieza en dev/staging. Kagent es un proyecto CNCF Sandbox, usado por varias empresas.

**Q: ¿Cómo se compara con kubectl + scripts?**
A: No los reemplaza, los complementa. Reduce la carga cognitiva y democratiza el acceso.

---

## 📝 NOTAS PARA EL INSTRUCTOR

### Preparación Pre-Workshop

**1 semana antes:**
- [ ] Probar todas las demos
- [ ] Verificar que Kagent está instalado
- [ ] Preparar slides
- [ ] Revisar que Music Store está desplegada

**1 día antes:**
- [ ] Verificar cluster Kubernetes
- [ ] Probar comandos de Kagent
- [ ] Preparar terminal con fuente grande
- [ ] Tener comandos en archivo para copiar/pegar

**1 hora antes:**
- [ ] Verificar conexión a internet
- [ ] Abrir todas las herramientas (Workik, Claude, terminal)
- [ ] Verificar audio/video
- [ ] Tener agua/café

### Durante el Workshop

**Tips:**
- 🎤 Habla claro y pausado
- ⏸️ Pausa después de cada demo
- 👀 Mantén contacto visual con la audiencia
- 💬 Invita preguntas durante el workshop
- 🎯 Mantén el ritmo, pero sé flexible

**Si algo falla:**
- Ten comandos kubectl de respaldo
- Explica el error (es parte del aprendizaje)
- Usa los archivos de documentación como referencia

### Después del Workshop

- [ ] Compartir archivos del workshop
- [ ] Enviar enlaces a recursos
- [ ] Pedir feedback
- [ ] Responder preguntas por email/Discord

---

## 🎯 CHECKLIST FINAL

### Técnico
- [ ] Cluster Kubernetes corriendo
- [ ] Music Store desplegada (5 réplicas)
- [ ] PostgreSQL funcionando
- [ ] Kagent instalado (11 agentes)
- [ ] music-store-agent creado
- [ ] Port-forward activo

### Presentación
- [ ] Slides preparadas
- [ ] Terminal configurado (fuente grande)
- [ ] Comandos en archivo
- [ ] Documentación abierta
- [ ] Ejemplos de código listos

### Logística
- [ ] Audio/video funcionando
- [ ] Internet estable
- [ ] Backup de demos (videos)
- [ ] Contactos de participantes
- [ ] Materiales para compartir

---

## 📊 MÉTRICAS DE ÉXITO

Al final, los participantes deberían:
- ✅ Entender AgentOps vs ChatOps
- ✅ Haber visto 8 demos en vivo
- ✅ Saber cómo empezar con IA en DevOps
- ✅ Tener recursos para continuar aprendiendo
- ✅ Sentirse motivados a probar las herramientas

---

**¡Éxito con el workshop!** 🚀

**Última actualización:** 12 de noviembre de 2025  
**Versión:** 1.0  
**Autor:** [Tu nombre]
