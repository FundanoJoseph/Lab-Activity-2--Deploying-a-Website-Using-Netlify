const SNIPPETS = {
  hello: `print("Hello, World!")
print("Welcome to PyWorkshop.")`,
  variables: `name = "Joseph"
age = 20
gpa = 1.75
is_student = True

print(name, age, gpa, is_student)`,
  types: `value = "42"
print(type(value))
number = int(value)
print(number + 8)`,
  decisions: `score = 88

if score >= 90:
    print("Excellent")
elif score >= 75:
    print("Good job")
else:
    print("Keep practicing")`,
  loops: `for n in range(1, 6):
    print("Count:", n)

total = 0
i = 1
while i <= 5:
    total += i
    i += 1
print("Sum:", total)`,
  lists: `langs = ["Python", "HTML", "CSS"]
langs.append("JavaScript")

for lang in langs:
    print("I am learning", lang)`,
  functions: `def greet(name):
    return f"Hello, {name}! Ready to code?"

print(greet("Joseph"))
print(greet("classmate"))`
};

const QUIZ_KEY = {
  q1: "b",
  q2: "a",
  q3: "c",
  q4: "b",
  q5: "a"
};

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function initNav() {
  const btn = $(".menu-toggle");
  const links = $(".nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
}

function readableCode(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll("button").forEach((node) => node.remove());
  return clone.innerText.trim();
}

function initCopyButtons() {
  $all("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.querySelector(btn.getAttribute("data-copy"));
      const text = target ? readableCode(target) : btn.dataset.snippet || "";
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = old), 1200);
      } catch {
        btn.textContent = "Copy failed";
      }
    });
  });
}

function initSnippets() {
  const preview = $("#snippet-preview");
  const buttons = $all("[data-snippet]");
  if (!preview || !buttons.length) return;

  const setSnippet = (key) => {
    preview.textContent = SNIPPETS[key] || "";
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.snippet === key));
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setSnippet(btn.dataset.snippet));
  });

  $("#copy-snippet")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(preview.textContent);
    const btn = $("#copy-snippet");
    btn.textContent = "Copied — paste in the compiler";
    setTimeout(() => (btn.textContent = "Copy snippet"), 1400);
  });

  setSnippet("hello");
}

function initToc() {
  const links = $all(".toc a");
  if (!links.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
  );
  $all(".lesson").forEach((el) => observer.observe(el));
}

async function checkBackend() {
  const el = $("#backend-status");
  if (!el) return;
  try {
    const res = await fetch("/api/status", { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("offline");
    const data = await res.json();
    el.textContent = `Python backend online · ${data.engine} · ${data.message}`;
  } catch {
    el.textContent = "Static Netlify mode · quiz is scored in the browser";
  }
}

async function gradeQuiz(answers) {
  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error("no api");
    return res.json();
  } catch {
    const total = Object.keys(QUIZ_KEY).length;
    const score = Object.entries(QUIZ_KEY).filter(([k, v]) => answers[k] === v).length;
    return { score, total, source: "javascript" };
  }
}

function initQuiz() {
  const form = $("#quiz-form");
  const banner = $("#quiz-result");
  if (!form || !banner) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const answers = Object.fromEntries(data.entries());
    const result = await gradeQuiz(answers);
    const passed = result.score === result.total;
    banner.className = `banner show ${passed ? "ok" : "bad"}`;
    banner.textContent = `You scored ${result.score}/${result.total}. ${
      passed ? "Nice work — you are ready for the playground." : "Review the lessons and try again."
    }`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCopyButtons();
  initSnippets();
  initToc();
  checkBackend();
  initQuiz();
});
