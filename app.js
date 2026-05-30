const STORAGE_KEY = "sigman-mvp-v4";
const LEGACY_KEYS = ["sigman-mvp-v3", "sigman-mvp-v2", "sigman-state-v1"];
const DAY_MS = 24 * 60 * 60 * 1000;

const todayKey = () => new Date().toISOString().slice(0, 10);

const copy = {
  day: "\u5929",
  times: "\u6b21",
  fallbackReason: "\u8a2d\u5b9a\u4e00\u500b\u4f60\u4e0d\u60f3\u4e2d\u65b7\u7d00\u9304\u7684\u7406\u7531\u3002",
  guardToday: "\u4eca\u5929\u53ea\u9700\u8981\u5b88\u4f4f\u4eca\u5929\u3002",
  preserved: "\u9019\u4e00\u6b21\uff0c\u7d00\u9304\u4fdd\u7559\u4e0b\u4f86\u4e86\u3002",
  nextStep: "\u4e0b\u4e00\u6b65\uff1a\u96e2\u958b\u523a\u6fc0\u6e90\uff0c\u56de\u5230\u4e00\u4ef6\u5177\u9ad4\u884c\u52d5\u3002",
  timerDone: "\u4f60\u5df2\u7d93\u6490\u904e 90 \u79d2\u3002\u73fe\u5728\u6309\u4e0b\u5b8c\u6210\uff0c\u628a\u9019\u4e00\u523b\u6536\u5c3e\u3002"
};

