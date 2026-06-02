# 엔드필드 공장 계산기 앱

## 구조
```
endfield-app/
├── src/
│   ├── index.html          # 메인 앱 (사이트 HTML 임베드)
│   ├── overlay.html        # 오버레이 창
│   └── endfield_factory_calc.html  # 빌드 시 복사됨
├── src-tauri/
│   ├── src/main.rs         # Rust 백엔드
│   ├── tauri.conf.json     # Tauri 설정
│   └── Cargo.toml          # Rust 의존성
└── package.json
```

## 로컬 빌드 방법

### 1. 필수 설치
```bash
# Rust 설치
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Node.js 20+ 설치
https://nodejs.org

# Tauri 의존성 (Windows)
# Visual Studio C++ Build Tools 필요
# https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

### 2. 프로젝트 설정
```bash
# 사이트 HTML 복사
cp ../endfield_factory_calc.html src/endfield_factory_calc.html

# npm 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 배포용 빌드
npm run build
```

### 3. 빌드 결과물
```
src-tauri/target/release/bundle/
├── msi/     # Windows Installer
└── nsis/    # 설치 파일 (.exe)
```

## GitHub Actions 자동 빌드

태그를 푸시하면 자동으로 빌드 & 릴리즈:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Custom URL Scheme

앱 설치 시 `endfield://` URL scheme 자동 등록.

브라우저에서 사이트의 "배치 도우미" 버튼 클릭 시
자동으로 앱이 실행되고 배치 데이터가 전달됨.

## 업데이트 서명 키 생성
```bash
npm run tauri signer generate -- -w .tauri/update-key.key
```
생성된 공개키를 tauri.conf.json의 pubkey에 입력.
