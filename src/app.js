const http = require("http");
const cors = require("cors");
const express = require("express");
const loader = require("./loader");
const config = require("./config");
const apiRouter = require("./router");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const create = async () => {

    await loader.connectMongoDB();
    const app = express();

    // CORS 에러 방지
    app.use(
        cors({
            credentials: true,
            //origin: `http://${config.location}:${config.port}`,
            origin: "http://43.201.66.157:3001",
            //origin: "http://localhost:3000",
        })
    );


    //
    // Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함
    app.use(express.json());
    app.use(cookieParser());
    app.use(bodyParser.json());

    // version 1의 api router 등록
    app.use("/api/v1", apiRouter.v1);

    // 해당되는 URL이 없을 때를 대비한 미들웨어
    app.use((req, res, next) => {
        next();
        // new AppError()
    });

    app.use(function (err, req, res, next) {
        res.status(400).json({
            errorName: err.name,
            httpCode: err.httpCode,
            errorMessage: err.message,
        });
    });

    // 에러 핸들러 등록

    // express와 http.Server 분리
    const server = http.createServer(app);

    const serverApp = {
        start() {
            server.listen(config.port);
            server.on("listening", () => {
                console.log(`서버가 포트 ${config.port}에서 구동중입니다.`);
            });
        },
        // 서버 중지를 위함. ctrl + c 누른 직후 실행
        stop() {
            console.log("서버를 중지하고 있습니다.");
            this.isShuttingDown = true;
            return new Promise((resolve, reject) => {
                server.close(async (error) => {
                    if (error !== undefined) {
                        console.log(`HTTP 서버 중지 실패: ${error.message}`);
                        reject(error);
                    }
                    console.log("더 이상 커넥션을 받지 않습니다.");
                    await loader.disconnectMongoDB();
                    console.log("DB 커넥션을 정상적으로 끊었습니다.");
                    console.log("서버 중지 작업 성공하였습니다.");
                    this.isShuttingDown = false;
                    resolve();
                });
            });
        },
        isShuttingDown: false, // 서버가 중지하는 상태인지를 확인하는 플래그
        _app: app,
    };

    return serverApp;
};

module.exports = create;
