plugins {
    java
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
    id("org.asciidoctor.jvm.convert") version "3.3.2"

}

group = "org.nasdakgo"
version = "0.0.1-SNAPSHOT"

val queryDslVersion = "5.0.0" // QueryDSL Version Setting

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

extra["snippetsDir"] = file("build/generated-snippets")


dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-web-services")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    // https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-api
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    implementation("io.jsonwebtoken:jjwt-impl:0.11.5")
    implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")


    // https://mvnrepository.com/artifact/org.modelmapper/modelmapper
    implementation("org.modelmapper:modelmapper:3.1.1")

    // https://mvnrepository.com/artifact/p6spy/p6spy
    //implementation("p6spy:p6spy:3.9.1")

    // https://mvnrepository.com/artifact/com.github.gavlyukovskiy/p6spy-spring-boot-starter
    implementation("com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.9.0")

    //jar파일 생성
    implementation("com.google.guava:guava:31.0.1-jre")

    //implementation("org.springframework.session:spring-session-jdbc")

    // https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind
    implementation("com.fasterxml.jackson.core:jackson-databind:2.15.2")


    // QueryDSL Implementation
    implementation ("com.querydsl:querydsl-jpa:${queryDslVersion}:jakarta") // QueryDSL JPA 의존성 추가
    annotationProcessor("com.querydsl:querydsl-apt:${queryDslVersion}:jakarta") // QueryDSL Annotation Processor 추가
    annotationProcessor("jakarta.annotation:jakarta.annotation-api")   // QueryDSL Annotation Processor 추가
    annotationProcessor("jakarta.persistence:jakarta.persistence-api") // QueryDSL Annotation Processor 추가


    compileOnly("org.projectlombok:lombok")
    runtimeOnly("com.mysql:mysql-connector-j")
    annotationProcessor("org.projectlombok:lombok") // lombok
//    providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mybatis.spring.boot:mybatis-spring-boot-starter-test:3.0.3")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

/**
 * QueryDSL Build Options
 */
val querydslDir = "src/main/generated" // QueryDSL(QClass) 생성 경로 설정

sourceSets {
    getByName("main").java.srcDirs(querydslDir)
}

tasks.withType<JavaCompile> { // JavaCompile 설정 추가 compile시 QueryDSL(QClass) 코드를 생성하도록 설정
    options.generatedSourceOutputDirectory = file(querydslDir)
}

tasks.named("clean") {// clean 시 QueryDSL(QClass) 코드를 삭제하도록 설정
    doLast {
        file(querydslDir).deleteRecursively()
    }
}

tasks.named<Jar>("jar") {
    archiveFileName.set("Nasdak.jar")
    destinationDirectory.set(file("${rootDir}/build/libs"))
    manifest {
        attributes["Main-Class"] = "org.nasdakgo.nasdak.NasdakApplication" // 여기에 본인의 메인 클래스 패키지 경로를 넣어야 합니다.
    }
}


