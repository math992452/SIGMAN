const WAITLIST_KEY = "sigman-waitlist-local-v1";

const form = document.querySelector("#waitlistForm");
const statusLabel = document.querySelector("#waitlistStatus");

function readWaitlist() {
  try {
    return JSON.parse(localStorage.getItem(WAITLIST_KEY)) || [];
  } catch {
    return [];
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const entry = {
    name: String(data.get("name") || "").trim(),
    email: String(data.get("email") || "").trim(),
    createdAt: new Date().toISOString(),
    source: "github-pages-local"
  };

  const waitlist = readWaitlist().filter((item) => item.email !== entry.email);
  waitlist.unshift(entry);
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(waitlist));

  form.reset();
  statusLabel.textContent = "已暫存預約資料。下一步接上 Supabase 後，這裡會改成正式送出。";
});
