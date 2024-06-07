# OpenJDK 이미지를 기반으로 함
FROM openjdk:17-jdk-alpine

# 작업 디렉터리 설정
WORKDIR /nasdak-java-app

# 필요한 파일 복사
COPY . .

# Gradle 패키징 및 JAR 실행을 위해 필요한 패키지 설치
#RUN apk update \
#    && apk add --no-cache curl xargs

# Gradle 패키징 및 JAR 실행
RUN chmod +x ./gradlew

#RUN apk add --no-cache curl && 
RUN ./gradlew clean build --info

# 도커 컨테이너 실행 시 실행할 명령어
CMD ["java", "-jar", "build/libs/Nasdak-0.0.1-SNAPSHOT.jar"]

