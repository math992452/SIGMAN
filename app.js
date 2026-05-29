const STORAGE_KEY = "sigman-mvp-v3";
const DAY_MS = 24 * 60 * 60 * 1000;

const text = {
  day: "\u5929",
  fallbackReason: "\u5148\u5beb\u4e0b\u4e00\u500b\u4f60\u9858\u610f\u6490\u4f4f\u7684\u7406\u7531",
  timerRunning: "\u8a08\u6642\u4e2d",
  timerStart: "\u958b\u59cb 90 \u79d2",
  timerContinue: "\u7e7c\u7e8c\u8a08\u6642",
  timerDone: "\u4f60\u6490\u904e\u53bb\u4e86\u3002\u73fe\u5728\u505a\u4e00\u500b\u5c0f\u884c\u52d5\uff0c\u628a\u9019\u4e00\u523b\u6536\u5c3e\u3002"
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultState = {
  startDate: todayKey(),
  bestDays: 0,
  reason: "",
  taskDate: todayKey(),
  doneTasks: [],
  rescueWins: 0
};

const tasks = [
  { icon: "\u547c", title: "\u51b7\u975c\u547c\u5438 5 \u5206\u9418", desc: "\u5148\u8b93\u8eab\u9ad4\u964d\u901f\uff0c\u8166\u888b\u624d\u56de\u5f97\u4f86\u3002" },
  { icon: "\u529b", title: "\u5b8c\u6210 20 \u6b21\u4f0f\u5730\u633a\u8eab", desc: "\u628a\u885d\u52d5\u8f49\u6210\u8eab\u9ad4\u884c\u52d5\u3002" },
  { icon: "\u66f8", title: "\u95b1\u8b80 10 \u9801", desc: "\u5582\u990a\u9577\u671f\u7684\u81ea\u5df1\u3002" },
  { icon: "\u975c", title: "\u51a5\u60f3 10 \u5206\u9418", desc: "\u7df4\u7fd2\u4e0d\u88ab\u5ff5\u982d\u727d\u8457\u8d70\u3002" }
];

const rescueActions = [
  { icon: "\u6c34", title: "\u559d\u4e00\u676f\u6c34", desc: "\u96e2\u958b\u539f\u5730\uff0c\u6162\u6162\u559d\u5b8c\u3002" },
  { icon: "\u8d70", title: "\u8d70\u51fa\u623f\u9593", desc: "\u6539\u8b8a\u74b0\u5883\u6bd4\u786c\u6490\u6709\u6548\u3002" },
  { icon: "\u606f", title: "4-7-8 \u547c\u5438", desc: "\u5438 4 \u79d2\uff0c\u505c 7 \u79d2\uff0c\u5410 8 \u79d2\u3002" },
  { icon: "\u5beb", title: "\u5beb\u4e0b\u611f\u53d7", desc: "\u628a\u885d\u52d5\u5beb\u6210\u4e00\u53e5\u8a71\u3002" },
  { icon: "\u51b7", title: "\u51b7\u6c34\u6d17\u81c9", desc: "\u8b93\u8eab\u9ad4\u5feb\u901f\u5207\u63db\u72c0\u614b\u3002" },
  { icon: "\u8a0a", title: "\u50b3\u8a0a\u7d66\u670b\u53cb", desc: "\u53ea\u8aaa\uff1a\u6211\u73fe\u5728\u9700\u8981\u8f49\u79fb\u6ce8\u610f\u529b\u3002" }
];

const prompts = [
  "\u653e\u4e0b\u624b\u6a5f\uff0c\u5148\u505a 10 \u6b21\u6df1\u547c\u5438\u3002",
  "\u7ad9\u8d77\u4f86\uff0c\u96e2\u958b\u73fe\u5728\u7684\u4f4d\u7f6e\u3002",
  "\u63d0\u9192\u81ea\u5df1\uff1a\u885d\u52d5\u4e0d\u662f\u547d\u4ee4\uff0c\u53ea\u662f\u8a0a\u865f\u3002",
  "\u4eca\u5929\u53ea\u8981\u8d0f\u9019 90 \u79d2\u3002"
];

let state = loadState();
let timerSeconds = 90;
let timerId = null;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const loaded = saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
  if (loaded.taskDate !== todayKey()) {
    loaded.taskDate = todayKey();
    loaded.doneTasks = [];
  }
  return loaded;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function daysSince(dateString) {
  const start = new Date(`${dateString}T00:00:00`);
  const today = new Date(`${todayKey()}T00:00:00`);
  return Math.max(0, Math.floor((today - start) / DAY_MS) + 1);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("zh-Hant", { month: "long", day: "numeric" }).format(new Date(`${dateString}T00:00:00`));
}

function setScreen(name, navName = name) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  const nav = document.querySelector(".bottom-nav");
  nav.hidden = name === "splash" || name === "setup";
  nav.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === navName);
  });
}

