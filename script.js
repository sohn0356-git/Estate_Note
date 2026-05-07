import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import ReactDOM from "https://esm.sh/react-dom@18.3.1/client";

const lessons = [
  {
    id: 1,
    title: "부동산 기초 용어",
    subtitle: "전세, 월세, 매매의 차이 알기",
    note: "부동산 공부의 첫 걸음은 용어 정리입니다. 단어 하나하나 뜻을 익혀두면 시장 해석이 쉽습니다.",
  },
  {
    id: 2,
    title: "시세와 시가의 이해",
    subtitle: "매물 가격 구조 파악",
    note: "시세, 감정가, 호가를 비교하면서 가격이 왜 달라지는지 연습합니다.",
  },
  {
    id: 3,
    title: "중개 수수료와 계약서",
    subtitle: "계약 단계에서 놓치기 쉬운 항목",
    note: "중개 수수료 계산 방법과 중요 조항을 익혀 실제 매매/임대 경험에 대비합니다.",
  },
  {
    id: 4,
    title: "투자 지표와 수익 모델",
    subtitle: "수익률, 공실률, 대출 이해",
    note: "어떤 매물이 성장 가능성이 있는지 확인하기 위해 기본 투자 지표를 공부합니다.",
  },
  {
    id: 5,
    title: "지역 분석과 입지 선택",
    subtitle: "주변 환경과 교통로 평가",
    note: "부동산 가치는 지역에 따라 크게 달라집니다. 입지 분석 연습을 시작합니다.",
  },
];

const initialNotes = [
  {
    id: "note-1",
    title: "첫 공부",
    content: "오늘은 부동산 기초 용어를 정리했고, 매매와 전세의 차이를 다시 한 번 확인했습니다.",
  },
];

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("estate-note-data")) || initialNotes;
    } catch {
      return initialNotes;
    }
  });
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [activeLesson, setActiveLesson] = useState(1);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    localStorage.setItem("estate-note-data", JSON.stringify(notes));
  }, [notes]);

  const selectedLesson = lessons.find((item) => item.id === activeLesson);

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [notes, search]);

  const handleAddNote = () => {
    if (!draft.trim()) return;
    const next = {
      id: `note-${Date.now()}`,
      title: `공부 노트 ${notes.length + 1}`,
      content: draft.trim(),
    };
    setNotes([next, ...notes]);
    setDraft("");
  };

  return (
    <div className="app-shell">
      <section className="hero-card">
        <div>
          <div className="tag-group">
            <span className="tag-pill">부동산 스터디</span>
            <span className="tag-pill">하루 학습</span>
            <span className="tag-pill">튜토리얼</span>
          </div>
          <h1>하루하루 부동산을 알아가는 실전 학습</h1>
          <p>
            Estate Note는 부동산 공부를 처음 시작하는 사람도 따라올 수 있는 튜토리얼형 웹사이트입니다.
            매일 하나씩 개념을 익히고, 노트로 기록하며 공부 습관을 만들 수 있습니다.
          </p>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <strong>5일</strong>
            <p>연속 학습 스티커</p>
          </div>
          <div className="metric-card">
            <strong>오늘 미션</strong>
            <p>{selectedLesson ? selectedLesson.title : "오늘 미션을 선택하세요"}</p>
          </div>
          <div className="metric-card">
            <strong>레슨 수</strong>
            <p>{lessons.length}단계 코스</p>
          </div>
        </div>
      </section>

      <section className="challenge-card">
        <div className="section-title">
          <h2>오늘의 학습 플랜</h2>
          <button onClick={() => setActiveTab("study")}>학습으로 이동</button>
        </div>
        <strong>{selectedLesson?.title}</strong>
        <p>{selectedLesson?.note}</p>
        <div className="tag-group">
          <span className="tag-pill">{selectedLesson?.subtitle}</span>
          <span className="tag-pill">React 기반 인터랙티브</span>
        </div>
      </section>

      <section className="lesson-card">
        <div className="section-title">
          <h2>부동산 집중 코스</h2>
          <p>상위 부동산 앱에서 영감을 받은 카드형 레이아웃</p>
        </div>
        <div className="lesson-grid">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="lesson-card">
              <span className="lesson-tag">Day {lesson.id}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.subtitle}</p>
              <button onClick={() => setActiveLesson(lesson.id)}>
                오늘 공부하기
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="note-card">
        <div className="section-title">
          <h2>오늘의 공부 노트</h2>
          <p>자신만의 정리를 남기고 저장해보세요.</p>
        </div>
        <label htmlFor="note-input">오늘 배운 내용을 간단히 메모</label>
        <textarea
          id="note-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="오늘 배운 개념, 궁금한 점, 다음에 확인할 내용 등을 기록합니다."
        />
        <button onClick={handleAddNote}>노트 저장</button>

        <div className="search-bar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="이전 노트 검색"
          />
        </div>
        <div className="note-list">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <article key={note.id} className="note-item">
                <strong>{note.title}</strong>
                <p>{note.content}</p>
              </article>
            ))
          ) : (
            <p>검색 결과가 없습니다. 다른 키워드로 찾아보세요.</p>
          )}
        </div>
      </section>

      <section className="roadmap-card">
        <div className="section-title">
          <h2>스터디 로드맵</h2>
          <p>하루하루 배워가며 전체 흐름을 잡는 구성</p>
        </div>
        <div className="timeline-list">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="timeline-item">
              <h4>Day {lesson.id}. {lesson.title}</h4>
              <p>{lesson.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <nav className="bottom-nav">
        <button className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>홈</button>
        <button className={activeTab === "study" ? "active" : ""} onClick={() => setActiveTab("study")}>학습</button>
        <button className={activeTab === "note" ? "active" : ""} onClick={() => setActiveTab("note")}>노트</button>
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>프로필</button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
