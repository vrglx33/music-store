# 🔌 Kagent MCP (Model Context Protocol) - Exploración Completa

## 🎯 ¿Qué es MCP en Kagent?

**MCP (Model Context Protocol)** es el protocolo que permite a los agentes de Kagent interactuar con Kubernetes y otras herramientas. Es la capa que conecta los LLMs con las acciones reales en el cluster.

```
┌─────────────────────────────────────────────────────────┐
│                    ARQUITECTURA MCP                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐         ┌──────────┐         ┌────────┐ │
│  │  Agent   │ ──────> │   MCP    │ ──────> │  K8s   │ │
│  │ (LLM)    │ <────── │  Server  │ <────── │  API   │ │
│  └──────────┘         └──────────┘         └────────┘ │
│       │                     │                    │     │
│   Razona              Traduce              Ejecuta     │
│   Decide              Valida               Responde    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 MCP Servers en Kagent

### Servers Disponibles

```bash
kubectl get remotemcpserver -n default
```

**Resultado:**
```
NAME                 PROTOCOL          URL
kagent-tool-server   STREAMABLE_HTTP   http://kagent-tools.default:8084/mcp
kagent-grafana-mcp   STREAMABLE_HTTP   http://kagent-grafana-mcp.default:8000/mcp
```

### 1. kagent-tool-server

**Descripción:** Servidor principal de herramientas de Kagent  
**Puerto:** 8084  
**Protocolo:** STREAMABLE_HTTP  
**Tools disponibles:** 106 herramientas

**Categorías de tools:**
- Kubernetes (k8s_*)
- Helm (helm_*)
- Cilium (cilium_*)
- Istio (istio_*)
- Argo Rollouts (argo_*)
- Prometheus (prometheus_*)
- Utilidades (datetime, shell)

### 2. kagent-grafana-mcp

**Descripción:** Servidor MCP para Grafana  
**Puerto:** 8000  
**Protocolo:** STREAMABLE_HTTP  
**Función:** Integración con Grafana para observabilidad

---

## 🛠️ Tools Disponibles (106 total)

### Kubernetes Tools (k8s_*) - 20 tools

| Tool | Descripción |
|------|-------------|
| `k8s_get_resources` | Listar recursos (pods, deployments, etc.) |
| `k8s_describe_resource` | Obtener detalles de un recurso |
| `k8s_get_pod_logs` | Ver logs de pods |
| `k8s_get_events` | Ver eventos del cluster |
| `k8s_create_resource` | Crear recursos |
| `k8s_delete_resource` | Eliminar recursos |
| `k8s_patch_resource` | Modificar recursos |
| `k8s_scale` | Escalar deployments |
| `k8s_rollout` | Gestionar rollouts |
| `k8s_apply_manifest` | Aplicar manifiestos YAML |
| `k8s_annotate_resource` | Agregar anotaciones |
| `k8s_label_resource` | Agregar labels |
| `k8s_remove_annotation` | Quitar anotaciones |
| `k8s_remove_label` | Quitar labels |
| `k8s_execute_command` | Ejecutar comandos en pods |
| `k8s_check_service_connectivity` | Verificar conectividad |
| `k8s_get_resource_yaml` | Obtener YAML de recursos |
| `k8s_generate_resource` | Generar recursos |
| `k8s_create_resource_from_url` | Crear desde URL |
| `k8s_get_available_api_resources` | Listar APIs disponibles |
| `k8s_get_cluster_configuration` | Ver configuración del cluster |

### Helm Tools (helm_*) - 6 tools

| Tool | Descripción |
|------|-------------|
| `helm_list_releases` | Listar releases |
| `helm_get_release` | Obtener detalles de release |
| `helm_upgrade` | Actualizar release |
| `helm_uninstall` | Desinstalar release |
| `helm_repo_add` | Agregar repositorio |
| `helm_repo_update` | Actualizar repositorios |

### Cilium Tools (cilium_*) - 59 tools

**Categorías:**
- **Gestión de Endpoints:** 8 tools
- **Políticas de Red:** 5 tools
- **Cluster Mesh:** 4 tools
- **Observabilidad:** 12 tools
- **BGP:** 2 tools
- **Servicios:** 4 tools
- **Configuración:** 8 tools
- **Instalación:** 4 tools
- **Debugging:** 12 tools

**Ejemplos clave:**
- `cilium_status_and_version` - Estado de Cilium
- `cilium_get_daemon_status` - Estado del daemon
- `cilium_get_endpoints_list` - Listar endpoints
- `cilium_show_cluster_mesh_status` - Estado de cluster mesh
- `cilium_install_cilium` - Instalar Cilium
- `cilium_validate_cilium_network_policies` - Validar políticas

### Istio Tools (istio_*) - 12 tools

| Tool | Descripción |
|------|-------------|
| `istio_version` | Versión de Istio |
| `istio_proxy_status` | Estado de proxies |
| `istio_proxy_config` | Configuración de proxies |
| `istio_install_istio` | Instalar Istio |
| `istio_generate_manifest` | Generar manifiestos |
| `istio_analyze_cluster_configuration` | Analizar configuración |
| `istio_list_waypoints` | Listar waypoints |
| `istio_generate_waypoint` | Generar waypoint |
| `istio_apply_waypoint` | Aplicar waypoint |
| `istio_delete_waypoint` | Eliminar waypoint |
| `istio_waypoint_status` | Estado de waypoints |
| `istio_ztunnel_config` | Configuración ztunnel |
| `istio_remote_clusters` | Clusters remotos |

### Argo Rollouts Tools (argo_*) - 8 tools

| Tool | Descripción |
|------|-------------|
| `argo_rollouts_list` | Listar rollouts |
| `argo_pause_rollout` | Pausar rollout |
| `argo_promote_rollout` | Promover rollout |
| `argo_set_rollout_image` | Cambiar imagen |
| `argo_check_plugin_logs` | Ver logs del plugin |
| `argo_verify_argo_rollouts_controller_install` | Verificar controller |
| `argo_verify_kubectl_plugin_install` | Verificar plugin kubectl |
| `argo_verify_gateway_plugin` | Verificar gateway plugin |

### Prometheus Tools (prometheus_*) - 5 tools

| Tool | Descripción |
|------|-------------|
| `prometheus_query_tool` | Ejecutar query PromQL |
| `prometheus_query_range_tool` | Query con rango de tiempo |
| `prometheus_promql_tool` | Herramienta PromQL |
| `prometheus_label_names_tool` | Nombres de labels |
| `prometheus_targets_tool` | Ver targets |

### Utilidades - 2 tools

| Tool | Descripción |
|------|-------------|
| `datetime_get_current_time` | Obtener fecha/hora actual |
| `shell` | Ejecutar comandos shell |

---

## 🎯 Cómo los Agentes Usan MCP

### Ejemplo 1: k8s-agent usando tools

Cuando ejecutas:
```bash
kagent invoke --agent "k8s-agent" --task "List all pods in music-store"
```

**Proceso interno:**
1. **LLM recibe la tarea:** "List all pods in music-store"
2. **LLM decide usar:** `k8s_get_resources`
3. **MCP Server ejecuta:**
   ```json
   {
     "tool": "k8s_get_resources",
     "args": {
       "resource_type": "pod",
       "namespace": "music-store"
     }
   }
   ```
4. **MCP Server llama:** `kubectl get pods -n music-store`
5. **Resultado regresa:** Al LLM
6. **LLM formatea:** Respuesta en lenguaje natural

### Ejemplo 2: helm-agent usando tools

```bash
kagent invoke --agent "helm-agent" --task "List helm releases"
```

**Proceso:**
1. LLM → `helm_list_releases`
2. MCP → `helm list -A`
3. Resultado → LLM → Respuesta formateada

---

## 🔍 Explorar MCP Tools

### Ver todos los tools disponibles

```bash
# Listar tools del servidor principal
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[*].name}' | tr ' ' '\n' | sort

