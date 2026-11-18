import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App.jsx';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);
// 모바일 주소창이 접히고 펼쳐질 때마다 위치를 다시 계산하며 화면이 튀는 것 방지
ScrollTrigger.config({ ignoreMobileResize: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
