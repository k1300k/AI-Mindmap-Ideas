# 🚀 IdeaFlow - 클라우드 동기화 마인드맵 대시보드

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Development](https://img.shields.io/badge/dev-Vibe%20Coding-purple)
![Mobile](https://img.shields.io/badge/mobile-optimized-brightgreen)
![Firebase](https://img.shields.io/badge/firebase-integrated-orange)
![Supabase](https://img.shields.io/badge/supabase-supported-green)
![Cloud Sync](https://img.shields.io/badge/cloud-sync-enabled-blue)
![Offline](https://img.shields.io/badge/offline-support-green)

**바이브코딩(Vibe Coding)**으로 개발된 차세대 마인드맵 대시보드입니다. AI와의 대화를 통해 점진적으로 발전하며, **Firebase** 및 **Supabase** 두 가지 백엔드 옵션을 지원합니다. 클라우드 저장, **멀티 디바이스 동기화**, **오프라인 지원**, **모바일 최적화** 기능을 제공합니다.

## 🆕 Supabase Edition (v2.0.0)

**Firebase 설정이 복잡하다면?** 이제 **Supabase**를 사용할 수 있습니다!

### 왜 Supabase인가?
- ✅ **더 간단한 설정** - Firebase보다 훨씬 쉬운 초기 설정
- ✅ **PostgreSQL 기반** - 강력한 SQL 쿼리 지원
- ✅ **오픈소스** - 벤더 종속성 낮음
- ✅ **직관적인 대시보드** - 데이터 관리가 쉬움
- ✅ **무료 플랜** - 작은 프로젝트에 충분

### 빠른 시작 (Supabase)
```bash
# 1. Supabase 데모 페이지 열기
open supabase-demo.html

# 2. Supabase 프로젝트 생성 (supabase.com)
# 3. URL과 Anon Key 입력
# 4. Google/GitHub 로그인 테스트

# 자세한 설정: SUPABASE_SETUP.md 참고
```

## 🎯 프로젝트 비전

**"질문으로 접근하는 생활형 불편 대응 아이디어"**를 시각화하고 관리하기 위한 최첨단 마인드맵 도구입니다. 일상 생활에서 발견한 불편함을 체계적으로 정리하고, 해결 아이디어를 확장해 나가며, 클라우드를 통해 언제 어디서나 접근할 수 있습니다.

## 🌟 핵심 기능

### ☁️ **클라우드 백엔드 지원** (v2.0.0)
두 가지 백엔드 옵션 중 선택:

#### Firebase Edition (기존)
- 🔄 **실시간 데이터베이스**: Firebase Realtime Database 연동
- 📱 **멀티 디바이스 동기화**: 여러 기기에서 동일한 데이터 접근
- 🔒 **자동 백업**: 연결 실패 시 LocalStorage로 자동 전환
- ⚙️ **간편한 설정**: 웹 인터페이스에서 직접 설정
- 📊 **연결 상태 모니터링**: 실시간 연결 상태 확인

#### Supabase Edition (신규! 🆕)
- 🐘 **PostgreSQL 데이터베이스**: 강력한 SQL 쿼리 지원
- ⚡ **실시간 동기화**: Firebase와 동일한 실시간 기능
- 🔐 **Row Level Security**: 코드 없이 보안 규칙 설정
- 🎯 **더 간단한 설정**: Firebase보다 쉬운 초기 설정
- 🌐 **오프라인 지원**: 인터넷 연결 없이도 작업 가능
- 📚 **풍부한 문서**: 상세한 설정 가이드 제공

### ✨ **인터랙티브 노드 관리**
- 🎯 **스마트 자식 노드 추가**: 부모 노드 선택 시 색상과 크기 자동 상속
- 🔄 **무한 확장 가능**: 노란색 노드에서 계속 노란색 자식 생성 가능
- 📝 **메모 기능**: 각 노드에 상세 메모 작성 가능
- 🖱️ **정밀한 드래그**: 5px 이상 이동 시에만 드래그 인식 (의도치 않은 이동 방지)
- 더블클릭으로 노드 편집 모달 열기
- 노드 크기 조절 (소/중/대)
- 10가지 색상 팔레트로 노드 색상 커스터마이징

### 🔗 **링크 연결 기능**
- 노드에 외부 URL 직접 연결
- 링크 클릭 시 새 창에서 열기
- 레퍼런스 관리 및 외부 리소스 연결

### 📱 **모바일 최적화** (v1.2.0)
- 📲 **터치 제스처**: 모바일에서 자연스러운 터치 조작
- 🔍 **핀치 줌**: 두 손가락으로 자유로운 줍 제스처
- 📏 **적절한 터치 영역**: 최소 44px 터치 영역 확보
- 🎯 **방향 패드 네비게이션**: 모바일에서 캔버스 이동 가능

### 💾 **자동 저장 시스템**
- 🔄 **실시간 클라우드 저장**: 모든 변경사항이 즉시 Firebase에 저장
- 📦 **JSON 파일 형식**: 데이터 다운로드/불러오기 지원
- 🔁 **브라우저 재방문 시 자동 복원**: 이전 작업 상태 유지
- 💾 **줌/패닝 상태 저장**: 확대/축소 및 위치 정보 함께 저장

### 🔍 **줌 & 패닝 기능**
- **25% ~ 300% 확대/축소**: 자유로운 줌 레벨 조절
- **Space 키 + 드래그**: 캔버스 패닝 (이동)
- **방향 패드**: 키보드로 정밀한 이동
- **마우스 휠**: 확대/축소
- **핀치 줌**: 모바일 터치 줌 지원

### 🎨 **UI/UX 개선**
- **반응형 디자인**: 모든 기기에서 최적화된 사용 경험
- **다크/라이트 모드**: 시스템 설정 자동 인식
- **부드러운 애니메이션**: 자연스러운 전환 효과
- **인라인 편집**: 더블클릭으로 빠른 편집

## 🚀 빠른 시작

### 옵션 1: Supabase Edition (추천 ⭐)

**더 간단한 설정을 원한다면 Supabase를 선택하세요!**

```bash
# 1. 저장소 클론
git clone https://github.com/k1300k/AI-Mindmap-Ideas.git
cd AI-Mindmap-Ideas

# 2. 로컬 서버 실행
python -m http.server 8000
# 또는 npx serve .

# 3. Supabase 데모 열기
open http://localhost:8000/supabase-demo.html

# 4. Supabase 설정 (자세한 내용은 SUPABASE_SETUP.md 참고)
# - supabase.com에서 프로젝트 생성
# - SQL Editor에서 supabase-schema.sql 실행
# - URL과 Anon Key를 데모 페이지에 입력
```

### 옵션 2: Firebase Edition (기존)

```bash
# 1. 저장소 클론
git clone https://github.com/k1300k/AI-Mindmap-Ideas.git
cd AI-Mindmap-Ideas

# 2. 로컬 서버 실행
python -m http.server 8000
# 또는 npx serve .

# 3. Firebase 설정
# - 좌측 툴바의 ⚙️ Firebase 설정 버튼 클릭
# - Firebase 콘솔에서 프로젝트 생성
# - Realtime Database 활성화
# - 설정 정보 입력 및 저장
```

### 웹에서 바로 사용하기
```
https://ai-mindmap-ideas.vercel.app
```

## 📖 상세 사용법

### 기본 사용법
1. **노드 추가**: 좌측 패널에서 "노드 추가" 버튼 클릭 후 부모 노드 선택 (단축키: N)
2. **링크 추가**: 좌측 패널에서 "링크 추가" 버튼 클릭 후 연결할 2개 노드 순서대로 선택 (단축키: L)
3. **노드 편집**: 노드 더블클릭 또는 우클릭 → 편집
4. **줌 조절**: 마우스 휠 또는 우측 줌 컨트롤 사용
5. **캔버스 이동**: Space 키 + 드래그 또는 방향 키

### 클라우드 백엔드 설정 가이드
- **Supabase 설정**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 📚 상세 가이드
- **Firebase 설정**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### 소셜 로그인 사용하기 (Google / GitHub)
1. **Firebase 설정 완료**: Firebase Authentication이 활성화되어야 합니다
2. **Auth Domain 설정**: Firebase 설정에서 Auth Domain 입력 (예: `your-project.firebaseapp.com`)
3. **헤더에서 로그인**: 우측 상단의 "Google" 또는 "GitHub" 버튼 클릭
4. **팝업 허용**: 브라우저에서 팝업을 허용해야 합니다
5. **자동 로그인**: 다음 방문 시 자동으로 로그인 상태 유지

**주의사항**:
- Firebase 콘솔에서 Google 및 GitHub 인증 제공업체를 활성화해야 합니다
- GitHub 로그인 설정 방법은 [GITHUB_AUTH_SETUP.md](./GITHUB_AUTH_SETUP.md) 참고
- 사용 중인 도메인이 Firebase의 승인된 도메인 목록에 있어야 합니다
- 로컬 테스트 시 `localhost`는 자동으로 허용됩니다

### 템플릿 사용
- **기본 템플릿**: 빈 마인드맵에서 시작
- **프로젝트 기획**: 프로젝트 관련 마인드맵
- **공부 계획**: 학습 계획 마인드맵

## 🛠 기술 스택

### 코어 기술
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **클라우드 데이터베이스**: 
  - Firebase Realtime Database (NoSQL)
  - Supabase PostgreSQL (SQL) 🆕
- **저장소**: Cloud Database (Primary), LocalStorage API (Backup)

### 라이브러리 & 서비스
- **Firebase SDK**: 9.22.0 (Firebase Edition)
- **Supabase JS**: 2.x (Supabase Edition) 🆕
- **html2canvas**: 1.4.1 (PNG 내보내기)
- **Font Awesome**: 6.4.0 (아이콘)
- **Google Fonts**: Noto Sans KR (폰트)

### 개발 방식
- **Vibe Coding**: AI와의 대화를 통한 점진적 개발
- **반응형 디자인**: 모바일 퍼스트 접근법
- **접근성**: WCAG 2.1 준수

## 📁 프로젝트 구조

```
ideaflow/
├── index.html                    # 메인 HTML (Firebase)
├── supabase-demo.html            # Supabase 데모 🆕
├── css/
│   └── style.css                # 스타일시트
├── js/
│   ├── main.js                  # 핵심 JavaScript (Firebase)
│   ├── firebase-config.js       # Firebase 설정
│   ├── firebase-config-manager.js # Firebase UI 관리
│   └── supabase-config.js       # Supabase 설정 🆕
├── supabase-schema.sql          # Supabase DB 스키마 🆕
├── FIREBASE_SETUP.md            # Firebase 설정 가이드
├── SUPABASE_SETUP.md            # Supabase 설정 가이드 🆕
├── README.md                    # 프로젝트 문서
└── LICENSE                      # MIT 라이선스
```

## 📊 데이터 구조

### 마인드맵 데이터 형식
```json
{
  "version": "1.3.0",
  "id": "default",
  "title": "마인드맵 제목",
  "nodes": [
    {
      "id": "node-1",
      "content": "노드 내용",
      "x": 100,
      "y": 100,
      "color": "#3B82F6",
      "size": "medium",
      "memo": "노드 메모"
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

## 🔄 최근 업데이트

### v2.0.0 (2025-11-14) - Supabase 지원 추가 🚀
- ✅ **Supabase Edition 출시** - Firebase의 복잡성을 해결하는 대안
- ✅ **PostgreSQL 기반 데이터베이스** - 강력한 SQL 쿼리 지원
- ✅ **더 간단한 설정 프로세스** - Firebase보다 쉬운 초기 설정
- ✅ **Row Level Security** - 코드 없이 보안 규칙 설정
- ✅ **실시간 동기화** - Firebase와 동일한 실시간 기능
- ✅ **Supabase 데모 페이지** - 빠른 테스트를 위한 데모 UI
- ✅ **상세한 설정 가이드** - SUPABASE_SETUP.md 문서 제공
- ✅ **Google/GitHub 로그인** - Supabase Authentication 통합

### v1.4.0 (2025-11-14) - GitHub 로그인 추가 🔐 (Firebase)
- ✅ **GitHub OAuth 인증 통합** - Firebase Authentication으로 GitHub 로그인 지원
- ✅ **다중 인증 제공자** - Google과 GitHub 동시 지원
- ✅ **향상된 로그인 UI** - 프로바이더별 카드 UI로 직관적인 인증 경험
- ✅ **통합 인증 관리** - 하나의 인증 시스템으로 여러 소셜 로그인 관리
- ✅ **상세 설정 가이드** - GitHub OAuth App 설정 가이드 문서 추가
- ✅ **개선된 에러 처리** - 각 인증 제공자별 구체적인 에러 메시지

### v1.3.6 (2025-11-11) - 링크 추가 기능 강화 🔗
- ✅ **링크 추가 버튼** - 좌측 툴바에 "링크 추가" 버튼 추가
- ✅ **2단계 노드 선택** - 첫 번째 노드 선택 후 두 번째 노드 선택으로 연결
- ✅ **시각적 피드백** - 선택 중인 노드에 애니메이션 효과 및 강조 표시
- ✅ **중복 연결 방지** - 이미 연결된 노드는 재연결 불가
- ✅ **L 키 단축키** - 키보드 L 키로 빠른 링크 추가 모드 진입
- ✅ **Toast 알림** - 각 단계마다 명확한 안내 메시지 표시
- ✅ **ESC 취소** - 링크 추가 중 언제든지 ESC 키로 취소 가능

### v1.3.5 (2025-11-11) - Google 로그인 활성화 🔐
- ✅ **Google 인증 통합** - Firebase Authentication으로 Google 로그인 지원
- ✅ **헤더 인증 UI** - 로그인 상태 표시 및 사용자 프로필 아바타
- ✅ **지속적 로그인** - 페이지 새로고침 후에도 로그인 상태 유지
- ✅ **향상된 에러 처리** - 팝업 차단, 도메인 미인증 등 상세한 에러 안내
- ✅ **실시간 상태 업데이트** - Firebase Auth 상태 리스너로 즉각적인 UI 반영
- ✅ **사용자 경험 개선** - Toast 알림으로 모든 인증 액션 피드백 제공

### v1.3.4 (2025-11-11) - Firebase 초기화 개선 및 사용자 안내 강화 🔧
- ✅ **Firebase 초기화 로직 통합** - 중복 코드 제거 및 단일 초기화 함수로 통합
- ✅ **설정 검증 기능** - Firebase 설정 누락 시 친절한 안내 메시지 표시
- ✅ **타입별 Toast 알림** - Success, Error, Warning, Info 타입별 색상 스타일 추가
- ✅ **향상된 에러 메시지** - 구체적인 문제 진단 및 해결 방법 안내
- ✅ **자동 안내 시스템** - 첫 실행 시 Firebase 설정 안내 자동 표시
- ✅ **LocalStorage 폴백** - Firebase 미설정 시 LocalStorage로 자동 전환
- ✅ **개선된 로깅** - 이모지 아이콘으로 디버깅 용이성 향상

### v1.3.3 (2025-11-11) - Firebase 설정 모달 표시 개선 🛠️
- ✅ Firebase 설정 버튼을 눌렀을 때 모달이 즉시 표시되도록 오버레이 레이아웃을 수정했습니다.
- ✅ 설정 창이 화면 중앙에 고정되고 배경이 어둡게 처리되어 집중도가 향상되었습니다.
- ✅ README와 Firebase 가이드를 최신 상태로 업데이트했습니다.

### v1.3.0 (2025-11-11) - Firebase 통합 🚀
- ✅ **Firebase Realtime Database 통합**
- ✅ **멀티 디바이스 동기화** - 여러 기기에서 동일한 데이터 접근
- ✅ **실시간 클라우드 저장** - 모든 변경사항 즉시 Firebase에 저장
- ✅ **오프라인 지원** - 인터넷 연결 없이도 작업 가능
- ✅ **Firebase 설정 UI** - 웹 인터페이스에서 직접 Firebase 설정
- ✅ **연결 상태 모니터링** - 실시간 Firebase 연결 상태 확인
- ✅ **향상된 설정 화면** - 탭 기반 인터페이스, 시각적 개선

### v1.2.0 (2025-11-09) - 모바일 최적화 📱
- ✅ **자동 저장 시스템** - 모든 변경사항 실시간 저장
- ✅ **줌 기능** - 25% ~ 300% 확대/축소, 핀치 줌 지원
- ✅ **캔버스 패닝** - Space 키 + 드래그, 방향 패드
- ✅ **PNG 내보내기** - 마인드맵을 이미지로 저장
- ✅ **모바일 최적화** - 터치 제스처, 핀치 줌, 방향 패드 네비게이션

## 🧪 개발 로드맵

### 완료된 기능 ✅
- [x] **사용자 인증 시스템** - Google/GitHub 로그인 (v1.4.0)
- [x] **Supabase 지원** - Firebase 대안 제공 (v2.0.0)
- [x] **실시간 동기화** - 클라우드 기반 데이터 동기화

### 예정된 기능 🔮
- [ ] **완전한 Supabase 마인드맵 앱** - 전체 기능 통합
- [ ] **공유 및 협업** - 실시간 다중 사용자 편집
- [ ] **고급 템플릿** - 더 많은 사전 정의 템플릿
- [ ] **데이터 분석** - 마인드맵 사용 패턴 분석
- [ ] **내보내기 개선** - PDF, SVG 등 다양한 형식 지원
- [ ] **PocketBase 지원** - 로컬 호스팅 옵션 추가

## 🤝 기여하기

이 프로젝트는 Vibe Coding 방식으로 개발되고 있습니다. 버그 리포트, 기능 제안, 개선 아이디어를 환영합니다!

### 기여 방법
1. 이슈를 생성하여 버그나 기능 제안
2. 개선사항이 있다면 PR 생성
3. 문서 개선 제안 환영

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🙏 감사의 말

이 프로젝트는 AI와의 대화를 통해 개발되었습니다. 지속적인 개선과 함께 더 나은 도구를 만들어가겠습니다.

---

**Made with ❤️ by AI-Powered Vibe Coding**

*버전: 2.0.0 | Supabase Edition | 최종 업데이트: 2025-11-14*

### 🌟 특별한 점
- **AI 기반 개발**: Claude AI와의 협업으로 개발
- **지속적 진화**: 사용자 피드백을 반영한 지속적 개선
- **커뮤니티 중심**: 오픈소스로 누구나 기여 가능
- **교육적 가치**: 웹 개발 학습에 활용 가능