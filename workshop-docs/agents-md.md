Guion del Taller (120 Minutos): DevOps Potenciados por IA

Sesión 8: Casos de uso frecuentes en DevOps potenciados por IA

---
## 🎵 ADAPTACIÓN PARA MUSIC STORE PLATFORM

Este documento ha sido adaptado para demostrar cómo aplicar herramientas DevOps potenciadas por IA al proyecto **Music Store Platform**, una plataforma digital de marketplace para artistas independientes.

### Contexto del Proyecto:
- **Stack Tecnológico**: Node.js 18, TypeScript, Express, React 18, PostgreSQL 14, Prisma ORM
- **Arquitectura**: Aplicación monolítica con SSR (Server-Side Rendering)
- **Infraestructura**: Docker, Kubernetes (Minikube local / GKE en producción)
- **CI/CD**: Jenkins con pipelines declarativos
- **Base de Datos**: PostgreSQL con Prisma para migraciones

### Casos de Uso Demostrados:
1. **Generación de Jenkinsfile** para aplicaciones Node.js/TypeScript
2. **Refactorización a Librerías Compartidas** para múltiples microservicios
3. **Operaciones de Kubernetes con Agentes IA** (Kagent)
4. **Infrastructure as Code** (Terraform para GCP)
5. **Database as Code** (SQL generado por IA + Liquibase/Prisma)

---

1. Introducción y Ecosistema (0:00 - 0:30) (30 min)

(Slide 1: Título)
"¡Hola a todos y bienvenidos! Hoy vamos a sumergirnos en cómo la IA está cambiando radicalmente nuestras prácticas de DevOps. Esta no es una sesión teórica; vamos a construir y operar infraestructura real usando agentes de IA."

(Slide 2: Agenda)
"Tenemos 2 horas y una agenda apretada. Empezaremos con la configuración de nuestro laboratorio, que es crucial. Luego, pasaremos por cuatro casos de uso clave: generación de pipelines, refactorización a librerías compartidas, operaciones en Kubernetes con agentes, y terminaremos con IaC y DaC."

(Slide 3: Nuestro Entorno DevOps)
"Este es nuestro stack. Como ven, usamos herramientas estándar de la industria: Jenkins para CI, Bitbucket para SCM, Terraform para GCP, y un stack completo de Kubernetes con Helm, ArgoCD y MySQL. Hoy, la IA será la 'pegamento' inteligente entre todas ellas."

(Slide 4: De "ChatOps" a "AgentOps")
"El cambio de paradigma clave que quiero que entiendan es este: hemos pasado de 'ChatOps', donde le pedíamos a un bot de Slack que ejecutara un script, a 'AgentOps'. Hoy, los agentes de IA no solo responden; actúan. Tienen herramientas, entienden el estado de nuestros sistemas y pueden ejecutar planes complejos de varios pasos."

(Slide 5: Arquitectura del Laboratorio)
"Esto es lo que vamos a configurar ahora mismo. Tendremos Jenkins y Kagent corriendo dentro de Kubernetes (Minikube local) y usaremos Workik (una herramienta SaaS) para conectarnos a nuestro Bitbucket y generar código."

(Slide 6 & 7: Herramientas de IA)
"Nuestras dos herramientas de IA hoy son Kagent y Workik. Ambas tienen niveles gratuitos. Workik es un generador de código especializado en DevOps (CI/CD, IaC, SQL). Kagent es un framework de IA agencial que vive dentro de Kubernetes, dándole a la IA 'manos' para operar kubectl, helm y más.

Tarea: Configuración del Laboratorio (Comandos)

"Muy bien, ¡manos a la obra! Lo primero es levantar nuestro entorno local. Todos estos comandos deben ejecutarse en su terminal."

1. Iniciar Kubernetes (Minikube)
"Necesitamos un clúster con suficientes recursos para Jenkins, Argo y Kagent."

# Iniciar Minikube
minikube start --memory=8192 --cpus=4



2. Instalar ArgoCD (para Demo de Kagent)

# Crear namespace
kubectl create namespace argocd

