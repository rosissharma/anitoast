import { toast } from "../../src/index.js";
window.toast = toast;
toast.init({ position: "bottom-right", theme: "dark" });

// Wordmark animation
(function () {
  const el = document.getElementById("wordmark");
  const word = "anitoast.";
  word.split("").forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "wm-char";
    s.textContent = ch;
    s.style.animationDelay = 0.05 + i * 0.07 + "s";
    el.appendChild(s);
  });
})();

// Theme toggle
const html = document.documentElement;
const btn = document.getElementById("theme-toggle");
const STORAGE_KEY = "anitoast-theme";

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  html.setAttribute("data-theme", saved);
} else {
  html.setAttribute(
    "data-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY))
      switchTheme(e.matches ? "dark" : "light", false);
  });

function switchTheme(next, save = true) {
  if (!document.startViewTransition) {
    html.setAttribute("data-theme", next);
    if (save) localStorage.setItem(STORAGE_KEY, next);
    return;
  }
  document.startViewTransition(() => {
    html.setAttribute("data-theme", next);
    if (save) localStorage.setItem(STORAGE_KEY, next);
  });
}

btn.addEventListener("click", () => {
  switchTheme(
    html.getAttribute("data-theme") === "dark" ? "light" : "dark",
  );
});

// Install pills copy functionality
document.querySelectorAll(".install-pill").forEach((pill) => {
  const copy = () => {
    navigator.clipboard
      .writeText(pill.getAttribute("data-copy"))
      .then(() => {
        pill.classList.add("copied");
        toast.success("Copied!", { duration: 1400 });
        setTimeout(() => pill.classList.remove("copied"), 1400);
      });
  };
  pill.addEventListener("click", copy);
  pill.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copy();
    }
  });
});

// Apply config function
function applyConfig() {
  toast.init({
    position: document.getElementById("cfg-position").value,
    theme: document.getElementById("cfg-theme").value,
    richColors: document.getElementById("cfg-rich-colors").checked,
    closeButton: document.getElementById("cfg-close-btn").checked,
  });
}
["cfg-position", "cfg-theme", "cfg-rich-colors", "cfg-close-btn"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("change", applyConfig);
  },
);

// Demo functions
window.demoDescription = () =>
  toast.success("File uploaded", {
    description: "report-q3-2025.pdf was uploaded to your workspace.",
  });
window.demoAction = () =>
  toast("Invitation sent", {
    action: {
      label: "Undo",
      onClick: () => toast.info("Invitation cancelled."),
    },
  });
window.demoCancel = () =>
  toast.warning("Delete 3 files?", {
    description: "This action cannot be undone.",
    cancel: {
      label: "Cancel",
      onClick: () => toast("Deletion cancelled"),
    },
    action: {
      label: "Delete",
      onClick: () => toast.error("Files deleted"),
    },
    duration: Infinity,
  });
window.demoLoading = () => {
  const id = toast.loading("Processing your request...");
  setTimeout(() => toast.dismiss(id), 3000);
};
window.demoPromise = () => {
  toast.promise(
    new Promise((res, rej) =>
      setTimeout(
        () =>
          Math.random() > 0.35
            ? res({ items: 42 })
            : rej(new Error("Network timeout")),
        2000,
      ),
    ),
    {
      loading: { title: "Fetching data..." },
      success: (d) => ({
        title: "Data loaded",
        description: `Retrieved ${d.items} items from the server.`,
      }),
      error: (e) => ({ title: "Request failed", description: e.message }),
    },
  );
};
window.demoInfinite = () =>
  toast.info("This toast stays until dismissed.", {
    duration: Infinity,
    closeButton: true,
  });
window.demoCustomDuration = () =>
  toast.success("8 second toast!", {
    description: "This one hangs around a bit longer.",
    duration: 8000,
  });
