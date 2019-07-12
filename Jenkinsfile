pipeline {
    agent {
        label "hornet-js"
    }

    triggers {
        pollSCM('H */4 * * 1-5')
    }

    environment {

        MODULE_GROUP="fr.gouv.diplomatie.hornet"
        MODULE_GROUP_PUB="fr/gouv/diplomatie/hornet"
        MODULE_ID="hornet-showroom"
        
        BUILD_TIMESTAMP=sh(script: 'date +%Y%m%d.%H%M%S', returnStdout:true).trim()
        VERSION_PACKAGE=sh(script:"npm run version --silent", returnStdout:true).trim()

        VERSION_RELEASE="${VERSION_PACKAGE}"
        VERSION_SNAPSHOT="${VERSION_RELEASE}-${BUILD_TIMESTAMP}-${BUILD_NUMBER}"

        // Construction
        //HORNETJSBUILDER_VERSION="latest"
        HORNETJSBUILDER_VERSION="2.0.1"
        // HORNETJSBUILDER_VERSION=sh(script: 'npm show hornet-js-builder version', returnStdout:true).trim()
        
        HORNETJSBUILDER_BASE="/var/lib/jenkins/.hbw/${HORNETJSBUILDER_VERSION}"

        // Publication
        ARTIFACTORY_URL = "http://artifactory.app.diplomatie.gouv.fr/artifactory-dev"
        REPOSITORY_GROUP="hornet"
        REPOSITORY_SNAPSHOT = "${REPOSITORY_GROUP}-snapshot"
        REPOSITORY_RELEASE = "${REPOSITORY_GROUP}-release"        
        REPOSITORY_NPM_SNAPSHOT = "${REPOSITORY_GROUP}-npm-snapshot"
        REPOSITORY_NPM_RELEASE = "${REPOSITORY_GROUP}-npm-release"

        // Déploiement
        RUNDECK_HOST="10.110.192.11"
        RUNDECK_JOB_OS_CIBLE="DEB9"
        RUNDECK_JOB_DEB9_SNAPSHOT_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-${RUNDECK_JOB_OS_CIBLE}-SNAPSHOT-application-${MODULE_ID}-scheduled-install"
        RUNDECK_JOB_DEB9_RELEASE_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-${RUNDECK_JOB_OS_CIBLE}-RELEASE-application-${MODULE_ID}-scheduled-install"
        //RUNDECK_JOB_DEB8_SNAPSHOT_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-DEB8-SNAPSHOT-application-${MODULE_ID}-scheduled-install"
        //RUNDECK_JOB_DEB8_RELEASE_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-DEB8-RELEASE-application-${MODULE_ID}-scheduled-install"
        RUNDECK_CREDENTIALS_KEY="hornet_cd_at_rundeck01"

        // Qualité
        SONAR_HOST = "http://sonar01-nosaml.devng.diplomatie.gouv.fr/sonar"
        SONAR_CREDENTIALS_KEY = "hornet_cq_at_sonar01"
        SONAR_SCANNER_CLI = "3.0.3.778"

    }

    options {
        buildDiscarder(logRotator(artifactDaysToKeepStr: "20", artifactNumToKeepStr: "1", daysToKeepStr: "90", numToKeepStr: "20"))
        disableConcurrentBuilds()
    }

    stages {

        stage("Install Builder") {
            steps {
                withNPM(npmrcConfig: "npmrc_hornet") {
                    sh '''
						echo "Install hornet-js-builder@$HORNETJSBUILDER_VERSION"
						echo "${HORNETJSBUILDER_VERSION}" > hb_version
						bash hbw.sh --version
                       '''
                }
            }
            post {
                success {
                    echo "[SUCCESS] Success to install builder"
                }
                failure {
                    echo "[FAILURE] Failed to install builder"
                }
            }
        }

        stage("Handle Snaphot version") {
            when {
				anyOf {
	                branch "develop"
				}
            }
            steps {
                  withNPM(npmrcConfig: "npmrc_hornet") {                    
                    sh '''
                        npm i -E 
                        bash hbw.sh versions:set --versionFix=${VERSION_SNAPSHOT}
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-batch --module=hornet-js-batch
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-bean --module=hornet-js-bean
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-components --module=hornet-js-components
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-core --module=hornet-js-core
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-database --module=hornet-js-database
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-passport --module=hornet-js-passport
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-react-components --module=hornet-js-react-components
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-test --module=hornet-js-test
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-utils --module=hornet-js-utils

                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=generator-hornet-js --module=generator-hornet-js
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=generator-hornet-js-lite --module=generator-hornet-js-lite
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=generator-hornet-js-lite-batch --module=generator-hornet-js-lite-batch
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-builder --module=hornet-js-builder
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-man --module=hornet-js-man
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=hornet-js-gc-monitor --module=hornet-js-gc-monitor
                        bash hbw.sh dependency:set-snapshot --dependencyVersionFix=applitutoriel-js --module=applitutoriel-js
                    '''
                  }
            }
            post {
                success {
                    echo "[SUCCESS] Success to handle snapshot version"
                }
                failure {
                    echo "[FAILURE] Failed to handle snapshot version"
                }
            }
        }

        stage("Publish NPM snapshot") {
            when {
                branch "develop"
            }
            steps {
                  withNPM(npmrcConfig: "npmrc_hornet") {
                    sh "bash hbw.sh publish --publish-registry ${ARTIFACTORY_URL}/api/npm/${REPOSITORY_NPM_SNAPSHOT} -E"
                  }
            }
            post {
                success {
                    echo "[SUCCESS] Success to Publish snapshot"
                }
                failure {
                    echo "[FAILURE] Failed to Publish snapshot"
                }
            }
        }

        stage("Publish NPM release") {
            when {
                branch "master"
            }
            steps {
                  withNPM(npmrcConfig: "npmrc_hornet") {
                    sh "npm i -E"
                    sh "bash hbw.sh publish --publish-registry ${ARTIFACTORY_URL}/api/npm/${REPOSITORY_NPM_RELEASE} -E"
                  }
            }
            post {
                success {
                    echo "[SUCCESS] Success to Publish release"
                }
                failure {
                    echo "[FAILURE] Failed to Publish release"
                }
            }
        }

        stage("Publish snapshot") {
            when {
				anyOf {
	                branch "develop"
				}
            }

            steps {
                sh '''
                    mkdir -p ./${MODULE_ID}/target
                    echo "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>${MODULE_GROUP}</groupId>
    <artifactId>${MODULE_ID}</artifactId>
    <version>${VERSION_RELEASE}-SNAPSHOT</version>
</project>" > ./target/${MODULE_ID}-${VERSION_SNAPSHOT}.pom
                    '''
                withCredentials([usernamePassword(credentialsId: "hornet_ci_at_artifactory", passwordVariable: "pwd_ci", usernameVariable: "user_ci")]) {
                    script {
                        def artifactory = Artifactory.newServer url: "$ARTIFACTORY_URL", username: "$user_ci", password: "$pwd_ci"
                        def uploadSpec = """{
                            "files": [
                            {
                                "pattern": "target/*.*",
                                "target": "${REPOSITORY_SNAPSHOT}/${MODULE_GROUP_PUB}/${MODULE_ID}/${VERSION_RELEASE}-SNAPSHOT/",
                                "recursive": false
                            }
                        ]
                        }"""
                        artifactory.upload(uploadSpec)
                    }
                }
                archiveArtifacts artifacts: "target/*.*", fingerprint: true
            }
            post {
                success {
                    echo "[SUCCESS] Success to Publish snapshot"
                }
                failure {
                    echo "[FAILURE] Failed to Publish snapshot"
                }
            }
        }

        stage("Publish release") {
            when {
                branch "master"
            }
            steps {
                sh '''
                    mkdir -p ./${MODULE_ID}/target
                    echo "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>${MODULE_GROUP}</groupId>
    <artifactId>${MODULE_ID}</artifactId>
    <version>${VERSION_RELEASE}</version>
</project>" > ./target/${MODULE_ID}-${VERSION_RELEASE}.pom
                    '''
                withCredentials([usernamePassword(credentialsId: "hornet_ci_at_artifactory", passwordVariable: "pwd_ci", usernameVariable: "user_ci")]) {
                    script {
                        def artifactory = Artifactory.newServer url: "$ARTIFACTORY_URL", username: "$user_ci", password: "$pwd_ci"
                        def uploadSpec = """{
                            "files": [
                            {
                                "pattern": "target/*.*",
                                "target": "${REPOSITORY_RELEASE}/${MODULE_GROUP_PUB}/${MODULE_ID}/${VERSION_RELEASE}/",
                                "recursive": false
                            }
                        ]
                        }"""
                        artifactory.upload(uploadSpec)
                    }
                }
                archiveArtifacts artifacts: "target/*.*", fingerprint: true
            }
            post {
                success {
                    echo "[SUCCESS] Success to Publish release"
                }
                failure {
                    echo "[FAILURE] Failed to Publish release"
                }
            }
        }

        

        stage("Test") {
            steps {
                sh "bash hbw.sh test"
            }
            post {
                success {
                    echo "[SUCCESS] Success to Test"
                }
                failure {
                    echo "[FAILURE] Failed to Test"
                }
            }
        }

        stage("Quality") {

            environment {
                SONAR_CREDENTIALS = credentials("${SONAR_CREDENTIALS_KEY}")
            }

            when {
                anyOf {
                    branch "develop"
                    branch "master"
                }
            }
            steps {
                script {
                  scannerHome = tool "SonarQube Scanner ${SONAR_SCANNER_CLI}"
                }

                sh '''
                    echo "
                    sonar.host.url=${SONAR_HOST}
                    sonar.login=${SONAR_CREDENTIALS_PSW}
                    sonar.projectKey=${MODULE_GROUP}:${MODULE_ID}
                    sonar.projectName=${MODULE_ID}
                    sonar.projectVersion=${VERSION_SNAPSHOT}
                    sonar.sourceEncoding=UTF-8
                    
                    sonar.sources=./src
                    sonar.exclusions=**/node_modules/**,**/*.spec.ts

                    //sonar.tests=./test
                    //sonar.test.inclusions=**/*.spec.ts, **/*.test.karma.ts
                    //sonar.cobertura.reportPath=**/test_report/mocha/cobertura-coverage.xml

                    sonar.language=ts
                    sonar.baseDir=.
                    sonar.ts.tslint.projectPath=.
                    sonar.ts.tslint.path=${HORNETJSBUILDER_BASE}/node_modules/tslint/bin/tslint
                    sonar.ts.tslint.configPath=${HORNETJSBUILDER_BASE}/src/conf/tslint.json
                    sonar.ts.tslint.ruleConfigs=${HORNETJSBUILDER_BASE}/node_modules/tslint-microsoft-contrib

                    " > sonar-project.properties
                '''
               sh "${scannerHome}/bin/sonar-scanner"
            }
            post {
                success {
                    echo "[SUCCESS] Success to Analyse Quality"
                }
                failure {
                    echo "[FAILURE] Failed to Analyse Quality"
                }
            }
        }

        stage("Deploy snapshot") {
            environment {
                RUNDECK_CREDENTIALS = credentials("${RUNDECK_CREDENTIALS_KEY}")
            }
            when {
	            branch "develop"
            }
            steps {
                sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB9_SNAPSHOT_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_RELEASE}-SNAPSHOT"
             }
            post {
                success {
                    echo "[SUCCESS] Success to Deploy snapshot"
                }
                failure {
                    echo "[FAILURE] Failed to Deploy snapshot"
                }
            }
        }

        /*stage("Deploy release") {
            environment {
                RUNDECK_CREDENTIALS = credentials("${RUNDECK_CREDENTIALS_KEY}")
            }
            when {
	            branch "master"
            }
            steps {
                sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB9_RELEASE_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_RELEASE}"
                //sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB8_RELEASE_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_RELEASE}"
            }
            post {
                success {
                    echo "[SUCCESS] Success to Deploy release"
                }
                failure {
                    echo "[FAILURE] Failed to Deploy release"
                }
            }
        }*/
    }
}