# Ver detalles de un tool específico
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[?(@.name=="k8s_get_resources")]}' | jq
```

### Ver descripción de tools

```bash
# Ver todas las descripciones
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{range .status.discoveredTools[*]}{.name}{"\t"}{.description}{"\n"}{end}'
```

### Contar tools por categoría

```bash
# Kubernetes tools
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[*].name}' | tr ' ' '\n' | grep "^k8s_" | wc -l

# Cilium tools
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[*].name}' | tr ' ' '\n' | grep "^cilium_" | wc -l

# Helm tools
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[*].name}' | tr ' ' '\n' | grep "^helm_" | wc -l
```

---

## 🤖 Cómo los Agentes Seleccionan Tools

### Configuración de Tools en un Agente

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: k8s-agent
spec:
  declarative:
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
            - k8s_scale
            # ... más tools
```

**El agente solo puede usar los tools que tiene configurados.**

### Ejemplo: music-store-agent

```bash
# Ver tools configurados
kubectl get agent music-store-agent -n default \
  -o jsonpath='{.spec.declarative.tools[0].mcpServer.toolNames}' | jq
```

---

## 💡 Casos de Uso de MCP

### 1. Operaciones Kubernetes

**Tools usados:**
- `k8s_get_resources` - Listar recursos
- `k8s_scale` - Escalar
- `k8s_get_pod_logs` - Ver logs
- `k8s_get_events` - Ver eventos

**Ejemplo:**
```bash
kagent invoke --agent k8s-agent \
  --task "Scale music-store to 5 replicas and show me the logs"
```

### 2. Gestión de Helm

