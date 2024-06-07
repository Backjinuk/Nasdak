# Node.js 이미지를 기반으로 함
FROM node:20

# 작업 디렉터리 설정
WORKDIR /nasdak-node-app

# 필요한 파일 복사
COPY . .

# 종속성 설치
RUN npm install

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]

