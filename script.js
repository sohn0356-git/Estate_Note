document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#daily .note-card h3");
  if (section) {
    section.textContent = "오늘의 공부 기록"
  }
});
