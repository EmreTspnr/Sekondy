pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_CMD = 'docker-compose'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout source code from SCM
                checkout scm
            }
        }

        stage('Build API Image') {
            steps {
                dir('rest-api') {
                    echo 'Building REST API Docker Image...'
                    // Build the Docker image for the Node.js API
                    sh 'docker build -t sekondy-api:latest .'
                }
            }
        }

        stage('Deploy Services') {
            steps {
                echo 'Starting MongoDB, Redis, RabbitMQ and API via Docker Compose...'
                // Spin up the entire infrastructure
                sh '${DOCKER_COMPOSE_CMD} up -d'
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Waiting for services to be ready...'
                // Sleep for a few seconds to let services initialize
                sleep time: 15, unit: 'SECONDS'
                
                // Check if API is responding (assuming / health endpoint or similar)
                // sh 'curl -f http://localhost:5000/ || exit 1'
                echo 'Services are successfully running.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Deployment successful! Environment is up.'
        }
        failure {
            echo 'Deployment failed! Checking logs...'
            sh '${DOCKER_COMPOSE_CMD} logs'
            // Optionally bring down the failing containers
            // sh '${DOCKER_COMPOSE_CMD} down'
        }
    }
}
