# 🚀 Supabase 설정 가이드

이 문서는 IdeaFlow 마인드맵 대시보드를 **Supabase**와 연동하는 방법을 단계별로 안내합니다.

## 📌 목차
1. [Supabase란?](#supabase란)
2. [왜 Firebase 대신 Supabase를 선택했나요?](#왜-firebase-대신-supabase를-선택했나요)
3. [Supabase 프로젝트 생성](#supabase-프로젝트-생성)
4. [데이터베이스 설정](#데이터베이스-설정)
5. [인증 설정 (Google, GitHub)](#인증-설정)
6. [애플리케이션 연동](#애플리케이션-연동)
7. [문제 해결](#문제-해결)

---

## 🎯 Supabase란?

**Supabase**는 "오픈소스 Firebase 대안"으로 불리는 BaaS(Backend as a Service) 플랫폼입니다.

### 핵심 기능
- **PostgreSQL 데이터베이스** - 강력한 관계형 데이터베이스
- **실시간 구독** - Firebase Realtime Database와 유사한 기능
- **인증 시스템** - Google, GitHub 등 소셜 로그인 지원
- **Row Level Security** - 데이터 접근 제어
- **RESTful API** - 자동 생성되는 API
- **Storage** - 파일 저장 기능

---

## 💡 왜 Firebase 대신 Supabase를 선택했나요?

| 특징 | Firebase | Supabase |
|------|----------|----------|
| **데이터베이스** | NoSQL (Firestore) | PostgreSQL (SQL) |
| **설정 복잡도** | ⭐⭐⭐⭐ (복잡) | ⭐⭐ (간단) |
| **SQL 쿼리** | ❌ 불가능 | ✅ 가능 |
| **오픈소스** | ❌ | ✅ |
| **가격** | 무료 → 유료 (단계적) | 무료 플랜 충분 |
| **학습 곡선** | 가파름 | 완만함 |
| **벤더 종속성** | 높음 | 낮음 |

### Supabase의 장점
1. **PostgreSQL 기반** - SQL을 알고 있다면 즉시 사용 가능
2. **직관적인 대시보드** - 데이터 관리가 쉬움
3. **Row Level Security** - 코드 없이 보안 규칙 설정
4. **자동 API 생성** - 테이블 생성 시 REST API 자동 제공
5. **GitHub 기반 워크플로우** - Git과 자연스럽게 통합

---

## 🛠 Supabase 프로젝트 생성

### 1단계: 계정 생성
1. [supabase.com](https://supabase.com) 접속
2. **"Start your project"** 클릭
3. **GitHub 계정으로 로그인** (권장)

### 2단계: 새 프로젝트 생성
1. 대시보드에서 **"New Project"** 클릭
2. 다음 정보 입력:
   ```
   Name: ideaflow-mindmap
   Database Password: [강력한 비밀번호 입력 - 꼭 저장하세요!]
   Region: Northeast Asia (Seoul) - 가장 가까운 리전 선택
   Pricing Plan: Free (무료)
   ```
3. **"Create new project"** 클릭
4. 프로젝트 생성 대기 (약 2분 소요)

### 3단계: API 키 확인
프로젝트가 생성되면 **Settings > API**로 이동:

```
Project URL: https://your-project.supabase.co
anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **중요**: `service_role` 키는 절대 클라이언트에 노출하지 마세요!

---

## 💾 데이터베이스 설정

### 1단계: SQL 에디터로 테이블 생성

Supabase 대시보드에서 **SQL Editor** 탭으로 이동 후 아래 SQL 실행:

```sql
-- 마인드맵 데이터 테이블
CREATE TABLE mindmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '새 마인드맵',
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) 활성화
ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 마인드맵만 조회 가능
CREATE POLICY "사용자는 자신의 마인드맵만 조회 가능"
  ON mindmaps FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 마인드맵만 생성 가능
CREATE POLICY "사용자는 자신의 마인드맵만 생성 가능"
  ON mindmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 마인드맵만 수정 가능
CREATE POLICY "사용자는 자신의 마인드맵만 수정 가능"
  ON mindmaps FOR UPDATE
  USING (auth.uid() = user_id);

-- 사용자는 자신의 마인드맵만 삭제 가능
CREATE POLICY "사용자는 자신의 마인드맵만 삭제 가능"
  ON mindmaps FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_mindmaps_user_id ON mindmaps(user_id);
CREATE INDEX idx_mindmaps_updated_at ON mindmaps(updated_at DESC);

-- 자동 updated_at 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 설정
CREATE TRIGGER update_mindmaps_updated_at
  BEFORE UPDATE ON mindmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2단계: 실시간 구독 활성화

**Database > Replication** 탭으로 이동:
1. `mindmaps` 테이블 찾기
2. **"Realtime"** 토글을 **ON**으로 변경
3. 이제 데이터 변경이 실시간으로 구독됩니다!

---

## 🔐 인증 설정

### Google 로그인 설정

1. **Authentication > Providers** 탭으로 이동
2. **Google** 제공자 선택
3. **"Enable Sign in with Google"** 토글 ON

#### Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services > OAuth consent screen** 설정
4. **Credentials > Create Credentials > OAuth 2.0 Client ID**
5. 다음 정보 입력:
   ```
   Application type: Web application
   Name: IdeaFlow Mindmap
   Authorized redirect URIs: 
     https://your-project.supabase.co/auth/v1/callback
   ```
6. **Client ID**와 **Client Secret** 복사
7. Supabase의 Google 제공자 설정에 입력

### GitHub 로그인 설정

1. **Authentication > Providers** 탭에서 **GitHub** 선택
2. **"Enable Sign in with GitHub"** 토글 ON

#### GitHub OAuth App 설정
1. [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers) 접속
2. **"New OAuth App"** 클릭
3. 다음 정보 입력:
   ```
   Application name: IdeaFlow Mindmap
   Homepage URL: https://your-domain.com (또는 http://localhost:8000)
   Authorization callback URL: 
     https://your-project.supabase.co/auth/v1/callback
   ```
4. **Client ID**와 **Client Secret** 복사
5. Supabase의 GitHub 제공자 설정에 입력

### 승인된 도메인 추가

**Authentication > URL Configuration**에서:
```
Site URL: https://your-domain.com
Redirect URLs: 
  http://localhost:8000
  https://your-domain.com
```

---

## 🔌 애플리케이션 연동

### 1단계: HTML 파일 수정

`index-supabase.html` 파일을 사용하거나 기존 `index.html`을 수정:

```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-config.js"></script>
```

### 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성 (Git에 커밋하지 마세요!):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

또는 JavaScript 파일에서 직접 설정:

```javascript
// js/supabase-config.js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3단계: 로컬 서버 실행

```bash
# Python 서버
python -m http.server 8000

# 또는 Node.js 서버
npx serve .
```

브라우저에서 `http://localhost:8000/index-supabase.html` 접속

---

## 🔍 주요 기능 사용법

### 로그인하기
1. 우측 상단의 **"Google"** 또는 **"GitHub"** 버튼 클릭
2. 팝업 창에서 계정 선택 및 승인
3. 자동으로 로그인 상태 유지

### 마인드맵 저장
- 노드를 추가/수정/삭제하면 **자동으로 Supabase에 저장**됩니다
- 저장 상태는 좌측 하단에 표시됩니다

### 실시간 동기화
- 다른 기기에서 동일한 계정으로 로그인하면
- 마인드맵이 **실시간으로 동기화**됩니다
- 변경사항이 즉시 반영됩니다

---

## 🐛 문제 해결

### 1. 로그인 팝업이 차단됨
**해결 방법:**
- 브라우저 주소창 오른쪽의 팝업 차단 아이콘 클릭
- `https://your-project.supabase.co` 도메인 허용

### 2. "Auth session missing!" 에러
**원인:** Supabase URL 또는 Anon Key가 잘못되었습니다.

**해결 방법:**
1. Supabase 대시보드에서 API 키 다시 확인
2. `js/supabase-config.js` 파일의 키가 올바른지 확인
3. 페이지 새로고침 (Ctrl + F5)

### 3. 데이터가 저장되지 않음
**원인:** Row Level Security 정책이 잘못되었거나 로그인하지 않았습니다.

**해결 방법:**
1. 로그인 상태 확인 (우측 상단에 프로필 사진 표시)
2. Supabase 대시보드 > **Database > Tables > mindmaps** 확인
3. RLS 정책이 올바르게 설정되었는지 확인

### 4. CORS 에러
**원인:** 로컬 파일을 직접 열었습니다 (file:///)

**해결 방법:**
- 반드시 로컬 서버를 통해 접속하세요:
  ```bash
  python -m http.server 8000
  # 그리고 http://localhost:8000 접속
  ```

### 5. 실시간 동기화가 작동하지 않음
**해결 방법:**
1. Supabase 대시보드 > **Database > Replication** 확인
2. `mindmaps` 테이블의 Realtime이 활성화되어 있는지 확인
3. 브라우저 콘솔에서 WebSocket 연결 상태 확인

---

## 📊 데이터 구조

Supabase `mindmaps` 테이블 구조:

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | UUID | 마인드맵 고유 ID (자동 생성) |
| `user_id` | UUID | 사용자 ID (auth.users 참조) |
| `title` | TEXT | 마인드맵 제목 |
| `data` | JSONB | 노드, 연결선, 줌 등 전체 데이터 |
| `created_at` | TIMESTAMP | 생성 시각 |
| `updated_at` | TIMESTAMP | 수정 시각 (자동 업데이트) |

### data 컬럼 JSON 구조 예시
```json
{
  "version": "2.0.0",
  "nodes": [
    {
      "id": "node-1",
      "content": "중앙 아이디어",
      "x": 400,
      "y": 300,
      "color": "#3B82F6",
      "size": "large",
      "memo": "메모 내용",
      "url": "https://example.com"
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "from": "node-1",
      "to": "node-2"
    }
  ],
  "zoom": 1,
  "pan": { "x": 0, "y": 0 }
}
```

---

## 🚀 배포하기

### Vercel 배포 (권장)

1. GitHub 저장소에 푸시
2. [vercel.com](https://vercel.com) 접속
3. **"Import Project"** 클릭
4. GitHub 저장소 선택
5. 환경 변수 설정:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```
6. **"Deploy"** 클릭

### Netlify 배포

1. GitHub 저장소에 푸시
2. [netlify.com](https://netlify.com) 접속
3. **"New site from Git"** 클릭
4. GitHub 저장소 선택
5. Build settings:
   ```
   Build command: (비워둠)
   Publish directory: .
   ```
6. 환경 변수 설정 (Vercel과 동일)
7. **"Deploy site"** 클릭

---

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL 튜토리얼](https://www.postgresqltutorial.com/)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💬 지원

문제가 발생하면 다음을 확인하세요:
1. 브라우저 개발자 도구 콘솔 (F12)
2. Supabase 대시보드의 Logs 탭
3. GitHub Issues에 질문 올리기

**Made with ❤️ by AI-Powered Development**

*버전: 2.0.0 | Supabase Edition | 최종 업데이트: 2025-11-14*