const taskFactories = [
  () => {
    const move = pick([
      { name: "\u4f0f\u5730\u633a\u8eab", unit: "\u4e0b", values: [8, 10, 12, 15, 20, 25, 30] },
      { name: "\u6df1\u8e72", unit: "\u4e0b", values: [15, 20, 25, 30, 40, 50] },
      { name: "\u958b\u5408\u8df3", unit: "\u4e0b", values: [30, 40, 50, 60, 80] },
      { name: "\u5e73\u677f\u652f\u6490", unit: "\u79d2", values: [30, 45, 60, 75, 90] },
      { name: "\u9760\u7246\u975c\u8e72", unit: "\u79d2", values: [30, 45, 60, 75, 90] }
    ]);
    const amount = pick(move.values);
    return {
      icon: "\u529b",
      title: `\u5b8c\u6210 ${amount} ${move.unit}${move.name}`,
      description: pick([
        "\u628a\u885d\u52d5\u8f49\u6210\u8eab\u9ad4\u884c\u52d5\u3002",
        "\u5148\u8b93\u8eab\u9ad4\u51fa\u529b\uff0c\u982d\u8166\u624d\u6703\u964d\u901f\u3002",
        "\u4e0d\u6c42\u5b8c\u7f8e\uff0c\u53ea\u8981\u7acb\u523b\u958b\u59cb\u3002"
      ])
    };
  },
  () => {
    const plan = pick([
      { title: "\u505a 4-7-8 \u547c\u5438", values: [3, 4, 5, 6], unit: "\u56de\u5408" },
      { title: "\u65b9\u584a\u547c\u5438", values: [2, 3, 4, 5], unit: "\u5206\u9418" },
      { title: "\u6162\u901f\u5410\u6c23\u7df4\u7fd2", values: [3, 5, 7, 10], unit: "\u5206\u9418" }
    ]);
    const amount = pick(plan.values);
    return {
      icon: "\u547c",
      title: `${plan.title} ${amount} ${plan.unit}`,
      description: pick([
        "\u8b93\u8eab\u9ad4\u5148\u964d\u901f\uff0c\u885d\u52d5\u6703\u8ddf\u8457\u4e0b\u964d\u3002",
        "\u53ea\u7ba1\u6578\u547c\u5438\uff0c\u4e0d\u8981\u8ddf\u885d\u52d5\u8faf\u8ad6\u3002",
        "\u628a\u6ce8\u610f\u529b\u653e\u56de\u80f8\u53e3\u548c\u9f3b\u606f\u3002"
      ])
    };
  },
  () => {
    const pages = pick([5, 8, 10, 12, 15, 20]);
    return {
      icon: "\u66f8",
      title: `\u95b1\u8b80 ${pages} \u9801`,
      description: pick([
        "\u628a\u6ce8\u610f\u529b\u62c9\u56de\u9577\u671f\u76ee\u6a19\u3002",
        "\u8b80\u5b8c\u5c31\u7b97\uff0c\u4e0d\u9700\u8981\u4eca\u5929\u8b8a\u6210\u53e6\u4e00\u500b\u4eba\u3002",
        "\u7528\u4e00\u9ede\u5c08\u6ce8\u611f\u91cd\u65b0\u63a5\u7ba1\u4eca\u5929\u3002"
      ])
    };
  },
  () => {
    const minutes = pick([3, 5, 8, 10, 12, 15]);
    return {
      icon: "\u975c",
      title: `\u975c\u5750 ${minutes} \u5206\u9418`,
      description: pick([
        "\u89c0\u5bdf\u885d\u52d5\uff0c\u4e0d\u6025\u8457\u53cd\u61c9\u3002",
        "\u5ff5\u982d\u53ef\u4ee5\u4f86\uff0c\u4f60\u4e0d\u9700\u8981\u8ddf\u8457\u8d70\u3002",
        "\u4eca\u5929\u7684\u76ee\u6a19\u53ea\u662f\u505c\u4e0b\u81ea\u52d5\u53cd\u61c9\u3002"
      ])
    };
  },
  () => {
    const minutes = pick([5, 8, 10, 12, 15, 20]);
    return {
      icon: "\u8d70",
      title: `\u5916\u51fa\u6216\u539f\u5730\u8d70\u52d5 ${minutes} \u5206\u9418`,
      description: pick([
        "\u96e2\u958b\u523a\u6fc0\u6e90\uff0c\u5148\u63db\u4e00\u500b\u7a7a\u9593\u3002",
        "\u8d70\u8def\u6703\u6253\u65b7\u81ea\u52d5\u6a21\u5f0f\u3002",
        "\u8b93\u8eab\u9ad4\u79fb\u52d5\uff0c\u6ce8\u610f\u529b\u5c31\u6703\u8ddf\u8457\u79fb\u52d5\u3002"
      ])
    };
  },
  () => {
    const minutes = pick([3, 5, 8, 10, 12]);
    return {
      icon: "\u6574",
      title: `\u6574\u7406\u684c\u9762 ${minutes} \u5206\u9418`,
      description: pick([
        "\u628a\u5916\u5728\u79e9\u5e8f\u627e\u56de\u4f86\uff0c\u5167\u5728\u6703\u6bd4\u8f03\u7a69\u3002",
        "\u4e00\u6b21\u53ea\u6e05\u4e00\u5c0f\u5340\uff0c\u4e0d\u8981\u64f4\u5927\u4efb\u52d9\u3002",
        "\u7528\u4e00\u500b\u53ef\u898b\u7684\u5b8c\u6210\u611f\u958b\u59cb\u4eca\u5929\u3002"
      ])
    };
  },
  () => {
    const lines = pick([3, 5, 7, 10]);
    return {
      icon: "\u5beb",
      title: `\u5beb\u4e0b ${lines} \u884c\u4eca\u5929\u7684\u72c0\u614b`,
      description: pick([
        "\u628a\u60c5\u7dd2\u5beb\u51fa\u4f86\uff0c\u5b83\u5c31\u4e0d\u6703\u5168\u90e8\u7559\u5728\u8166\u88e1\u3002",
        "\u4e0d\u7528\u5beb\u5f97\u597d\uff0c\u5beb\u5f97\u771f\u5c31\u597d\u3002",
        "\u5148\u770b\u898b\u89f8\u767c\u9ede\uff0c\u624d\u6709\u6a5f\u6703\u6539\u8b8a\u8def\u7dda\u3002"
      ])
    };
  },
  () => {
    const amount = pick([300, 400, 500, 600, 800]);
    return {
      icon: "\u6c34",
      title: `\u559d\u6c34 ${amount} ml`,
      description: pick([
        "\u5148\u7167\u9867\u8eab\u9ad4\uff0c\u5c31\u662f\u5728\u7167\u9867\u610f\u5fd7\u529b\u3002",
        "\u5c0f\u52d5\u4f5c\u4e5f\u662f\u4e00\u6b21\u91cd\u65b0\u638c\u63a7\u3002",
        "\u7528\u4e00\u500b\u7c21\u55ae\u884c\u52d5\u628a\u81ea\u5df1\u62c9\u56de\u4f86\u3002"
      ])
    };
  }
];

