# 🤖 Guía para Crear Agentes Personalizados en Kagent

## 📚 Tabla de Contenidos
1. [Conceptos Básicos](#conceptos-básicos)
2. [Métodos de Creación](#métodos-de-creación)
3. [Anatomía de un Agente](#anatomía-de-un-agente)
4. [Ejemplos Prácticos](#ejemplos-prácticos)
5. [Best Practices](#best-practices)

---

## 🎯 Conceptos Básicos

### ¿Qué es un Agente en Kagent?

Un **agente** en Kagent es una entidad de IA que:
- Entiende lenguaje natural
- Tiene acceso a **herramientas (tools)** específicas
- Sigue **instrucciones (system prompt)** que definen su comportamiento
- Puede interactuar con Kubernetes y otros sistemas

### Componentes de un Agente

```
┌─────────────────────────────────────┐
│          AGENTE KAGENT              │
├─────────────────────────────────────┤
│ 1. Nombre e Identificación          │
│ 2. System Prompt (Instrucciones)    │
│ 3. Tools (Herramientas)             │
│ 4. Model Config (LLM a usar)        │
│ 5. Skills (Capacidades)             │
│ 6. Deployment Config                │
└─────────────────────────────────────┘
```

---

## 🛠️ Métodos de Creación

### Método 1: Dashboard UI (Más Fácil)

```bash
# Abrir el dashboard de Kagent
kagent dashboard
```

**Pasos en el UI:**
1. Click en **"+ Create" → "New Agent"**
2. Llenar el formulario:
   - **Agent Name**: Nombre único
   - **Namespace**: Donde vivirá el agente
   - **Description**: Qué hace el agente
   - **Instructions**: System prompt
   - **Model**: Modelo LLM a usar
3. **Add Tools**: Seleccionar herramientas
4. Click **"Create Agent"**

### Método 2: YAML (Más Flexible)

Crear un archivo YAML con la definición del agente y aplicarlo con kubectl.

```bash
kubectl apply -f my-custom-agent.yaml
```

---

## 📋 Anatomía de un Agente (YAML)

### Estructura Básica

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: my-custom-agent
  namespace: default
  labels:
    app: my-app
    team: platform
spec:
  declarative:
    # System prompt - Las instrucciones del agente
    systemMessage: |
      You are a helpful agent that...
      
    # Configuración del modelo LLM
    modelConfig: default-model-config
    
    # Herramientas que puede usar
    tools:
      - mcpServer:
          apiGroup: kagent.dev
          kind: RemoteMCPServer
          name: kagent-tool-server
          toolNames:
            - k8s_get_resources
            - k8s_describe_resource
      type: McpServer
    
    # Configuración de deployment
    deployment:
      replicas: 1
      resources:
        requests:
          cpu: 100m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi
    
    # Skills (capacidades) del agente
    a2aConfig:
      skills:
        - id: my-skill
          name: My Skill
          description: What this skill does
          examples:
            - "Example question 1"
            - "Example question 2"
          tags:
            - tag1
            - tag2
```

---

## 🎨 Ejemplos Prácticos

### Ejemplo 1: Agente para Music Store Platform

Vamos a crear un agente especializado en nuestra aplicación Music Store.

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: music-store-agent
  namespace: default
  labels:
    app: music-store-platform
    type: application-agent
spec:
  declarative:
    systemMessage: |
      # Music Store Platform Agent
      
      You are a specialized AI agent for the Music Store Platform application.
      Your role is to help operators manage, monitor, and troubleshoot the 
      Music Store application running on Kubernetes.
      
      ## Your Responsibilities
      
      1. **Application Health**: Monitor the health of music-store-platform pods
      2. **Database Management**: Check PostgreSQL status and connectivity
      3. **Scaling**: Help scale the application based on load
      4. **Troubleshooting**: Diagnose issues with the application
      5. **Deployment**: Assist with deployments and rollbacks
      
      ## Guidelines
      
      - Always check the music-store namespace first
      - Verify database connectivity before scaling
      - Provide clear explanations of what you're doing
      - If unsure, ask for clarification
      - Format responses in Markdown
      
      ## Key Resources
      
      - Deployment: music-store-platform
      - Service: music-store-service
      - Database: music-store-db-postgresql
      - Namespace: music-store
      
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
          description: Check the health and status of the Music Store application
          examples:
            - "Is the Music Store app healthy?"
            - "Check the status of music-store pods"
            - "Are all replicas running?"
          tags:
            - health
            - monitoring
            - status
        
        - id: app-scaling
          name: Application Scaling
          description: Scale the Music Store application up or down
          examples:
            - "Scale music-store to 5 replicas"
            - "How many replicas are running?"
            - "Increase capacity for music-store"
          tags:
            - scaling
            - capacity
            - performance
        
        - id: app-troubleshooting
          name: Application Troubleshooting
          description: Diagnose and fix issues with the Music Store app
          examples:
            - "Why is music-store failing?"
            - "Show me logs for music-store pods"
            - "What errors are happening?"
          tags:
            - troubleshooting
            - debugging
            - logs
        
        - id: database-management
          name: Database Management
          description: Manage and monitor the PostgreSQL database
          examples:
            - "Is the database connected?"
            - "Check PostgreSQL status"
            - "Show database pod logs"
          tags:
            - database
            - postgresql
            - connectivity
```

### Aplicar el Agente

```bash
# Guardar el YAML en un archivo
cat > music-store-agent.yaml << 'EOF'
[YAML del ejemplo anterior]
EOF

# Aplicar el agente
kubectl apply -f music-store-agent.yaml

# Verificar que se creó
kagent get agent music-store-agent -n default

# Esperar a que esté listo
kubectl wait --for=condition=Ready agent/music-store-agent -n default --timeout=60s
```

### Probar el Agente

```bash
# Usar el agente personalizado
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Check the health of the Music Store application" \
  --stream

# Escalar con el agente
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Scale music-store to 5 replicas" \
  --stream

# Troubleshooting
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Show me the logs of any failing music-store pods" \
  --stream
```

---

### Ejemplo 2: Agente de Seguridad

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: security-audit-agent
  namespace: default
spec:
  declarative:
    systemMessage: |
      # Security Audit Agent
      
      You are a Kubernetes security expert focused on auditing and 
      improving cluster security posture.
      
      ## Your Mission
      
      1. Audit RBAC configurations
      2. Check for security vulnerabilities
      3. Verify network policies
      4. Review pod security standards
      5. Identify exposed services
      
      ## Security Principles
      
      - Principle of least privilege
      - Defense in depth
      - Zero trust networking
      - Secure by default
      
      ## Response Format
      
      Always structure your findings as:
      1. **Severity**: Critical/High/Medium/Low
      2. **Finding**: What you discovered
      3. **Impact**: Potential security impact
      4. **Recommendation**: How to fix it
      
    modelConfig: default-model-config
    
    tools:
      - mcpServer:
          apiGroup: kagent.dev
          kind: RemoteMCPServer
          name: kagent-tool-server
          toolNames:
            - k8s_get_resources
            - k8s_describe_resource
            - k8s_get_resource_yaml
            - k8s_get_available_api_resources
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
        - id: rbac-audit
          name: RBAC Audit
          description: Audit Role-Based Access Control configurations
          examples:
            - "Audit RBAC in music-store namespace"
            - "Check for overly permissive roles"
            - "List all cluster-admin users"
          tags:
            - security
            - rbac
            - audit
        
        - id: network-policy-check
          name: Network Policy Check
          description: Verify network policies are properly configured
          examples:
            - "Check network policies in music-store"
            - "Are pods properly isolated?"
            - "Show me all network policies"
          tags:
            - security
            - networking
            - isolation
```

---

### Ejemplo 3: Agente de Costos

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: cost-optimization-agent
  namespace: default
spec:
  declarative:
    systemMessage: |
      # Cost Optimization Agent
      
      You are a FinOps expert focused on optimizing Kubernetes costs.
      
      ## Your Goals
      
      1. Identify over-provisioned resources
      2. Find unused resources
      3. Recommend right-sizing
      4. Suggest cost-saving opportunities
      
      ## Analysis Framework
      
      - Compare requests vs actual usage
      - Identify idle resources
      - Calculate potential savings
      - Prioritize recommendations by impact
      
    modelConfig: default-model-config
    
    tools:
      - mcpServer:
          apiGroup: kagent.dev
          kind: RemoteMCPServer
          name: kagent-tool-server
          toolNames:
            - k8s_get_resources
            - k8s_describe_resource
            - k8s_get_resource_yaml
        type: McpServer
    
    deployment:
      replicas: 1
    
    a2aConfig:
      skills:
        - id: resource-analysis
          name: Resource Analysis
          description: Analyze resource usage and identify optimization opportunities
          examples:
            - "Analyze resource usage in music-store"
            - "Find over-provisioned pods"
            - "What can we optimize to save costs?"
          tags:
            - cost
            - optimization
            - finops
```

---

## 🎯 Best Practices

### 1. System Prompt Design

**✅ DO:**
```yaml
systemMessage: |
  # Clear Role Definition
  You are a [specific role] that [specific purpose].
  
  ## Responsibilities
  - Bullet point 1
  - Bullet point 2
  
  ## Guidelines
  - How to behave
  - What to prioritize
  
  ## Response Format
  - How to structure responses
```

**❌ DON'T:**
```yaml
systemMessage: "You are a helpful agent."  # Too vague!
```

### 2. Tool Selection

**Principio:** Solo incluye las herramientas que el agente realmente necesita.

```yaml
# ✅ Específico para el caso de uso
tools:
  - mcpServer:
      toolNames:
        - k8s_get_resources      # Para listar
        - k8s_describe_resource  # Para detalles
        - k8s_get_pod_logs       # Para logs

# ❌ Demasiado permisivo
tools:
  - mcpServer:
      toolNames:
        - k8s_*  # ¡Todas las herramientas!
```

### 3. Skills Definition

**✅ Buenos ejemplos:**
```yaml
skills:
  - id: clear-id
    name: Clear Name
    description: Specific description of what it does
    examples:
      - "Concrete example 1"
      - "Concrete example 2"
      - "Concrete example 3"
    tags:
      - relevant-tag1
      - relevant-tag2
```

### 4. Resource Limits

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

### 5. Naming Conventions

```yaml
metadata:
  name: app-name-agent  # Descriptivo y único
  namespace: default    # O namespace específico
  labels:
    app: app-name
    type: custom-agent
    team: platform-team
```

---

## 🔧 Comandos Útiles

### Gestión de Agentes

```bash
# Listar todos los agentes
kagent get agent -n default

# Ver detalles de un agente
kubectl describe agent music-store-agent -n default

# Ver el YAML completo
kubectl get agent music-store-agent -n default -o yaml

# Editar un agente
kubectl edit agent music-store-agent -n default

# Eliminar un agente
kubectl delete agent music-store-agent -n default

# Ver logs del agente
kubectl logs -n default deployment/music-store-agent
```

### Testing

```bash
# Invocar el agente
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Your question here" \
  --stream

# Ver el estado del agente
kubectl get agent music-store-agent -n default -o jsonpath='{.status.conditions}'

# Verificar que el pod está corriendo
kubectl get pods -n default | grep music-store-agent
```

### Debugging

```bash
# Ver eventos del agente
kubectl get events -n default --field-selector involvedObject.name=music-store-agent

# Ver logs detallados
kubectl logs -n default deployment/music-store-agent --tail=100 -f

# Verificar herramientas disponibles
kubectl get remotemcpserver -n default
```

---

## 📊 Workflow Completo: Crear un Agente Custom

```bash
# 1. Crear el YAML del agente
cat > my-agent.yaml << 'EOF'
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: my-agent
  namespace: default
spec:
  declarative:
    systemMessage: |
      Your instructions here...
    modelConfig: default-model-config
    tools:
      - mcpServer:
          apiGroup: kagent.dev
          kind: RemoteMCPServer
          name: kagent-tool-server
          toolNames:
            - k8s_get_resources
        type: McpServer
    deployment:
      replicas: 1
EOF

# 2. Aplicar el agente
kubectl apply -f my-agent.yaml

# 3. Esperar a que esté listo
kubectl wait --for=condition=Ready agent/my-agent -n default --timeout=60s

# 4. Verificar que está corriendo
kagent get agent my-agent -n default

# 5. Probar el agente
kagent invoke --agent "my-agent" --namespace default \
  --task "Test question" \
  --stream

# 6. Ver logs si hay problemas
kubectl logs -n default deployment/my-agent --tail=50
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial
- [Creating Your First Agent](https://kagent.dev/docs/kagent/getting-started/first-agent)
- [Agent Examples](https://kagent.dev/agents)
- [Available Tools](https://kagent.dev/tools)
- [Core Concepts](https://kagent.dev/docs/kagent/concepts)

### Ejemplos de Agentes
- [k8s-agent](https://kagent.dev/agents/k8s-agent) - Kubernetes operations
- [helm-agent](https://kagent.dev/agents/helm-agent) - Helm management
- [observability-agent](https://kagent.dev/agents/observability-agent) - Monitoring

### Comunidad
- [Discord](https://discord.gg/Fu3k65f2k3)
- [GitHub](https://github.com/kagent-dev/kagent)
- [GitHub Issues](https://github.com/kagent-dev/kagent/issues)

---

## 💡 Ideas de Agentes Personalizados

1. **CI/CD Agent** - Gestionar pipelines y deployments
2. **Backup Agent** - Automatizar backups de bases de datos
3. **Compliance Agent** - Verificar compliance y políticas
4. **Performance Agent** - Analizar y optimizar performance
5. **Migration Agent** - Ayudar con migraciones de aplicaciones
6. **Documentation Agent** - Generar documentación automática
7. **Incident Response Agent** - Responder a incidentes
8. **Capacity Planning Agent** - Planear capacidad futura

---

**¡Ahora estás listo para crear tus propios agentes personalizados en Kagent!** 🚀
