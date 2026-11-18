# AI가 듣고, 사람이 상담한다 — 세심함(Attentiveness)

뷰티·의료 분야 상담 과정에서 AI가 듣고, 사람이 상담하는 것이 어떻게 고객을 위한 세심함이 되는가 — 연구 발표를 스크롤형 웹사이트로 옮긴 페이지입니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
```

## 배포 (Cloudflare Pages)

- Framework preset: **Vite** (또는 None)
- Build command: `npm run build`
- Build output directory: `dist`

## 영상 자리

`src/App.jsx`의 `VideoSlot` 컴포넌트에 영상 placeholder가 하나 있습니다. 합친 영상이 준비되면 `public/video/`에 넣고 placeholder를 `<video>`로 교체합니다.

## 크레딧

모션 컴포넌트 일부는 [React Bits](https://reactbits.dev) (MIT + Commons Clause, © David Haz)에서 가져왔습니다 — `src/components/reactbits/`.
