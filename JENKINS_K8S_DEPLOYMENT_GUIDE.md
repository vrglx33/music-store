# 🚀 Jenkins Pipeline - Kubernetes Deployment Guide

## 📋 Resumen

Este Jenkinsfile despliega automáticamente la aplicación Music Store Platform en Kubernetes local usando un pipeline completo de CI/CD.

---

## 🎯 Stages del Pipeline

### 1. **Checkout** ✅
- Muestra información del código checked out
- Branch, commit, y último mensaje

### 2. **Install Node.js & Dependencies** 📦
- Instala nvm si no existe
- Instala Node.js 18
- Ejecuta `npm ci` para instalar dependencias

### 3. **Lint** 🔍
- Ejecuta linter (con fallback si no está configurado)

### 4. **Build** 🏗️
- Ejecuta `npm run build`
- Compila la aplicación

### 5. **Tests** 🧪
- Ejecuta `npm test` (con fallback si no está configurado)

### 6. **Security Scan** 🔒
- Ejecuta `npm audit`
- Continúa aunque encuentre vulnerabilidades

### 7. **Build Docker Image** 🐳
- Construye imagen Docker: `music-store-platform:latest`
- Tagea con número de build: `music-store-platform:${BUILD_NUMBER}`

### 8. **Create K8s Resources** 📦
- Crea namespace `music-store`
- Crea ConfigMap con NODE_ENV y PORT
- Crea Secrets con DATABASE_URL y SESSION_SECRET

### 9. **Deploy to Kubernetes** 🚀
- Aplica deployment.yaml
- Aplica service.yaml
- Espera a que el deployment esté listo
- Muestra status de pods y services

---

## 🔧 Configuración Requerida

### Jenkins debe tener acceso a:

1. **Docker** - Para construir imágenes
   ```bash
   # Verificar desde Jenkins
   docker --version
   ```

2. **kubectl** - Para desplegar en Kubernetes
   ```bash
   # Verificar desde Jenkins
   kubectl version --client
   ```

3. **Kubernetes Context** - Configurado para cluster local
   ```bash
   # Verificar contexto
   kubectl config current-context
   ```

---

## 📁 Archivos Necesarios

### Jenkinsfile
- Pipeline completo con 9 stages
- Usa nvm para Node.js
- Construye Docker image
- Despliega en Kubernetes

### Dockerfile
- Multi-stage build
- Node.js 18
- Prisma migrations
- Production-ready

### k8s/deployment.yaml
- 3 replicas
- Health checks (liveness + readiness)
- Resource limits
- Environment variables desde ConfigMap/Secrets

### k8s/service.yaml
- ClusterIP service
- Puerto 3000
- Selector: app=music-store-platform

---

## 🚀 Cómo Ejecutar

### Paso 1: Acceder a Jenkins

```bash
# Port forward si es necesario
kubectl port-forward -n jenkins svc/jenkins 8080:8080

# Abrir navegador
open http://localhost:8080
```

**Credenciales:**
- Username: `admin`
- Password: `184748bcff62400f81b4dd23ee21ade7`

### Paso 2: Ejecutar Pipeline

1. Ir al job: **music-store-pipeline**
2. Click en **"Build Now"**
3. Ver el progreso en **Console Output**

### Paso 3: Verificar Deployment

```bash
# Ver pods
kubectl get pods -n music-store

# Ver services
kubectl get svc -n music-store

# Ver logs
kubectl logs -f deployment/music-store-platform -n music-store

# Port forward para acceder
kubectl port-forward -n music-store svc/music-store-platform 3000:3000

# Abrir app
open http://localhost:3000
```

---

## 📊 Recursos Creados en Kubernetes

### Namespace
```
music-store
```

### ConfigMap
```yaml
music-store-config:
  NODE_ENV: production
  PORT: 3000
```

### Secret
```yaml
music-store-secrets:
  DATABASE_URL: postgresql://postgres:postgres@postgres:5432/musicstore
  SESSION_SECRET: demo-secret-key-change-in-production
```

### Deployment
```
music-store-platform
- 3 replicas
- Image: music-store-platform:latest
- Port: 3000
```

### Service
```
music-store-platform
- Type: ClusterIP
- Port: 3000
```

---

## ⏱️ Tiempos Estimados

### Primera Ejecución
- Install nvm + Node.js: ~2 min
- npm ci: ~30 seg
- Build: ~20 seg
- Tests: ~10 seg
- Docker build: ~2 min
- K8s deploy: ~1 min
- **Total: ~6 minutos**