const rescueActions = [
  { id: "quick_challenge", icon: "\u529b", title: "\u5feb\u901f\u6311\u6230", desc: "\u505a 20 \u6b21\u4f0f\u5730\u633a\u8eab\uff0c\u6216\u539f\u5730\u6df1\u8e72 30 \u79d2\u3002" },
  { id: "breathing", icon: "\u606f", title: "\u547c\u5438\u7df4\u7fd2", desc: "4-7-8 \u547c\u5438\u6cd5\uff0c\u505a 4 \u56de\u5408\u3002" },
  { id: "leave", icon: "\u8d70", title: "\u96e2\u958b\u73fe\u5834", desc: "\u7acb\u523b\u96e2\u958b\u623f\u9593\uff0c\u8d70\u5230\u5ba2\u5ef3\u3001\u967d\u53f0\u6216\u5ba4\u5916\u3002" },
  { id: "cold_water", icon: "\u51b7", title: "\u51b7\u6c34\u6d17\u81c9", desc: "\u7528\u51b7\u6c34\u6d17\u81c9 30 \u79d2\u3002" },
  { id: "write", icon: "\u5beb", title: "\u5beb\u4e0b\u611f\u53d7", desc: "\u5beb\u4e00\u53e5\u8a71\uff1a\u6211\u73fe\u5728\u60f3\u7834\u6212\uff0c\u56e0\u70ba____\u3002" },
  { id: "commitment", icon: "\u8afe", title: "\u95b1\u8b80\u627f\u8afe", desc: "\u6211\u4e0d\u9700\u8981\u8ddf\u885d\u52d5\u8faf\u8ad6\u3002\u6211\u53ea\u9700\u8981\u5ef6\u5f8c 90 \u79d2\u3002" }
];

const defaultState = {
  userState: {
    startDate: todayKey(),
    bestStreak: 1,
    reason: "",
    emergencyCompletedCount: 0,
    lastResetDate: ""
  },
  dailyTasks: createDailyTasks(),
  emergencyLogs: [],
  resetLogs: []
};

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

let state = loadState();
let timerSeconds = 90;
let timerId = null;
let selectedActionId = null;

function createDailyTasks(date = todayKey()) {
  return {
    date,
    refreshCount: 0,
    tasks: shuffle(taskFactories)
      .slice(0, 4)
      .map((factory, index) => ({
        id: `${date}-${index}-${randomInt(1000, 9999)}`,
        ...factory(),
        completed: false
      }))
  };
}

function randomInt(min, max) {
  const range = max - min + 1;
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return min + (values[0] % range);
  }
  return min + Math.floor(Math.random() * range);
}

function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function refreshDailyTasks() {
  const refreshCount = (state.dailyTasks.refreshCount || 0) + 1;
  state.dailyTasks = createDailyTasks();
  state.dailyTasks.refreshCount = refreshCount;
  renderAll();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return normalizeState(JSON.parse(saved));

  for (const key of LEGACY_KEYS) {
    const legacy = localStorage.getItem(key);
    if (legacy) return migrateLegacy(JSON.parse(legacy));
  }

  return cloneDefaultState();
}

