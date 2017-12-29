pipeline {
    agent {
        label "hornet-js"
    }

    environment {

        MODULE_GROUP="hornet-js"
        MODULE_ID="hornet-showroom"
        
        BUILD_TIMESTAMP=sh(script: 'date +%Y%m%d%H%M%S', returnStdout:true).trim()
        VERSION_PACKAGE=sh(script:"npm run version --silent", returnStdout:true).trim()

        VERSION_RELEASE="${VERSION_PACKAGE}"
        VERSION_SNAPSHOT="${VERSION_RELEASE}-${BUILD_TIMESTAMP}"

        // Construction
        //HORNETJSBUILDER_VERSION="latest"
        //HORNETJSBUILDER_VERSION="1.5.2"
        HORNETJSBUILDER_VERSION=sh(script: 'npm show hornet-js-builder version', returnStdout:true).trim()
        
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
        //RUNDECK_JOB_DEB9_SNAPSHOT_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-DEB9-SNAPSHOT-application-${MODULE_ID}-scheduled-install"
        //RUNDECK_JOB_DEB9_RELEASE_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-DEB9-RELEASE-application-${MODULE_ID}-scheduled-install"
        RUNDECK_JOB_DEB8_SNAPSHOT_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-DEB8-SNAPSHOT-application-${MODULE_ID}-scheduled-install"
        RUNDECK_JOB_DEB8_RELEASE_ID="${MODULE_GROUP}-${MODULE_ID}-DEVNG-DEB8-RELEASE-application-${MODULE_ID}-scheduled-install"
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
        stage("Environnement") {
            steps {
                echo sh(script: "env|sort", returnStdout: true)
            }
            post {
                success {
                    echo "[SUCCESS] Success to print Environnement"
                }
                failure {
                    echo "[FAILURE] Failed to print Environnement"
                }
            }
        }

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
	                branch "develop-PUB"
				}
            }
            steps {                    
                    sh '''
                        bash hbw.sh versions:set --versionFix=${VERSION_SNAPSHOT}
                        HORNET_THEMES_INTRANET_VERSION_LATEST=`npm show hornet-themes-intranet version`
                        HORNET_JS_BATCH_VERSION_LATEST=`npm show hornet-js-batch version`
                        HORNET_JS_BEAN_VERSION_LATEST=`npm show hornet-js-bean version`
                        HORNET_JS_COMMUNITY_VERSION_LATEST=`npm show hornet-js-community version`
                        HORNET_JS_COMPONENTS_VERSION_LATEST=`npm show hornet-js-components version`
                        HORNET_JS_CORE_VERSION_LATEST=`npm show hornet-js-core version`
                        HORNET_JS_DATABASE_VERSION_LATEST=`npm show hornet-js-database version`
                        HORNET_JS_PASSPORT_VERSION_LATEST=`npm show hornet-js-passport version`
                        HORNET_JS_REACT_COMPONENTS_VERSION_LATEST=`npm show hornet-js-react-components version`
                        HORNET_JS_TEST_VERSION_LATEST=`npm show hornet-js-test version`
                        HORNET_JS_UTILS_VERSION_LATEST=`npm show hornet-js-utils version`
                        HORNET_JS_MAN_VERSION_LATEST=`npm show hornet-js-man version`
                        GENERATOR_HORNET_JS_VERSION_LATEST=`npm show generator-hornet-js version`
                        GENERATOR_HORNET_JS_LITE_VERSION_LATEST=`npm show generator-hornet-js-lite version`
                        GENERATOR_HORNET_JS_BATCH_VERSION_LATEST=`npm show generator-hornet-js-lite-batch version`
                        HORNET_JS_BUILDER_VERSION_LATEST=`npm show hornet-js-builder version`
                        HORNET_JS_TS_TYPINGS_VERSION_LATEST=`npm show hornet-js-ts-typings version`
                      

                        bash hbw.sh dependency:set --versionFix=${HORNET_THEMES_INTRANET_VERSION_LATEST} --dependencyVersionFix=hornet-themes-intranet
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_BATCH_VERSION_LATEST} --dependencyVersionFix=hornet-js-batch
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_BEAN_VERSION_LATEST} --dependencyVersionFix=hornet-js-bean
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_COMMUNITY_VERSION_LATEST} --dependencyVersionFix=hornet-js-community
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_COMPONENTS_VERSION_LATEST} --dependencyVersionFix=hornet-js-components
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_CORE_VERSION_LATEST} --dependencyVersionFix=hornet-js-core
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_DATABASE_VERSION_LATEST} --dependencyVersionFix=hornet-js-database
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_PASSPORT_VERSION_LATEST} --dependencyVersionFix=hornet-js-passport
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_REACT_COMPONENTS_VERSION_LATEST} --dependencyVersionFix=hornet-js-react-components
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_TEST_VERSION_LATEST} --dependencyVersionFix=hornet-js-test
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_UTILS_VERSION_LATEST} --dependencyVersionFix=hornet-js-utils
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_MAN_VERSION_LATEST} --dependencyVersionFix=hornet-js-man
                        bash hbw.sh dependency:set --versionFix=${GENERATOR_HORNET_JS_VERSION_LATEST} --dependencyVersionFix=generator-hornet-js
                        bash hbw.sh dependency:set --versionFix=${GENERATOR_HORNET_JS_LITE_VERSION_LATEST} --dependencyVersionFix=generator-hornet-js-lite
                        bash hbw.sh dependency:set --versionFix=${GENERATOR_HORNET_JS_BATCH_VERSION_LATEST} --dependencyVersionFix=generator-hornet-js-lite-batch
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_BUILDER_VERSION_LATEST} --dependencyVersionFix=hornet-js-builder
                        bash hbw.sh dependency:set --versionFix=${HORNET_JS_TS_TYPINGS_VERSION_LATEST} --dependencyVersionFix=hornet-js-ts-typings
                    ''' 
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
                branch "develop-PUB"
            }
            steps {
                sh "bash hbw.sh publish --publish-registry ${ARTIFACTORY_URL}/api/npm/${REPOSITORY_NPM_SNAPSHOT}"
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
                branch "master-PUB"
            }
            steps {
                sh "bash hbw.sh publish --publish-registry ${ARTIFACTORY_URL}/api/npm/${REPOSITORY_NPM_RELEASE}"
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
	                branch "develop-PUB"
				}
            }
            steps {
                withCredentials([usernamePassword(credentialsId: "hornet_ci_at_artifactory", passwordVariable: "pwd_ci", usernameVariable: "user_ci")]) {
                    script {
                        def artifactory = Artifactory.newServer url: "$ARTIFACTORY_URL", username: "$user_ci", password: "$pwd_ci"
                        def uploadSpec = """{
                            "files": [
                            {
                                "pattern": "target/*.zip",
                                "target": "${REPOSITORY_SNAPSHOT}/${MODULE_GROUP}/${MODULE_ID}/${VERSION_SNAPSHOT}/"
                            }
                        ]
                        }"""
                        artifactory.upload(uploadSpec)
                    }
                }
                archiveArtifacts artifacts: "target/*.zip", fingerprint: true
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
                branch "master-PUB"
            }
            steps {
                withCredentials([usernamePassword(credentialsId: "hornet_ci_at_artifactory", passwordVariable: "pwd_ci", usernameVariable: "user_ci")]) {
                    script {
                        def artifactory = Artifactory.newServer url: "$ARTIFACTORY_URL", username: "$user_ci", password: "$pwd_ci"
                        def uploadSpec = """{
                            "files": [
                            {
                                "pattern": "target/*.zip",
                                "target": "${REPOSITORY_RELEASE}/${MODULE_GROUP}/${MODULE_ID}/${VERSION_RELEASE}/"
                            }
                        ]
                        }"""
                        artifactory.upload(uploadSpec)
                    }
                }
                archiveArtifacts artifacts: "target/*.zip", fingerprint: true
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
                    branch "develop-PUB"
                    branch "master-PUB"
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
                    sonar.projectVersion=${PROJECT_VERSION}
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
	            branch "develop-PUB"
            }
            steps {
                //sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB9_SNAPSHOT_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_SNAPSHOT}"
                sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB8_SNAPSHOT_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_SNAPSHOT}"
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

        stage("Deploy release") {
            environment {
                RUNDECK_CREDENTIALS = credentials("${RUNDECK_CREDENTIALS_KEY}")
            }
            when {
	            branch "master-PUB"
            }
            steps {
                //sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB9_RELEASE_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_RELEASE}"
                sh "node trigger-rundeck.js ${RUNDECK_HOST} ${RUNDECK_JOB_DEB8_RELEASE_ID} ${RUNDECK_CREDENTIALS_PSW} ${VERSION_RELEASE}"
            }
            post {
                success {
                    echo "[SUCCESS] Success to Deploy release"
                }
                failure {
                    echo "[FAILURE] Failed to Deploy release"
                }
            }
        }
    }
}
