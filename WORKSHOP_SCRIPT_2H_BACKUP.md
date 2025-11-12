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
2. ✅ Configurar y usar **Jenkins Agents** para CI/CD distribuido
3. ✅ Operar Kubernetes con **Kagent** usando lenguaje natural
4. ✅ Crear **agentes personalizados** de Kagent para sus aplicaciones
5. ✅ Implementar una arquitectura de agentes en su infraestructura

---

## 📊 Estructura del Workshop

| Tiempo | Sección | Duración |
|--------|---------|----------|
| 0:00 - 0:15 | Introducción: ChatOps → AgentOps | 15 min |
| 0:15 - 0:45 | Parte 1: Jenkins Agents | 30 min |
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

## 📍 PARTE 1: JENKINS AGENTS (0:15 - 0:45) - 30 minutos

### 0:15 - 0:17 | Introducción a Jenkins Agents (2 min)

**[SLIDE: ¿Qué son Jenkins Agents?]**

> "Jenkins Agents son **nodos de ejecución distribuidos** que permiten paralelizar builds y ejecutar trabajos en diferentes entornos."

**Conceptos clave:**
```
┌─────────────────────────────────────────┐
│         JENKINS MASTER                  │
│  (Orquestador, no ejecuta builds)       │
└────────────┬────────────────────────────┘
             │
     ┌───────┴───────┬──────────┐
     │               │          │
┌────▼────┐    ┌────▼────┐  ┌──▼──────┐
│ Agent 1 │    │ Agent 2 │  │ Agent 3 │
│ Node.js │    │ Docker  │  │ Python  │
└─────────┘    └─────────┘  └─────────┘
```

---

### 0:17 - 0:27 | Demo 1: Configurar Jenkins Agents (10 min)

**[SLIDE: Tipos de Jenkins Agents]**

> "Vamos a configurar diferentes tipos de agentes para Music Store Platform."

**[TERMINAL - Jenkins UI]**

**Paso 1: Acceder a Jenkins**
```bash
# Port-forward a Jenkins
kubectl port-forward -n jenkins svc/jenkins 8080:8080

# Obtener password de admin
kubectl get secret -n jenkins jenkins \
  -o jsonpath="{.data.jenkins-admin-password}" | base64 -d
```

**Paso 2: Configurar Agent en Kubernetes**

En Jenkins UI:
1. Manage Jenkins → Manage Nodes and Clouds
2. Configure Clouds → Kubernetes
3. Agregar Pod Template:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  containers:
  - name: nodejs
    image: node:18
    command:
    - cat
    tty: true
  - name: docker
    image: docker:latest
    command:
    - cat
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
```

**Explicar:**
> "Este agent tiene dos contenedores:
> - Node.js para builds
> - Docker para crear imágenes
> 
> Jenkins orquesta, los agents ejecutan."

---

### 0:27 - 0:37 | Demo 2: Pipeline con Agents Dinámicos (10 min)

**[SLIDE: Jenkinsfile con Agents]**

> "Ahora vamos a crear un pipeline que usa diferentes agents para diferentes tareas."

**Jenkinsfile para Music Store:**
```groovy
pipeline {
    agent none  // No agent por defecto
    
    stages {
        stage('Build') {
            agent {
                kubernetes {
                    label 'nodejs-agent'
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: nodejs
    image: node:18
    command: ['cat']
    tty: true
"""
                }
            }
            steps {
                container('nodejs') {
                    sh 'npm ci'
                    sh 'npm run build'
                    sh 'npm test'
                }
            }
        }
        
        stage('Docker Build') {
            agent {
                kubernetes {
                    label 'docker-agent'
                    yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:latest
    command: ['cat']
    tty: true
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
                    sh 'docker build -t music-store:${BUILD_NUMBER} .'
                    sh 'docker push gcr.io/project/music-store:${BUILD_NUMBER}'
                }
            }
        }
        
        stage('Deploy') {
            agent {
                kubernetes {
                    label 'kubectl-agent'
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
                    sh 'kubectl set image deployment/music-store-platform music-store=gcr.io/project/music-store:${BUILD_NUMBER}'
                    sh 'kubectl rollout status deployment/music-store-platform'
                }
            }
        }
    }
}
```

**Explicar beneficios:**
> "Cada stage usa un agent especializado:
> - Build → Agent con Node.js
> - Docker → Agent con Docker
> - Deploy → Agent con kubectl
> 
> Esto permite:
> - ✅ Aislamiento entre stages
> - ✅ Imágenes optimizadas por tarea
> - ✅ Paralelización automática
> - ✅ Escalabilidad horizontal"

---

### 0:37 - 0:45 | Demo 3: Monitorear Agents (8 min)

**[SLIDE: Observabilidad de Agents]**

> "Es importante monitorear nuestros agents para optimizar recursos."

**[TERMINAL - Jenkins + Kubectl]**

**Ver agents activos:**
```bash
# En Jenkins UI
# Manage Jenkins → Manage Nodes and Clouds → Nodes

# Ver pods de agents en Kubernetes
kubectl get pods -n jenkins -l jenkins=agent

# Ver recursos consumidos
kubectl top pods -n jenkins -l jenkins=agent
```

**Configurar límites de recursos:**
```yaml
# En Pod Template de Jenkins
spec:
  containers:
  - name: nodejs
    image: node:18
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "1Gi"
        cpu: "1000m"
```

**Configurar retención:**
```groovy
// En Jenkinsfile
options {
    buildDiscarder(logRotator(
        numToKeepStr: '10',
        daysToKeepStr: '30'
    ))
    timeout(time: 30, unit: 'MINUTES')
}
```

**[SLIDE: Resumen Parte 1]**

> "Jenkins Agents nos permiten:
> - ✅ Distribuir carga de trabajo
> - ✅ Especializar entornos de ejecución
> - ✅ Escalar horizontalmente
> - ✅ Aislar builds entre proyectos
> 
> Esto es la base de AgentOps en CI/CD."

---

## 📍 PARTE 2: KAGENT - AGENTES DE KUBERNETES (0:45 - 1:15) - 30 minutos

### 0:45 - 0:47 | Introducción a Kagent (2 min)

**[SLIDE: ¿Qué es Kagent?]**

> "Kagent es un framework de **agentes de IA para Kubernetes**. Permite operar K8s con lenguaje natural."

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

### 0:47 - 1:00 | Demo 4: Instalar y Configurar Kagent (13 min)

**[SLIDE: Caso de Uso - Shared Libraries]**

> "Tienen 10 microservicios con Jenkinsfiles similares. Cada cambio hay que replicarlo 10 veces. Vamos a refactorizar."

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
