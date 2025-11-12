#!/bin/bash

echo "🔍 Verificando Setup del Workshop..."
echo ""

# Check tools
echo "📦 Herramientas:"
command -v python3 && echo "✅ Python" || echo "❌ Python"
command -v node && echo "✅ Node.js" || echo "❌ Node.js"
command -v docker && echo "✅ Docker" || echo "❌ Docker"
command -v kubectl && echo "✅ kubectl" || echo "❌ kubectl"
command -v kagent && echo "✅ Kagent" || echo "❌ Kagent"

echo ""
echo "☸️  Kubernetes:"
kubectl cluster-info &>/dev/null && echo "✅ Cluster accesible" || echo "❌ Cluster"
kubectl get ns jenkins &>/dev/null && echo "✅ Namespace jenkins" || echo "❌ Namespace jenkins"
kubectl get ns music-store &>/dev/null && echo "✅ Namespace music-store" || echo "❌ Namespace music-store"

echo ""
echo "🔄 Argo Rollouts:"
kubectl get crd rollouts.argoproj.io &>/dev/null && echo "✅ CRD instalado" || echo "❌ CRD"

echo ""
echo "🤖 Kagent:"
kagent get agent -n default | grep -q "k8s-agent" && echo "✅ k8s-agent" || echo "❌ k8s-agent"
kagent get agent -n default | grep -q "argo-rollouts" && echo "✅ argo-rollouts-agent" || echo "❌ argo-rollouts-agent"

echo ""
echo "🚀 Pipe Pilot:"
[ -d "../pipe-pilot" ] && echo "✅ Directorio existe" || echo "❌ Directorio"
[ -f "../pipe-pilot/main.py" ] && echo "✅ main.py existe" || echo "❌ main.py"

echo ""
echo "✅ Verificación completa!"
