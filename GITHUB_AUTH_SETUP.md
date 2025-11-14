# 🔐 GitHub 로그인 설정 가이드

이 가이드는 IdeaFlow 마인드맵 애플리케이션에 GitHub OAuth 로그인을 설정하는 방법을 설명합니다.

## 📋 목차

1. [GitHub OAuth App 생성](#1-github-oauth-app-생성)
2. [Firebase Authentication 설정](#2-firebase-authentication-설정)
3. [승인된 도메인 추가](#3-승인된-도메인-추가)
4. [로컬 개발 환경 설정](#4-로컬-개발-환경-설정)
5. [프로덕션 배포 설정](#5-프로덕션-배포-설정)
6. [문제 해결](#6-문제-해결)

---

## 1. GitHub OAuth App 생성

### 1.1 GitHub 설정 페이지 접속

1. GitHub에 로그인합니다
2. 오른쪽 상단 프로필 아이콘 클릭 → **Settings** 선택
3. 왼쪽 사이드바에서 **Developer settings** 클릭
4. **OAuth Apps** → **New OAuth App** 클릭

### 1.2 OAuth App 정보 입력

#### 로컬 개발용 설정:
```
Application name: IdeaFlow Dev (Local)
Homepage URL: http://localhost:8000
Authorization callback URL: https://your-project.firebaseapp.com/__/auth/handler
```

#### 프로덕션용 설정:
```
Application name: IdeaFlow
Homepage URL: https://ai-mindmap-ideas.vercel.app
Authorization callback URL: https://your-project.firebaseapp.com/__/auth/handler
```

> 💡 **중요**: Authorization callback URL은 반드시 Firebase Auth Domain의 `/__/auth/handler` 경로여야 합니다.

### 1.3 Client ID 및 Secret 복사

1. OAuth App 생성 후 **Client ID**가 표시됩니다 (복사해두세요)
2. **Generate a new client secret** 버튼을 클릭합니다
3. 생성된 **Client Secret**을 즉시 복사합니다 (다시 볼 수 없습니다!)

---

## 2. Firebase Authentication 설정

### 2.1 Firebase Console 접속

1. [Firebase Console](https://console.firebase.google.com/)에 로그인합니다
2. 프로젝트를 선택합니다
3. 왼쪽 메뉴에서 **Authentication** 클릭
4. **Sign-in method** 탭 선택

### 2.2 GitHub 제공업체 활성화

1. 제공업체 목록에서 **GitHub** 찾기
2. **사용 설정** 토글을 활성화합니다
3. 앞서 복사한 GitHub OAuth 정보를 입력합니다:
   - **클라이언트 ID**: GitHub OAuth App의 Client ID
   - **클라이언트 보안 비밀**: GitHub OAuth App의 Client Secret
4. **저장** 버튼을 클릭합니다

### 2.3 Firebase 콜백 URL 확인

Firebase에서 제공하는 **승인 콜백 URL**을 복사합니다:
```
https://your-project.firebaseapp.com/__/auth/handler
```

이 URL을 GitHub OAuth App 설정의 **Authorization callback URL**에 정확히 입력해야 합니다.

---

## 3. 승인된 도메인 추가

### 3.1 Firebase Authentication 도메인 설정

1. Firebase Console → **Authentication** → **Settings** 탭
2. **승인된 도메인** 섹션으로 스크롤
3. 다음 도메인들이 추가되어 있는지 확인:
   - `localhost` (로컬 개발용)
   - `ai-mindmap-ideas.vercel.app` (프로덕션용)
   - `your-project.firebaseapp.com` (Firebase 기본 도메인)

4. 도메인이 없다면 **도메인 추가** 버튼을 클릭하여 추가합니다

---

## 4. 로컬 개발 환경 설정

### 4.1 로컬 서버 실행

```bash
# Python을 사용하는 경우
python -m http.server 8000

# Node.js를 사용하는 경우
npx serve -p 8000
```

### 4.2 브라우저에서 테스트

1. `http://localhost:8000`에 접속합니다
2. 좌측 툴바에서 **⚙️ Firebase 설정** 버튼을 클릭합니다
3. Firebase 설정 정보를 입력합니다:
   - API Key
   - Auth Domain (예: `your-project.firebaseapp.com`)
   - Database URL
   - 기타 필수 정보
4. **설정 저장** 버튼을 클릭합니다
5. 페이지를 새로고침합니다

### 4.3 GitHub 로그인 테스트

1. 헤더 우측의 **GitHub** 버튼을 클릭합니다
2. GitHub 로그인 팝업이 열립니다
3. 계정 인증을 완료합니다
4. 로그인 성공 시 사용자 정보가 헤더에 표시됩니다

---

## 5. 프로덕션 배포 설정

### 5.1 Vercel 환경 변수 설정 (선택사항)

Vercel에서 배포하는 경우, 환경 변수를 설정할 수 있습니다:

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** → **Environment Variables** 이동
3. 다음 변수를 추가 (선택사항, 정적 HTML이므로 클라이언트에서 Firebase 설정 UI 사용 권장):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`

### 5.2 GitHub OAuth App 프로덕션 URL 업데이트

1. GitHub → Settings → Developer settings → OAuth Apps
2. 프로덕션용 OAuth App 선택 (또는 새로 생성)
3. 다음 정보를 업데이트:
   ```
   Homepage URL: https://ai-mindmap-ideas.vercel.app
   Authorization callback URL: https://your-project.firebaseapp.com/__/auth/handler
   ```
4. **Update application** 클릭

---

## 6. 문제 해결

### 6.1 "팝업이 차단되었습니다" 오류

**원인**: 브라우저가 로그인 팝업을 차단했습니다.

**해결 방법**:
1. 브라우저 주소창 우측의 팝업 차단 아이콘을 클릭합니다
2. 해당 사이트의 팝업을 허용합니다
3. 다시 로그인을 시도합니다

### 6.2 "인증되지 않은 도메인입니다" 오류

**원인**: Firebase Authentication의 승인된 도메인 목록에 현재 도메인이 없습니다.

**해결 방법**:
1. Firebase Console → Authentication → Settings → 승인된 도메인
2. 현재 사용 중인 도메인을 추가합니다
3. 페이지를 새로고침하고 다시 시도합니다

### 6.3 "redirect_uri_mismatch" 오류

**원인**: GitHub OAuth App의 Authorization callback URL이 Firebase의 콜백 URL과 일치하지 않습니다.

**해결 방법**:
1. GitHub OAuth App 설정을 확인합니다
2. Authorization callback URL이 정확히 다음 형식인지 확인:
   ```
   https://your-project.firebaseapp.com/__/auth/handler
   ```
3. Firebase Console에서 Auth Domain을 확인합니다
4. 두 값이 일치하도록 수정합니다

### 6.4 "Firebase 인증이 초기화되지 않았습니다" 오류

**원인**: Firebase 설정이 올바르지 않거나 누락되었습니다.

**해결 방법**:
1. 좌측 툴바의 **⚙️ Firebase 설정** 버튼을 클릭합니다
2. 모든 필수 필드(API Key, Database URL, Auth Domain)를 입력합니다
3. **설정 저장** 버튼을 클릭합니다
4. 페이지를 새로고침합니다

### 6.5 "이 이메일은 다른 로그인 방법으로 이미 사용 중입니다" 오류

**원인**: 동일한 이메일 주소가 다른 인증 제공업체(예: Google)로 이미 등록되어 있습니다.

**해결 방법**:
1. Firebase Console → Authentication → Settings
2. **계정 중복 관리** 설정 확인
3. "동일한 이메일을 가진 여러 계정 허용" 옵션을 활성화합니다
4. 또는 먼저 등록된 제공업체로 로그인합니다

### 6.6 로컬 개발 시 HTTPS 오류

**원인**: Firebase Authentication은 `localhost`를 제외하고 HTTPS를 요구합니다.

**해결 방법**:
- `localhost` 또는 `127.0.0.1`을 사용하여 개발 서버에 접속합니다
- 또는 로컬 HTTPS 인증서를 설정합니다 ([mkcert](https://github.com/FiloSottile/mkcert) 사용 권장)

---

## 📚 참고 자료

- [Firebase Authentication 문서](https://firebase.google.com/docs/auth)
- [GitHub OAuth Apps 문서](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Firebase JavaScript SDK 참조](https://firebase.google.com/docs/reference/js/auth)

---

## 🆘 추가 도움이 필요하신가요?

문제가 해결되지 않는다면:

1. 브라우저 개발자 도구 콘솔(F12)에서 에러 메시지를 확인하세요
2. Firebase Console의 Authentication → Users 탭에서 사용자 로그를 확인하세요
3. GitHub Issues에 질문을 남겨주세요: [AI-Mindmap-Ideas Issues](https://github.com/k1300k/AI-Mindmap-Ideas/issues)

---

**마지막 업데이트**: 2025-11-14  
**버전**: v1.3.7
