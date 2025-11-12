# 🤖 Guía: Crear Agente Personalizado de Kagent para Music Store

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Prerequisitos](#prerequisitos)
3. [Paso 1: Entender la Estructura](#paso-1-entender-la-estructura)
4. [Paso 2: Crear el YAML del Agente](#paso-2-crear-el-yaml-del-agente)
5. [Paso 3: Aplicar el Agente](#paso-3-aplicar-el-agente)
6. [Paso 4: Verificar el Agente](#paso-4-verificar-el-agente)
7. [Paso 5: Usar el Agente](#paso-5-usar-el-agente)
8. [Paso 6: Personalizar Skills](#paso-6-personalizar-skills)
9. [Troubleshooting](#troubleshooting)

---

## Introducción

Un **agente personalizado de Kagent** es un asistente de IA especializado que:
- Conoce tu aplicación específica
- Tiene acceso a herramientas de Kubernetes
- Puede ejecutar operaciones automáticamente
- Responde en lenguaje natural

Para Music Store, crearemos un agente que:
- Monitorea la salud de la aplicación
- Gestiona scaling
- Troubleshootea problemas
- Maneja la base de datos PostgreSQL

---

## Prerequisitos

### Verificar Kagent

```bash
# Verificar que Kagent esté instalado
kagent version

# Verificar agentes existentes
kagent get agent -n default

# Verificar namespace
kubectl get ns kagent
```

### Verificar Music Store

```bash
# Verificar deployment
kubectl get deployment music-store-platform -n music-store

# Verificar pods
kubectl get pods -n music-store

# Verificar service
kubectl get svc -n music-store
```

---

## Paso 1: Entender la Estructura

### Anatomía de un Agente Kagent

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: music-store-agent          # Nombre del agente
  namespace: default                # Namespace donde vive
  labels:                           # Labels para organización
    app: music-store-platform
    type: application-agent

spec:
  declarative:
    systemMessage: |                # Instrucciones para la IA
      # Define el rol y comportamiento del agente
    
    modelConfig: default-model-config  # Configuración del modelo LLM
    
    tools:                          # Herramientas disponibles
      - mcpServer:
          name: kagent-tool-server
          toolNames:
            - k8s_get_resources
            - k8s_describe_resource
            # ... más tools
    
    deployment:                     # Recursos del agente
      replicas: 1
      resources:
        requests:
          cpu: 100m
          memory: 256Mi
    
    a2aConfig:                      # Skills del agente
      skills:
        - id: app-health-check
          name: Application Health Check
          description: Check app health
          examples:
            - "Is the app healthy?"
```

### Componentes Clave

1. **systemMessage**: El "cerebro" del agente - define su personalidad y conocimiento
2. **tools**: Herramientas de Kubernetes que puede usar
3. **a2aConfig.skills**: Capacidades específicas con ejemplos
4. **deployment**: Recursos computacionales del agente

---

## Paso 2: Crear el YAML del Agente

### Crear el Archivo

```bash
# Crear directorio para agentes
mkdir -p k8s/kagent

# Crear archivo del agente
touch k8s/kagent/music-store-agent.yaml
```

### YAML Completo del Agente

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: music-store-agent
  namespace: default
  labels:
    app: music-store-platform
    type: application-agent
    team: platform
spec:
  declarative:
    systemMessage: |
      # Music Store Platform Agent
      
      You are a specialized AI agent for the **Music Store Platform** application.
      Your role is to help operators manage, monitor, and troubleshoot the 
      Music Store application running on Kubernetes.
      
      ## Your Responsibilities
      
      1. **Application Health**: Monitor the health of music-store-platform pods
      2. **Database Management**: Check PostgreSQL status and connectivity
      3. **Scaling**: Help scale the application based on load
      4. **Troubleshooting**: Diagnose issues with the application
      5. **Deployment**: Assist with deployments and rollbacks
      6. **Performance**: Monitor and optimize application performance
      
      ## Guidelines
      
      - Always check the **music-store** namespace first
      - Verify database connectivity before scaling
      - Provide clear explanations of what you're doing
      - If unsure, ask for clarification before making changes
      - Format all responses in Markdown
      - Be proactive in identifying potential issues
      - Follow the principle of least privilege
      
      ## Key Resources
      
      - **Deployment**: music-store-platform (in namespace music-store)
      - **Service**: music-store-service (LoadBalancer on port 80)
      - **Database**: music-store-db-postgresql (PostgreSQL 18.0.0)
      - **Namespace**: music-store
      - **Replicas**: Default is 3, can scale based on load
      - **Port**: Application runs on port 3000
      
      ## Common Tasks
      
      ### Health Check
      - Check if all pods are Running and Ready
      - Verify database connectivity
      - Check service endpoints
      - Review recent events
      
      ### Scaling
      - Current state: 3 replicas (default)
      - Can scale up to 10 replicas for high load
      - Always verify database can handle the load
      - Monitor resource usage after scaling
      
      ### Troubleshooting
      - Check pod logs for errors
      - Verify environment variables
      - Check database connection string
      - Review recent events
      - Verify ConfigMap and Secrets
      
      ## Response Format
      
      Structure your responses as:
      1. **Current Status**: What you found
      2. **Analysis**: What it means
      3. **Actions Taken**: What you did (if any)
      4. **Recommendations**: What should be done next
      
      Always be helpful, clear, and security-conscious.
      
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
            - k8s_check_service_connectivity
            - k8s_get_resource_yaml
            - k8s_execute_command
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
          description: Check the health and status of the Music Store application including all pods, services, and database
          examples:
            - "Is the Music Store app healthy?"
            - "Check the status of music-store pods"
            - "Are all replicas running?"
            - "How is the Music Store application doing?"
            - "Give me a health report of music-store"
          tags:
            - health
            - monitoring
            - status
            - diagnostics
        
        - id: app-scaling
          name: Application Scaling
          description: Scale the Music Store application up or down based on load requirements
          examples:
            - "Scale music-store to 5 replicas"
            - "How many replicas are running?"
            - "Increase capacity for music-store"
            - "Scale down music-store to 2 replicas"
            - "What's the current replica count?"
          tags:
            - scaling
            - capacity
            - performance
            - replicas
        
        - id: app-troubleshooting
          name: Application Troubleshooting
          description: Diagnose and fix issues with the Music Store application
          examples:
            - "Why is music-store failing?"
            - "Show me logs for music-store pods"
            - "What errors are happening in music-store?"
            - "Debug the music-store application"
            - "Find problems in music-store"
          tags:
            - troubleshooting
            - debugging
            - logs
            - errors
        
        - id: database-management
          name: Database Management
          description: Manage and monitor the PostgreSQL database for Music Store
          examples:
            - "Is the database connected?"
            - "Check PostgreSQL status"
            - "Show database pod logs"
            - "Verify database connectivity"
            - "How is the music-store database?"
          tags:
            - database
            - postgresql
            - connectivity
            - data
        
        - id: performance-monitoring
          name: Performance Monitoring
          description: Monitor and analyze the performance of the Music Store application
          examples:
            - "How is music-store performing?"
            - "Show me resource usage"
            - "Are there any performance issues?"
            - "Check CPU and memory usage"
            - "Analyze music-store performance"
          tags:
            - performance
            - monitoring
            - resources
            - optimization
        
        - id: deployment-management
          name: Deployment Management
          description: Manage deployments, rollouts, and configuration changes
          examples:
            - "Show me the deployment configuration"
            - "What's the current image version?"
            - "Check deployment history"
            - "Verify deployment status"
            - "Show me the deployment spec"
          tags:
            - deployment
            - configuration
            - rollout
            - version
```

### Explicación de Cada Sección

#### 1. systemMessage
```yaml
systemMessage: |
  # Music Store Platform Agent
  
  You are a specialized AI agent...
```
- Define el rol del agente
- Especifica responsabilidades
- Lista recursos clave
- Proporciona guidelines

#### 2. tools
```yaml
tools:
  - mcpServer:
      toolNames:
        - k8s_get_resources      # Listar recursos
        - k8s_describe_resource  # Describir recursos
        - k8s_get_pod_logs       # Ver logs
        - k8s_patch_resource     # Modificar recursos
```
- Herramientas de Kubernetes disponibles
- Cada tool permite operaciones específicas

#### 3. a2aConfig.skills
```yaml
skills:
  - id: app-health-check
    name: Application Health Check
    examples:
      - "Is the Music Store app healthy?"
```
- Define capacidades específicas
- Proporciona ejemplos de uso
- Ayuda al agente a entender intenciones

---

## Paso 3: Aplicar el Agente

### Aplicar el YAML

```bash
# Aplicar el agente
kubectl apply -f k8s/kagent/music-store-agent.yaml

# Verificar que se creó
kubectl get agent music-store-agent -n default
```

### Salida Esperada

```
agent.kagent.dev/music-store-agent created
```

### Verificar Status

```bash
# Ver detalles del agente
kubectl get agent music-store-agent -n default -o yaml

# Ver el deployment del agente
kubectl get deployment -n kagent | grep music-store

# Ver pods del agente
kubectl get pods -n kagent | grep music-store
```

---

## Paso 4: Verificar el Agente

### Verificar que el Agente está Ready

```bash
# Listar agentes
kagent get agent -n default

# Buscar music-store-agent
kagent get agent -n default | grep music-store
```

### Salida Esperada

```
| X  | default/music-store-agent | 2025-11-12T... | true | true |
```

- **DEPLOYMENT_READY**: true ✅
- **ACCEPTED**: true ✅

### Verificar Logs del Agente

```bash
# Ver logs del deployment del agente
kubectl logs -n kagent deployment/music-store-agent --tail=50

# Seguir logs en tiempo real
kubectl logs -n kagent deployment/music-store-agent -f
```

---

## Paso 5: Usar el Agente

### Comando Básico

```bash
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "PREGUNTA_O_COMANDO" \
  --stream
```

### Ejemplo 1: Health Check

```bash
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Is the Music Store application healthy? Check all pods, services, and database." \
  --stream
```

**Respuesta del Agente:**
```
📊 Current Status:
- Deployment: music-store-platform
- Replicas: 3/3 ready
- Pods: All running and healthy
- Service: music-store-service (LoadBalancer)
- Database: PostgreSQL pod running

✅ Analysis:
The Music Store application is healthy. All components are operational.

🎯 Actions Taken:
- Checked deployment status
- Verified pod health
- Tested service connectivity
- Confirmed database is running

💡 Recommendations:
- Monitor resource usage
- Consider enabling HPA for auto-scaling
- Set up alerts for pod failures
```

### Ejemplo 2: Scaling

```bash
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Scale the music-store application to 5 replicas" \
  --stream
```

**Respuesta del Agente:**
```
🔄 Scaling music-store-platform to 5 replicas...

✅ Actions Taken:
- Scaled deployment from 3 to 5 replicas
- Waiting for new pods to be ready...
- All 5 pods are now running and ready

📊 Current Status:
- Replicas: 5/5 ready
- Resource usage: CPU 45%, Memory 60%
- All health checks passing

💡 Recommendations:
- Monitor performance with increased load
- Consider setting up HPA if load varies
- Database can handle current connection pool
```

### Ejemplo 3: Troubleshooting

```bash
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Why are some music-store pods restarting? Debug the issue." \
  --stream
```

**Respuesta del Agente:**
```
🔍 Investigating pod restarts...

📊 Current Status:
- Found 2 pods with recent restarts
- Restart count: 5 in the last hour
- Exit code: 1 (application error)

🔎 Analysis:
Checking pod logs...
Error found: "ECONNREFUSED: Database connection failed"

Root cause: Database connection timeout
- Database pod was restarted 1 hour ago
- Connection pool not properly configured
- Liveness probe timeout too aggressive

✅ Actions Taken:
1. Verified database is now healthy
2. Restarted affected pods
3. Pods are now stable

💡 Recommendations:
1. Increase liveness probe timeout from 3s to 10s
2. Configure connection pool retry logic
3. Add database health check before app start
4. Set up alerts for pod restart rate
```

### Ejemplo 4: Performance Analysis

```bash
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Analyze the performance of music-store. Are there any bottlenecks?" \
  --stream
```

### Ejemplo 5: Database Check

```bash
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "Check if the PostgreSQL database is healthy and connected to the application." \
  --stream
```

---

## Paso 6: Personalizar Skills

### Agregar Nuevo Skill

Editar `k8s/kagent/music-store-agent.yaml`:

```yaml
a2aConfig:
  skills:
    # ... skills existentes ...
    
    - id: backup-management
      name: Database Backup Management
      description: Manage database backups for Music Store
      examples:
        - "Create a backup of the music-store database"
        - "List recent backups"
        - "Restore from latest backup"
        - "Verify backup integrity"
      tags:
        - backup
        - database
        - disaster-recovery
```

### Aplicar Cambios

```bash
# Aplicar cambios
kubectl apply -f k8s/kagent/music-store-agent.yaml

# Esperar a que el agente se actualice
kubectl rollout status deployment/music-store-agent -n kagent

# Verificar nuevo skill
kagent invoke --agent "music-store-agent" \
  --namespace default \
  --task "What are your capabilities?" \
  --stream
```

---

## Paso 7: Mejores Prácticas

### 1. systemMessage Claro y Específico

```yaml
systemMessage: |
  # Sé específico sobre:
  - Namespace donde vive la app
  - Nombres exactos de recursos
  - Límites de operaciones (ej: max 10 replicas)
  - Procedimientos de seguridad
  - Formato de respuestas
```

### 2. Skills con Buenos Ejemplos

```yaml
skills:
  - id: skill-name
    examples:
      # Múltiples formas de pedir lo mismo
      - "Forma directa"
      - "Forma con contexto"
      - "Forma casual"
      - "Forma técnica"
```

### 3. Tags Descriptivos

```yaml
tags:
  - categoria-principal
  - sub-categoria
  - tipo-operacion
  - nivel-criticidad
```

### 4. Recursos Apropiados

```yaml
deployment:
  replicas: 1  # Usualmente 1 es suficiente
  resources:
    requests:
      cpu: 100m      # Mínimo necesario
      memory: 256Mi
    limits:
      cpu: 500m      # Límite razonable
      memory: 512Mi
```

---

## Troubleshooting

### Problema 1: Agente no aparece en la lista

```bash
# Verificar que se aplicó
kubectl get agent -n default

# Ver eventos
kubectl get events -n default | grep music-store-agent

# Ver descripción
kubectl describe agent music-store-agent -n default
```

### Problema 2: Agente no está Ready

```bash
# Ver status
kubectl get agent music-store-agent -n default -o jsonpath='{.status}'

# Ver logs del controller
kubectl logs -n kagent deployment/kagent-controller

# Ver logs del agente
kubectl logs -n kagent deployment/music-store-agent
```

### Problema 3: Agente no responde

```bash
# Verificar que el agente está corriendo
kubectl get pods -n kagent | grep music-store

# Reiniciar el agente
kubectl rollout restart deployment/music-store-agent -n kagent

# Ver logs
kubectl logs -n kagent deployment/music-store-agent --tail=100
```

### Problema 4: Errores de permisos

```bash
# Verificar RBAC
kubectl get rolebinding -n music-store | grep kagent
kubectl get clusterrolebinding | grep kagent

# Ver permisos del service account
kubectl describe sa kagent-agent -n kagent
```

---

## Comandos Útiles

### Gestión del Agente

```bash
# Listar todos los agentes
kagent get agent -n default

# Ver detalles de un agente
kubectl get agent music-store-agent -n default -o yaml

# Actualizar agente
kubectl apply -f k8s/kagent/music-store-agent.yaml

# Eliminar agente
kubectl delete agent music-store-agent -n default

# Reiniciar agente
kubectl rollout restart deployment/music-store-agent -n kagent
```

### Debugging

```bash
# Logs del agente
kubectl logs -n kagent deployment/music-store-agent -f

# Eventos del agente
kubectl get events -n kagent --field-selector involvedObject.name=music-store-agent

# Status del deployment
kubectl get deployment music-store-agent -n kagent

# Describir el agente
kubectl describe agent music-store-agent -n default
```

### Testing

```bash
# Test simple
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Hello, what can you do?" --stream

# Test health check
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Check app health" --stream

# Test con sesión
kagent invoke --agent "music-store-agent" --namespace default \
  --session "test-session-1" \
  --task "Scale to 5 replicas" --stream
```

---

## Ejemplo Completo: Crear y Usar el Agente

```bash
# 1. Crear el archivo
cat > k8s/kagent/music-store-agent.yaml << 'EOF'
# Pegar el YAML completo aquí
EOF

# 2. Aplicar
kubectl apply -f k8s/kagent/music-store-agent.yaml

# 3. Esperar a que esté ready
kubectl wait --for=condition=Ready agent/music-store-agent -n default --timeout=60s

# 4. Verificar
kagent get agent -n default | grep music-store

# 5. Usar
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Give me a complete health report of the Music Store application" \
  --stream

# 6. Test de scaling
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Scale music-store to 5 replicas and monitor the rollout" \
  --stream

# 7. Test de troubleshooting
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Are there any errors or warnings in the music-store pods?" \
  --stream
```

---

## Recursos Adicionales

### Documentación Oficial
- [Kagent Docs](https://kagent.dev/docs)
- [Agent API Reference](https://kagent.dev/docs/api/agent)
- [Skills Configuration](https://kagent.dev/docs/skills)

### Ejemplos de Agentes
- [k8s-agent](https://github.com/kagent-dev/kagent/tree/main/examples/k8s-agent)
- [observability-agent](https://github.com/kagent-dev/kagent/tree/main/examples/observability-agent)

### Tools Disponibles
- `k8s_get_resources` - Listar recursos
- `k8s_describe_resource` - Describir recursos
- `k8s_get_pod_logs` - Ver logs de pods
- `k8s_get_events` - Ver eventos
- `k8s_patch_resource` - Modificar recursos
- `k8s_check_service_connectivity` - Verificar conectividad
- `k8s_get_resource_yaml` - Obtener YAML de recursos
- `k8s_execute_command` - Ejecutar comandos en pods

---

## Conclusión

Has aprendido a:
- ✅ Crear un agente personalizado de Kagent
- ✅ Configurar systemMessage y skills
- ✅ Aplicar y verificar el agente
- ✅ Usar el agente para operaciones
- ✅ Troubleshootear problemas comunes

**Próximos pasos:**
1. Personaliza el systemMessage para tu caso de uso
2. Agrega skills específicos que necesites
3. Prueba el agente con casos reales
4. Itera y mejora basado en el uso

**¡Tu agente de Music Store está listo!** 🎉
