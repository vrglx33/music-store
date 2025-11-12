# 🚀 Kagent - Guía Rápida de Instalación

## ⚡ Instalación en 5 Minutos

### Requisitos Previos

- ✅ Kubernetes cluster (v1.24+)
- ✅ kubectl configurado
- ✅ API Key de un proveedor LLM (OpenAI, Anthropic, Azure, u Ollama local)

---

## 📥 Paso 1: Descargar Kagent CLI

### macOS

```bash
# Apple Silicon (M1/M2/M3)
curl -L https://github.com/kagent-dev/kagent/releases/latest/download/kagent-darwin-arm64 -o kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/

# Intel
curl -L https://github.com/kagent-dev/kagent/releases/latest/download/kagent-darwin-amd64 -o kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/
```

### Linux

```bash
curl -L https://github.com/kagent-dev/kagent/releases/latest/download/kagent-linux-amd64 -o kagent
chmod +x kagent
sudo mv kagent /usr/local/bin/
```

### Windows

```powershell
# Descargar desde GitHub Releases
# https://github.com/kagent-dev/kagent/releases/latest
# Agregar al PATH
```

### Verificar Instalación

```bash
kagent version
# Salida esperada: v0.7.x o superior
```

---

## 🔑 Paso 2: Configurar API Key

Kagent soporta múltiples proveedores LLM. Elige uno:

### Opción 1: OpenAI (Recomendado)

```bash
export OPENAI_API_KEY="sk-..."
```

**Obtener API Key:**
1. Ir a https://platform.openai.com/api-keys
2. Crear nueva API key
3. Copiar y exportar

**Modelos recomendados:**
- `gpt-4o` (mejor calidad)
- `gpt-4o-mini` (más rápido y económico)
- `gpt-3.5-turbo` (económico)

### Opción 2: Anthropic Claude

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

**Obtener API Key:**
1. Ir a https://console.anthropic.com/
2. Settings → API Keys
3. Create Key

**Modelos recomendados:**
- `claude-3-5-sonnet` (mejor calidad)
- `claude-3-haiku` (rápido y económico)

### Opción 3: Azure OpenAI

```bash
export AZURE_OPENAI_API_KEY="..."
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
export AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"
```

### Opción 4: Ollama (Local, Gratis)

```bash
# 1. Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Descargar modelo
ollama pull llama3.1

# 3. Iniciar Ollama
ollama serve

# 4. No requiere API key
# Kagent detectará Ollama automáticamente en localhost:11434
```

### Opción 5: OpenRouter (Múltiples Modelos)

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
```

**Obtener API Key:**
1. Ir a https://openrouter.ai/
2. Sign up (gratis)
3. Keys → Create Key

**Ventaja:** Acceso a múltiples modelos (GPT-4, Claude, Llama, etc.) con una sola API key

---

## 🎯 Paso 3: Instalar Kagent en Kubernetes

### Instalación Básica

```bash
# Instalar con configuración por defecto
kagent install
```

**Esto despliega:**
- Kagent controller
- CRDs (Custom Resource Definitions)
- Agentes pre-configurados:
  - `k8s-agent` - Operaciones de Kubernetes
  - `helm-agent` - Gestión de Helm
  - `observability-agent` - Monitoreo
  - `promql-agent` - Queries de Prometheus
- MCP servers (Model Context Protocol)
- Kagent UI (opcional)

### Instalación Personalizada

```bash
# Especificar proveedor LLM
kagent install --model-provider openai

# Especificar modelo
kagent install --model gpt-4o

# Habilitar UI
kagent install --enable-ui

# Instalar en namespace específico
kagent install --namespace kagent-system

# Configurar recursos
kagent install --set agents.resources.requests.memory=512Mi

# Instalar solo agentes específicos
kagent install --agents k8s-agent,helm-agent

# Instalación completa personalizada
kagent install \
  --model-provider openai \
  --model gpt-4o \
  --namespace kagent-system \
  --enable-ui \
  --enable-metrics \
  --set agents.replicas=2
```

### Proceso de Instalación

```
🚀 Installing Kagent...
   ✓ Checking Kubernetes connection
   ✓ Validating API key
   ✓ Creating namespace: default
   ✓ Installing CRDs
   ✓ Deploying Kagent controller
   ✓ Creating default model config
   ✓ Installing agents:
      • k8s-agent
      • helm-agent
      • observability-agent
      • promql-agent
   ✓ Deploying MCP servers
   ✓ Installing Kagent UI
   ✓ Waiting for pods to be ready...

✅ Kagent installed successfully!

Resources created:
  • Namespace: default
  • Agents: 4
  • MCP Servers: 1
  • UI: enabled

Next steps:
  1. Verify: kagent get agent
  2. Try: kagent invoke --agent k8s-agent --task "list pods"
  3. UI: kubectl port-forward -n default svc/kagent-ui 3000:3000