function renderStats() {
  const streak = daysSince(state.startDate);
  state.bestDays = Math.max(state.bestDays, streak);

  document.querySelector("#streakDays").textContent = streak;
  document.querySelector("#bestDays").textContent = `${state.bestDays} ${text.day}`;
  document.querySelector("#startDateLabel").textContent = formatDate(state.startDate);
  document.querySelector("#reasonLabel").textContent = state.reason || text.fallbackReason;
  document.querySelector("#ring").style.setProperty("--progress", Math.min(100, streak * 7));
  document.querySelector("#startDateInput").value = state.startDate;
  document.querySelector("#reasonInput").value = state.reason;
}

function renderTasks() {
  document.querySelector("#taskList").innerHTML = tasks
    .map((task, index) => {
      const done = state.doneTasks.includes(index);
      return `
        <button class="task ${done ? "done" : ""}" data-task="${index}">
          <span class="task-icon">${task.icon}</span>
          <span>
            <strong>${task.title}</strong>
            <small>${task.desc}</small>
          </span>
          <span class="check">${done ? "\u2713" : ""}</span>
        </button>
      `;
    })
    .join("");
  document.querySelector("#doneCount").textContent = state.doneTasks.length;
}

function renderActions() {
  document.querySelector("#actionGrid").innerHTML = rescueActions
    .map((action, index) => `
      <button class="action-card" data-action="${index}">
        <span>${action.icon}</span>
        <strong>${action.title}</strong>
        <small>${action.desc}</small>
      </button>
    `)
    .join("");
}

function renderTimer() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const seconds = String(timerSeconds % 60).padStart(2, "0");
  document.querySelector("#timer").textContent = `${minutes}:${seconds}`;
  document.querySelector("#timerButton").textContent = timerId ? text.timerRunning : timerSeconds === 90 ? text.timerStart : text.timerContinue;
}

function stopTimer(reset = false) {
  clearInterval(timerId);
  timerId = null;
  if (reset) timerSeconds = 90;
  renderTimer();
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    timerSeconds -= 1;
    if (timerSeconds <= 0) {
      timerSeconds = 0;
      stopTimer();
      document.querySelector("#rescuePrompt").textContent = text.timerDone;
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function renderAll() {
  renderStats();
  renderTasks();
  renderActions();
  renderTimer();
  saveState();
}

document.addEventListener("click", (event) => {
  const startButton = event.target.closest("[data-start]");
  if (startButton) {
    setScreen("home", "home");
    return;
  }

  const setupButton = event.target.closest("[data-open-setup]");
  if (setupButton) {
    setScreen("setup");
    return;
  }

  const goButton = event.target.closest("[data-go]");
  if (goButton) {
    setScreen(goButton.dataset.go, goButton.dataset.nav || goButton.dataset.go);
    if (goButton.dataset.jump === "tasks") {
      requestAnimationFrame(() => document.querySelector(".task-panel")?.scrollIntoView({ block: "start", behavior: "smooth" }));
    }
    return;
  }

  const taskButton = event.target.closest("[data-task]");
  if (taskButton) {
    const index = Number(taskButton.dataset.task);
    state.doneTasks = state.doneTasks.includes(index)
      ? state.doneTasks.filter((taskIndex) => taskIndex !== index)
      : [...state.doneTasks, index];
    renderAll();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    document.querySelectorAll(".action-card").forEach((button) => button.classList.remove("selected"));
    actionButton.classList.add("selected");
    document.querySelector("#rescuePrompt").textContent = prompts[Number(actionButton.dataset.action) % prompts.length];
  }
});

document.querySelector("#timerButton").addEventListener("click", startTimer);
document.querySelector("[data-reset-timer]").addEventListener("click", () => stopTimer(true));

document.querySelector("#surviveButton").addEventListener("click", () => {
  state.rescueWins += 1;
  stopTimer(true);
  renderAll();
  setScreen("home", "home");
});

document.querySelector("#setupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.startDate = document.querySelector("#startDateInput").value || todayKey();
  state.reason = document.querySelector("#reasonInput").value.trim();
  renderAll();
  setScreen("home", "home");
});

document.querySelector("#relapseButton").addEventListener("click", () => {
  state.bestDays = Math.max(state.bestDays, daysSince(state.startDate));
  state.startDate = todayKey();
  state.doneTasks = [];
  renderAll();
  setScreen("home", "home");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

renderAll();
