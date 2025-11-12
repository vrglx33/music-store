# 🔐 Jenkins - Credenciales y Acceso

## 📍 Información de Acceso

### URL de Jenkins

**Local (con port-forward):**
```
http://localhost:8080
```

**Comando para port-forward:**
```bash
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

---

## 🔑 Credenciales

### Usuario Administrador

**Username:** `admin`

**Password (Initial Admin Password):**
```
184748bcff62400f81b4dd23ee21ade7
```

---

## 🚀 Cómo Acceder

### Paso 1: Port Forward

```bash
# Abrir túnel a Jenkins
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

Dejar este comando corriendo en una terminal.

### Paso 2: Abrir Navegador

```bash
# Abrir en navegador
open http://localhost:8080
```

O manualmente ir a: http://localhost:8080

### Paso 3: Login

1. **Username:** `admin`
2. **Password:** `184748bcff62400f81b4dd23ee21ade7`
3. Click en "Sign in"

---

## 📋 Comandos Útiles

### Obtener la contraseña nuevamente

```bash
# Desde el pod
kubectl exec -n jenkins deployment/jenkins -- \
  cat /var/jenkins_home/secrets/initialAdminPassword
```

### Ver estado de Jenkins

```bash
# Ver pods
kubectl get pods -n jenkins

# Ver servicios
kubectl get svc -n jenkins

# Ver logs
kubectl logs -n jenkins deployment/jenkins -f
```

### Reiniciar Jenkins

```bash
# Reiniciar el pod
kubectl rollout restart deployment/jenkins -n jenkins

# Esperar a que esté listo
kubectl rollout status deployment/jenkins -n jenkins
```

---

## 🔧 Configuración para Pipe Pilot

### Variables de Entorno (.env)

Ya configuradas en `pipe-pilot/.env`:

```bash
JENKINS_URL=http://localhost:8080
JENKINS_USERNAME=admin
JENKINS_TOKEN=
```

### Obtener API Token

1. Ir a Jenkins: http://localhost:8080
2. Login con las credenciales
3. Click en tu usuario (arriba derecha)
4. Click en "Configure"
5. Scroll hasta "API Token"
6. Click en "Add new Token"
7. Dar un nombre: "pipe-pilot"
8. Click en "Generate"
9. **Copiar el token generado**
10. Agregar al `.env`:
    ```bash
    JENKINS_TOKEN=<tu-token-aqui>
    ```

---

## 🎯 Para el Workshop

### Demo: Acceder a Jenkins

**Duración:** 2 minutos

**Comandos:**
```bash
# 1. Port forward
kubectl port-forward -n jenkins svc/jenkins 8080:8080 &

# 2. Abrir navegador
open http://localhost:8080

# 3. Mostrar credenciales
echo "Username: admin"
echo "Password: 184748bcff62400f81b4dd23ee21ade7"
```

**Narrativa:**
> "Jenkins está corriendo en nuestro cluster de Kubernetes. Vamos a acceder a la UI con port-forward. Las credenciales son admin y esta contraseña inicial que obtuvimos del pod."

---

## 🔒 Seguridad

### Cambiar Contraseña (Recomendado)

1. Login en Jenkins
2. Click en tu usuario
3. Click en "Configure"
4. Scroll hasta "Password"
5. Ingresar nueva contraseña
6. Click en "Save"

### Crear Usuarios Adicionales

1. Ir a "Manage Jenkins"
2. Click en "Manage Users"
3. Click en "Create User"
4. Llenar formulario
5. Click en "Create User"

---

## 📊 Información del Pod

**Namespace:** `jenkins`  
**Pod:** `jenkins-6f9656cfb9-zn5ql`  
**Service:** `jenkins` (ClusterIP)  
**Puerto:** `8080`  
**Estado:** Running  
**Edad:** 8 días

---

## 🐛 Troubleshooting

### No puedo acceder a Jenkins

```bash
# Verificar que el pod esté corriendo
kubectl get pods -n jenkins

# Ver logs
kubectl logs -n jenkins deployment/jenkins --tail=50

# Verificar port-forward
lsof -i :8080
```

### Olvidé la contraseña

```bash
# Obtener contraseña inicial
kubectl exec -n jenkins deployment/jenkins -- \
  cat /var/jenkins_home/secrets/initialAdminPassword
```

### Jenkins no responde

```bash
# Reiniciar Jenkins
kubectl rollout restart deployment/jenkins -n jenkins

# Esperar
kubectl rollout status deployment/jenkins -n jenkins

# Verificar
kubectl get pods -n jenkins
```

---

## 📝 Notas

- ✅ Jenkins está desplegado en Kubernetes
- ✅ Usa un deployment (no StatefulSet)
- ✅ Datos en volumen persistente
- ✅ Acceso vía port-forward o Ingress
- ✅ Contraseña inicial en el pod

---

**Última actualización:** 12 de noviembre de 2025, 1:18 AM  
**Estado:** ✅ Credenciales obtenidas
