# 🚀 Demo: GitOps con Pipe Pilot + ArgoCD + Kagent

## 📋 Concepto Mejorado

**Flujo completo de CI/CD con IA:**
1. **Pipe Pilot** → Genera Jenkinsfile inteligente (CI)
2. **Jenkins** → Build, test, push Docker image
3. **ArgoCD** → Deploy automático en K8s (CD)
4. **Kagent** → Monitoreo inteligente y troubleshooting con IA

---

## 🎯 Flujo de la Demo (15 minutos)

### **Parte 1: CI con Pipe Pilot + Jenkins (3 min)**

**Mostrar:**
```bash
# 1. Generar Jenkinsfile con Pipe Pilot
python main.py /path/to/music-store

# 2. Jenkinsfile generado automáticamente
- Build
- Test
- Docker build & push
- Update manifest (nuevo!)
```

**Punto clave:** 
- Pipe Pilot genera pipeline completo con IA
- Jenkins construye imagen: `music-store:v1.2.3`
- Jenkins actualiza el manifest de K8s

---

### **Parte 2: CD con ArgoCD (3 min)**

**Mostrar:**
```bash
# ArgoCD detecta cambio en Git
# Sincroniza automáticamente
# Despliega nueva versión
```

**Dashboard de ArgoCD:**
- Estado: Syncing → Healthy
- Versión anterior: v1.2.2
- Versión nueva: v1.2.3
- Rollout progresivo visible

---

### **Parte 3: Monitoreo con Kagent (5 min) 🆕**

**Aquí está la magia:**

```bash
# Usar Kagent para verificar el deployment
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Check the status of music-store-platform deployment after the update to v1.2.3. Is it healthy?" \
  --stream
```

**Kagent responde:**
```
✅ Deployment Status:
- Replicas: 3/3 ready
- Image: music-store:v1.2.3
- Status: Healthy
- Rolling update: Completed successfully
- No errors detected

Recent events:
- Scaled up replica set to 3
- Successfully pulled new image
- All pods running and ready
```

**Troubleshooting automático con Kagent:**
```bash
# Si hay problemas, Kagent los detecta
kagent invoke --agent "k8s-agent" --namespace default \
  --task "The music-store app seems slow. Investigate and suggest solutions." \
  --stream
```

**Kagent analiza y responde:**
```
🔍 Analysis:
- CPU usage: 85% (high)
- Memory: 450MB/512MB (near limit)
- Response time: 2.5s (slow)

💡 Recommendations:
1. Scale to 5 replicas (immediate)
2. Increase memory limit to 1GB
3. Add HPA for auto-scaling

Would you like me to scale the deployment now?
```

**Escalar con Kagent:**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale music-store-platform to 5 replicas" \
  --stream
```

---

### **Parte 4: Demo Completa - GitOps + IA (4 min)**

**El flujo completo:**

1. **Developer hace cambio:**
```bash
# Editar código
echo "console.log('New feature!');" >> src/index.js
git add . && git commit -m "feat: Add new feature"
git push
```

2. **Jenkins CI (Pipe Pilot):**
```
✅ Build successful
✅ Tests passed
✅ Docker image built: v1.2.4
✅ Manifest updated in Git
```

3. **ArgoCD CD:**
```
🔄 Detected change in Git
🔄 Syncing...
✅ Deployed v1.2.4
```

4. **Kagent verifica automáticamente:**
```bash
kagent invoke --agent "observability-agent" --namespace default \
  --task "Monitor the music-store deployment and alert if any issues" \
  --stream
```

**Kagent responde en tiempo real:**
```
📊 Monitoring music-store-platform...

✅ Deployment progressing
✅ 1/3 pods updated
✅ 2/3 pods updated
✅ 3/3 pods updated
✅ All pods healthy
✅ Service responding normally
✅ No errors detected

Deployment completed successfully in 2m 15s
```

---

## 🛠️ Arquitectura Completa

```
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │ git push
       ▼
┌─────────────┐
│   GitHub    │◄──────┐
└──────┬──────┘       │
       │              │
       │ webhook      │ update manifest
       ▼              │
┌─────────────┐       │
│   Jenkins   │───────┘
│ (Pipe Pilot)│
└──────┬──────┘
       │ docker push
       ▼
┌─────────────┐
│  Registry   │
└─────────────┘
       ▲
       │ pull image
       │
┌──────┴──────┐
│   ArgoCD    │◄──── watches Git
└──────┬──────┘
       │ kubectl apply
       ▼
┌─────────────┐      ┌─────────────┐
│ Kubernetes  │◄─────│   Kagent    │
└─────────────┘      │  (AI Agent) │
                     └─────────────┘
                     monitors & troubleshoots
