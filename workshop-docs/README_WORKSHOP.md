# 📚 Guía de Archivos del Workshop

## 🎯 Archivo Principal del Workshop

### `WORKSHOP_SCRIPT_2H.md` ⭐ **USAR ESTE**

**Contenido:** Guión completo de 2 horas enfocado 100% en AGENTES
- ✅ Introducción: ChatOps → AgentOps
- ✅ Parte 1: Jenkins Agents (30 min)
- ✅ Parte 2: Kagent - Agentes de K8s (30 min)  
- ✅ Parte 3: Agentes Personalizados (30 min)
- ✅ Cierre y Q&A

**Estado:** ✅ Completo y actualizado
**Enfoque:** 100% Agentes (Jenkins + Kagent)
**NO incluye:** Prompt engineering, generación de código con LLMs

---

## 📁 Archivos de Soporte

### Demos y Guías

1. **`KAGENT_QUICK_INSTALL.md`** ⭐ **NUEVO**
   - Instalación rápida en 5 minutos
   - Configuración de API keys
   - Verificación paso a paso
   - Troubleshooting común

2. **`KAGENT_DEMO_FLOW.md`**
   - Script de 15-20 min de demos de Kagent
   - 7 demos paso a paso
   - Comandos listos para copiar/pegar

3. **`KAGENT_CUSTOM_AGENTS_GUIDE.md`**
   - Guía completa para crear agentes personalizados
   - Anatomía de un agente
   - 3 ejemplos prácticos
   - Best practices

4. **`KAGENT_INSTALLATION_GUIDE.md`**
   - Instalación detallada de Kagent
   - Troubleshooting
   - Comparación de proveedores LLM

4. **`DEMO_COMPLETE_SUMMARY.md`**
   - Resumen ejecutivo de la demo
   - Checklist completa
   - Comandos rápidos

### Agente Personalizado

5. **`k8s/music-store-agent.yaml`**
   - Agente personalizado para Music Store
   - ✅ YA ESTÁ DESPLEGADO Y FUNCIONANDO
   - 6 skills definidas

### Estado del Proyecto

6. **`DEVOPS_AI_DEMO_STATUS.md`**
   - Estado actualizado del proyecto
   - Problemas resueltos
   - Información de Kagent

7. **`agents-md.md`**
   - Documento original adaptado
   - Referencia completa

---

## 🎬 Cómo Usar Este Material

### Para dar el Workshop:

1. **Abrir:** `WORKSHOP_SCRIPT_2H.md`
2. **Seguir** el guión minuto a minuto
3. **Ejecutar** los comandos mostrados
4. **Referencia:** Usar los otros archivos como apoyo

### Para practicar las demos:

1. **Abrir:** `KAGENT_DEMO_FLOW.md`
2. **Ejecutar** las 7 demos
3. **Verificar** que todo funciona

### Para crear agentes personalizados:

1. **Abrir:** `KAGENT_CUSTOM_AGENTS_GUIDE.md`
2. **Seguir** los ejemplos
3. **Modificar:** `k8s/music-store-agent.yaml`

---

## ✅ Estado Actual (12 Nov 2025)

### Aplicación
- ✅ Music Store desplegada (3 réplicas)
- ✅ PostgreSQL funcionando
- ✅ Migraciones completadas
- ✅ Accesible en http://localhost:8081

### Kagent
- ✅ Instalado y funcionando
- ✅ 11 agentes activos:
  - k8s-agent
  - helm-agent
  - observability-agent
  - promql-agent
  - argo-rollouts-agent
  - cilium-*-agents (3)
  - istio-agent
  - kgateway-agent
  - **music-store-agent** (personalizado)

### Demos Probadas
- ✅ Listar pods con k8s-agent
- ✅ Escalar deployment con k8s-agent
- ✅ Helm releases con helm-agent
- ✅ Health report con music-store-agent

---

## 🚀 Comandos Rápidos

### Ver agentes disponibles
```bash
kagent get agent -n default
```

### Usar k8s-agent
```bash
kagent invoke --agent "k8s-agent" --namespace default \
  --task "Show me all pods in music-store" \
  --stream
```

### Usar agente personalizado
```bash
kagent invoke --agent "music-store-agent" --namespace default \
  --task "Give me a health report" \
  --stream
```

### Ver aplicación
```bash
kubectl get all -n music-store
```

---

## 📞 Estructura de Archivos

```
music store/
├── WORKSHOP_SCRIPT_2H.md          ⭐ GUIÓN PRINCIPAL
├── KAGENT_DEMO_FLOW.md            📋 Demos de Kagent
├── KAGENT_CUSTOM_AGENTS_GUIDE.md  🤖 Crear agentes
├── KAGENT_INSTALLATION_GUIDE.md   🔧 Instalación
├── DEMO_COMPLETE_SUMMARY.md       📊 Resumen
├── DEVOPS_AI_DEMO_STATUS.md       📈 Estado
├── agents-md.md                   📚 Referencia
├── k8s/
│   ├── music-store-agent.yaml     🎯 Agente custom
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── migration-job.yaml
└── README_WORKSHOP.md             📖 Este archivo
```

---

## 🎯 Resumen Ejecutivo

**Archivo a usar:** `WORKSHOP_SCRIPT_2H.md`

**Contenido:**
- 2 horas de contenido
- 100% enfocado en agentes
- Jenkins Agents + Kagent
- Demos en vivo probadas
- Agente personalizado funcionando

**Estado:** ✅ LISTO PARA PRESENTAR

---

**Última actualización:** 12 de noviembre de 2025, 12:20 AM
