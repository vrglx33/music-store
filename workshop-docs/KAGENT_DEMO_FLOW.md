# 🎬 Kagent Demo Flow - Music Store Platform

## 🎯 Objetivo de la Demo
Demostrar cómo Kagent permite operar Kubernetes usando **lenguaje natural** en lugar de comandos técnicos complejos.

---

## 📋 Pre-Demo Checklist

```bash
# Verificar que todo está corriendo
kubectl get pods -n music-store
kubectl get pods -n default | grep agent

# Verificar acceso a la aplicación
curl -s http://localhost:8081 | head -5

# Listar agentes disponibles
kagent get agent -n default
```

---

## 🎪 DEMO FLOW (15-20 minutos)

### 🌟 PARTE 1: Introducción (2 min)

**Narración:**
> "Tradicionalmente, operar Kubernetes requiere conocer muchos comandos: kubectl get, kubectl scale, helm install, etc. Con Kagent, podemos usar **lenguaje natural** para hacer lo mismo. Veamos cómo."

**Mostrar:**
```bash
# Los agentes instalados
kagent get agent -n default
```

**Explicar:**
- 10 agentes especializados corriendo
- Cada uno experto en un dominio (K8s, Helm, Observabilidad, etc.)
- Todos conectados a OpenAI para entender lenguaje natural

---

### 🔍 PARTE 2: Exploración Básica (3 min)

**Escenario:** "Quiero ver qué está corriendo en mi aplicación"

#### Demo 1: Listar Recursos
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me all pods in the music-store namespace" \
  --stream
```

**Punto clave:** 
- No necesité recordar `kubectl get pods -n music-store`
- El agente entendió "show me" y lo tradujo al comando correcto
- Respuesta en lenguaje natural + datos estructurados

**Pausa para preguntas:** "¿Ven cómo el agente interpretó mi intención?"

---

### 📊 PARTE 3: Operaciones Complejas (4 min)

**Escenario:** "Necesito escalar mi aplicación porque viene tráfico"

#### Demo 2: Escalar Deployment
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale the music-store-platform deployment to 7 replicas in the music-store namespace" \
  --stream
```

**Observar juntos:**
1. El agente primero **verifica** el estado actual (3 réplicas)
2. Luego **explica** lo que va a hacer
3. Ejecuta el cambio (`kubectl patch`)
4. **Confirma** el resultado

**Verificar:**
```bash
kubectl get pods -n music-store | grep platform
# Deberías ver 7 pods
```

**Punto clave:**
- El agente siguió un proceso de "verificar → actuar → confirmar"
- Esto es más seguro que ejecutar comandos a ciegas
- Incluye contexto y explicaciones

---

### 📦 PARTE 4: Gestión de Helm (3 min)

**Escenario:** "¿Qué tengo instalado con Helm?"

#### Demo 3: Listar Releases de Helm
```bash
kagent invoke --agent "helm-agent" --namespace default \
  --task "List all helm releases in the music-store namespace and show me their status" \
  --stream
```

**Resultado esperado:**
- Muestra PostgreSQL instalado
- Versión del chart
- Estado del release

**Punto clave:**
- Agente especializado en Helm
- Puede hacer install, upgrade, rollback con lenguaje natural

---

### 🔧 PARTE 5: Troubleshooting (4 min)

**Escenario:** "Algo no funciona, necesito investigar"

#### Demo 4: Diagnosticar Problemas
```bash
kagent invoke --agent "observability-agent" --namespace default \
  --task "Check the health of all resources in the music-store namespace and identify any issues" \
  --stream
```

**O más específico:**
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me the logs of the music-store-platform pods from the last 5 minutes" \
  --stream
```

**Punto clave:**
- El agente puede correlacionar múltiples fuentes
- Identifica problemas proactivamente
- Sugiere soluciones

---

### 🎨 PARTE 6: Operaciones Avanzadas (3 min)

**Escenario:** "Quiero hacer un cambio más complejo"

#### Demo 5: Actualizar Configuración
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Add a label 'environment=production' to all music-store-platform pods in the music-store namespace" \
  --stream
```

**O con Prometheus:**
```bash
kagent invoke --agent "promql-agent" --namespace default \
  --task "Show me the CPU usage of the music-store-platform pods in the last hour" \
  --stream
```

**Punto clave:**
- Operaciones que normalmente requieren múltiples comandos
- El agente orquesta todo automáticamente
- Reduce la carga cognitiva del operador

---

### 🚀 PARTE 7: Comparación Antes/Después (2 min)

**Mostrar slide o terminal side-by-side:**

#### Forma Tradicional:
```bash
# 1. Ver pods
kubectl get pods -n music-store -o wide

# 2. Verificar deployment actual
kubectl get deployment music-store-platform -n music-store -o yaml | grep replicas

# 3. Escalar
kubectl scale deployment music-store-platform --replicas=7 -n music-store

# 4. Verificar
kubectl get pods -n music-store -w

# 5. Verificar eventos
kubectl get events -n music-store --sort-by='.lastTimestamp'
```

#### Con Kagent:
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale music-store-platform to 7 replicas and verify it's healthy" \
  --stream