```

---

## ✅ Paso 4: Verificar Instalación

### Ver Agentes Disponibles

```bash
kagent get agent -n default
```

**Salida esperada:**
```
+----+----------------------------------------+---------------------------+------------------+----------+
| #  | NAME                                   | CREATED                   | DEPLOYMENT_READY | ACCEPTED |
+----+----------------------------------------+---------------------------+------------------+----------+
| 1  | default/k8s-agent                      | 2025-11-12T00:00:00-05:00 | true             | true     |
| 2  | default/helm-agent                     | 2025-11-12T00:00:00-05:00 | true             | true     |
| 3  | default/observability-agent            | 2025-11-12T00:00:00-05:00 | true             | true     |
| 4  | default/promql-agent                   | 2025-11-12T00:00:00-05:00 | true             | true     |
+----+----------------------------------------+---------------------------+------------------+----------+
```

### Ver Pods de Kagent

```bash
kubectl get pods -n default | grep agent
```

**Salida esperada:**
```
k8s-agent-xxx                       1/1     Running   0          2m
helm-agent-xxx                      1/1     Running   0          2m
observability-agent-xxx             1/1     Running   0          2m
promql-agent-xxx                    1/1     Running   0          2m
kagent-controller-xxx               1/1     Running   0          2m
kagent-ui-xxx                       1/1     Running   0          2m
```

### Probar Primer Comando

```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "List all pods in the default namespace" \
  --stream
```

**Salida esperada:**
```json
{
  "artifact": {
    "parts": [{
      "kind": "text",
      "text": "Here are all the pods in the default namespace:\n\n1. k8s-agent-xxx - Running (1/1)\n2. helm-agent-xxx - Running (1/1)\n..."
    }]
  }
}
```

---

## 🎨 Paso 5: Acceder a la UI (Opcional)

```bash
# Port-forward al servicio de UI
kubectl port-forward -n default svc/kagent-ui 3000:3000
```

Abrir en navegador: http://localhost:3000

**Funcionalidades de la UI:**
- Chat interactivo con agentes
- Visualización de agentes disponibles
- Historial de conversaciones
- Creación de agentes personalizados
- Monitoreo de uso

---

## 🔧 Configuración Avanzada

### Configurar Modelo por Defecto

```bash
# Crear configuración de modelo
cat <<EOF | kubectl apply -f -
apiVersion: kagent.dev/v1alpha2
kind: ModelConfig
metadata:
  name: default-model-config
  namespace: default
spec:
  provider: openai
  model: gpt-4o
  temperature: 0.7
  maxTokens: 4096
EOF
```

### Configurar Recursos para Agentes

```bash
# Editar deployment del agente
kubectl edit deployment k8s-agent -n default

# Agregar recursos:
spec:
  template:
    spec:
      containers:
      - name: agent
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Habilitar Métricas

```bash
# Instalar con métricas
kagent install --enable-metrics

# Ver métricas
kubectl port-forward -n default svc/kagent-metrics 9090:9090
```

---

## 🐛 Troubleshooting

### Problema: Agentes no se crean

```bash
# Ver logs del controller
kubectl logs -n default deployment/kagent-controller

# Verificar CRDs
kubectl get crd | grep kagent

# Verificar API key
kubectl get secret -n default kagent-api-key -o yaml
```

### Problema: API Key no funciona

```bash
# Verificar que la variable esté exportada
echo $OPENAI_API_KEY

# Reinstalar con la API key correcta
kagent uninstall
export OPENAI_API_KEY="sk-..."
kagent install
```

### Problema: Pods no inician

```bash
# Ver eventos
kubectl get events -n default --sort-by='.lastTimestamp'

# Ver logs del pod
kubectl logs -n default <pod-name>

# Verificar recursos
kubectl describe pod -n default <pod-name>
```

### Problema: Timeout en respuestas

```bash
# Aumentar timeout
kagent invoke --agent k8s-agent \
  --task "..." \
  --timeout 60s
```

---

## 🗑️ Desinstalar Kagent

```bash
# Desinstalar completamente
kagent uninstall

# Desinstalar y eliminar CRDs
kagent uninstall --purge

# Desinstalar de namespace específico
kagent uninstall --namespace kagent-system
```

---

## 📚 Comandos Útiles

### Gestión de Agentes

```bash
# Listar agentes
kagent get agent

# Ver detalles de un agente
kagent get agent k8s-agent -n default -o yaml

# Eliminar agente
kagent delete agent <agent-name> -n default

# Reiniciar agente
kubectl rollout restart deployment/<agent-name> -n default
```

### Invocar Agentes

```bash
# Comando básico
kagent invoke --agent k8s-agent --task "list pods"

# Con namespace específico
kagent invoke --agent k8s-agent --namespace default --task "..."

# Con streaming
kagent invoke --agent k8s-agent --task "..." --stream

# Con timeout
kagent invoke --agent k8s-agent --task "..." --timeout 30s
```

### Logs y Debug

```bash
# Ver logs de un agente
kubectl logs -n default deployment/k8s-agent -f

# Ver logs del controller
kubectl logs -n default deployment/kagent-controller -f

# Ver eventos
kubectl get events -n default
```

---

## 🎯 Próximos Pasos

1. ✅ Kagent instalado
2. ⏭️ Probar agentes pre-instalados
3. ⏭️ Crear tu primer agente personalizado
4. ⏭️ Integrar con tu CI/CD
5. ⏭️ Explorar la UI

**Recursos:**
- Documentación: https://kagent.dev/docs
- Ejemplos: https://github.com/kagent-dev/kagent/tree/main/examples
- Community: https://discord.gg/kagent

---

**Última actualización:** 12 de noviembre de 2025
