# Firebase 개별 설정 창 가이드

## 개요

Firebase 개별 설정 창은 IdeaFlow 마인드맵 대시보드에서 Firebase 프로젝트를 개별적으로 설정하고 Google 계정을 연결할 수 있는 전용 인터페이스입니다. 이 설정 창은 개발 이력 창과 유사한 형태로 표시되며, Firebase Realtime Database 연결과 Google 인증을 한 곳에서 관리할 수 있습니다.

## 주요 기능

### 🔧 Firebase 프로젝트 설정
- **실시간 데이터베이스 연결**: Firebase Realtime Database URL 설정
- **프로젝트 인증 정보**: API 키, 프로젝트 ID, 인증 도메인 설정
- **연결 테스트**: 설정 즉시 연결 상태 확인
- **자동 저장**: 설정 정보가 브라우저에 자동 저장

### 🔗 Google 계정 연결
- **Google OAuth 2.0 인증**: Google 계정으로 로그인
- **계정 상태 관리**: 로그인/로그아웃 기능
- **프로필 정보 표시**: 연결된 계정 정보 확인
- **권한 관리**: 필요한 권한 요청 및 관리

### 📊 연결 상태 모니터링
- **실시간 상태 표시**: Firebase 연결 상태 실시간 모니터링
- **시각적 인디케이터**: 연결 상태에 따른 색상 표시 (초록/노랑/빨강)
- **자동 재연결**: 연결이 끊어진 경우 자동 재연결 시도
- **오류 알림**: 연결 문제 발생 시 사용자 알림

## 사용 방법

### 1. Firebase 개별 설정 창 열기

좌측 툴바에서 **⚙️ Firebase 설정** 버튼을 클릭하면 개발 이력 창과 유사한 형태의 설정 창이 표시됩니다.

### 2. Firebase 프로젝트 설정

#### 필수 정보 입력
```
API Key: AIzaSyB_1K5fR9xD2fG7h8jKlMnOpQrStUvWxYz
Database URL: https://your-project-default-rtdb.firebaseio.com
Project ID: your-project-id
Auth Domain: your-project.firebaseapp.com
Storage Bucket: your-project.appspot.com
Messaging Sender ID: 123456789012
App ID: 1:123456789012:web:abcd1234efgh5678
```

#### 설정 정보 가져오기
1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. 프로젝트 설정 → 일반 탭 → 내 앱 섹션
3. 웹 앱 아이콘 클릭
4. Firebase 구성 정보 복사

### 3. Google 계정 연결

#### Google 로그인
1. 설정 창의 **Google 계정 연결** 섹션에서 **Google로 로그인** 버튼 클릭
2. Google 계정 선택 및 권한 허용
3. 연결 성공 시 계정 정보 표시

#### 연결 해제
- **로그아웃** 버튼 클릭으로 계정 연결 해제
- 로컬 인증 정보 자동 삭제

### 4. 연결 테스트

#### 자동 테스트
- 설정 적용 시 자동으로 연결 테스트 실행
- 성공/실패 결과 즉시 표시

#### 수동 테스트
- **연결 테스트** 버튼으로 수동 테스트 가능
- 상세한 연결 상태 정보 확인

## 고급 기능

### 🔄 멀티 디바이스 동기화
- **실시간 동기화**: 여러 기기에서 동시 작업 가능
- **衝突解決**: 동시 편집 시 자동 충돌 해결
- **오프라인 지원**: 인터넷 연결 없이도 작업 가능

### 📈 성능 최적화
- **지연 로딩**: 필요한 시점에 데이터 로드
- **캐싱 전략**: 효율적인 데이터 캐싱
- **압축 전송**: 데이터 전송 시 압축 적용

### 🔒 보안 기능
- **인증 토큰 관리**: 안전한 토큰 저장 및 갱신
- **권한 검증**: 데이터베이스 접근 권한 확인
- **암호화**: 민감한 데이터 암호화 저장

## 문제 해결

### 설정 창이 뜨지 않는 경우