function migrateLegacy(legacy) {
  const migrated = cloneDefaultState();
  migrated.userState.startDate = legacy.startDate || todayKey();
  migrated.userState.bestStreak = legacy.bestStreak || legacy.bestDays || legacy.best || 1;
  migrated.userState.reason = legacy.reason || "";
  migrated.userState.emergencyCompletedCount = legacy.emergencyCompletedCount || legacy.rescueWins || 0;
  migrated.dailyTasks = createDailyTasks(legacy.taskDate || todayKey());
  migrated.dailyTasks.tasks = migrated.dailyTasks.tasks.map((task, index) => ({
    ...task,
    completed: Array.isArray(legacy.doneTasks) ? legacy.doneTasks.includes(index) : false
  }));
  return normalizeState(migrated);
}

function normalizeState(nextState) {
  const merged = {
    userState: { ...defaultState.userState, ...(nextState.userState || nextState) },
    dailyTasks: nextState.dailyTasks || createDailyTasks(nextState.taskDate || todayKey()),
    emergencyLogs: nextState.emergencyLogs || [],
    resetLogs: nextState.resetLogs || []
  };

  if (merged.dailyTasks.date !== todayKey()) {
    merged.dailyTasks = createDailyTasks();
  }

  if (!Array.isArray(merged.dailyTasks.tasks) || merged.dailyTasks.tasks.length !== 4) {
    merged.dailyTasks = createDailyTasks();
  }

  merged.userState.bestStreak = Math.max(merged.userState.bestStreak || 1, daysSince(merged.userState.startDate));
  merged.userState.emergencyCompletedCount = Math.max(merged.userState.emergencyCompletedCount || 0, merged.emergencyLogs.length);
  return merged;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function daysSince(dateString) {
  const start = new Date(`${dateString}T00:00:00`);
  const today = new Date(`${todayKey()}T00:00:00`);
  return Math.max(1, Math.floor((today - start) / DAY_MS) + 1);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("zh-Hant", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(`${dateString}T00:00:00`));
}

function getSelectedActionTitle() {
  return rescueActions.find((action) => action.id === selectedActionId)?.title || null;
}

function setScreen(name, navName = name) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  const nav = document.querySelector(".bottom-nav");
  nav.hidden = name === "splash";
  nav.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === navName);
  });

  if (name === "rescue") {
    resetRescueSession();
    startTimer();
  } else {
    stopTimer(false);
  }
}

function renderStats() {
  const streak = daysSince(state.userState.startDate);
  state.userState.bestStreak = Math.max(state.userState.bestStreak, streak);

  document.querySelector("#streakDays").textContent = streak;
  document.querySelector("#bestDays").textContent = `${state.userState.bestStreak} ${copy.day}`;
  document.querySelector("#startDateLabel").textContent = formatDate(state.userState.startDate);
  document.querySelector("#homeMessage").textContent = streak > 1
    ? `你已經撐過 ${streak} 天，現在只需要保住這一天。`
    : copy.guardToday;
  document.querySelector("#reasonLabel").textContent = state.userState.reason || copy.fallbackReason;

  document.querySelector("#settingsStreak").textContent = `${streak} ${copy.day}`;
  document.querySelector("#settingsStartDate").textContent = formatDate(state.userState.startDate);
  document.querySelector("#settingsBest").textContent = `${state.userState.bestStreak} ${copy.day}`;
  document.querySelector("#settingsRescues").textContent = `${state.userState.emergencyCompletedCount} ${copy.times}`;
  document.querySelector("#startDateInput").value = state.userState.startDate;
  document.querySelector("#startDateInput").max = todayKey();
  document.querySelector("#reasonInput").value = state.userState.reason;
}

function renderTasks() {
  document.querySelector("#taskList").innerHTML = state.dailyTasks.tasks
    .map((task) => `
      <button class="task ${task.completed ? "done" : ""}" data-task="${task.id}">
        <span class="task-icon">${task.icon}</span>
        <span>
          <strong>${task.title}</strong>
          <small>${task.description}</small>
        </span>
        <span class="check">${task.completed ? "\u2713" : ""}</span>
      </button>
    `)
    .join("");
  document.querySelector("#doneCount").textContent = state.dailyTasks.tasks.filter((task) => task.completed).length;
}

