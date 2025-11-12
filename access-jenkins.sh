#!/bin/bash

# 🚀 Script para acceder a Jenkins

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              🚀 ACCEDIENDO A JENKINS                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que Jenkins esté corriendo
echo "📊 Verificando estado de Jenkins..."
kubectl get pods -n jenkins

echo ""
echo "⏳ Esperando a que Jenkins esté listo..."
kubectl wait --for=condition=ready pod -l app=jenkins -n jenkins --timeout=60s

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Jenkins está listo!"
    echo ""
    echo "🔐 CREDENCIALES:"
    echo "   Username: admin"
    echo "   Password: 184748bcff62400f81b4dd23ee21ade7"
    echo ""
    echo "🌐 URL: http://localhost:8080"
    echo ""
    echo "📡 Iniciando port-forward..."
    echo "   (Presiona Ctrl+C para detener)"
    echo ""
    
    # Port forward
    kubectl port-forward -n jenkins svc/jenkins 8080:8080
else
    echo ""
    echo "❌ Jenkins no está listo. Verifica los logs:"
    echo "   kubectl logs -n jenkins deployment/jenkins"
    exit 1
fi