### Ejecuciones Siguientes
- nvm cached: skip
- Node.js cached: skip
- npm ci: ~30 seg
- Build: ~20 seg
- Tests: ~10 seg
- Docker build: ~1 min (layers cached)
- K8s deploy: ~30 seg
- **Total: ~3 minutos**

---

## 🐛 Troubleshooting

### Error: "docker: not found"

**Problema:** Jenkins no tiene acceso a Docker

**Solución:**
```bash
# Verificar que Docker esté disponible en el pod de Jenkins
kubectl exec -n jenkins deployment/jenkins -- docker --version

# Si no está, necesitas montar docker.sock o usar Docker-in-Docker
```

### Error: "kubectl: not found"

**Problema:** kubectl no está instalado en Jenkins

**Solución:**
```bash
# Instalar kubectl en Jenkins pod
kubectl exec -n jenkins deployment/jenkins -- sh -c "
  curl -LO https://dl.k8s.io/release/v1.28.0/bin/linux/amd64/kubectl
  chmod +x kubectl
  mv kubectl /usr/local/bin/
"
```

### Error: "ImagePullBackOff"

**Problema:** Kubernetes no puede encontrar la imagen

**Solución:**
```bash
# La imagen debe estar disponible localmente
# Si usas minikube:
eval $(minikube docker-env)
docker images | grep music-store-platform

# Si usas kind:
kind load docker-image music-store-platform:latest
```

### Error: "CrashLoopBackOff"

**Problema:** La aplicación falla al iniciar

**Solución:**
```bash
# Ver logs
kubectl logs -n music-store deployment/music-store-platform

# Verificar ConfigMap y Secrets
kubectl get configmap music-store-config -n music-store -o yaml
kubectl get secret music-store-secrets -n music-store -o yaml

# Verificar que la base de datos esté disponible
kubectl get pods -n default | grep postgres
```

---

## 🎬 Para la Demo

### Script de Demo

```bash
# 1. Mostrar Jenkins
open http://localhost:8080

# 2. Mostrar el Jenkinsfile
cat Jenkinsfile

# 3. Ejecutar el pipeline
# (Click en "Build Now" en Jenkins UI)

# 4. Mientras corre, mostrar los stages
# (Ver Console Output en Jenkins)

# 5. Verificar deployment
kubectl get pods -n music-store -w

# 6. Acceder a la aplicación
kubectl port-forward -n music-store svc/music-store-platform 3000:3000 &
open http://localhost:3000

# 7. Mostrar logs en tiempo real
kubectl logs -f -n music-store deployment/music-store-platform
```

### Puntos Clave para Mencionar

1. **Pipeline Completo** - De código a producción en un solo click
2. **Automated Testing** - Lint, build, tests, security scan
3. **Docker Build** - Imagen optimizada multi-stage
4. **Kubernetes Native** - ConfigMaps, Secrets, Deployments
5. **Health Checks** - Liveness y readiness probes
6. **Rollout Strategy** - Rolling updates automáticos
7. **Observability** - Logs y métricas disponibles

---

## 📝 Notas Importantes

### Para Producción

⚠️ **Cambiar antes de producción:**

1. **Secrets** - Usar secrets manager real (Vault, AWS Secrets Manager)
2. **Database** - Configurar PostgreSQL production-ready
3. **Ingress** - Configurar ingress controller y TLS
4. **Monitoring** - Agregar Prometheus y Grafana
5. **Logging** - Configurar ELK o Loki
6. **Backup** - Configurar backups de base de datos
7. **CI/CD** - Agregar tests de integración y E2E

### Para el Workshop

✅ **Perfecto para demostrar:**

- Pipeline as Code con Jenkinsfile
- Docker multi-stage builds
- Kubernetes deployments
- ConfigMaps y Secrets
- Health checks y rolling updates
- GitOps workflow

---

## 🔗 Referencias

- [Jenkinsfile](./Jenkinsfile)
- [Dockerfile](./Dockerfile)
- [k8s/deployment.yaml](./k8s/deployment.yaml)
- [k8s/service.yaml](./k8s/service.yaml)
- [Jenkins Credentials](./JENKINS_CREDENTIALS.md)

---

**Última actualización:** 12 de noviembre de 2025, 2:05 AM  
**Branch:** feature/jenkins-ci-cd-pipeline  
**Commit:** 8d8a853  
**Estado:** ✅ Listo para demo
