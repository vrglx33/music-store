# 🔗 Workshop Integration: Pipe Pilot → Jenkins → Kubernetes

## 🎯 Objetivo

Crear un flujo completo que conecte las 3 partes del workshop:
1. **Parte 1:** Pipe Pilot genera el Jenkinsfile
2. **Transición:** Desplegar con Jenkins en Kubernetes
3. **Parte 2:** Kagent monitorea y opera el deployment

---

## 🎬 FLUJO COMPLETO DE LA DEMO

### PARTE 1: GENERAR PIPELINE CON PIPE PILOT (0:15 - 0:45)

#### Demo 1: Generar Jenkinsfile para Music Store

```bash
cd pipe-pilot
source .venv/bin/activate

# Generar pipeline para Music Store
python main.py https://github.com/tu-usuario/music-store
```

**El agente genera:**
- ✅ Jenkinsfile con stages para Node.js/TypeScript
- ✅ Docker build stage
- ✅ Kubernetes deployment stage
- ✅ Prisma migration stage
- ✅ PostgreSQL integration

---

### TRANSICIÓN: DESPLEGAR CON JENKINS (0:45 - 0:50) - 5 minutos

> "Ahora que Pipe Pilot generó nuestro pipeline, vamos a usarlo para desplegar Music Store en Kubernetes."

#### Paso 1: Crear el Job en Jenkins

**[TERMINAL]**

```bash
# Port-forward a Jenkins
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

**[JENKINS UI]**

1. Abrir http://localhost:8080
2. New Item → "music-store-pipeline"
3. Pipeline type
4. Pipeline script from SCM
5. Git → URL del repo
6. Script Path: `Jenkinsfile`
7. Save

#### Paso 2: Configurar Credentials

```bash
# Crear secret para Docker registry
kubectl create secret docker-registry gcr-secret \
  --docker-server=gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat key.json)" \
  -n jenkins

# Crear secret para Database
kubectl create secret generic music-store-db \
  --from-literal=DATABASE_URL="postgresql://user:pass@music-store-db-postgresql:5432/musicstore" \
  -n music-store
```

#### Paso 3: Ejecutar el Pipeline

**[JENKINS UI]**

1. Click en "Build Now"
2. Observar los stages ejecutándose:
   - ✅ Checkout
   - ✅ Install Dependencies
   - ✅ Build
   - ✅ Test
   - ✅ Docker Build & Push
   - ✅ Database Migration
   - ✅ Deploy to Kubernetes

**[TERMINAL - Paralelo]**

```bash
# Ver los pods de Jenkins agents siendo creados
watch kubectl get pods -n jenkins

# Ver el deployment de Music Store
watch kubectl get pods -n music-store
```

**Narración:**
> "Observen cómo Jenkins crea agents dinámicamente en Kubernetes para cada stage:
> - Agent con Node.js para el build
> - Agent con Docker para crear la imagen
> - Agent con kubectl para el deployment
> 
> Esto es AgentOps en acción: agentes especializados ejecutando tareas específicas."

---

### PARTE 2: MONITOREAR CON KAGENT (0:50 - 1:15)

> "Ahora que la aplicación está desplegándose, usemos Kagent para monitorear el proceso."

#### Demo 1: Ver el deployment en progreso

```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me the status of the music-store deployment and tell me if it's healthy" \
  --stream
```

**El agente responde:**
```
Checking music-store deployment...

Current status:
- Desired replicas: 3
- Updated replicas: 2
- Available replicas: 1
- Unavailable replicas: 2

Analysis:
The deployment is currently rolling out. 2 pods are being updated,
but only 1 is available. This is normal during a deployment.

Recent events:
- Image pulled: gcr.io/project/music-store:42
- Container started in pod music-store-platform-xyz
- Readiness probe succeeded

Recommendation: Wait 1-2 minutes for the rollout to complete.
```

#### Demo 2: Verificar que la migración de DB funcionó

```bash
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Check if the database migration completed successfully" \
  --stream
```

**El agente responde:**
```
Checking database migration status...

Migration job: music-store-migration-gwx4b
Status: Completed
Exit code: 0

Logs show:
✓ Prisma schema loaded
✓ 5 migrations applied successfully
✓ Database is up to date

Database pod: music-store-db-postgresql-0
Status: Running (1/1 ready)

Conclusion: Database migration completed successfully.
The application should be able to connect to the database.
```

#### Demo 3: Ver logs del deployment

```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me the logs of the music-store pods from the last 2 minutes" \
  --stream
```

**El agente muestra:**
```
Logs from music-store-platform pods:

Pod: music-store-platform-b7b9b58b6-2wtc5
---
[2025-11-12 00:50:15] Server starting...
[2025-11-12 00:50:16] Database connected successfully
[2025-11-12 00:50:16] Prisma client initialized
[2025-11-12 00:50:17] Server listening on port 3000
[2025-11-12 00:50:18] Health check passed

