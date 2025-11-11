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
1. 좌측 툴바의 "Firebase 설정" 버튼 클릭
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

## 보안 고려사항

- 실제 운영환경에서는 Firebase 보안 규칙을 더 엄격하게 설정
- 사용자 인증을 추가하여 개인 데이터 보호
- API 키는 공개되어도 문제없지만, 보안 규칙으로 접근 제어

## 추가 기능

- 사용자 인증 추가 (선택사항)
- 여러 마인드맵 관리
- 공유 및 협업 기능
- 데이터 백업 및 복원 기능