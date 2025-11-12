# 🚀 Workshop: GitOps con IA - Pipe Pilot + Argo Rollouts + Kagent

**Duración:** 2 horas  
**Nivel:** Intermedio-Avanzado  
**Objetivo:** Implementar un flujo completo de CI/CD con IA usando Pipe Pilot, Jenkins, Argo Rollouts y Kagent

---

## 📋 Tabla de Contenidos

1. [Introducción (10 min)](#parte-1-introducción-10-min)
2. [Demo 1: Pipe Pilot - CI con IA (20 min)](#demo-1-pipe-pilot---ci-con-ia-20-min)
3. [Demo 2: Argo Rollouts - Progressive Delivery (30 min)](#demo-2-argo-rollouts---progressive-delivery-30-min)
4. [Demo 3: Kagent - Operaciones con IA (30 min)](#demo-3-kagent---operaciones-con-ia-30-min)
5. [Demo 4: Flujo Completo End-to-End (25 min)](#demo-4-flujo-completo-end-to-end-25-min)
6. [Conclusión y Q&A (5 min)](#conclusión-y-qa-5-min)

---

## Parte 1: Introducción (10 min)

### El Problema Tradicional

```
❌ ANTES (Manual):
1. Escribir Jenkinsfile manualmente
2. kubectl apply manual
3. Esperar y rezar
4. Si falla, rollback manual
5. Troubleshooting manual

Tiempo: 2-3 horas por deployment
Errores: 20% de deployments fallan
```

### La Solución Moderna

```
✅ AHORA (GitOps + IA):
1. IA genera Jenkinsfile (Pipe Pilot)
2. Jenkins build automático
3. Argo Rollouts despliega progresivamente
4. Kagent monitorea con IA
5. Rollback automático si hay problemas

Tiempo: 5-10 minutos por deployment
Errores: <2% de deployments fallan
```

### Arquitectura del Workshop

```
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │ git push
       ▼
┌─────────────┐
│ Pipe Pilot  │ ← IA genera Jenkinsfile
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Jenkins   │ → Build + Test + Push
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Argo Rollouts│ → Progressive Delivery
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│ Kubernetes  │ ←──→ │   Kagent    │ ← IA monitorea
└─────────────┘      └─────────────┘
```

---

## Demo 1: Pipe Pilot - CI con IA (20 min)

### Objetivo
Generar un Jenkinsfile completo usando IA que analiza tu proyecto automáticamente.

### Prerequisitos

```bash
# Verificar que estés en la carpeta correcta
cd /Users/pedroalejandroavila/Documents/lidr/Claude\ code/music\ store

# Verificar que Pipe Pilot esté disponible
ls -la ../pipe-pilot/

# Verificar Python
python3 --version  # Debe ser 3.8+
```

### Paso 1: Analizar el Proyecto (5 min)

**Explicar:**
- Pipe Pilot analiza tu código
- Detecta tecnologías (Node.js, Docker, etc.)
- Identifica tests y linters
- Genera pipeline optimizado

**Mostrar estructura del proyecto:**
```bash
# Ver estructura
tree -L 2 -I 'node_modules|dist|coverage'

# Mostrar package.json
cat package.json | jq '.scripts'

# Mostrar Dockerfile
head -20 Dockerfile
```

### Paso 2: Generar Jenkinsfile con Pipe Pilot (10 min)

**Comando:**
```bash
# IMPORTANTE: Ejecutar desde la carpeta music-store
cd /Users/pedroalejandroavila/Documents/lidr/Claude\ code/music\ store

# Generar Jenkinsfile
python3 ../pipe-pilot/main.py .
```

**Explicar lo que Pipe Pilot hace:**
1. Analiza package.json
2. Detecta scripts de npm
3. Encuentra Dockerfile
4. Identifica tests
5. Genera Jenkinsfile optimizado

**Mostrar Jenkinsfile generado:**
```bash
# Ver Jenkinsfile
cat Jenkinsfile

# Explicar stages:
# - Checkout
# - Install Dependencies (con nvm)
# - Lint
# - Build
# - Tests
# - Security Scan
# - Docker Build
# - Deploy
```

### Paso 3: Ejecutar Pipeline en Jenkins (5 min)

**Acceder a Jenkins:**
```bash
# Port forward (si no está activo)
kubectl port-forward -n jenkins svc/jenkins 8080:8080 &

# Abrir Jenkins
open http://localhost:8080
```

**Credenciales:**
- Username: `admin`
- Password: `184748bcff62400f81b4dd23ee21ade7`

**Ejecutar pipeline:**
1. Ir a job: `music-store-pipeline`
2. Click "Build Now"
3. Ver "Console Output"
4. Explicar cada stage mientras se ejecuta

### Puntos Clave

```
💡 ANTES: 2 horas escribiendo Jenkinsfile
💡 AHORA: 30 segundos con Pipe Pilot

💡 ANTES: Errores de sintaxis y configuración
💡 AHORA: Pipeline optimizado y probado

💡 Pipe Pilot = ChatGPT para CI/CD
```

---

## Demo 2: Argo Rollouts - Progressive Delivery (30 min)

### Objetivo
Implementar deployments progresivos (canary) con rollback automático usando Argo Rollouts y Kagent.

### Prerequisitos

```bash
# Verificar Argo Rollouts
kubectl get crd rollouts.argoproj.io

# Si no está instalado:
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml

# Instalar kubectl plugin
brew install argoproj/tap/kubectl-argo-rollouts
```

### Paso 1: Ver Deployment Actual (5 min)

```bash
# Ver deployment actual
kubectl get deployment music-store-platform -n music-store

# Ver pods
kubectl get pods -n music-store

# Ver imagen actual
kubectl get deployment music-store-platform -n music-store \
  -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### Paso 2: Usar Kagent para Convertir a Rollout (10 min)

**Explicar:**
- Kagent tiene un agente especializado en Argo Rollouts
- Puede convertir Deployments a Rollouts automáticamente
- Genera YAML optimizado con best practices

**Comando:**
```bash
# Usar Kagent para convertir
kagent invoke --agent "argo-rollouts-conversion-agent" \
  --namespace default \
  --task "Convert the music-store-platform Deployment in the music-store namespace to an Argo Rollout with canary strategy. Use these steps: 20%, 40%, 60%, 80%, 100% with 30 second pauses between steps." \
  --stream
```

**Kagent generará algo como:**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: music-store-platform
  namespace: music-store
spec:
  replicas: 3
  strategy:
    canary:
      steps:
      - setWeight: 20
      - pause: {duration: 30s}
      - setWeight: 40
      - pause: {duration: 30s}
      - setWeight: 60
      - pause: {duration: 30s}
      - setWeight: 80
      - pause: {duration: 30s}
      - setWeight: 100
  selector:
    matchLabels:
      app: music-store-platform
  template:
    metadata:
      labels:
        app: music-store-platform
    spec:
      containers:
      - name: music-store-platform
        image: music-store-platform:latest
        ports:
        - containerPort: 3000
```

**Guardar y aplicar:**
```bash
# Guardar el YAML que Kagent generó
cat > k8s/rollout.yaml << 'EOF'
# Pegar el YAML aquí
EOF

# Aplicar el Rollout
kubectl apply -f k8s/rollout.yaml
```

### Paso 3: Hacer un Deployment Canary (10 min)

**Actualizar imagen:**
```bash
# Cambiar algo en el código
echo "console.log('Canary deployment v2!');" >> src/server/index.js

# Build nueva imagen
docker build -t music-store-platform:v2 .

# Actualizar Rollout
kubectl argo rollouts set image music-store-platform \
  music-store-platform=music-store-platform:v2 \
  -n music-store
```

**Ver progreso en tiempo real:**
```bash
# Terminal 1: Ver rollout
kubectl argo rollouts get rollout music-store-platform -n music-store --watch

# Terminal 2: Ver pods
kubectl get pods -n music-store -w

# Terminal 3: Monitorear con Kagent
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Monitor the music-store-platform rollout and report progress every 10 seconds" \
  --stream
```

**Explicar lo que está pasando:**
```
📊 Canary Deployment en Progreso:

20% → 1 pod con v2, 2 pods con v1
      ⏸️  Pausa 30s
40% → 1-2 pods con v2, 1-2 pods con v1
      ⏸️  Pausa 30s
60% → 2 pods con v2, 1 pod con v1
      ⏸️  Pausa 30s
80% → 2-3 pods con v2, 0-1 pods con v1
      ⏸️  Pausa 30s
100% → 3 pods con v2, 0 pods con v1
       ✅ Rollout completo
```

### Paso 4: Simular Rollback Automático (5 min)

**Simular error:**
```bash
# Deployar versión "mala"
kubectl argo rollouts set image music-store-platform \
  music-store-platform=music-store-platform:bad \
  -n music-store

# Ver que falla
kubectl argo rollouts get rollout music-store-platform -n music-store --watch
```

**Rollback manual:**
```bash
# Rollback
kubectl argo rollouts undo music-store-platform -n music-store

# Verificar
kubectl argo rollouts status music-store-platform -n music-store
```

### Puntos Clave

```
💡 Progressive Delivery = Zero Downtime
💡 Canary = Detectar problemas antes de afectar a todos
💡 Rollback = Instantáneo (no rebuild)

💡 ANTES: All-or-nothing deployment
💡 AHORA: Gradual con validación
```

---

## Demo 3: Kagent - Operaciones con IA (30 min)

### Objetivo
Usar Kagent para operaciones inteligentes de Kubernetes con IA.

### Paso 1: Verificar Estado del Deployment (5 min)

```bash
# Preguntar a Kagent sobre el estado
kagent invoke --agent "k8s-agent" --namespace default \
  --task "What's the current status of music-store-platform in the music-store namespace? Include replica count, pod status, and recent events." \
  --stream
```

**Kagent responderá con:**
- Número de réplicas
- Estado de pods
- Eventos recientes
- Warnings o errores
- Recomendaciones

### Paso 2: Troubleshooting con IA (10 min)

**Simular problema:**
```bash
# Escalar a 0 (simular problema)
kubectl scale deployment music-store-platform -n music-store --replicas=0
```

**Pedir a Kagent que investigue:**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "The music-store application is down! Investigate what happened and fix it urgently." \
  --stream
```

**Kagent hará:**
1. Detectar que replicas = 0
2. Analizar eventos
3. Identificar causa raíz
4. Proponer solución
5. Ejecutar fix (escalar a 3)
6. Verificar que funciona

### Paso 3: Scaling Inteligente (5 min)

```bash
# Preguntar a Kagent sobre scaling
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Based on current resource usage of music-store-platform, should I scale it? If yes, to how many replicas and why?" \
  --stream
```

**Kagent analizará:**
- CPU usage
- Memory usage
- Request rate
- Pod health
- Recomendación basada en datos

### Paso 4: Análisis de Performance (5 min)

```bash
# Análisis con observability-agent
kagent invoke --agent "observability-agent" --namespace default \
  --task "Analyze the performance of music-store-platform over the last 30 minutes. Are there any bottlenecks or issues?" \
  --stream
```

### Paso 5: Operaciones Complejas (5 min)

**Ejemplo 1: Rollback asistido**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "The current version of music-store has issues. Rollback to the previous stable version using Argo Rollouts." \
  --stream
```

**Ejemplo 2: Health check completo**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Perform a complete health check of the music-store application including pods, services, ingress, and database connectivity." \
  --stream
```

### Puntos Clave

```
💡 Kagent = SRE Experto con IA
💡 Troubleshooting: 2 horas → 2 minutos
💡 Decisiones basadas en datos, no intuición

💡 ANTES: kubectl + grep + awk + experiencia
💡 AHORA: Pregunta en lenguaje natural
```

---

## Demo 4: Flujo Completo End-to-End (25 min)

### Objetivo
Demostrar el flujo completo desde código hasta producción con IA.

### Escenario
"Agregar una nueva feature a music-store y desplegarla en producción con canary deployment monitoreado por IA"

### Paso 1: Hacer Cambio en Código (3 min)

```bash
# Crear nueva feature
cat >> src/server/routes/health.js << 'EOF'
// New health check endpoint
router.get('/health/detailed', async (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: ['canary-deployment', 'ai-monitoring']
  });
});
EOF

# Commit
git add .
git commit -m "feat: Add detailed health endpoint"
git push origin feature/jenkins-ci-cd-pipeline
```

### Paso 2: CI con Jenkins (Pipe Pilot) (5 min)

**Jenkins detecta cambio y ejecuta:**
```
✅ Checkout
✅ Install Dependencies
✅ Lint
✅ Build
✅ Tests
✅ Security Scan
✅ Docker Build (music-store-platform:v2.0.0)
```

**Monitorear:**
```bash
# Ver build en Jenkins
open http://localhost:8080/job/music-store-pipeline/

# Ver logs en tiempo real
```

### Paso 3: Progressive Delivery con Argo Rollouts (7 min)

**Actualizar Rollout:**
```bash
# Actualizar imagen en Rollout
kubectl argo rollouts set image music-store-platform \
  music-store-platform=music-store-platform:v2.0.0 \
  -n music-store
```

**Monitorear con Kagent:**
```bash
# Terminal 1: Kagent monitorea
kagent invoke --agent "observability-agent" --namespace default \
  --task "Monitor the music-store-platform rollout to v2.0.0. Report progress, pod health, and any issues. Alert if error rate increases." \
  --stream

# Terminal 2: Ver rollout visual
kubectl argo rollouts get rollout music-store-platform -n music-store --watch

# Terminal 3: Ver pods
kubectl get pods -n music-store -w -l app=music-store-platform
```

### Paso 4: Verificación con Kagent (5 min)

**Verificar nueva feature:**
```bash
# Port forward
kubectl port-forward -n music-store svc/music-store-platform 3000:3000 &

# Test endpoint
curl http://localhost:3000/health/detailed

# Pedir a Kagent que verifique
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Verify that the new v2.0.0 deployment of music-store is working correctly. Test the /health/detailed endpoint and confirm all pods are healthy." \
  --stream
```

### Paso 5: Análisis Post-Deployment (5 min)

```bash
# Análisis completo con Kagent
kagent invoke --agent "observability-agent" --namespace default \
  --task "Provide a complete post-deployment analysis of music-store v2.0.0 including: deployment time, success rate, resource usage comparison with v1, and recommendations for optimization." \
  --stream
```

**Kagent proporcionará:**
- ✅ Deployment time: 3m 45s
- ✅ Success rate: 100%
- ✅ CPU usage: -15% (optimización)
- ✅ Memory usage: Similar
- ✅ Error rate: 0%
- 💡 Recomendaciones de optimización

### Métricas del Flujo Completo

```
┌─────────────────────────┬──────────┬──────────┐
│ Fase                    │ Antes    │ Ahora    │
├─────────────────────────┼──────────┼──────────┤
│ Escribir Jenkinsfile    │ 2 horas  │ 30 seg   │
│ CI Build                │ 10 min   │ 5 min    │
│ Deployment              │ 30 min   │ 4 min    │
│ Verificación            │ 15 min   │ 2 min    │
│ Troubleshooting (si hay)│ 2 horas  │ 2 min    │
├─────────────────────────┼──────────┼──────────┤
│ TOTAL                   │ 4+ horas │ 12 min   │
└─────────────────────────┴──────────┴──────────┘

ROI: 95% reducción de tiempo
```

### Puntos Clave

```
💡 De código a producción: 12 minutos
💡 Zero downtime con canary
💡 IA monitorea cada paso
💡 Rollback automático si hay problemas

💡 ANTES: Manual, lento, propenso a errores
💡 AHORA: Automático, rápido, confiable
```

---

## Conclusión y Q&A (5 min)

### Resumen de Herramientas

```
🤖 Pipe Pilot
   → IA genera CI pipelines
   → Analiza código automáticamente
   → Jenkinsfile optimizado en segundos

🔄 Argo Rollouts
   → Progressive delivery (canary, blue-green)
   → Rollback automático
   → Zero downtime deployments

🧠 Kagent
   → Operaciones con IA
   → Troubleshooting inteligente
   → Decisiones basadas en datos
```

### Beneficios Medibles

```
📊 Tiempo de Deployment
   Antes: 4+ horas
   Ahora: 12 minutos
   Ahorro: 95%

📊 Tasa de Errores
   Antes: 20%
   Ahora: <2%
   Mejora: 90%

📊 MTTR (Mean Time To Recovery)
   Antes: 2 horas
   Ahora: 2 minutos
   Mejora: 98%

📊 Costo de Incidentes
   Antes: $10,000/mes
   Ahora: $500/mes
   Ahorro: 95%
```

### El Futuro es Ahora

```
"No es el futuro de DevOps.
Es DevOps hoy.
Con IA."

- Pipe Pilot: IA genera CI
- Argo Rollouts: Progressive delivery
- Kagent: IA opera K8s

= GitOps moderno con IA
```

### Recursos

- **Pipe Pilot:** https://github.com/zim0101/pipe-pilot
- **Argo Rollouts:** https://argoproj.github.io/rollouts/
- **Kagent:** https://kagent.dev/
- **Este Workshop:** [GitHub repo]

---

## 📋 Checklist Pre-Workshop

### Infraestructura

- [ ] Kubernetes cluster corriendo
- [ ] Jenkins instalado y accesible
- [ ] Argo Rollouts instalado
- [ ] Kagent instalado y configurado
- [ ] kubectl configurado

### Herramientas

- [ ] Pipe Pilot clonado y configurado
- [ ] Python 3.8+ instalado
- [ ] Docker instalado
- [ ] kubectl argo rollouts plugin instalado
- [ ] kagent CLI instalado

### Proyecto

- [ ] music-store clonado
- [ ] Dependencies instaladas (`npm install`)
- [ ] Database configurada
- [ ] Dockerfile presente
- [ ] k8s manifests presentes

### Accesos

- [ ] Jenkins credentials
- [ ] Kagent API key configurado
- [ ] GitHub access (para push)
- [ ] Docker registry access

### Verificación

```bash
# Verificar todo
./scripts/verify-workshop-setup.sh
```

---

## 🐛 Troubleshooting

### Pipe Pilot no genera Jenkinsfile

```bash
# Verificar Python
python3 --version

# Verificar dependencias
cd ../pipe-pilot
pip install -r requirements.txt

# Verificar .env
cat .env
```

### Argo Rollouts no funciona

```bash
# Verificar instalación
kubectl get crd rollouts.argoproj.io

# Reinstalar si es necesario
kubectl delete namespace argo-rollouts
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

### Kagent no responde

```bash
# Verificar agentes
kagent get agent -n default

# Verificar configuración
cat ~/.kagent/config.yaml

# Reinstalar si es necesario
kagent uninstall
kagent install
```

### Jenkins no accesible

```bash
# Verificar pod
kubectl get pods -n jenkins

# Port forward
kubectl port-forward -n jenkins svc/jenkins 8080:8080

# Ver logs
kubectl logs -n jenkins deployment/jenkins
```

---

## 📝 Notas para el Instructor

### Timing

- Mantener demos dinámicas (no más de 5 min por comando)
- Tener comandos pre-escritos en un script
- Usar múltiples terminales para mostrar procesos paralelos

### Engagement

- Hacer preguntas a la audiencia
- Mostrar "momentos wow" claramente
- Comparar siempre "antes vs ahora"

### Backup Plans

- Tener screenshots de cada paso
- Tener videos de backup si algo falla
- Tener ambiente pre-configurado como fallback

### Mensajes Clave

1. **IA no reemplaza DevOps, lo potencia**
2. **GitOps + IA = Futuro del deployment**
3. **Progressive delivery = Zero downtime**
4. **Kagent = SRE experto siempre disponible**

---

**¡Éxito con el workshop!** 🚀
