// React 관련 import
import React from 'react'; // React 라이브러리 임포트 

// ReactDOM 관련 import
import ReactDOM from 'react-dom/client'; // React 컴포넌트를 실제 DOM에 렌더링하는 기능 제공

// 스타일 관련 import
import './index.css';  // 전역 스타일시트(index.css) 임포트
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 스타일시트 임포트 (UI 스타일을 쉽게 적용)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap의 JavaScript 기능 임포트

// 컴포넌트 관련 import
import App from './App'; // App 컴포넌트 임포트 (애플리케이션의 루트 컴포넌트)
import reportWebVitals from './reportWebVitals'; // 웹 성능 측정을 위한 웹 비탈리티 보고서 함수 임포트

// 루트 DOM 요소에 React 앱을 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));

// 루트 DOM에 App 컴포넌트를 렌더링
root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);

// 웹 성능을 추적하여 로그로 출력하거나 API로 전송하는 함수 호출
reportWebVitals(); 