```

---

## 💡 Casos de Uso de Kagent

### **1. Verificación Post-Deployment**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Verify that the music-store deployment v1.2.4 is healthy and responding correctly" \
  --stream
```

### **2. Troubleshooting Automático**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Why are some music-store pods crashing? Fix the issue." \
  --stream
```

### **3. Scaling Inteligente**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Based on current load, should I scale music-store? If yes, to how many replicas?" \
  --stream
```

### **4. Rollback Asistido**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "The new version v1.2.4 has issues. Rollback to the previous stable version." \
  --stream
```

### **5. Análisis de Performance**
```bash
kagent invoke --agent "observability-agent" --namespace default \
  --task "Analyze the performance of music-store over the last hour. Any bottlenecks?" \
  --stream
```

---

## 🎬 Demo Script Completo

### **Slide 1: El Problema (1 min)**

```
❌ ANTES:
- Deployments manuales
- Troubleshooting manual
- No hay visibilidad
- Errores humanos

✅ DESPUÉS (GitOps + IA):
- Git push → Deploy automático
- IA monitorea y troubleshootea
- Visibilidad completa
- Cero errores humanos
```

---

### **Slide 2: La Solución - 3 Herramientas IA (2 min)**

```
🤖 Pipe Pilot
   → Genera pipelines CI con IA
   → Analiza tu código
   → Crea Jenkinsfile optimizado

🔄 ArgoCD
   → GitOps declarativo
   → Deploy automático
   → Rollbacks fáciles

🧠 Kagent
   → Monitoreo inteligente
   → Troubleshooting con IA
   → Operaciones autónomas
```

---

### **Demo Live (10 min)**

**Parte 1: Generar Pipeline (2 min)**
```bash
# Terminal 1
cd music-store
python ../pipe-pilot/main.py .

# Mostrar Jenkinsfile generado
cat Jenkinsfile
```

**Parte 2: Hacer Cambio y Deploy (3 min)**
```bash
# Terminal 1
echo "console.log('Demo feature');" >> src/index.js
git add . && git commit -m "feat: Demo feature"
git push

# Terminal 2: Ver Jenkins
open http://localhost:8080

# Terminal 3: Ver ArgoCD
open http://localhost:8080/argocd
```

**Parte 3: Kagent Verifica (2 min)**
```bash
# Terminal 4: Kagent monitorea
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Monitor music-store deployment and report status" \
  --stream
```

**Parte 4: Troubleshooting con Kagent (3 min)**
```bash
# Simular problema: escalar a 0
kubectl scale deployment music-store-platform -n music-store --replicas=0

# Kagent detecta y soluciona
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Music store is down! Investigate and fix it urgently." \
  --stream
```

**Kagent responde:**
```
🚨 CRITICAL: music-store-platform has 0 replicas!

Analysis:
- Deployment scaled to 0
- No pods running
- Service unavailable

Action taken:
- Scaled deployment to 3 replicas
- Waiting for pods to be ready...
- ✅ 3/3 pods ready
- ✅ Service restored

Root cause: Manual scaling to 0
Recommendation: Enable HPA to prevent manual scaling issues
```

---

## 📊 Comparación de Enfoques

### **Opción 1: Jenkins Shared Library**
```
Scope: Solo CI
Beneficio: Reduce duplicación
Modernidad: ⭐⭐ (2018)
IA: ❌ No
```

### **Opción 2: GitOps con ArgoCD**
```
Scope: CI + CD
Beneficio: Automatización completa
Modernidad: ⭐⭐⭐⭐ (2023)
IA: ❌ No
```

### **Opción 3: GitOps + ArgoCD + Kagent** ⭐
```
Scope: CI + CD + Ops
Beneficio: Automatización + IA
Modernidad: ⭐⭐⭐⭐⭐ (2025)
IA: ✅ Sí (Pipe Pilot + Kagent)
```

---

## 💬 Mensajes Clave

### **1. Triple IA**
```
Pipe Pilot: IA genera CI
ArgoCD: GitOps automático
Kagent: IA opera K8s
```

### **2. De Manual a Autónomo**
```
Antes: Humano hace todo
Ahora: IA hace todo
Humano: Solo aprueba
```

### **3. Métricas Impactantes**
```
Deployment: 30 min → 5 min (83% ⬇️)
Troubleshooting: 2 horas → 2 min (98% ⬇️)
Errores: 20% → 0.5% (97% ⬇️)
```

### **4. El Futuro es Ahora**
```
"No es el futuro de DevOps.
Es DevOps hoy.
Con IA."
```

---

## 🎯 Ventajas de Incluir Kagent

### **Sin Kagent (Solo GitOps)**
- ✅ Deploy automático
- ❌ Monitoreo manual
- ❌ Troubleshooting manual
- ❌ Scaling manual
- ❌ Sin IA

### **Con Kagent (GitOps + IA)**
- ✅ Deploy automático
- ✅ Monitoreo con IA
- ✅ Troubleshooting con IA
- ✅ Scaling inteligente
- ✅ Operaciones autónomas

---

## 🚀 Preparación para la Demo

### **1. Instalar ArgoCD**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### **2. Configurar ArgoCD Application**
```yaml
# k8s/argocd/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: music-store
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/vrglx33/music-store
    targetRevision: main
    path: k8s/overlays/dev
  destination:
    server: https://kubernetes.default.svc
    namespace: music-store
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### **3. Verificar Kagent**
```bash
# Ver agentes disponibles
kagent get agent -n default

# Verificar k8s-agent
kagent invoke --agent "k8s-agent" --namespace default \
  --task "List all namespaces" \
  --stream
```

