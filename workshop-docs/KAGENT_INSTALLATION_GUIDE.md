# Guía de Instalación de Kagent

## 📚 Información Oficial

**Sitio Web:** https://kagent.dev  
**Documentación:** https://kagent.dev/docs/kagent/introduction/installation  
**GitHub:** https://github.com/kagent-dev/kagent  
**Discord:** https://discord.gg/Fu3k65f2k3

## 🎯 ¿Qué es Kagent?

Kagent es un framework open-source de la CNCF (Cloud Native Computing Foundation) para ejecutar agentes de IA en Kubernetes. Permite automatizar operaciones complejas de DevOps usando lenguaje natural.

**Creado por:** Solo.io  
**Estado:** CNCF Sandbox Project

## ⚙️ Requisitos Previos

### 1. Cluster de Kubernetes
- Kubernetes 1.20+ funcionando
- kubectl configurado
- Acceso de administrador al cluster

### 2. API Key de un Proveedor LLM

Kagent **REQUIERE** una API key de uno de estos proveedores:

| Proveedor | Costo | URL | Notas |
|-----------|-------|-----|-------|
| **OpenAI** | Pago | https://platform.openai.com | Más común, requiere tarjeta |
| **Anthropic (Claude)** | Pago | https://console.anthropic.com | Excelente calidad |
| **Azure OpenAI** | Pago | https://azure.microsoft.com/openai | Requiere suscripción Azure |
| **OpenRouter** | Freemium | https://openrouter.ai | Algunos modelos gratuitos |
| **Ollama** | Gratis | https://ollama.ai | Local, requiere recursos |

### 3. kagent CLI

El CLI de Kagent debe estar instalado en tu máquina local.

## 📦 Instalación Paso a Paso

### Paso 1: Instalar kagent CLI

#### Opción A: Script de Instalación (Linux/macOS)
```bash
curl https://raw.githubusercontent.com/kagent-dev/kagent/refs/heads/main/scripts/get-kagent | bash
```

#### Opción B: Homebrew (macOS)
```bash
brew install kagent/tap/kagent
```

#### Verificar Instalación
```bash
kagent --help
kagent version
```

### Paso 2: Configurar API Key del Proveedor LLM

Elige UNO de los siguientes según tu proveedor:

#### OpenAI
```bash
export OPENAI_API_KEY="sk-..."
```

#### Anthropic (Claude)
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

#### OpenRouter
```bash
export OPENROUTER_API_KEY="sk-or-..."
```

#### Azure OpenAI
```bash
export AZURE_OPENAI_API_KEY="..."
export AZURE_OPENAI_ENDPOINT="https://..."
```

### Paso 3: Instalar Kagent en el Cluster

#### Instalación con Perfil Demo (Recomendado para empezar)
```bash
# Instala Kagent con agentes y herramientas preconfiguradas
kagent install

# Salida esperada:
# kagent installed successfully
```

#### Instalación con Perfil Mínimo
```bash
# Instala solo la infraestructura base, sin agentes predefinidos
kagent install --profile minimal
```

### Paso 4: Verificar Instalación

```bash
# Ver pods de Kagent
kubectl get pods -n kagent

# Listar agentes instalados
kagent get agent -n kagent

# Ver detalles de un agente específico
kagent get agent k8s-agent -n kagent
```

## 🤖 Agentes Disponibles (Perfil Demo)

Cuando instalas con el perfil demo, obtienes estos agentes:

| Agente | Descripción | Uso |
|--------|-------------|-----|
| **k8s-agent** | Operaciones de Kubernetes | Deploy, scale, troubleshoot |
| **helm-agent** | Gestión de Helm charts | Install, upgrade, rollback |
| **observability-agent** | Monitoreo y observabilidad | Logs, metrics, traces |
| **promql-agent** | Queries de Prometheus | Métricas y alertas |
| **argo-rollouts-agent** | Despliegues progresivos | Canary, blue-green |
| **cilium-*-agent** | Networking con Cilium | Políticas de red |
| **istio-agent** | Service mesh con Istio | Traffic management |

## 💡 Ejemplos de Uso

### Ejemplo 1: Desplegar una Aplicación
```bash
kagent invoke k8s-agent "deploy the app 'music-store' using image 'music-store:latest' with 3 replicas"
```

### Ejemplo 2: Escalar un Deployment
```bash
kagent invoke k8s-agent "scale deployment music-store-platform to 5 replicas in namespace music-store"
```

### Ejemplo 3: Instalar un Chart de Helm
```bash
kagent invoke helm-agent "add bitnami repo and install postgresql chart named 'my-db' in namespace 'database'"
```

### Ejemplo 4: Diagnosticar Problemas
```bash
kagent invoke observability-agent "show me the status of all resources in namespace music-store and identify any issues"
```

## 🔧 Configuración Avanzada

