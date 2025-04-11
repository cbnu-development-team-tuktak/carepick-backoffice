// src/setupProxy.js
// http-proxy-middleware 모듈에서 프록시 미들웨어 생성 함수 가져오기
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // WebSocket 요청 프록시
  // /ws-logs → http://localhost:8080
  app.use(
    '/ws-logs',
    createProxyMiddleware({
      target: 'http://localhost:8080', // 백엔드 서버 주소 
      changeOrigin: true, // 호스트 헤더를 백엔드 주소 기준으로 변경
      ws: true, // WebSocket 프록시 활성화
    })
  );

  // REST API 요청 프록시
  // /api → http://localhost:8080/api
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // 백엔드 서버의 /api 경로
      changeOrigin: true, // 호스트 헤더를 백엔드 서버의 /api 경로 기준으로 변경
    })
  );
};
