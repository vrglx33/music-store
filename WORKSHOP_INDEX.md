# 🎓 Workshop AgentOps - Índice Principal

## 📂 Estructura del Proyecto

```
music-store/
├── 📁 workshop-docs/          ← TODA LA DOCUMENTACIÓN DEL WORKSHOP
│   ├── README.md              (Índice de documentos)
│   ├── WORKSHOP_SCRIPT_2H.md  ⭐ GUIÓN PRINCIPAL
│   ├── KAGENT_QUICK_INSTALL.md ⚡ INSTALACIÓN RÁPIDA
│   └── ... (14 archivos más)
│
├── 📁 k8s/                     ← Manifiestos de Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── migration-job.yaml
│   └── music-store-agent.yaml  🤖 AGENTE PERSONALIZADO
│
├── 📁 pipe-pilot/              ← Instalación de Pipe Pilot
│   ├── .env                    (Configuración con API key)
│   ├── main.py
│   └── output/
│       └── Jenkinsfile         (Pipeline generado)
│
└── 📁 src/                     ← Código de Music Store Platform
    ├── server/
    └── client/
```

---

## 🚀 Inicio Rápido

### 1️⃣ Para Dar el Workshop

```bash
cd workshop-docs
open WORKSHOP_SCRIPT_2H.md
```

### 2️⃣ Para Instalar Kagent

```bash
cd workshop-docs
open KAGENT_QUICK_INSTALL.md
```

### 3️⃣ Para Ver las Demos

```bash
cd workshop-docs
open WORKSHOP_INTEGRATION_DEMO.md
```

---

## 📚 Documentos Principales

| Archivo | Descripción | Ubicación |
|---------|-------------|-----------|
| **WORKSHOP_SCRIPT_2H.md** | Guión completo (2 horas) | `workshop-docs/` |
| **KAGENT_QUICK_INSTALL.md** | Instalación rápida (5 min) | `workshop-docs/` |
| **WORKSHOP_INTEGRATION_DEMO.md** | Flujo end-to-end | `workshop-docs/` |
| **KAGENT_CUSTOM_AGENTS_GUIDE.md** | Crear agentes | `workshop-docs/` |
| **music-store-agent.yaml** | Agente personalizado | `k8s/` |
| **Jenkinsfile** | Pipeline generado | `pipe-pilot/output/` |

---

## 🎯 Accesos Directos

### Documentación del Workshop
```bash
cd workshop-docs/
ls -lh
```

### Agente Personalizado
```bash
cat k8s/music-store-agent.yaml
```

### Jenkinsfile Generado
```bash
cat pipe-pilot/output/Jenkinsfile
```

---

## ✅ Estado del Proyecto

- ✅ **15 documentos** en `workshop-docs/`
- ✅ **Pipe Pilot** instalado y configurado
- ✅ **Kagent** con 11 agentes activos
- ✅ **Music Store** desplegado (10 réplicas)
- ✅ **Todas las demos** probadas y funcionando

---

## 📞 Navegación Rápida

**Ver todos los documentos:**
```bash
ls -lh workshop-docs/
```

**Leer el README principal:**
```bash
cat workshop-docs/README.md
```

**Abrir guión del workshop:**
```bash
open workshop-docs/WORKSHOP_SCRIPT_2H.md
```

---

**Última actualización:** 12 de noviembre de 2025, 12:55 AM
