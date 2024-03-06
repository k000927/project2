const dotenv = require("dotenv");
process.env.NODE_ENV = process.env.NODE_ENV ?? "development";
console.log(`어플리케이션 서버를 다음 환경으로 시작합니다: ${process.env.NODE_ENV}`);

// 환경 변수 Read
const envFound = dotenv.config();
// .env 파일이 없을 경우 에러 발생
if (!envFound) {
  // throw new AppError
}
// mongoDB URI 값 체크. 없을 경우 에러 발생
if (envFound.MONGODB_URI === undefined) {
  // throw new AppError
}

module.exports = {
  applicationName: process.env.APPLICATION_NAME ?? "app", // 어플리케이션 이름
  port: parseInt(process.env.PORT ?? "3000", 10), // PORT 번호 10진수로 parsing, 어플리케이션이 바인딩되는 포트
  mongoDBUri: process.env.MONGODB_URI, // mongoDB 연결 주소
  location: process.env.LOCATION,
};