function renderActions() {
  document.querySelector("#actionGrid").innerHTML = rescueActions
    .map((action) => `
      <button class="action-card ${selectedActionId === action.id ? "selected" : ""}" data-action="${action.id}">
        <span>${action.icon}</span>
        <strong>${action.title}</strong>
        <small>${action.desc}</small>
      </button>
    `)
    .join("");
}

function renderTimer() {
  document.querySelector("#timer").textContent = timerSeconds;
}

function renderCompletion() {
  const streak = daysSince(state.userState.startDate);
  document.querySelector("#completionText").textContent = `${copy.preserved} 目前紀錄仍然保留：${streak} 天。${copy.nextStep}`;
}

function renderAll() {
  renderStats();
  renderTasks();
  renderActions();
  renderTimer();
  renderCompletion();
  saveState();
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
      stopTimer(false);
      document.querySelector("#rescuePrompt").textContent = copy.timerDone;
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function resetRescueSession() {
  stopTimer(true);
  selectedActionId = null;
  document.querySelector("#completionCard").hidden = true;
  document.querySelector("#surviveButton").hidden = false;
  document.querySelector("#rescuePrompt").textContent = "\u4f60\u4e0d\u9700\u8981\u89e3\u6c7a\u4e00\u751f\uff0c\u53ea\u9700\u8981\u6490\u904e 90 \u79d2\u3002";
  renderActions();
}

function completeRescue() {
  const log = {
    date: todayKey(),
    completedAt: new Intl.DateTimeFormat("zh-Hant", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()),
    actionSelected: getSelectedActionTitle()
  };
  state.emergencyLogs.unshift(log);
  state.userState.emergencyCompletedCount += 1;
  stopTimer(true);
  document.querySelector("#completionCard").hidden = false;
  document.querySelector("#surviveButton").hidden = true;
  renderAll();
}

document.addEventListener("click", (event) => {
  const startButton = event.target.closest("[data-start]");
  if (startButton) {
    setScreen("home", "home");
    return;
  }

  const goButton = event.target.closest("[data-go]");
  if (goButton) {
    setScreen(goButton.dataset.go, goButton.dataset.nav || goButton.dataset.go);
    return;
  }

  const taskButton = event.target.closest("[data-task]");
  if (taskButton) {
    const task = state.dailyTasks.tasks.find((item) => item.id === taskButton.dataset.task);
    if (task) task.completed = !task.completed;
    renderAll();
    return;
  }

  const refreshTasksButton = event.target.closest("#refreshTasksButton");
  if (refreshTasksButton) {
    refreshDailyTasks();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    selectedActionId = actionButton.dataset.action;
    renderActions();
  }
});

document.querySelector("[data-reset-timer]").addEventListener("click", () => {
  stopTimer(true);
  startTimer();
});

document.querySelector("#surviveButton").addEventListener("click", completeRescue);

document.querySelector("#setupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedDate = document.querySelector("#startDateInput").value || todayKey();
  state.userState.startDate = selectedDate > todayKey() ? todayKey() : selectedDate;
  state.userState.reason = document.querySelector("#reasonInput").value.trim().slice(0, 80);
  renderAll();
  setScreen("home", "home");
});

document.querySelector("#relapseButton").addEventListener("click", () => {
  const streak = daysSince(state.userState.startDate);
  state.userState.bestStreak = Math.max(state.userState.bestStreak, streak);
  state.userState.startDate = todayKey();
  state.userState.lastResetDate = todayKey();
  state.resetLogs.unshift({
    date: todayKey(),
    streakBeforeReset: streak,
    situation: null,
    trigger: null,
    nextAction: null
  });
  state.dailyTasks = createDailyTasks();
  renderAll();
  setScreen("home", "home");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

renderAll();
