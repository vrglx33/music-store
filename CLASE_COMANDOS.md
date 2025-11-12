# 🎓 Comandos para la Clase - GitOps con IA

## 📋 Preparación Antes de la Clase

```bash
# 1. Cambiar a la rama de la clase (limpia, sin solución)
git checkout workshop/clase-base

# 2. Verificar que todo está listo
./scripts/verify-workshop-setup.sh

# 3. Acceder a Jenkins (en otra terminal)
./access-jenkins.sh
```

---

## 🚀 Parte 1: Pipe Pilot - Generar Jenkinsfile (5 min)

### Comando 1: Ver el proyecto
```bash
# Ver estructura del proyecto
ls -la

# Ver package.json
cat package.json | grep -A 10 '"scripts"'
```

### Comando 2: Generar Jenkinsfile con Pipe Pilot
```bash
# Generar Jenkinsfile con IA
python3 ../pipe-pilot/main.py .
```

### Comando 3: Ver el Jenkinsfile generado
```bash
# Ver el Jenkinsfile
cat Jenkinsfile
```

### Comando 4: Ejecutar en Jenkins
```bash
# Abrir Jenkins
open http://localhost:8080

# Credenciales:
# Username: admin
# Password: 184748bcff62400f81b4dd23ee21ade7
```

---

## 🔄 Parte 2: Argo Rollouts - Progressive Delivery (10 min)

### Comando 5: Ver deployment actual
```bash
# Ver deployment
kubectl get deployment music-store-platform -n music-store

# Ver pods
kubectl get pods -n music-store

# Ver réplicas actuales
kubectl get deployment music-store-platform -n music-store -o jsonpath='{.spec.replicas}'
```

### Comando 6: Convertir a Rollout con Kagent
```bash
# Usar Kagent para convertir a Rollout
kagent invoke --agent "argo-rollouts-conversion-agent" \
  --namespace default \
  --task "Convert the music-store-platform Deployment in the music-store namespace to an Argo Rollout with canary strategy. Use these steps: 20%, 40%, 60%, 80%, 100% with 30 second pauses between steps." \
  --stream
```

### Comando 7: Guardar el Rollout YAML
```bash
# Crear directorio si no existe
mkdir -p k8s/kagent

# El YAML generado por Kagent se guarda en:
# k8s/kagent/rollout.yaml
# (Copiar el output de Kagent al archivo)
```

### Comando 8: Aplicar el Rollout
```bash
# Aplicar el Rollout
kubectl apply -f k8s/kagent/rollout.yaml

# Verificar
kubectl get rollout music-store-platform -n music-store
```

### Comando 9: Hacer un Canary Deployment
```bash
# Terminal 1: Ver rollout en tiempo real
kubectl argo rollouts get rollout music-store-platform -n music-store --watch

# Terminal 2: Actualizar imagen (simular nueva versión)
kubectl argo rollouts set image music-store-platform \
  music-store-platform=music-store-platform:v2 \
  -n music-store
```

---

## 🤖 Parte 3: Kagent - Operaciones con IA (10 min)

### Comando 10: Verificar estado con Kagent
```bash
# Preguntar a Kagent sobre el estado
kagent invoke --agent "k8s-agent" \
  --namespace default \
  --task "What's the current status of music-store-platform in the music-store namespace? Include replica count, pod status, and recent events." \
  --stream
```

### Comando 11: Escalar con Kagent
```bash
# Escalar a 1 réplica
kagent invoke --agent "k8s-agent" \
  --namespace default \
  --task "Scale the music-store-platform deployment in the music-store namespace to 1 replica" \
  --stream
```

### Comando 12: Verificar el escalado
```bash
# Ver pods
kubectl get pods -n music-store

# Ver deployment
kubectl get deployment music-store-platform -n music-store
```

### Comando 13: Troubleshooting con Kagent
```bash
# Simular problema (escalar a 0)
kubectl scale deployment music-store-platform -n music-store --replicas=0

# Pedir a Kagent que lo arregle
kagent invoke --agent "k8s-agent" \
  --namespace default \
  --task "The music-store application is down! Investigate what happened and fix it urgently." \
  --stream
```

### Comando 14: Análisis de performance
```bash
# Análisis con Kagent
kagent invoke --agent "observability-agent" \
  --namespace default \
  --task "Analyze the performance of music-store-platform. Are there any bottlenecks or issues?" \
  --stream
```

---

## 🎯 Parte 4: Crear Agente Personalizado (10 min)

### Comando 15: Crear el agente de Music Store
```bash
# Crear directorio
mkdir -p k8s/kagent

# Crear archivo del agente
cat > k8s/kagent/music-store-agent.yaml << 'EOF'
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: music-store-agent
  namespace: default
  labels:
    app: music-store-platform
spec:
  declarative:
    systemMessage: |
      You are a specialized AI agent for the Music Store Platform application.
      Your role is to help operators manage, monitor, and troubleshoot the 
      Music Store application running on Kubernetes.
      
      Key Resources:
      - Deployment: music-store-platform (in namespace music-store)
      - Service: music-store-service
      - Database: music-store-db-postgresql
      - Namespace: music-store
      
      Always check the music-store namespace first and provide clear explanations.
      
    modelConfig: default-model-config
    
    tools:
      - mcpServer:
          apiGroup: kagent.dev
          kind: RemoteMCPServer
          name: kagent-tool-server
          toolNames:
            - k8s_get_resources
            - k8s_describe_resource
            - k8s_get_pod_logs
            - k8s_get_events
            - k8s_patch_resource
        type: McpServer
    
    deployment:
      replicas: 1
      resources:
        requests:
          cpu: 100m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi
    
    a2aConfig:
      skills:
        - id: app-health-check
          name: Application Health Check
          description: Check the health of Music Store application
          examples:
            - "Is the Music Store app healthy?"
            - "Check music-store status"
          tags:
            - health
            - monitoring
        
        - id: app-scaling
          name: Application Scaling
          description: Scale the Music Store application
          examples:
            - "Scale music-store to 5 replicas"
            - "How many replicas are running?"
          tags:
            - scaling
            - capacity
EOF
```