# Añadir repo de Helm e instalar
helm repo add argo [https://argoproj.github.io/argo-helm](https://argoproj.github.io/argo-helm)
helm install argocd argo/argo-cd -n argocd



3. Instalar Jenkins (para Demos de CI)

# Crear namespace
kubectl create namespace jenkins

# Añadir repo de Helm e instalar
helm repo add jenkins [https://charts.jenkins.io](https://charts.jenkins.io)
helm install jenkins jenkins/jenkins -n jenkins

# (Opcional) Obtener la contraseña de admin de Jenkins
echo "Jenkins Admin Pass:"
kubectl -n jenkins get secret jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 -d; echo



4. Instalar Kagent (Nuestro Agente de IA)
"Aquí es donde instalamos el 'cerebro' en nuestro clúster."

# Instalar CLI de Kagent
# Opción 1: Script de instalación (Linux/macOS)
curl https://raw.githubusercontent.com/kagent-dev/kagent/refs/heads/main/scripts/get-kagent | bash

# Opción 2: Homebrew (macOS)
brew install kagent/tap/kagent

# Configurar API key (ejemplo con OpenAI)
export OPENAI_API_KEY="sk-..."

# Instalar Kagent en el clúster con perfil demo
kagent install



5. Verificar Instalación de Kagent
"Una vez instalado Kagent con `kagent install`, podemos verificar que todo está funcionando."

# Verificar que los pods de Kagent están corriendo
kubectl get pods -n kagent

# Listar los agentes disponibles
kagent get agent -n kagent

# Deberías ver agentes como:
# - k8s-agent (para operaciones de Kubernetes)
# - helm-agent (para gestión de Helm charts)
# - observability-agent (para monitoreo)
# - promql-agent (para queries de Prometheus)

# Ver detalles de un agente específico
kagent get agent k8s-agent -n kagent



6. Configuración de Herramientas SaaS

Workik: Vayan a workik.com y regístrense para la prueba gratuita.

Bitbucket: Creen una cuenta gratuita en bitbucket.org.

GCP: Asegúrense de tener una cuenta de GCP (el nivel gratuito es suficiente para la demo de IaC).

"¡Listo! Nuestro laboratorio está configurado. Tenemos K8s, Jenkins, Argo y Kagent listos para actuar."

2. Caso de Uso 1: De NLP a Jenkinsfile (0:30 - 0:50) (20 min)

(Slide 8 & 9: DEMO Workik + Bitbucket)

"Nuestro primer desafío: un desarrollador sube una nueva aplicación Java a Bitbucket. Necesita un pipeline. En lugar de escribirlo desde cero, usaremos la intención."

Flujo de la Demo (En pantalla):

"He creado un repositorio en Bitbucket llamado music-store-platform. Contiene package.json, tsconfig.json, Dockerfile y el código fuente de la aplicación."

"Voy a la UI de Workik y selecciono 'Jenkins Code Generator'."

"Conecto mi cuenta de Bitbucket y selecciono el repositorio music-store-platform."

"Ahora, el prompt. En lugar de código, escribo lo que quiero."

Prompt de IA (Workik):

"Genera un Jenkinsfile declarativo para mi Music Store Platform (Node.js/TypeScript). Necesita etapas para:
1. Checkout del código
2. Instalar dependencias (npm install)
3. Ejecutar tests (npm test)
4. Build del cliente y servidor (npm run build)
5. Construir imagen Docker y pushearla a Google Container Registry (GCR)"



"Workik analiza el prompt y el repositorio. Ve el package.json, tsconfig.json y el Dockerfile y entiende que es una aplicación Node.js/TypeScript con React."

"(Muestra el Jenkinsfile generado). Observen esto. Ha creado las etapas correctamente, ha configurado el agent (probablemente node:18 y docker), ha incluido la instalación de dependencias, ejecución de tests, build de cliente/servidor, y los comandos para construir y pushear la imagen Docker. Esto es un borrador del 90% en segundos."

"Hacemos commit de este Jenkinsfile directamente a Bitbucket."

3. Caso de Uso 2: Refactorización a Librerías Compartidas (0:50 - 1:15) (25 min)

(Slide 10 & 11: DEMO IA + Librerías Compartidas)

"El pipeline que generamos funciona, pero es monolítico. ¿Qué pasa si tenemos múltiples microservicios Node.js (music-store-api, music-store-admin, music-store-worker)? No queremos copiar y pegar la lógica de 'Build, Test y Push a GCR' en cada Jenkinsfile."

"Vamos a refactorizar esto usando Librerías Compartidas de Jenkins, y la IA nos ayudará a escribir el código Groovy."

Flujo de la Demo (En pantalla):

"Primero, creo un nuevo repositorio en Bitbucket llamado jenkins-shared-libs."

"Dentro, creo la estructura de carpetas: vars/."

"Ahora, tomo la etapa 'Build and Push' de mi Jenkinsfile y le pido a una IA (puede ser Workik o un LLM general) que la refactorice."

Prompt de IA (Refactor):

"Toma estas etapas de 'Test, Build y Push de Docker' de un Jenkinsfile para aplicaciones Node.js/TypeScript y conviértelas en funciones Groovy para una Librería Compartida de Jenkins. 
Crea dos funciones:
1. 'testAndBuildNodeApp' - que ejecute npm install, npm test, y npm run build
2. 'buildAndPushGCR' - que acepte parámetros como 'imageName' y 'gcpProject' para construir y pushear la imagen Docker"



"(Muestra el código Groovy generado). La IA crea dos archivos:
- vars/testAndBuildNodeApp.groovy
- vars/buildAndPushGCR.groovy
Cada uno contiene una función call() con la lógica reutilizable."

"Hago commit de este archivo a jenkins-shared-libs."

"Paso clave: Voy a mi Jenkins (que instalamos en Minikube) -> Manage Jenkins -> Configure System -> Global Pipeline Libraries. Añado mi repo jenkins-shared-libs de Bitbucket."

"Finalmente, edito el Jenkinsfile de mi music-store-platform."

(Muestra el Antes y Después - Slide 11)

"Antes, teníamos 20 líneas de lógica de Docker. Después, nuestro Jenkinsfile se ve así:"

// Jenkinsfile en music-store-platform
@Library('jenkins-shared-libs') _

pipeline {
    agent {
        docker { image 'node:18' }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test and Build') {
            steps {
                script {
                    // ¡Lógica centralizada para Node.js!
                    testAndBuildNodeApp()
                }
            }
        }
        
        stage('Docker Build and Push') {
            steps {
                script {
                    buildAndPushGCR(
                        imageName: 'music-store-platform', 
                        gcpProject: 'music-store-prod'
                    )
                }
            }
        }
    }
}



"Acabamos de hacer nuestro CI mantenible y escalable con la ayuda de la IA."

4. Caso de Uso 3: Operaciones de K8s con Kagent (1:15 - 1:50) (35 min)

(Slide 12 & 13: Kagent Agents)

"Ahora, el caso de uso más emocionante: AgentOps. Vamos a operar nuestro clúster de Kubernetes usando lenguaje natural. Ya instalamos Kagent y sus agentes."

Flujo de la Demo (En la Terminal):

"Primero, verifiquemos que Kagent puede ver nuestro modelo de IA."

# Verificar que kagent está instalado y funcionando
kagent get agent -n kagent
# Debería mostrar los agentes disponibles (k8s-agent, helm-agent, etc.)



(Slide 14: Demo 1 - Despliegue simple)
2.  "Mi intención: 'Quiero desplegar la Music Store Platform'. No quiero escribir YAML."

```bash
# Usamos el k8s-agent (requiere que kagent esté instalado en el cluster)
# NOTA: Este comando es demostrativo. Requiere configuración previa de kagent.
kagent invoke k8s-agent "deploy the app 'music-store-platform' using the image 'gcr.io/music-store-prod/music-store-platform:latest' with 3 replicas and expose port 3000"
```



"¡Observen esto! Kagent me responde con un plan. Dice: 'Voy a generar este YAML para un Deployment y luego lo aplicaré'. Me pide confirmación."

"Escribo y y presiono Enter."

"Verifiquemos que se creó:"

kubectl get deployment music-store-platform
# SALIDA: music-store-platform   3/3     3            3           10s



(Slide 15: Demo 2 - Despliegue de Dependencias (Helm))
6.  "Nuestra Music Store Platform necesita una base de datos PostgreSQL. Usemos el agente de Helm."

```bash
# Usamos el helm-agent (requiere que kagent esté instalado en el cluster)
# NOTA: Este comando es demostrativo. Requiere configuración previa de kagent.
kagent invoke helm-agent "add 'bitnami' repo if missing, then install postgresql chart 'music-store-db' in 'database' namespace with persistence enabled"
```



"Miren el plan ahora. Es un plan de varios pasos: 1. Crear el namespace database. 2. Añadir el repo bitnami. 3. Instalar el chart bitnami/postgresql con persistencia habilitada."

"Apruebo el plan (y). Kagent lo ejecuta."

"Verifiquemos:"

kubectl get pods -n database
# SALIDA: music-store-db-postgresql-0   1/1     Running   0          45s



(Slide 16: Demo 3 - Refactorización a Canary (Argo))
10. "Este es el poder de los agentes especializados. Tenemos ArgoCD (y Argo Rollouts) instalado. Quiero convertir mi despliegue simple music-store-platform en un 'Canary Rollout' para hacer deployments más seguros sin escribir YAML."

```bash
# Usamos el argo-rollouts-agent (requiere que kagent esté instalado en el cluster)
# NOTA: Este comando es demostrativo. Requiere configuración previa de kagent.
kagent invoke argo-rollouts-agent "convert deployment 'music-store-platform' to an Argo Rollout with a 20% canary step and pause duration of 5 minutes"
```



"El agente sabe cómo leer un Deployment, transformarlo en un recurso Rollout de Argo, y aplicar el cambio. Apruebo el plan (y)."

"Verifiquemos:"

# El Deployment ya no existe, ahora es un Rollout
kubectl get deployment music-store-platform # No encontrado
kubectl get rollout music-store-platform    # Encontrado

# Ver el estado del rollout
kubectl argo rollouts get rollout music-store-platform --watch



"Hemos desplegado, gestionado dependencias y refactorizado un despliegue, todo usando lenguaje natural."

5. Caso de Uso 4: NLP a IaC y DaC (1:50 - 2:00) (10 min)

(Slide 17: NLP a IaC y DaC)
"Terminemos con dos casos de uso rápidos de generación de código."

(Slide 18: Demo IaC (Terraform))

"Volvemos a Workik. Selecciono 'Terraform Code Generator'."

"Mi intención: necesito la infraestructura en GCP."

Prompt de IA (Workik):

"Genera Terraform HCL para GCP para la Music Store Platform. Necesito:
1. Un clúster GKE regional en 'us-central1' con 3 nodos (e2-medium)
2. Una base de datos Cloud SQL PostgreSQL 14
3. Un bucket de Cloud Storage para almacenar archivos de audio y artwork
4. Configuración de red VPC privada"



"(Muestra el HCL generado). De nuevo, este es un borrador del 90%. Como ingenieros, debemos revisarlo. ¿Es el 'machine_type' correcto? ¿La red es pública o privada? La IA acelera el inicio, el ingeniero valida."

(Slide 19: Demo DaC (Liquibase))
4.  "Finalmente, un flujo híbrido para 'Database as Code' (DaC)."
5.  "Paso 1 (IA): Usamos 'SQL Generator' de Workik."

**Prompt de IA (Workik):**
```
"Genera SQL 'CREATE TABLE' para PostgreSQL para el esquema de Music Store Platform:
1. Tabla 'users' con id, username, email, role (artist/listener), created_at
2. Tabla 'albums' con id, title, artist_id, price, artwork_url, created_at
3. Tabla 'tracks' con id, album_id, title, duration, audio_url, track_number
4. Tabla 'purchases' con id, user_id, album_id, purchase_date, amount
Incluye las foreign keys y índices apropiados."
```



"Paso 2 (DBA/Dev): Tomamos este SQL y lo ejecutamos en nuestra base de datos music-store-db (la que desplegamos con Helm)."

"Paso 3 (DevOps): Ahora, usamos Liquibase para capturar ese cambio y versionarlo."

# (Asumiendo que liquibase y el driver de PostgreSQL están instalados localmente)
# Hacemos port-forward al servicio de PostgreSQL
kubectl port-forward svc/music-store-db-postgresql -n database 5432:5432 &

# Obtener la contraseña de PostgreSQL
export POSTGRES_PASSWORD=$(kubectl get secret music-store-db-postgresql -n database -o jsonpath="{.data.postgres-password}" | base64 -d)

# Liquibase inspecciona la DB y genera el changelog
liquibase --url="jdbc:postgresql://localhost:5432/music_store" \
  --username=postgres \
  --password=$POSTGRES_PASSWORD \
  generate-changelog --changelog-file=music-store-db.changelog.xml



"Este music-store-db.changelog.xml es nuestro 'Database as Code'. Fue creado por la IA, aplicado por un DBA, y versionado por DevOps. Este archivo va a Bitbucket junto con nuestro código de la aplicación.

NOTA: En este proyecto ya usamos Prisma como ORM, que genera migraciones automáticamente. Sin embargo, Liquibase es útil para:
- Equipos que prefieren SQL puro
- Migraciones complejas que requieren control fino
- Integración con sistemas legacy
- Auditoría y rollback de cambios de esquema"

6. Conclusión y Q&A (2:00 - Fin)

(Slide 20: Conclusiones y Preguntas)

"Para resumir lo que vimos hoy:

Generación: Aceleramos el bootstrap de Jenkinsfile y Terraform.

Refactorización: Modernizamos nuestro CI a Librerías Compartidas.

Operación: Usamos Kagent para un 'AgentOps' real, operando K8s, Helm y Argo con intención.

La IA no reemplaza al ingeniero de DevOps. Es un copiloto, un acelerador y un agente que reduce la carga cognitiva.

¡Gracias! ¿Preguntas?"

---

## 📋 COMANDOS PRÁCTICOS PARA MUSIC STORE PLATFORM

### Escenario 1: Setup Inicial del Entorno de Desarrollo

```bash
# 1. Clonar el repositorio
git clone https://bitbucket.org/tu-org/music-store-platform.git
cd music-store-platform

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos local
createdb music_store
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar migraciones de Prisma
npm run prisma:migrate
npm run prisma:seed

# 5. Iniciar en modo desarrollo
npm run dev
```

### Escenario 2: Despliegue en Kubernetes Local (KIND o Minikube)

```bash
# OPCIÓN A: Usando KIND (Kubernetes IN Docker) - Recomendado
# 1. Iniciar KIND cluster
kind create cluster --name music-store

# 2. Construir la imagen Docker localmente
docker build -t music-store-platform:latest .

# 3. Cargar la imagen en KIND
kind load docker-image music-store-platform:latest --name music-store

# OPCIÓN B: Usando Minikube
# 1. Iniciar Minikube con recursos suficientes
minikube start --memory=8192 --cpus=4

# 2. Construir la imagen Docker localmente
docker build -t music-store-platform:latest .

# 3. Cargar la imagen en Minikube
minikube image load music-store-platform:latest

# 4. Crear namespace para la aplicación
kubectl create namespace music-store

# 5. Desplegar PostgreSQL con Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install music-store-db bitnami/postgresql \
  --namespace music-store \
  --set auth.database=music_store \
  --set auth.username=musicstore \
  --set auth.password=changeme123 \
  --set persistence.size=5Gi

# 6. Crear ConfigMap con variables de entorno
kubectl create configmap music-store-config \
  --namespace music-store \
  --from-literal=NODE_ENV=production \
  --from-literal=PORT=3000

# 7. Crear Secret con credenciales de DB
kubectl create secret generic music-store-secrets \
  --namespace music-store \
  --from-literal=DATABASE_URL="postgresql://musicstore:changeme123@music-store-db-postgresql:5432/music_store" \
  --from-literal=SESSION_SECRET="your-session-secret-here"

# 8. Aplicar manifiestos de Kubernetes
kubectl apply -f k8s/deployment.yaml -n music-store
kubectl apply -f k8s/service.yaml -n music-store

# 9. Verificar el despliegue
kubectl get pods -n music-store
kubectl get svc -n music-store

# 10. Acceder a la aplicación
minikube service music-store-service -n music-store
```

### Escenario 3: Usando Kagent para Operaciones

```bash
# 1. Verificar que Kagent está listo
kagent get agent -n kagent

# 2. Escalar la aplicación usando lenguaje natural
# NOTA: Estos comandos requieren kagent instalado. Alternativamente usa kubectl:
kubectl scale deployment music-store-platform --replicas=5 -n music-store

# Con kagent (si está instalado):
# kagent invoke k8s-agent "scale deployment music-store-platform to 5 replicas in namespace music-store"

# 3. Agregar un Ingress con certificado SSL
# Con kubectl (método tradicional):
kubectl apply -f k8s/ingress.yaml -n music-store

# Con kagent (si está instalado):
# kagent invoke k8s-agent "create an ingress for service music-store-service in namespace music-store with host musicstore.example.com and enable TLS"

# 4. Configurar HorizontalPodAutoscaler
# Con kubectl:
kubectl autoscale deployment music-store-platform --min=2 --max=10 --cpu-percent=70 -n music-store

# Con kagent (si está instalado):
# kagent invoke k8s-agent "create HPA for deployment music-store-platform in namespace music-store with min 2, max 10 replicas, target CPU 70%"

# 5. Crear un CronJob para backup de base de datos
# Con kubectl:
kubectl apply -f k8s/backup-cronjob.yaml -n music-store

# Con kagent (si está instalado):
# kagent invoke k8s-agent "create a cronjob in namespace music-store that runs daily at 2am to backup postgresql database music-store-db"
```

### Escenario 4: CI/CD con Jenkins

```bash
# Ejemplo de Jenkinsfile generado por IA para Music Store Platform
# Este archivo iría en la raíz del repositorio

pipeline {
    agent {
        docker { 
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        GCP_PROJECT = 'music-store-prod'
        IMAGE_NAME = 'music-store-platform'
        GCR_REGISTRY = 'gcr.io'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test:coverage'
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${GCR_REGISTRY}/${GCP_PROJECT}/${IMAGE_NAME}:${BUILD_NUMBER} .
                        docker tag ${GCR_REGISTRY}/${GCP_PROJECT}/${IMAGE_NAME}:${BUILD_NUMBER} \
                                   ${GCR_REGISTRY}/${GCP_PROJECT}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Push to GCR') {
            steps {
                script {
                    sh """
                        gcloud auth configure-docker
                        docker push ${GCR_REGISTRY}/${GCP_PROJECT}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${GCR_REGISTRY}/${GCP_PROJECT}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                        kubectl set image deployment/music-store-platform \
                            music-store-platform=${GCR_REGISTRY}/${GCP_PROJECT}/${IMAGE_NAME}:${BUILD_NUMBER} \
                            -n music-store
                        kubectl rollout status deployment/music-store-platform -n music-store
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline ejecutado exitosamente!'
        }
        failure {
            echo 'Pipeline falló. Revisar logs.'
        }
    }
}
```

### Escenario 5: Prompts de IA Útiles para Music Store

**Para Workik (Generación de Código):**

1. **Terraform para infraestructura completa:**
```
"Genera Terraform para GCP que incluya:
- GKE cluster con node pool de 3 nodos e2-standard-2
- Cloud SQL PostgreSQL 14 con 10GB de almacenamiento
- Cloud Storage bucket para archivos de audio (lifecycle: 90 días)
- Cloud Storage bucket para artwork (lifecycle: 365 días)
- VPC con subnets privadas
- Cloud NAT para acceso a internet
- Firewall rules para permitir tráfico HTTPS
- Service account para la aplicación con permisos mínimos"
```

2. **GitHub Actions workflow:**
```
"Genera un workflow de GitHub Actions para Music Store Platform que:
- Se ejecute en push a main y pull requests
- Ejecute tests con cobertura mínima de 80%
- Construya la imagen Docker
- Suba la imagen a GitHub Container Registry
- Despliegue a staging automáticamente
- Requiera aprobación manual para producción"
```

3. **Helm Chart:**
```
"Genera un Helm chart para Music Store Platform con:
- Deployment con 3 réplicas
- Service tipo LoadBalancer
- ConfigMap para variables de entorno
- Secret para credenciales de DB
- PersistentVolumeClaim para uploads (20Gi)
- Ingress con cert-manager para SSL
- HPA con min 2, max 10 replicas
- Probes de liveness y readiness en /health"
```

### Escenario 6: Monitoreo y Observabilidad

```bash
# Instalar Prometheus y Grafana con Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Usar Kagent para configurar alertas
# Con kubectl:
kubectl apply -f k8s/prometheus-rules.yaml -n monitoring

# Con kagent (si está instalado):
# kagent invoke k8s-agent "create a PrometheusRule in namespace monitoring that alerts when music-store-platform pods have CPU usage above 80% for 5 minutes"

# Port-forward para acceder a Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Usuario: admin, Password: prom-operator
```

### Escenario 7: Troubleshooting con IA

```bash
# Ver logs de la aplicación
kubectl logs -f deployment/music-store-platform -n music-store

# Usar Kagent para diagnosticar problemas
# Con kubectl (método tradicional):
kubectl get all -n music-store
kubectl describe pods -n music-store
kubectl top pods -n music-store

# Con kagent (si está instalado):
# kagent invoke k8s-agent "show me the status of all resources in namespace music-store and identify any issues"

# Ejecutar comandos dentro del pod
kubectl exec -it deployment/music-store-platform -n music-store -- /bin/sh

# Dentro del pod, verificar conectividad a la base de datos
npm run prisma:studio
```

---

## 🎯 RESUMEN DE BENEFICIOS

### Antes de IA en DevOps:
- ⏱️ **2-3 horas** para escribir un Jenkinsfile desde cero
- 📝 **Documentación dispersa** en múltiples fuentes
- 🐛 **Debugging manual** de YAML y configuraciones
- 🔄 **Copy-paste** de código entre proyectos similares

### Después de IA en DevOps:
- ⚡ **5-10 minutos** para generar un Jenkinsfile completo
- 🤖 **Asistente contextual** que entiende tu stack
- 🔍 **Diagnóstico automático** de problemas
- 🎨 **Código personalizado** para tu caso de uso específico

### ROI Estimado:
- **70% reducción** en tiempo de setup inicial
- **50% menos errores** en configuraciones
- **80% más rápido** en troubleshooting
- **100% más felices** los ingenieros de DevOps 😊

---

## ✅ VERIFICACIÓN Y ESTADO DEL PROYECTO

### Comandos Verificados y Funcionando:

#### 1. Cluster de Kubernetes
```bash
# Verificar cluster activo
kubectl cluster-info
# ✅ FUNCIONANDO: Cluster KIND activo en https://127.0.0.1:65154

# Ver contexto actual
kubectl config current-context
# ✅ FUNCIONANDO: kind-kind

# Listar namespaces
kubectl get namespaces
# ✅ FUNCIONANDO: Namespaces default, argocd, jenkins disponibles
```

#### 2. ArgoCD Instalado
```bash
# Verificar ArgoCD
kubectl get all -n argocd
# ✅ FUNCIONANDO: ArgoCD completamente desplegado y corriendo
# - argocd-server
# - argocd-repo-server
# - argocd-application-controller
# - argocd-dex-server
# - argocd-redis
```

#### 3. Namespace Music Store
```bash
# Crear namespace
kubectl create namespace music-store
# ✅ FUNCIONANDO: Namespace creado exitosamente

# Crear ConfigMap
kubectl create configmap music-store-config \
  --namespace music-store \
  --from-literal=NODE_ENV=production \
  --from-literal=PORT=3000
# ✅ FUNCIONANDO: ConfigMap creado

# Crear Secrets
kubectl create secret generic music-store-secrets \
  --namespace music-store \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=SESSION_SECRET="..."
# ✅ FUNCIONANDO: Secret creado
```

#### 4. Docker Build
```bash
# Construir imagen
docker build -t music-store-platform:latest .
# ✅ FUNCIONANDO: Imagen construida exitosamente (1.41GB)

# Verificar imagen
docker images | grep music-store
# ✅ FUNCIONANDO: music-store-platform:latest disponible

# Cargar imagen en KIND
kind load docker-image music-store-platform:latest
# ✅ FUNCIONANDO: Imagen cargada en el cluster
```

#### 5. Manifiestos de Kubernetes Creados
```bash
# Archivos creados en k8s/:
# ✅ deployment.yaml - Deployment con 3 réplicas
# ✅ service.yaml - LoadBalancer service
# ✅ ingress.yaml - Ingress con TLS
```

#### 6. Kagent CLI
```bash
# Verificar kagent instalado
kagent --help
# ✅ FUNCIONANDO: CLI instalado y disponible

# Comandos disponibles:
kagent get agent     # Listar agentes
kagent invoke        # Invocar agente
kagent dashboard     # Abrir dashboard
# ⚠️ NOTA: Kagent no está desplegado en el cluster (requiere instalación)
```

### Problemas Identificados y Soluciones:

#### ❌ Problema 1: package-lock.json excluido en .dockerignore
**Síntoma:** `npm ci` fallaba en Docker build
**Causa:** `.dockerignore` excluía `package-lock.json`
**Solución:** ✅ Comentada la línea en `.dockerignore`

#### ❌ Problema 2: Ruta incorrecta del servidor en Dockerfile
**Síntoma:** `Error: Cannot find module '/app/dist/server/index.js'`
**Causa:** TypeScript compila a `/app/dist/src/server/index.js`
**Solución:** ✅ Actualizado CMD en Dockerfile a `dist/src/server/index.js`

#### ⚠️ Problema 3: Dependencia uuid como ESM
**Síntoma:** `Error [ERR_REQUIRE_ESM]: require() of ES Module uuid`
**Causa:** uuid v13 es ESM-only, incompatible con CommonJS
**Solución Pendiente:** 
```bash
# Opción 1: Downgrade a uuid v9
npm install uuid@9

# Opción 2: Configurar TypeScript para ESM
# Modificar tsconfig.json y package.json para usar "type": "module"

# Opción 3: Usar dynamic import
# Cambiar require('uuid') por await import('uuid')
```

### Comandos que Requieren Instalación Adicional:

#### Kagent (Framework de IA Agencial)

**Documentación Oficial:** https://kagent.dev/docs/kagent/introduction/installation

**Requisitos:**
- API key de un proveedor LLM (OpenAI, Anthropic, Azure OpenAI, Ollama, o OpenRouter)
- kagent CLI instalado

```bash
# Paso 1: Configurar API key del proveedor LLM
# Opción A: OpenAI (requiere API key de pago)
export OPENAI_API_KEY="sk-..."

# Opción B: Anthropic/Claude (requiere API key)
export ANTHROPIC_API_KEY="sk-ant-..."

# Opción C: OpenRouter (puede tener tier gratuito)
export OPENROUTER_API_KEY="sk-or-..."

# Paso 2: Instalar kagent en el cluster
# Por defecto instala perfil "demo" con agentes preconfigurados
kagent install

# O instalar perfil mínimo sin agentes predefinidos
kagent install --profile minimal

# Paso 3: Verificar instalación
kubectl get pods -n kagent
kubectl get agents -n kagent

# Paso 4: Listar agentes disponibles
kagent get agent -n kagent
```

**Proveedores LLM Soportados:**
- **OpenAI** - Requiere API key de pago (https://platform.openai.com)
- **Anthropic (Claude)** - Requiere API key (https://console.anthropic.com)
- **Azure OpenAI** - Requiere suscripción Azure
- **Ollama** - Gratis, corre localmente (https://ollama.ai)
- **OpenRouter** - Agregador de LLMs, algunos modelos gratuitos (https://openrouter.ai)

**Nota Importante:** 
Sin una API key válida, Kagent no podrá funcionar. Para demos sin costo, considera:
1. Usar Ollama localmente (gratis pero requiere recursos)
2. OpenRouter con modelos gratuitos
3. Usar los comandos kubectl tradicionales como alternativa

#### PostgreSQL con Helm
```bash
# Instalar PostgreSQL para la aplicación
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install music-store-db bitnami/postgresql \
  --namespace music-store \
  --set auth.database=music_store \
  --set auth.username=musicstore \
  --set auth.password=changeme123 \
  --set persistence.size=5Gi
```

#### Prometheus y Grafana
```bash
# Instalar stack de monitoreo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### Próximos Pasos Recomendados:

1. **Resolver problema de uuid:**
   - Downgrade a uuid v9 o migrar a ESM

2. **Desplegar PostgreSQL:**
   - Usar Helm chart de Bitnami
   - Actualizar DATABASE_URL en el secret

3. **Verificar deployment:**
   - Una vez resuelto uuid, verificar pods en estado Running
   - Probar acceso a la aplicación

4. **Opcional - Instalar Kagent:**
   - Seguir pasos de instalación
   - Configurar API key de OpenRouter
   - Probar comandos de lenguaje natural

5. **Configurar Ingress:**
   - Instalar nginx-ingress-controller
   - Aplicar ingress.yaml
   - Configurar DNS local o /etc/hosts

### Comandos de Verificación Rápida:

```bash
# Ver estado general del cluster
kubectl get all -A

# Ver recursos en namespace music-store
kubectl get all,configmap,secret -n music-store

# Ver logs de la aplicación
kubectl logs -f deployment/music-store-platform -n music-store

# Describir pod para debugging
kubectl describe pod -n music-store -l app=music-store-platform

# Port-forward para acceso local (cuando esté funcionando)
kubectl port-forward -n music-store svc/music-store-service 8080:80

# Ver eventos del namespace
kubectl get events -n music-store --sort-by='.lastTimestamp'
```

### Recursos Creados en Este Proyecto:

```
k8s/
├── deployment.yaml      # Deployment de la aplicación
├── service.yaml         # LoadBalancer service
├── ingress.yaml         # Ingress con TLS
├── configmap.yaml       # (Referenciado, creado via kubectl)
└── secrets.yaml.example # (Ya existía en el proyecto)
```

### Documentación Actualizada:

- ✅ Comandos adaptados de Java/Maven a Node.js/TypeScript
- ✅ Ejemplos de Jenkinsfile para Music Store Platform
- ✅ Comandos de Kagent corregidos (get agent en lugar de get models)
- ✅ Alternativas con kubectl para comandos que requieren Kagent
- ✅ Soporte para KIND además de Minikube
- ✅ Prompts de IA específicos para el proyecto
- ✅ Sección de troubleshooting y verificación

---

## 📚 RECURSOS ADICIONALES

### Herramientas de IA para DevOps:

1. **Workik** (https://workik.com)
   - Generación de código CI/CD
   - Terraform, Jenkinsfile, GitHub Actions
   - Integración con repositorios

2. **Kagent** (https://kagent.run)
   - Framework de agentes de IA para Kubernetes
   - Operaciones con lenguaje natural
   - Agentes especializados (k8s, helm, argo)

3. **OpenRouter** (https://openrouter.ai)
   - Acceso a múltiples LLMs
   - Nivel gratuito disponible
   - Compatible con Kagent

### Documentación Oficial:

- Kubernetes: https://kubernetes.io/docs/
- Helm: https://helm.sh/docs/
- ArgoCD: https://argo-cd.readthedocs.io/
- KIND: https://kind.sigs.k8s.io/
- Prisma: https://www.prisma.io/docs/

### Comunidad y Soporte:

- Kagent Discord: https://discord.gg/kagent
- Kubernetes Slack: https://slack.k8s.io/
- CNCF Community: https://www.cncf.io/community/