#### 원인 분석
1. JavaScript 오류 확인
2. 브라우저 콘솔 로그 확인
3. CSS 스타일 충돌 확인

#### 해결 방법
```javascript
// 설정 창 수동 열기
document.getElementById('firebaseConfigBtn').click();

// 또는 직접 설정 창 HTML 로드
window.open('firebase-individual-config.html', 'firebase_config', 'width=800,height=600');
```

### Firebase 연결 실패

#### 일반적인 원인
1. **잘못된 설정 정보**: API 키, 데이터베이스 URL 오류
2. **네트워크 문제**: 인터넷 연결 불안정
3. **Firebase 서비스 문제**: Firebase 서버 일시 중단
4. **보안 규칙**: 데이터베이스 보안 규칙 제한

#### 해결 단계
1. **설정 정보 재확인**: Firebase 콘솔에서 정보 다시 복사
2. **네트워크 진단**: 인터넷 연결 상태 확인
3. **보안 규칙 검사**: 데이터베이스 보안 규칙 확인
4. **브라우저 캐시 삭제**: 오래된 캐시 제거

### Google 계정 연결 오류

#### 인증 오류
- **오류 코드**: 403, 404, 500 등
- **권한 부족**: 필요한 권한 미허용
- **계정 제한**: Google 계정 설정 문제

#### 해결 방법
1. **권한 재설정**: Google 계정 권한 다시 설정
2. **시크릿 모드 사용**: 브라우저 확장 프로그램 충돌 방지
3. **계정 전환**: 다른 Google 계정 사용

## 개발자 가이드

### 설정 창 커스터마이징

#### CSS 스타일 변경
```css
/* Firebase 설정 모달 스타일 */
.firebase-config-modal {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Google 로그인 버튼 */
.google-signin-btn {
    background: linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335);
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
}
```

#### JavaScript 기능 확장
```javascript
// Firebase 설정 관리자 확장
const firebaseConfigManager = {
    // 기존 기능...
    
    // 커스텀 기능 추가
    customSetup: function() {
        // 사용자 정의 설정 로직
    },
    
    // 이벤트 리스너 확장
    addCustomListeners: function() {
        document.getElementById('customBtn').addEventListener('click', this.customHandler);
    }
};
```

### API 통합

#### 외부 서비스 연동
```javascript
// Google Analytics 통합
gtag('event', 'firebase_config_open', {
    'event_category': 'config',
    'event_label': 'firebase_individual'
});

// 사용자 행동 추적
firebaseConfigManager.trackUserAction = function(action) {
    gtag('event', 'firebase_config_action', {
        'action_type': action,
        'timestamp': new Date().toISOString()
    });
};
```

## 업데이트 로그

### v1.3.1 (2025-11-11)
- ✅ Firebase 개별 설정 창 추가
- ✅ Google 계정 연결 기능 구현
- ✅ 개발 이력 창과 유사한 UI 적용
- ✅ 실시간 연결 상태 모니터링
- ✅ 자동 저장 및 복원 기능
- ✅ 모바일 반응형 디자인 지원

### 향후 계획
- 🔐 **고급 인증 기능**: 다중 인증 방식 지원
- 📊 **분석 대시보드**: 사용 통계 및 분석
- 🌐 **다국어 지원**: 한국어, 영어, 일본어
- 🔄 **자동 백업**: 정기적인 데이터 백업
- 🚀 **성능 최적화**: 대용량 데이터 처리 개선

## 기술 지원

### 문서 및 리소스
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Google OAuth 2.0 가이드](https://developers.google.com/identity/protocols/oauth2)
- [IdeaFlow GitHub 저장소](https://github.com/k1300k/AI-Mindmap-Ideas)

### 커뮤니티
- 이슈 보고: GitHub Issues
- 기능 제안: GitHub Discussions
- 일반 문의: 프로젝트 이메일

---

**문의사항**: 프로젝트 GitHub 저장소에 이슈를 생성해 주세요.

**마지막 업데이트**: 2025-11-11