All pods show successful startup. Application is healthy.
```

---

## 🎯 JENKINSFILE GENERADO POR PIPE PILOT

Este es el Jenkinsfile que Pipe Pilot genera para Music Store:

```groovy
pipeline {
    agent none
    
    environment {
        DOCKER_REGISTRY = 'gcr.io/music-store-prod'
        IMAGE_NAME = 'music-store-platform'
        K8S_NAMESPACE = 'music-store'
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            agent {
                kubernetes {
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: git
    image: alpine/git
    command: ['cat']
    tty: true
"""
                }
            }
            steps {
                container('git') {
                    git branch: 'main',
                        url: 'https://github.com/tu-usuario/music-store',
                        credentialsId: 'github-credentials'
                }
            }
        }
        
        stage('Build & Test') {
            agent {
                kubernetes {
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: nodejs
    image: node:18-alpine
    command: ['cat']
    tty: true
"""
                }
            }
            steps {
                container('nodejs') {
                    sh '''
                        echo "Installing dependencies..."
                        npm ci
                        
                        echo "Running tests..."
                        npm test
                        
                        echo "Building application..."
                        npm run build
                    '''
                }
            }
        }
        
        stage('Docker Build & Push') {
            agent {
                kubernetes {
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:24-dind
    command: ['cat']
    tty: true
    securityContext:
      privileged: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
"""
                }
            }
            steps {
                container('docker') {
                    sh '''
                        echo "Building Docker image..."
                        docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                        
                        echo "Pushing to registry..."
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
        
        stage('Database Migration') {
            agent {
                kubernetes {
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
"""
                }
            }
            steps {
                container('kubectl') {
                    sh '''
                        echo "Running Prisma migrations..."
                        kubectl run prisma-migrate-${BUILD_NUMBER} \
                          --image=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \
                          --restart=Never \
                          --namespace=${K8S_NAMESPACE} \
                          --env="DATABASE_URL=${DATABASE_URL}" \
                          -- npx prisma migrate deploy
                        
                        echo "Waiting for migration to complete..."
                        kubectl wait --for=condition=complete \
                          --timeout=120s \
                          job/prisma-migrate-${BUILD_NUMBER} \
                          -n ${K8S_NAMESPACE}
                        
                        echo "Migration completed successfully"
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            agent {
                kubernetes {
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
"""
                }
            }
            steps {
                container('kubectl') {
                    sh '''
                        echo "Updating deployment..."
                        kubectl set image deployment/music-store-platform \
                          music-store=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \
                          --namespace=${K8S_NAMESPACE}
                        
                        echo "Waiting for rollout to complete..."
                        kubectl rollout status deployment/music-store-platform \
                          --namespace=${K8S_NAMESPACE} \
                          --timeout=5m
                        
                        echo "Verifying deployment..."
                        kubectl get pods -n ${K8S_NAMESPACE} -l app=music-store-platform
                        
                        echo "Deployment completed successfully!"
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "Application deployed: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo 'Cleaning up...'
        }
    }
}
```

---

## 🎬 NARRATIVA PARA LA DEMO

### Introducción (1 min)

> "Vamos a ver cómo todo se conecta:
> 1. Pipe Pilot generó el Jenkinsfile automáticamente
> 2. Jenkins ejecuta el pipeline en Kubernetes
> 3. Kagent monitorea todo el proceso
> 
> Esto es AgentOps end-to-end."

### Durante el Build (2 min)

**[Mostrar Jenkins UI + Terminal]**

> "Observen cómo Jenkins crea pods dinámicamente:
> - Un pod con Node.js para el build
> - Un pod con Docker para la imagen
> - Un pod con kubectl para el deployment
> 
> Cada agent es efímero: se crea, ejecuta su tarea, y se destruye."

**[Terminal]**
```bash
# Mostrar pods de Jenkins agents
kubectl get pods -n jenkins -l jenkins=agent

# Salida:
# music-store-pipeline-1-nodejs-xyz    1/1   Running
# music-store-pipeline-1-docker-abc    1/1   Running
```

### Durante el Deployment (2 min)

**[Usar Kagent]**

> "Ahora usemos Kagent para ver qué está pasando:"

```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "What's happening with the music-store deployment right now?" \
  --stream
```

**El agente responde en tiempo real:**
```
Analyzing music-store deployment...

Current activity:
- Rolling update in progress
- Old pods: 3 (terminating)
- New pods: 3 (starting)
- Image: gcr.io/project/music-store:42

Recent events:
- Scaled up replica set to 3
- Started container in pod xyz
- Pulling image from gcr.io

Status: Deployment is healthy and progressing normally.
ETA: 1-2 minutes for completion.
```

### Verificación Final (1 min)

**[Usar music-store-agent]**

```bash
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Give me a deployment summary - did everything work?" \
  --stream
```

**El agente responde:**
```
Deployment Summary for Music Store Platform:

✅ Application Status:
   - 3 pods running and ready
   - All health checks passing
   - Image: gcr.io/project/music-store:42

✅ Database Status:
   - PostgreSQL pod running
   - Migrations completed successfully
   - Connection established

✅ Service Status:
   - LoadBalancer service active
   - Port 80 exposed
   - Ready to receive traffic

Conclusion: Deployment successful! 
Application is live and healthy.
```

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### Antes (Proceso Manual)

```
1. Escribir Jenkinsfile manualmente         → 30 min
2. Configurar Jenkins job                   → 10 min
3. Ejecutar pipeline                        → 5 min
4. Debuggear errores                        → 20 min
5. Verificar deployment manualmente         → 10 min
   (kubectl get pods, kubectl logs, etc.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~75 minutos
```

### Después (Con Agentes)

```
1. Pipe Pilot genera Jenkinsfile            → 15 seg
2. Jenkins ejecuta con agents dinámicos     → 5 min
3. Kagent monitorea y verifica              → 30 seg
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~6 minutos

Ahorro: 92% del tiempo
```

---

## 🎯 MENSAJES CLAVE

### Mensaje 1: Generación Automática
> "Pipe Pilot analizó nuestro código y generó un Jenkinsfile completo con todas las best practices. No escribimos ni una línea."

### Mensaje 2: Agents Dinámicos
> "Jenkins crea agents especializados en Kubernetes para cada tarea. Son efímeros: se crean, ejecutan, y se destruyen."

### Mensaje 3: Monitoreo Inteligente
> "Kagent no solo ejecuta comandos, razona sobre el estado del sistema y nos da análisis contextuales."

### Mensaje 4: End-to-End AgentOps
> "De código a producción con 3 agentes:
> - Pipe Pilot: Genera la infraestructura
> - Jenkins Agents: Ejecutan el CI/CD
> - Kagent: Monitorea y opera
> 
> Esto es AgentOps."

---

## 🔧 SETUP NECESARIO

### Pre-requisitos

1. **Jenkins en Kubernetes**
```bash
# Verificar Jenkins está corriendo
kubectl get pods -n jenkins

# Port-forward
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

2. **Pipe Pilot configurado**
```bash
cd pipe-pilot
source .venv/bin/activate
# .env con OPENROUTER_API_KEY configurado
```

3. **Kagent instalado**
```bash
# Verificar agentes
kagent get agent -n default
```

4. **Music Store desplegado**
```bash
# Verificar namespace existe
kubectl get ns music-store

# Verificar PostgreSQL
kubectl get pods -n music-store | grep postgresql
```

### Credentials en Jenkins

```bash
# GitHub credentials
# Jenkins UI → Manage Jenkins → Credentials → Add

# Docker registry secret
kubectl create secret docker-registry gcr-secret \
  --docker-server=gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat key.json)" \
  -n jenkins

# Database URL
kubectl create secret generic db-credentials \
  --from-literal=DATABASE_URL="postgresql://..." \
  -n jenkins
```

---

## 📋 CHECKLIST PARA LA DEMO

### Antes de Empezar
- [ ] Jenkins corriendo y accesible
- [ ] Pipe Pilot instalado y configurado
- [ ] Kagent funcionando (11 agentes activos)
- [ ] Music Store namespace creado
- [ ] PostgreSQL desplegado
- [ ] Credentials configurados en Jenkins
- [ ] Terminal preparado con comandos
- [ ] Jenkins UI abierto en navegador

### Durante la Demo
- [ ] Generar Jenkinsfile con Pipe Pilot
- [ ] Crear job en Jenkins
- [ ] Ejecutar pipeline
- [ ] Mostrar pods de agents siendo creados
- [ ] Usar Kagent para monitorear
- [ ] Verificar deployment exitoso
- [ ] Mostrar aplicación funcionando

### Comandos de Respaldo
```bash
# Si Jenkins no responde
kubectl delete pod -n jenkins -l app=jenkins
kubectl wait --for=condition=ready pod -n jenkins -l app=jenkins

# Si Kagent no responde
kagent get agent -n default
kubectl get pods -n default | grep agent

# Si el deployment falla
kubectl rollout undo deployment/music-store-platform -n music-store
```

---

## 🎬 TIMING DETALLADO

| Tiempo | Actividad | Duración |
|--------|-----------|----------|
| 0:15-0:25 | Generar Jenkinsfile con Pipe Pilot | 10 min |
| 0:25-0:35 | Mostrar Jenkinsfile generado | 10 min |
| 0:35-0:45 | Crear job en Jenkins | 10 min |
| **TRANSICIÓN** | | |
| 0:45-0:50 | Ejecutar pipeline en Jenkins | 5 min |
| 0:50-1:00 | Monitorear con Kagent | 10 min |
| 1:00-1:05 | Verificar deployment exitoso | 5 min |
| 1:05-1:15 | Ver aplicación funcionando | 10 min |

---

## ✅ RESULTADO FINAL

Al final de esta secuencia, habrás demostrado:

1. ✅ **Pipe Pilot** generó el Jenkinsfile automáticamente
2. ✅ **Jenkins** ejecutó el pipeline con agents dinámicos en K8s
3. ✅ **Kagent** monitoreó todo el proceso en tiempo real
4. ✅ **Music Store** desplegado y funcionando
5. ✅ **AgentOps** end-to-end en acción

**Mensaje final:**
> "Esto es AgentOps: agentes de IA que generan, ejecutan y monitorean infraestructura. De código a producción en minutos, no horas."

---

**Última actualización:** 12 de noviembre de 2025, 12:48 AM
