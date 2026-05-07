// 전역 변수들
let dayList = [];
let selectedDayId = null;

// DOM 요소들
const dayListEl = document.getElementById('day-list');
const selectedDayContentEl = document.getElementById('selected-day-content');
const dayContentEl = document.getElementById('day-content');
const selectedDayTitleEl = document.getElementById('selected-day-title');

// 유튜브 비디오 ID 추출 함수
function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length == 11) ? match[2] : null;
}

// 유튜브 임베드 생성
function createYouTubeEmbed(videoId) {
  return `<iframe class="youtube-embed"
            src="https://www.youtube.com/embed/${videoId}?rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>`;
}

// 초기화 함수
async function init() {
  try {
    // 날짜 목록 로드
    const response = await fetch('days/index.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dayList = await response.json();

    // UI 업데이트
    updateDayList();

    // 첫 번째 날짜 자동 선택
    if (dayList.length > 0) {
      selectDay(dayList[0].id);
    }

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
        ${links.map(link => {
          const videoId = getYouTubeVideoId(link.url);
          return `
            <div class="video-card">
              <div class="video-thumbnail" onclick="playVideo('${videoId}', this)">
                <img src="${link.thumbnail}" alt="${link.title}" loading="lazy" />
                <div class="video-duration">${link.duration}</div>
                <div class="play-overlay">
                  <button class="play-button">▶</button>
                </div>
              </div>
              <div class="video-info">
                <h4>${link.title}</h4>
                <p>${link.summary}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    selectedDayContentEl.style.display = 'block';
    selectedDayContentEl.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('날짜 선택 실패:', error);
    dayContentEl.innerHTML = '<p>콘텐츠를 불러오지 못했습니다.</p>';
  }
}

// 비디오 재생 함수
function playVideo(videoId, thumbnailElement) {
  const embedHtml = createYouTubeEmbed(videoId);
  thumbnailElement.outerHTML = embedHtml;
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', init);