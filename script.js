// 전역 변수들
let dayList = [];
let selectedDayId = null;
let currentLessonIndex = 0;
let notes = JSON.parse(localStorage.getItem('estate-notes') || '[]');

const lessons = [
  {
    title: "부동산 기초 용어",
    subtitle: "전세, 월세, 매매의 차이 알기",
    desc: "부동산 공부의 첫 걸음은 용어 정리입니다. 단어 하나하나 뜻을 익혀두면 시장 해석이 쉽습니다."
  },
  {
    title: "시세와 시가의 이해",
    subtitle: "매물 가격 구조 파악",
    desc: "시세, 감정가, 호가를 비교하면서 가격이 왜 달라지는지 연습합니다."
  },
  {
    title: "중개 수수료와 계약서",
    subtitle: "계약 단계에서 놓치기 쉬운 항목",
    desc: "중개 수수료 계산 방법과 중요 조항을 익혀 실제 매매/임대 경험에 대비합니다."
  },
  {
    title: "투자 지표와 수익 모델",
    subtitle: "수익률, 공실률, 대출 이해",
    desc: "어떤 매물이 성장 가능성이 있는지 확인하기 위해 기본 투자 지표를 공부합니다."
  },
  {
    title: "지역 분석과 입지 선택",
    subtitle: "주변 환경과 교통로 평가",
    desc: "부동산 가치는 지역에 따라 크게 달라집니다. 입지 분석 연습을 시작합니다."
  }
];

// DOM 요소들
const dayListEl = document.getElementById('day-list');
const selectedDayContentEl = document.getElementById('selected-day-content');
const dayContentEl = document.getElementById('day-content');
const selectedDayTitleEl = document.getElementById('selected-day-title');
const currentLessonEl = document.getElementById('current-lesson');
const lessonDescEl = document.getElementById('lesson-desc');
const totalDaysEl = document.getElementById('total-days');
const totalNotesEl = document.getElementById('total-notes');
const noteInputEl = document.getElementById('note-input');
const noteListEl = document.getElementById('note-list');

// 초기화 함수
async function init() {
  try {
    // 날짜 목록 로드
    const response = await fetch('days/index.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dayList = await response.json();

    // UI 업데이트
    updateDayList();
    updateMetrics();

    // 첫 번째 날짜 선택
    if (dayList.length > 0) {
      selectDay(dayList[0].id);
    }

    // 노트 표시
    updateNotes();

    console.log('Estate Note 초기화 완료');
  } catch (error) {
    console.error('초기화 실패:', error);
    dayListEl.innerHTML = '<p>콘텐츠를 불러오지 못했습니다. 페이지를 새로고침해보세요.</p>';
  }
}

// 날짜 목록 업데이트
function updateDayList() {
  dayListEl.innerHTML = dayList.map(day => `
    <article class="lesson-card day-card ${selectedDayId === day.id ? 'active' : ''}"
             onclick="selectDay('${day.id}')">
      <span class="lesson-tag">${day.id}</span>
      <h3>${day.title}</h3>
      <p>${day.description}</p>
    </article>
  `).join('');
}

// 메트릭 업데이트
function updateMetrics() {
  totalDaysEl.textContent = dayList.length;
  totalNotesEl.textContent = notes.length;
}

// 날짜 선택
async function selectDay(dayId) {
  try {
    selectedDayId = dayId;
    updateDayList();

    const selectedDay = dayList.find(d => d.id === dayId);
    if (!selectedDay) return;

    // 메타데이터 로드
    const [metaRes, linksRes] = await Promise.all([
      fetch(`days/${selectedDay.folder}/meta.json`),
      fetch(`days/${selectedDay.folder}/links.json`)
    ]);

    if (!metaRes.ok || !linksRes.ok) throw new Error('콘텐츠 로딩 실패');

    const meta = await metaRes.json();
    const links = await linksRes.json();

    // 콘텐츠 표시
    selectedDayTitleEl.textContent = `${selectedDay.id} 콘텐츠`;
    dayContentEl.innerHTML = `
      <div class="note-card">
        <h3>GPT 토막상식</h3>
        <p>${meta.fact}</p>
      </div>
      <div class="video-grid">
        ${links.map(link => `
          <div class="video-card">
            <div class="video-thumbnail">
              <img src="${link.thumbnail}" alt="${link.title}" loading="lazy" />
              <div class="video-duration">${link.duration}</div>
              <div class="play-overlay">
                <button onclick="window.open('${link.url}', '_blank')" class="play-button">▶</button>
              </div>
            </div>
            <div class="video-info">
              <h4>${link.title}</h4>
              <p>${link.summary}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    selectedDayContentEl.style.display = 'block';
    selectedDayContentEl.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('날짜 선택 실패:', error);
    dayContentEl.innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
  }
}

// 다음 레슨
function nextLesson() {
  currentLessonIndex = (currentLessonIndex + 1) % lessons.length;
  const lesson = lessons[currentLessonIndex];

  currentLessonEl.textContent = lesson.title;
  lessonDescEl.textContent = lesson.desc;

  // 부드러운 전환 효과
  currentLessonEl.style.animation = 'fadeIn 0.3s ease';
  lessonDescEl.style.animation = 'fadeIn 0.3s ease 0.1s both';
}

// 노트 추가
function addNote() {
  const content = noteInputEl.value.trim();
  if (!content) return;

  const note = {
    id: Date.now(),
    title: `공부 노트 ${notes.length + 1}`,
    content: content,
    date: new Date().toISOString().split('T')[0]
  };

  notes.unshift(note);
  saveNotes();
  updateNotes();
  noteInputEl.value = '';

  // 성공 피드백
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = '저장됨!';
  btn.style.background = '#10b981';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1500);
}

// 노트 저장
function saveNotes() {
  localStorage.setItem('estate-notes', JSON.stringify(notes));
  updateMetrics();
}

// 노트 표시
function updateNotes() {
  if (notes.length === 0) {
    noteListEl.innerHTML = '<p>아직 저장된 노트가 없습니다.</p>';
    return;
  }

  noteListEl.innerHTML = notes.map(note => `
    <article class="note-item">
      <strong>${note.title}</strong>
      <small>${note.date}</small>
      <p>${note.content}</p>
    </article>
  `).join('');
}

// 노트 검색
function filterNotes() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = query
    ? notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      )
    : notes;

  if (filtered.length === 0) {
    noteListEl.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  noteListEl.innerHTML = filtered.map(note => `
    <article class="note-item">
      <strong>${note.title}</strong>
      <small>${note.date}</small>
      <p>${note.content}</p>
    </article>
  `).join('');
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', init);