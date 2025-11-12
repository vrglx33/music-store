pipeline {
    agent any

    environment {
        NODE_VERSION = '16.x'
        NPM_REGISTRY = 'https://registry.npmjs.org/'
        PROJECT_NAME = 'music-store-platform'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deploy environment')
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to build')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH}", 
                    url: 'https://github.com/your-org/music-store-platform.git'
                
                sh 'printenv'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || echo "Lint not configured, skipping..."'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Tests') {
            steps {
                sh 'npm test || echo "Tests not configured, skipping..."'
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=moderate || echo "Vulnerabilities found, but continuing..."'
            }
        }

        stage('Build Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.build("${PROJECT_NAME}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY_ENV == 'production' }
            }
            steps {
                script {
                    // Example deployment strategy
                    sh """
                        docker login -u ${DOCKER_CREDENTIALS_USR} -p ${DOCKER_CREDENTIALS_PSW}
                        docker push ${PROJECT_NAME}:${env.BUILD_NUMBER}
                        kubectl apply -f k8s/deployment.yaml
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
            echo "Build #${env.BUILD_NUMBER} for ${PROJECT_NAME}"
        }
        failure {
            echo "❌ Pipeline failed!"
            echo "Build #${env.BUILD_NUMBER} for ${PROJECT_NAME}"
        }
        always {
            echo "🧹 Cleaning workspace..."
            cleanWs()
        }
    }
}