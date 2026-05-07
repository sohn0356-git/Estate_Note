# Estate Note

Estate Note는 부동산 공부를 날짜별 폴더 형태로 정리하는 React 기반 학습 사이트입니다.

## 프로젝트 구성

- `index.html`: React 앱을 렌더링하는 메인 페이지
- `styles.css`: 앱 UI 스타일
- `script.js`: React 컴포넌트와 동적 콘텐츠 로딩
- `days/index.json`: 날짜별 학습 폴더 목록
- `days/YYYY-MM-DD/meta.json`: 해당 날짜의 제목, 설명, GPT 토막상식
- `days/YYYY-MM-DD/links.json`: 해당 날짜의 유튜브 링크 5개
- `design.md`: 참고 디자인과 영감 출처

## 날짜별 폴더 구조

날짜별 폴더를 추가하면 사이트에서 자동으로 목록을 보여줍니다.

예시:

```
Estate_Note/
  days/
    2026-05-07/
      meta.json
      links.json
    index.json
```

### 폴더 추가 방법

1. `days/` 아래에 `YYYY-MM-DD` 형식의 폴더를 추가합니다.
2. 해당 폴더에 `meta.json` 파일과 `links.json` 파일을 만듭니다.
3. `days/index.json`에 새 날짜 항목을 추가합니다.

### 파일 형식 예시

`meta.json`
```json
{
  "title": "2026-05-07 부동산 공부",
  "description": "첫날은 부동산 기초 용어와 시장 개념을 정리합니다.",
  "fact": "GPT 토막상식: 부동산 가격은 공급과 수요뿐 아니라 교통, 학교, 개발 계획 같은 지역 요소에 의해 크게 달라집니다."
}
```

`links.json`
```json
[
  {
    "title": "부동산 기초 용어 정리",
    "url": "https://www.youtube.com/results?search_query=부동산+기초+용어+정리"
  },
  {
    "title": "전세, 월세, 매매 차이",
    "url": "https://www.youtube.com/results?search_query=전세+월세+매매+차이"
  }
]
```

## 기능

- 날짜별 폴더 목록을 클릭해 해당 날짜의 학습 자료 확인
- 유튜브 링크 5개 및 GPT 토막상식 표시
- 부동산 학습 코스와 노트 작성 기능
- 검색 기능으로 이전 노트 빠르게 찾기

## 사용 방법

1. `Estate_Note` 디렉토리에서 파일을 수정합니다.
2. 변경 내용을 GitHub에 커밋합니다.
3. `git push origin main`으로 원격에 반영합니다.

## 앞으로 할 것

- 폴더 생성 자동 감지 기능 추가
- Markdown 기반 노트 페이지 추가
- 학습 진행률과 완료 체크 기능
- 개별 날짜별 요약 카드 추가
