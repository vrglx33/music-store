#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       🚀 CREANDO RAMAS DEL WORKSHOP                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 1. Guardar trabajo actual
echo "📦 Guardando trabajo actual..."
git add .
git stash save "Workshop files before branch creation"

# 2. Crear rama base (limpia, para la clase)
echo ""
echo "🌿 Creando rama: workshop/clase-base"
git checkout -b workshop/clase-base

# 3. Mantener solo archivos necesarios para la clase
echo "📝 Agregando archivos de la clase..."
git add CLASE_COMANDOS.md 2>/dev/null || true
git add KAGENT_CUSTOM_AGENT_GUIDE.md 2>/dev/null || true
git add WORKSHOP_FINAL_GITOPS_AI.md 2>/dev/null || true
git add scripts/verify-workshop-setup.sh 2>/dev/null || true
git add access-jenkins.sh 2>/dev/null || true

# 4. Commit
echo "💾 Commit de la rama base..."
git commit -m "chore: Setup workshop base branch for class" || echo "No changes to commit"

# 5. Push
echo "⬆️  Pushing workshop/clase-base..."
git push -u origin workshop/clase-base

# 6. Volver a la rama original
echo ""
echo "🔄 Volviendo a feature/jenkins-ci-cd-pipeline..."
git checkout feature/jenkins-ci-cd-pipeline

# 7. Crear rama con solución completa
echo ""
echo "🌿 Creando rama: workshop/solucion-completa"
git checkout -b workshop/solucion-completa

# 8. Recuperar todo el trabajo
echo "📦 Recuperando archivos guardados..."
git stash pop || echo "No stash to pop"

# 9. Agregar todos los archivos de la solución
echo "📝 Agregando todos los archivos de la solución..."
git add ARGOCD_DEMO_PROPOSAL.md
git add GITOPS_KAGENT_DEMO.md
git add JENKINS_K8S_DEPLOYMENT_GUIDE.md
git add KAGENT_CUSTOM_AGENT_GUIDE.md
git add WORKSHOP_FINAL_GITOPS_AI.md
git add CLASE_COMANDOS.md
git add access-jenkins.sh
git add scripts/verify-workshop-setup.sh

# 10. Commit
echo "💾 Commit de la solución completa..."
git commit -m "feat: Complete workshop solution with Kagent agents and guides" || echo "No changes to commit"

# 11. Push
echo "⬆️  Pushing workshop/solucion-completa..."
git push -u origin workshop/solucion-completa

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ RAMAS CREADAS EXITOSAMENTE                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Ramas disponibles:"
echo ""
echo "1. 🎓 workshop/clase-base"
echo "   - Rama limpia para dar la clase"
echo "   - Solo incluye guías y scripts"
echo "   - Los estudiantes crearán los agentes durante la clase"
echo ""
echo "2. ✅ workshop/solucion-completa"
echo "   - Rama con toda la solución"
echo "   - Incluye todos los agentes de Kagent"
echo "   - Incluye todas las guías y documentación"
echo "   - Referencia para el instructor"
echo ""
echo "🎯 Para usar en la clase:"
echo "   git checkout workshop/clase-base"
echo ""
echo "🎯 Para ver la solución:"
echo "   git checkout workshop/solucion-completa"
echo ""
