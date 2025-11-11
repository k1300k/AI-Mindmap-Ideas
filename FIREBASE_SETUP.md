# Firebase 설정 가이드

## Firebase 프로젝트 만들기

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: IdeaFlow-Mindmap)
4. Google Analytics 설정은 필요에 따라 활성화
5. 프로젝트 생성 완료

## Realtime Database 설정

1. Firebase 콘솔에서 생성한 프로젝트로 이동
2. 왼쪽 메뉴에서 "Realtime Database" 클릭
3. "데이터베이스 만들기" 클릭
4. 데이터베이스 위치 선택 (가까운 위치 권장)
5. 보안 규칙 설정:

```json
{
  "rules": {
    "mindmaps": {
      "$user_id": {
        ".read": "$user_id === auth.uid",
        ".write": "$user_id === auth.uid"
      }
    }
  }
}
```

## Firebase 설정 정보 가져오기

1. Firebase 콘솔에서 프로젝트 설정 클릭 (톱니바퀴 아이콘)
2. "일반" 탭에서 "내 앱" 섹션으로 스크롤
3. 앱 등록 (웹 앱 아이콘 클릭)
4. 앱 닉네임 입력 (예: IdeaFlow Web)
5. Firebase Hosting은 건너뛰기
6. 설정 정보 복사

## 설정 정보 입력

IdeaFlow 앱에서:
1. 좌측 툴바의 "Firebase 설정" 버튼을 클릭하면 화면 중앙에 설정 모달이 열립니다.
2. Firebase 콘솔에서 복사한 정보를 각 필드에 입력
3. "설정 적용" 클릭

## 필수 필드

- **API Key**: Firebase 프로젝트의 API 키
- **Database URL**: Realtime Database URL
- **Project ID**: Firebase 프로젝트 ID

## 테스트

설정 후 자동으로 데이터가 Firebase에 저장되고 불러와지는지 확인:
1. 노드를 몇 개 추가
2. 페이지 새로고침
3. 이전 작업이 복원되는지 확인

## 문제 해결

### Firebase 설정 창이 표시되지 않을 때
- 최신 버전(v1.3.3 이상)의 스타일시트를 사용 중인지 확인합니다.
- 브라우저 캐시를 강력 새로고침(Ctrl/Cmd + Shift + R)하여 오버레이 스타일이 반영되었는지 확인합니다.
- 여전히 나타나지 않으면 개발자 도구 콘솔의 오류 메시지를 확인하고 이슈를 등록해주세요.

### Firebase 초기화 실패
- 설정 정보가 정확한지 확인
- 인터넷 연결 상태 확인
- 브라우저 콘솔 에러 메시지 확인

### 데이터 저장 실패
- Firebase 보안 규칙 확인
- 데이터베이스 용량 제한 확인
- 네트워크 연결 상태 확인

### 데이터 불러오기 실패
- LocalStorage 백업에서 자동으로 불러오는지 확인
- Firebase 콘솔에서 데이터가 저장되었는지 확인

## Google 로그인 설정 (v1.3.5 추가)

### Firebase Authentication 활성화
1. Firebase 콘솔에서 프로젝트로 이동
2. 왼쪽 메뉴에서 "Authentication" 클릭
3. "Sign-in method" 탭 선택
4. "Google" 제공업체 클릭하여 활성화
5. 프로젝트 공개용 이름 입력
6. 프로젝트 지원 이메일 선택
7. "저장" 클릭

### 승인된 도메인 추가
1. Authentication > Settings > Authorized domains
2. 사용할 도메인 추가 (예: `your-app.vercel.app`)
3. 로컬 테스트용 `localhost`는 기본적으로 포함됨

### 앱에서 로그인 사용
1. Firebase 설정에서 **Auth Domain**이 입력되어 있는지 확인
2. 헤더 우측 상단의 "Google 로그인" 버튼 클릭
3. Google 계정 선택 팝업에서 계정 선택
4. 로그인 성공 시 프로필 아바타와 이름 표시
5. 로그아웃하려면 이름 옆 "로그아웃" 버튼 클릭

### 문제 해결

#### 팝업이 차단될 때
- 브라우저 주소창 오른쪽의 팝업 차단 아이콘 클릭
- 팝업 허용 선택 후 다시 로그인 시도

#### "인증되지 않은 도메인" 에러
- Firebase 콘솔 > Authentication > Settings > Authorized domains
- 현재 사용 중인 도메인 추가

#### Auth Domain 관련 에러
- Firebase 설정 모달에서 Auth Domain이 올바르게 입력되었는지 확인
- 형식: `your-project-id.firebaseapp.com`

## 보안 고려사항

- 실제 운영환경에서는 Firebase 보안 규칙을 더 엄격하게 설정
- **Google 로그인 사용 시**: 사용자별 데이터 분리 구현 권장
- API 키는 공개되어도 문제없지만, 보안 규칙으로 접근 제어
- 사용자 인증 정보는 Firebase가 안전하게 관리

## 추가 기능

- ✅ **Google 로그인** - v1.3.5에서 구현됨
- 여러 마인드맵 관리
- 공유 및 협업 기능
- 데이터 백업 및 복원 기능