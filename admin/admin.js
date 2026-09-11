// admin/admin.js
// Loads the site content from the backend API, lets the admin edit it, and saves back.
// Also stores a copy in localStorage for instant preview.

const API_URL = "http://localhost:4000/api/content";
const textarea = document.getElementById("contentArea");
const statusDiv = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const previewBtn = document.getElementById("previewBtn");

async function loadContent() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error("Network error");
    const data = await resp.json();
    textarea.value = JSON.stringify(data, null, 2);
    localStorage.setItem("siteContent", textarea.value);
    statusDiv.textContent = "Content loaded from server.";
  } catch (e) {
    const stored = localStorage.getItem("siteContent");
    if (stored) {
      textarea.value = stored;
      statusDiv.textContent = "Server unreachable – loaded from localStorage.";
    } else {
      statusDiv.textContent = "Failed to load content.";
    }
  }
}

async function saveContent() {
  try {
    const parsed = JSON.parse(textarea.value);
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    if (!resp.ok) throw new Error("Save failed");
    const result = await resp.json();
    if (result.status === "ok") {
      statusDiv.textContent = "✅ Saved successfully.";
      localStorage.setItem("siteContent", textarea.value);
    } else {
      statusDiv.textContent = "❌ Save error.";
    }
  } catch (e) {
    statusDiv.textContent = `❌ ${e.message}`;
  }
}

previewBtn.addEventListener("click", () => {
  window.open("/", "_blank");
});

saveBtn.addEventListener("click", saveContent);

loadContent();