### Cambiar el Proveedor LLM Después de la Instalación

```bash
# Editar el ConfigMap de Kagent
kubectl edit configmap kagent-config -n kagent

# O actualizar con Helm values
kagent install --set llm.provider=anthropic --set llm.apiKey=$ANTHROPIC_API_KEY
```

### Usar Ollama Local (Sin Costo)

```bash
# 1. Instalar Ollama localmente
curl https://ollama.ai/install.sh | sh

# 2. Descargar un modelo
ollama pull llama2

# 3. Configurar Kagent para usar Ollama
export OLLAMA_HOST="http://host.docker.internal:11434"
kagent install --set llm.provider=ollama --set llm.model=llama2
```

## 🚨 Troubleshooting

### Problema: "kagent installed successfully" pero no hay pods

**Causa:** Falta la API key o es inválida

**Solución:**
```bash
# Verificar que la variable de entorno está configurada
echo $OPENAI_API_KEY

# Reinstalar con la API key correcta
kagent uninstall
export OPENAI_API_KEY="sk-..."
kagent install
```

### Problema: Agentes no responden

**Causa:** El proveedor LLM no está accesible

**Solución:**
```bash
# Ver logs de los pods de Kagent
kubectl logs -n kagent -l app=kagent

# Verificar conectividad
kubectl exec -it -n kagent <pod-name> -- curl https://api.openai.com
```

### Problema: "CRDs not found"

**Causa:** Los Custom Resource Definitions no se instalaron

**Solución:**
```bash
# Desinstalar completamente
kagent uninstall

# Reinstalar
kagent install
```

## 🔄 Desinstalación

```bash
# Desinstalar Kagent del cluster
kagent uninstall

# Eliminar el namespace (opcional)
kubectl delete namespace kagent
```

## 📊 Comparación de Proveedores LLM

### Para Demos y Pruebas:

| Proveedor | Costo Inicial | Mejor Para |
|-----------|---------------|------------|
| **OpenRouter** | $0 (algunos modelos) | Demos rápidas |
| **Ollama** | $0 (local) | Desarrollo offline |
| **OpenAI Trial** | $5 crédito gratis | Pruebas de calidad |

### Para Producción:

| Proveedor | Costo Aprox | Mejor Para |
|-----------|-------------|------------|
| **OpenAI GPT-4** | $0.03/1K tokens | Máxima calidad |
| **Anthropic Claude** | $0.015/1K tokens | Razonamiento complejo |
| **Azure OpenAI** | Variable | Empresas con Azure |

## 🎓 Recursos Adicionales

### Documentación
- [Quick Start Guide](https://kagent.dev/docs/kagent/getting-started/quickstart)
- [First Agent Guide](https://kagent.dev/docs/kagent/getting-started/first-agent)
- [Architecture](https://kagent.dev/docs/kagent/concepts/architecture)
- [FAQ](https://kagent.dev/docs/kagent/resources/faq)

### Comunidad
- [Discord](https://discord.gg/Fu3k65f2k3) - Soporte de la comunidad
- [GitHub Issues](https://github.com/kagent-dev/kagent/issues) - Reportar bugs
- [Roadmap](https://github.com/orgs/kagent-dev/projects/3) - Próximas features

### Tutoriales
- [InfraCloud Blog](https://www.infracloud.io/blogs/ai-agents-for-kubernetes/)
- [The New Stack Article](https://thenewstack.io/meet-kagent-open-source-framework-for-ai-agents-in-kubernetes/)
- [Solo.io Blog](https://www.solo.io/blog/bringing-agentic-ai-to-kubernetes-contributing-kagent-to-cncf)

## ✅ Checklist de Instalación

- [ ] Cluster de Kubernetes funcionando
- [ ] kubectl configurado
- [ ] kagent CLI instalado (`kagent version`)
- [ ] API key de proveedor LLM obtenida
- [ ] Variable de entorno configurada (`echo $OPENAI_API_KEY`)
- [ ] Kagent instalado (`kagent install`)
- [ ] Pods corriendo (`kubectl get pods -n kagent`)
- [ ] Agentes listados (`kagent get agent -n kagent`)
- [ ] Primer comando probado (`kagent invoke k8s-agent "..."`)

## 🎯 Conclusión

Kagent es una herramienta poderosa para automatizar operaciones de Kubernetes con IA, pero **requiere una API key de un proveedor LLM** para funcionar. 

**Para demos sin costo:**
1. Usa OpenRouter con modelos gratuitos
2. Instala Ollama localmente
3. Solicita créditos de prueba de OpenAI

**Para producción:**
- Usa OpenAI o Anthropic para mejor calidad
- Configura límites de rate y costos
- Monitorea el uso de tokens

---

**Última actualización:** 11 de noviembre de 2025  
**Versión de Kagent:** 0.7+  
**Documentación oficial:** https://kagent.dev
