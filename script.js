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
  const [dayList, setDayList] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayError, setDayError] = useState("");
  const [loadingDay, setLoadingDay] = useState(false);

  useEffect(() => {
    localStorage.setItem("estate-note-data", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    fetch("days/index.json")
      .then((res) => res.json())
      .then((data) => {
        setDayList(data);
        if (data.length > 0) {
          setSelectedDayId(data[0].id);
        }
      })
      .catch(() => {
        setDayError("날짜별 학습 폴더 목록을 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    if (!selectedDayId) return;
    const selected = dayList.find((day) => day.id === selectedDayId);
    if (!selected) return;

    setLoadingDay(true);
    setDayError("");

    Promise.all([
      fetch(`days/${selected.folder}/meta.json`).then((res) => res.json()),
      fetch(`days/${selected.folder}/links.json`).then((res) => res.json()),
    ])
      .then(([meta, links]) => {
        setSelectedDay({ meta, links });
      })
      .catch(() => {
        setDayError("선택한 날짜의 콘텐츠를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoadingDay(false);
      });
  }, [selectedDayId, dayList]);

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
          <h1>일자별 폴더로 보는 부동산 공부</h1>
          <p>
            날짜별 폴더를 클릭하면 오늘의 유튜브 링크 5개와 GPT 토막상식을 확인할 수 있습니다.
            오늘부터 매일 학습 콘텐츠를 채워가며 공부하세요.
          </p>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <strong>{dayList.length}</strong>
            <p>날짜별 스터디</p>
          </div>
          <div className="metric-card">
            <strong>{lessons.length}</strong>
            <p>부동산 코스</p>
          </div>
          <div className="metric-card">
            <strong>{notes.length}</strong>
            <p>저장된 노트</p>
          </div>
        </div>
      </section>

      <section className="challenge-card">
        <div className="section-title">
          <h2>오늘의 학습 플랜</h2>
          <button onClick={() => setActiveLesson(activeLesson % lessons.length + 1)}>
            다음 레슨 보기
          </button>
        </div>
        <strong>{selectedLesson?.title}</strong>
        <p>{selectedLesson?.note}</p>
        <div className="tag-group">
          <span className="tag-pill">{selectedLesson?.subtitle}</span>
          <span className="tag-pill">Day Folder 방식</span>
        </div>
      </section>

      <section className="lesson-card">
        <div className="section-title">
          <h2>날짜별 콘텐츠 폴더</h2>
          <p>폴더를 클릭하면 해당 날짜의 학습 자료를 볼 수 있습니다.</p>
        </div>
        <div className="lesson-grid">
          {dayList.map((day) => (
            <article
              key={day.id}
              className={`lesson-card day-card ${selectedDayId === day.id ? "active" : ""}`}
              onClick={() => setSelectedDayId(day.id)}
            >
              <span className="lesson-tag">{day.id}</span>
              <h3>{day.title}</h3>
              <p>{day.description}</p>
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
          <h2>선택한 날짜 콘텐츠</h2>
          <p>유튜브 링크와 GPT 토막상식을 한 곳에서 확인합니다.</p>
        </div>
        {loadingDay ? (
          <p>콘텐츠를 불러오는 중입니다...</p>
        ) : dayError ? (
          <p>{dayError}</p>
        ) : selectedDay ? (
          <div>
            <strong>{selectedDay.meta.title}</strong>
            <p>{selectedDay.meta.description}</p>
            <div className="note-card">
              <h3>GPT 토막상식</h3>
              <p>{selectedDay.meta.fact}</p>
            </div>
            <div className="note-card">
              <h3>오늘의 유튜브 링크</h3>
              <ul>
                {selectedDay.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>날짜별 폴더를 선택해주세요.</p>
        )}
      </section>

      <nav className="bottom-nav">
        <button className="active">홈</button>
        <button>학습</button>
        <button>노트</button>
        <button>폴더</button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
