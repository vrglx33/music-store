pipeline {
    agent any
    
    environment {
        // Application Configuration
        APP_NAME = 'music-store-platform'
        DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'your-registry.com' // Cambiar por tu registry
        
        // Node Configuration
        NODE_VERSION = '18'
        
        // Database Configuration (usar Jenkins credentials)
        DATABASE_URL = credentials('music-store-db-url')
        SESSION_SECRET = credentials('music-store-session-secret')
        
        // Kubernetes Configuration
        K8S_NAMESPACE = 'music-store'
        K8S_DEPLOYMENT = 'music-store-deployment'
        
        // Notification
        SLACK_CHANNEL = '#deployments' // Opcional
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                    checkout scm
                    
                    // Get commit information
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    env.GIT_AUTHOR = sh(
                        script: 'git log -1 --pretty=%an',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    echo "🔧 Setting up environment..."
                    sh '''
                        node --version
                        npm --version
                        echo "Build Number: ${BUILD_NUMBER}"
                        echo "Branch: ${GIT_BRANCH}"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing dependencies..."
                    sh '''
                        npm ci --prefer-offline --no-audit
                        echo "Dependencies installed successfully"
                    '''
                }
            }
        }
        
        stage('Prisma Generate') {
            steps {
                script {
                    echo "🗄️ Generating Prisma Client..."
                    sh 'npx prisma generate'
                }
            }
        }
        
        stage('Lint & Format Check') {
            steps {
                script {
                    echo "🔍 Running linting and format checks..."
                    sh '''
                        npm run lint || true
                        echo "Lint check completed"
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo "🧪 Running tests..."
                    sh '''
                        npm run test -- --ci --coverage --maxWorkers=2
                    '''
                }
            }
            post {
                always {
                    // Publish test results
                    junit allowEmptyResults: true, testResults: '**/junit.xml'
                    
                    // Publish coverage report
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    echo "🏗️ Building application..."
                    sh '''
                        npm run build
                        echo "Build completed successfully"
                        ls -la dist/
                    '''
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    echo "🔒 Running security audit..."
                    sh '''
                        npm audit --audit-level=moderate || true
                        echo "Security scan completed"
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh """
                        docker build -t ${DOCKER_IMAGE} .
                        docker tag ${DOCKER_IMAGE} ${APP_NAME}:latest
                        echo "Docker image built: ${DOCKER_IMAGE}"
                    """
                }
            }
        }
        
        stage('Push Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "📤 Pushing Docker image to registry..."
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-registry-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo \$DOCKER_PASS | docker login ${DOCKER_REGISTRY} -u \$DOCKER_USER --password-stdin
                            docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}
                            docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/${APP_NAME}:latest
                            docker push ${DOCKER_REGISTRY}/${APP_NAME}:latest
                            echo "Image pushed successfully"
                        """
                    }
                }
            }
        }
        
        stage('Database Migration') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "🗄️ Running database migrations..."
                    sh '''
                        npx prisma migrate deploy
                        echo "Migrations completed"
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes..."
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        sh """
                            # Update deployment image
                            kubectl set image deployment/${K8S_DEPLOYMENT} \
                                ${APP_NAME}=${DOCKER_REGISTRY}/${DOCKER_IMAGE} \
                                -n ${K8S_NAMESPACE}
                            
                            # Wait for rollout to complete
                            kubectl rollout status deployment/${K8S_DEPLOYMENT} \
                                -n ${K8S_NAMESPACE} \
                                --timeout=5m
                            
                            # Verify deployment
                            kubectl get pods -n ${K8S_NAMESPACE}
                            
                            echo "Deployment completed successfully"
                        """
                    }
                }
            }
        }
        
        stage('Health Check') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "🏥 Running health checks..."
                    sh '''
                        # Wait for application to be ready
                        sleep 10
                        
                        # Get service URL
                        SERVICE_URL=$(kubectl get ingress music-store-ingress -n ${K8S_NAMESPACE} -o jsonpath='{.spec.rules[0].host}')
                        
                        # Health check
                        curl -f http://${SERVICE_URL}/health || exit 1
                        
                        echo "Health check passed"
                    '''
                }
            }
        }
        
        stage('Smoke Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo "💨 Running smoke tests..."
                    sh '''
                        # Basic endpoint tests
                        SERVICE_URL=$(kubectl get ingress music-store-ingress -n ${K8S_NAMESPACE} -o jsonpath='{.spec.rules[0].host}')
                        
                        # Test API endpoints
                        curl -f http://${SERVICE_URL}/api/albums || exit 1
                        curl -f http://${SERVICE_URL}/api/artists || exit 1
                        
                        echo "Smoke tests passed"
                    '''
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo "✅ Pipeline completed successfully!"
                
                // Send notification (optional)
                // slackSend(
                //     channel: env.SLACK_CHANNEL,
                //     color: 'good',
                //     message: """
                //         ✅ Deployment Successful
                //         App: ${APP_NAME}
                //         Build: #${BUILD_NUMBER}
                //         Branch: ${GIT_BRANCH}
                //         Commit: ${GIT_COMMIT_MSG}
                //         Author: ${GIT_AUTHOR}
                //     """
                // )
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                
                // Send notification (optional)
                // slackSend(
                //     channel: env.SLACK_CHANNEL,
                //     color: 'danger',
                //     message: """
                //         ❌ Deployment Failed
                //         App: ${APP_NAME}
                //         Build: #${BUILD_NUMBER}
                //         Branch: ${GIT_BRANCH}
                //         Commit: ${GIT_COMMIT_MSG}
                //         Author: ${GIT_AUTHOR}
                //         Check: ${BUILD_URL}
                //     """
                // )
            }
        }
        
        always {
            script {
                echo "🧹 Cleaning up..."
                
                // Clean up Docker images
                sh """
                    docker rmi ${DOCKER_IMAGE} || true
                    docker system prune -f || true
                """
                
                // Archive artifacts
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
                
                // Clean workspace
                cleanWs()
            }
        }
    }
}