### Comando 16: Aplicar el agente
```bash
# Aplicar
kubectl apply -f k8s/kagent/music-store-agent.yaml

# Esperar a que esté ready
sleep 30

# Verificar
kagent get agent -n default | grep music-store
```

### Comando 17: Usar el agente personalizado
```bash
# Health check con el agente personalizado
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Is the Music Store application healthy? Check all pods and services." \
  --stream
```

### Comando 18: Escalar con el agente personalizado
```bash
# Escalar con el agente personalizado
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Scale the music-store application to 3 replicas" \
  --stream
```

---

## 🎬 Parte 5: Demo Completa End-to-End (5 min)

### Comando 19: Hacer un cambio en el código
```bash
# Agregar nueva feature
cat >> src/server/routes/health.js << 'EOF'

// New AI-powered health check
router.get('/health/ai', async (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.0.0',
    ai_features: ['pipe-pilot', 'kagent', 'argo-rollouts'],
    timestamp: new Date().toISOString()
  });
});
EOF
```

### Comando 20: Commit y push
```bash
# Commit
git add .
git commit -m "feat: Add AI-powered health endpoint"

# Push (si tienes permisos)
git push origin workshop/clase-base
```

### Comando 21: Build imagen Docker
```bash
# Build nueva imagen
docker build -t music-store-platform:v2.0.0 .

# Verificar
docker images | grep music-store
```

### Comando 22: Deploy con Argo Rollouts
```bash
# Actualizar rollout
kubectl argo rollouts set image music-store-platform \
  music-store-platform=music-store-platform:v2.0.0 \
  -n music-store

# Ver progreso
kubectl argo rollouts get rollout music-store-platform -n music-store --watch
```

### Comando 23: Verificar con Kagent
```bash
# Verificar deployment con Kagent
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Verify that the new v2.0.0 deployment is working correctly. Check all pods and test the new /health/ai endpoint." \
  --stream
```

### Comando 24: Test del nuevo endpoint
```bash
# Port forward
kubectl port-forward -n music-store svc/music-store-platform 3000:3000 &

# Test endpoint
curl http://localhost:3000/health/ai | jq
```

---

## 📊 Comandos de Verificación Final

### Comando 25: Ver todo el estado
```bash
# Ver todos los recursos
kubectl get all -n music-store

# Ver agentes de Kagent
kagent get agent -n default

# Ver rollouts
kubectl get rollout -n music-store
```

### Comando 26: Análisis final con Kagent
```bash
# Análisis completo
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Provide a complete summary of the Music Store application: deployment status, replica count, resource usage, and any recommendations for optimization." \
  --stream
```

---

## 🧹 Limpieza (Opcional)

```bash
# Eliminar agente personalizado
kubectl delete agent music-store-agent -n default

# Eliminar rollout
kubectl delete rollout music-store-platform -n music-store

# Volver a deployment normal
kubectl apply -f k8s/deployment.yaml
```

---

## 📝 Notas para el Instructor

### Timing Sugerido
- Parte 1 (Pipe Pilot): 5 min
- Parte 2 (Argo Rollouts): 10 min
- Parte 3 (Kagent Ops): 10 min
- Parte 4 (Agente Custom): 10 min
- Parte 5 (Demo E2E): 5 min
- **Total: 40 min**

### Tips
- Tener múltiples terminales abiertas
- Pre-ejecutar comandos lentos antes de la clase
- Tener screenshots de backup
- Explicar mientras los comandos se ejecutan

### Comandos Pre-Clase
```bash
# Verificar todo antes de empezar
./scripts/verify-workshop-setup.sh

# Iniciar Jenkins port-forward
kubectl port-forward -n jenkins svc/jenkins 8080:8080 &

# Verificar Kagent
kagent get agent -n default
```

---

## 🚨 Troubleshooting Rápido

### Si Pipe Pilot falla
```bash
cd ../pipe-pilot
pip install -r requirements.txt
cd ../music-store
```

### Si Kagent no responde
```bash
kubectl get pods -n kagent
kubectl logs -n kagent deployment/kagent-controller
```

### Si Argo Rollouts no está instalado
```bash
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f \
  https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

### Si Jenkins no es accesible
```bash
kubectl get pods -n jenkins
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

---

## ✅ Checklist Pre-Clase

- [ ] Rama `workshop/clase-base` creada y limpia
- [ ] Rama `workshop/solucion-completa` con todo funcionando
- [ ] Jenkins corriendo y accesible
- [ ] Kagent instalado y agentes activos
- [ ] Music Store desplegado en K8s
- [ ] Pipe Pilot configurado
- [ ] Comandos probados secuencialmente
- [ ] Screenshots de backup preparados
- [ ] Múltiples terminales configuradas

---

**¡Listo para la clase!** 🎉