```

**Punto clave:**
- 5 comandos → 1 comando en lenguaje natural
- El agente maneja la verificación automáticamente
- Menos errores, más rápido

---

## 🎯 MENSAJES CLAVE PARA LA AUDIENCIA

1. **Democratización:** No necesitas ser experto en kubectl para operar K8s
2. **Seguridad:** Los agentes verifican antes de actuar
3. **Contexto:** Las respuestas incluyen explicaciones, no solo datos
4. **Especialización:** Cada agente es experto en su dominio
5. **Extensibilidad:** Puedes crear tus propios agentes (siguiente parte)

---

## 🛠️ COMANDOS DE RESPALDO (Si algo falla)

### Si un agente no responde:
```bash
# Ver logs del agente
kubectl logs -n default deployment/k8s-agent --tail=50

# Verificar estado
kubectl get agent k8s-agent -n default
```

### Si necesitas resetear:
```bash
# Escalar de vuelta a 3
kubectl scale deployment music-store-platform --replicas=3 -n music-store
```

### Comandos alternativos para mostrar:
```bash
# Ver recursos de un pod
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me the resource usage of music-store-platform pods" \
  --stream

# Verificar conectividad
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Check if the music-store-service is accessible" \
  --stream

# Ver configuración
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me the environment variables of the music-store-platform deployment" \
  --stream
```

---

## 💡 TIPS PARA UNA DEMO EXITOSA

### Antes de la Demo:
1. ✅ Practica el flujo 2-3 veces
2. ✅ Ten los comandos en un archivo para copiar/pegar
3. ✅ Aumenta el tamaño de la fuente del terminal (18-20pt)
4. ✅ Usa `--stream` para ver el proceso en tiempo real
5. ✅ Ten un terminal de respaldo con kubectl por si acaso

### Durante la Demo:
1. 🎤 **Narra lo que estás haciendo** antes de ejecutar
2. ⏸️ **Pausa** después de cada comando para que la audiencia procese
3. 👀 **Señala** las partes importantes de la respuesta
4. 🤔 **Explica** el razonamiento del agente
5. 💬 **Invita preguntas** después de cada sección

### Manejo de Errores:
- Si un comando falla, **explica por qué** (es parte del aprendizaje)
- Ten comandos kubectl tradicionales listos como fallback
- Usa los errores para mostrar cómo el agente maneja problemas

---

## 🎬 SCRIPT COMPLETO PARA COPIAR/PEGAR

```bash
# ============================================
# KAGENT DEMO - MUSIC STORE PLATFORM
# ============================================

# 1. Mostrar agentes disponibles
echo "=== AGENTES DISPONIBLES ==="
kagent get agent -n default

# 2. Listar pods
echo -e "\n=== DEMO 1: Listar Pods ==="
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me all pods in the music-store namespace with their status" \
  --stream

# 3. Escalar deployment
echo -e "\n=== DEMO 2: Escalar Aplicación ==="
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale the music-store-platform deployment to 7 replicas in the music-store namespace" \
  --stream

# 4. Verificar escalado
echo -e "\n=== Verificación ==="
kubectl get pods -n music-store | grep platform

# 5. Helm releases
echo -e "\n=== DEMO 3: Gestión de Helm ==="
kagent invoke --agent "helm-agent" --namespace default \
  --task "List all helm releases in the music-store namespace and show their versions" \
  --stream

# 6. Diagnosticar
echo -e "\n=== DEMO 4: Troubleshooting ==="
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Describe the music-store-platform deployment and identify any potential issues" \
  --stream

# 7. Operación avanzada
echo -e "\n=== DEMO 5: Operación Avanzada ==="
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me the resource requests and limits for all containers in the music-store namespace" \
  --stream

# 8. Cleanup (opcional)
echo -e "\n=== Volver al estado original ==="
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Scale the music-store-platform deployment back to 3 replicas" \
  --stream
```

---

## 📊 MÉTRICAS DE ÉXITO

Al final de la demo, la audiencia debería poder:
- ✅ Entender qué es Kagent y para qué sirve
- ✅ Ver la diferencia entre comandos tradicionales y lenguaje natural
- ✅ Identificar casos de uso en sus propios proyectos
- ✅ Sentirse motivados a probar Kagent

---

## 🎤 CIERRE DE LA DEMO (1 min)

**Mensaje final:**
> "Como vieron, Kagent no reemplaza a kubectl o helm. Los **complementa** permitiéndonos operar con intención en lugar de comandos. Reduce la carga cognitiva, aumenta la seguridad, y democratiza el acceso a Kubernetes.
>
> Y lo mejor: pueden crear sus propios agentes personalizados para sus casos de uso específicos. Veamos cómo..."

**Transición a la siguiente parte:** Creación de agentes personalizados

---

## 🔗 Recursos Adicionales

- Documentación: https://kagent.dev
- GitHub: https://github.com/kagent-dev/kagent
- Discord: https://discord.gg/Fu3k65f2k3
- Ejemplos: https://kagent.dev/agents

---

**Tiempo total:** 15-20 minutos
**Nivel:** Intermedio
**Audiencia:** DevOps Engineers, Platform Engineers, SREs