**Tools usados:**
- `helm_list_releases` - Listar
- `helm_upgrade` - Actualizar
- `helm_get_release` - Detalles

**Ejemplo:**
```bash
kagent invoke --agent helm-agent \
  --task "Upgrade PostgreSQL to version 18.2.0"
```

### 3. Troubleshooting con Cilium

**Tools usados:**
- `cilium_status_and_version` - Estado
- `cilium_get_endpoints_list` - Endpoints
- `cilium_validate_cilium_network_policies` - Validar políticas

**Ejemplo:**
```bash
kagent invoke --agent cilium-debug-agent \
  --task "Check if there are any network policy issues"
```

### 4. Observabilidad con Prometheus

**Tools usados:**
- `prometheus_query_tool` - Queries
- `prometheus_targets_tool` - Targets

**Ejemplo:**
```bash
kagent invoke --agent observability-agent \
  --task "Show me CPU usage for music-store pods"
```

---

## 🔧 Crear un Agente con Tools Específicos

### Ejemplo: Agente de Monitoreo

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: monitoring-agent
  namespace: default
spec:
  declarative:
    systemMessage: |
      You are a monitoring specialist for Kubernetes.
      You help with observability, metrics, and alerting.
    
    modelConfig: default-model-config
    
    tools:
      - mcpServer:
          apiGroup: kagent.dev
          kind: RemoteMCPServer
          name: kagent-tool-server
          toolNames:
            # Kubernetes tools
            - k8s_get_resources
            - k8s_describe_resource
            - k8s_get_pod_logs
            - k8s_get_events
            
            # Prometheus tools
            - prometheus_query_tool
            - prometheus_query_range_tool
            - prometheus_targets_tool
            
            # Utilidades
            - datetime_get_current_time
    
    deployment:
      replicas: 1
```

---

## 📊 Estadísticas de MCP

### Tools por Categoría

| Categoría | Cantidad | Porcentaje |
|-----------|----------|------------|
| Cilium | 59 | 55.7% |
| Kubernetes | 20 | 18.9% |
| Istio | 12 | 11.3% |
| Argo Rollouts | 8 | 7.5% |
| Helm | 6 | 5.7% |
| Prometheus | 5 | 4.7% |
| Utilidades | 2 | 1.9% |
| **TOTAL** | **106** | **100%** |

### MCP Servers

- **Total servers:** 2
- **Protocol:** STREAMABLE_HTTP
- **Tools totales:** 106+
- **Agentes usando MCP:** 11

---

## 🎯 Beneficios de MCP

### 1. Abstracción
- Los agentes no necesitan saber kubectl
- El LLM solo decide QUÉ hacer
- MCP traduce a comandos reales

### 2. Seguridad
- Tools específicos por agente
- Validación en MCP Server
- No acceso directo a kubectl

### 3. Extensibilidad
- Fácil agregar nuevos tools
- Múltiples MCP servers
- Integración con cualquier API

### 4. Consistencia
- Mismos tools para todos los agentes
- Respuestas estructuradas
- Error handling centralizado

---

## 🚀 Agregar al Workshop

### Nueva Demo: Explorar MCP

**Duración:** 5 minutos

**Comandos:**

```bash
# 1. Ver MCP servers disponibles
kubectl get remotemcpserver -n default

# 2. Ver todos los tools
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[*].name}' | tr ' ' '\n' | wc -l

# 3. Ver tools de Kubernetes
kubectl get remotemcpserver kagent-tool-server -n default \
  -o jsonpath='{.status.discoveredTools[*].name}' | tr ' ' '\n' | grep "^k8s_"

# 4. Ver tools configurados en un agente
kubectl get agent k8s-agent -n default \
  -o jsonpath='{.spec.declarative.tools[0].mcpServer.toolNames}'
```

**Narrativa:**
> "MCP es la magia detrás de Kagent. Es el protocolo que permite a los agentes interactuar con Kubernetes. Tenemos 106 tools disponibles organizados en categorías: Kubernetes, Helm, Cilium, Istio, Argo Rollouts, y Prometheus. Cada agente solo puede usar los tools que tiene configurados, lo que garantiza seguridad y especialización."

---

## 📚 Recursos

### Documentación
- **MCP Spec:** https://modelcontextprotocol.io/
- **Kagent MCP:** https://kagent.dev/docs/mcp

### Comandos Útiles

```bash
# Listar MCP servers
kubectl get remotemcpserver -A

# Ver detalles de un server
kubectl describe remotemcpserver kagent-tool-server -n default

# Ver tools de un agente
kubectl get agent <agent-name> -n default -o yaml | grep -A 20 tools

# Ver logs del MCP server
kubectl logs -n default deployment/kagent-tools -f
```

---

**Última actualización:** 12 de noviembre de 2025, 1:00 AM  
**Tools documentados:** 106  
**MCP Servers:** 2  
**Estado:** ✅ Exploración completada
