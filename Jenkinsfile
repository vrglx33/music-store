@Library('music-store-pipeline-library') _

pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'your-docker-registry'
        APP_NAME = 'music-store-platform'
        GITHUB_REPO = 'https://github.com/vrglx33/music-store'
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deploy environment')
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to build')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                gitCheckout(
                    branch: "${params.BRANCH}",
                    url: "${GITHUB_REPO}",
                    credentialsId: 'github-credentials'
                )
            }
        }

        stage('Setup Node') {
            steps {
                nodeSetup(nodeVersion: NODE_VERSION)
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
                runUnitTests()
            }
        }

        stage('Docker Build') {
            steps {
                dockerBuildAndTag(
                    registry: DOCKER_REGISTRY,
                    appName: APP_NAME,
                    buildNumber: env.BUILD_NUMBER
                )
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
                expression { params.DEPLOY_ENV == 'production' }
            }
            steps {
                deployToKubernetes(
                    registry: DOCKER_REGISTRY,
                    appName: APP_NAME,
                    buildNumber: env.BUILD_NUMBER
                )
            }
        }
    }

    post {
        success {
            notifySuccess()
        }
        failure {
            notifyFailure()
        }
        always {
            cleanWorkspace()
        }
    }
}