### **4. Actualizar Jenkinsfile**
```groovy
stage('Update K8s Manifest') {
    steps {
        script {
            def version = "v${env.BUILD_NUMBER}"
            sh """
                cd k8s/overlays/dev
                kustomize edit set image music-store=registry/music-store:${version}
                git add .
                git commit -m "chore: Update to ${version}"
                git push
            """
        }
    }
}
```

---

## 📝 Script de Presentación

```
"Hoy vamos a ver el futuro de DevOps: GitOps con IA.

Tenemos 3 herramientas de IA trabajando juntas:

1. Pipe Pilot - IA que genera pipelines
2. ArgoCD - GitOps automático
3. Kagent - IA que opera Kubernetes

Veamos cómo funcionan juntas...

[DEMO]

Como pueden ver, desde un cambio en código hasta producción,
completamente automático. Y si algo falla, Kagent lo detecta
y lo soluciona. Automáticamente.

Esto no es el futuro. Es DevOps hoy. Con IA."
```

---

## 🎬 Momentos "WOW" de la Demo

### **Momento 1: Pipe Pilot Genera Pipeline**
```
"Miren cómo Pipe Pilot analiza nuestro código y genera
un Jenkinsfile completo. Sin escribir una línea."
```

### **Momento 2: ArgoCD Deploy Automático**
```
"Un git push y ArgoCD despliega automáticamente.
Git es la fuente de verdad. Siempre."
```

### **Momento 3: Kagent Detecta Problema**
```
"Ahora voy a romper algo... y miren cómo Kagent
lo detecta y lo soluciona. Solo."
```

### **Momento 4: Kagent Troubleshooting**
```
"Le pregunto a Kagent qué pasó, y me da un análisis
completo con recomendaciones. Como un SRE experto."
```

---

## 📊 Métricas Finales

### **Antes (Manual)**
```
┌─────────────────────┬──────────┐
│ Deployment          │ 30 min   │
│ Troubleshooting     │ 2 horas  │
│ Scaling decision    │ 30 min   │
│ Rollback            │ 15 min   │
│ Total incident      │ 3+ horas │
└─────────────────────┴──────────┘
```

### **Después (GitOps + Kagent)**
```
┌─────────────────────┬──────────┐
│ Deployment          │ 5 min    │
│ Troubleshooting     │ 2 min    │
│ Scaling decision    │ 30 seg   │
│ Rollback            │ 1 min    │
│ Total incident      │ 8 min    │
└─────────────────────┴──────────┘
```

### **ROI**
```
Ahorro de tiempo: 95%
Reducción de errores: 97%
MTTR: 20x más rápido
Costo de incidentes: 90% menos
```

---

## ✅ Checklist Pre-Demo

- [ ] Jenkins corriendo con Pipe Pilot
- [ ] ArgoCD instalado y configurado
- [ ] Kagent instalado y funcionando
- [ ] Application de ArgoCD creada
- [ ] Jenkinsfile con stage de update manifest
- [ ] Kustomize configurado
- [ ] Port-forwards activos (Jenkins, ArgoCD)
- [ ] Comandos de Kagent probados
- [ ] Código de ejemplo preparado

---

## 🎉 Conclusión

Esta demo muestra el **estado del arte en DevOps 2025**:

1. **Pipe Pilot** - IA genera CI
2. **Jenkins** - Ejecuta pipeline
3. **ArgoCD** - GitOps CD
4. **Kagent** - IA opera K8s

**Mensaje final:**
```
"De código a producción en 5 minutos.
Troubleshooting en 2 minutos.
Todo con IA.

Esto es DevOps en 2025."
```

---

## 📁 Archivos a Crear

1. `k8s/argocd/application.yaml` - ArgoCD Application
2. `k8s/base/kustomization.yaml` - Kustomize base
3. `k8s/overlays/dev/kustomization.yaml` - Kustomize overlay
4. Actualizar `Jenkinsfile` - Agregar stage de update manifest

**¿Quieres que cree estos archivos ahora?** 🚀
