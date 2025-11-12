pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'your-docker-registry'
        APP_NAME = 'music-store-platform'
        GITHUB_REPO = 'https://github.com/vrglx33/music-store'
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deployment environment')
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
                    url: "${GITHUB_REPO}", 
                    credentialsId: 'github-credentials'
            }
        }

        stage('Setup Node') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 18') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
            post {
                always {
                    junit 'test-results/**/*.xml'
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'
                sh 'npm run security-check'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY_ENV == 'production' && params.BRANCH == 'main' }
            }
            steps {
                script {
                    docker.withRegistry('https://your-docker-registry', 'docker-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_NUMBER}").push()
                    }
                    
                    // Example deployment to Kubernetes
                    sh """
                        kubectl set image deployment/${APP_NAME} ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_NUMBER}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            slackSend(
                color: 'good', 
                message: "Build ${env.BUILD_NUMBER} succeeded for ${APP_NAME}"
            )
        }
        failure {
            echo 'Pipeline failed!'
            slackSend(
                color: 'danger', 
                message: "Build ${env.BUILD_NUMBER} failed for ${APP_NAME}"
            )
        }
        always {
            cleanWs()
        }
    }
}