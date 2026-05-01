const STORAGE_KEY = "sophis-purpose-posts";

const themePalettes = {
  Reflection: ["#6fa7bf", "#dcecf2", "#fffdf7", "#386d86"],
  Creativity: ["#8eb9cc", "#edf5f7", "#fffdf7", "#5f96ad"],
  Growth: ["#789ca9", "#e7f1f5", "#fffdf7", "#386d86"],
  Life: ["#9fc4d1", "#f7f9f6", "#fffdf7", "#6fa7bf"],
  Notes: ["#142735", "#dcecf2", "#fffdf7", "#607483"],
};

const samplePosts = [
  {
    id: "sample-becoming-clear",
    title: "Becoming Clear",
    theme: "Reflection",
    readTime: "3 min read",
    date: "April 30, 2026",
    excerpt: "A note about choosing the life that feels true, even when it asks for patience.",
    body:
      "Some seasons are not about rushing into the next version of yourself. They are about listening closely enough to know what actually belongs.\n\nI am learning that purpose is not always loud. Sometimes it is the little pull toward honesty, the habit that brings me back to myself, or the work that makes time feel softer.\n\nThis blog is where I want to keep those pieces: the questions, the becoming, and the small decisions that slowly turn into a life.",
    published: true,
  },
  {
    id: "sample-creative-rhythm",
    title: "Protecting My Creative Rhythm",
    theme: "Creativity",
    readTime: "4 min read",
    date: "April 28, 2026",
    excerpt: "How I am making room for ideas before the world asks them to be useful.",
    body:
      "Creativity feels different when I stop treating it like a performance. It becomes a practice of noticing.\n\nI want to make more room for unfinished thoughts, messy drafts, and ideas that need a quiet corner before they become anything public.\n\nMy rhythm is simple right now: gather, write, rest, return. It is enough.",
    published: true,
  },
  {
    id: "sample-gentle-ambition",
    title: "Gentle Ambition",
    theme: "Growth",
    readTime: "2 min read",
    date: "April 24, 2026",
    excerpt: "A reminder that wanting more does not have to mean abandoning peace.",
    body:
      "I still want beautiful things. I still want to build, learn, be seen, and become excellent at what I love.\n\nBut I do not want ambition that costs me my tenderness. I want growth that has breath in it.\n\nMaybe purpose is not a single destination. Maybe it is the way I choose to move.",
    published: true,
  },
  {
    id: "sample-draft",
    title: "Things I Want to Remember",
    theme: "Notes",
    readTime: "1 min read",
    date: "April 20, 2026",
    excerpt: "A private draft for small truths, favorite lines, and future essays.",
    body:
      "Pay attention to what makes you feel awake.\n\nDo not shrink the dream just because it needs time.\n\nLet beauty be useful, too.",
    published: false,
  },
];

const form = document.querySelector("#postForm");
const postGrid = document.querySelector("#postGrid");
const searchInput = document.querySelector("#searchInput");
const postCount = document.querySelector("#postCount");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const heroCanvas = document.querySelector("#heroCanvas");
const featuredTitle = document.querySelector("#featuredTitle");
const featuredTheme = document.querySelector("#featuredTheme");
const featuredExcerpt = document.querySelector("#featuredExcerpt");
const dialog = document.querySelector("#postDialog");
const dialogCanvas = document.querySelector("#dialogCanvas");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogTheme = document.querySelector("#dialogTheme");
const dialogExcerpt = document.querySelector("#dialogExcerpt");
const dialogDate = document.querySelector("#dialogDate");
const dialogReadTime = document.querySelector("#dialogReadTime");
const dialogStatus = document.querySelector("#dialogStatus");
const dialogBody = document.querySelector("#dialogBody");

let posts = loadPosts();
let activeFilter = "All";

function loadPosts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return samplePosts;
  }

  try {
    const parsedPosts = JSON.parse(saved);
    return Array.isArray(parsedPosts) ? parsedPosts : samplePosts;
  } catch {
    return samplePosts;
  }
}

function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getPalette(theme) {
  return themePalettes[theme] || themePalettes.Notes;
}

function drawPostCover(canvas, post) {
  const ctx = canvas.getContext("2d");
  const colors = getPalette(post.theme);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  colors.forEach((color, index) => gradient.addColorStop(index / (colors.length - 1), color));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 253, 247, 0.18)";
  for (let index = 0; index < 9; index += 1) {
    const width = canvas.width * (0.35 + index * 0.025);
    const height = canvas.height * 0.1;
    const x = canvas.width * 0.11 + index * 20;
    const y = canvas.height * 0.16 + index * 54;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.16);
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  ctx.strokeStyle = "rgba(20, 39, 53, 0.16)";
  ctx.lineWidth = 2;
  for (let index = 0; index < 11; index += 1) {
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.12, canvas.height * (0.22 + index * 0.055));
    ctx.bezierCurveTo(
      canvas.width * 0.34,
      canvas.height * (0.11 + index * 0.045),
      canvas.width * 0.65,
      canvas.height * (0.34 + index * 0.038),
      canvas.width * 0.88,
      canvas.height * (0.2 + index * 0.062),
    );
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 253, 247, 0.94)";
  ctx.font = `700 ${Math.max(32, canvas.width * 0.048)}px Georgia, serif`;
  wrapCanvasText(ctx, post.title, canvas.width * 0.1, canvas.height * 0.75, canvas.width * 0.78, canvas.width * 0.06);

  ctx.fillStyle = "rgba(20, 39, 53, 0.68)";
  ctx.font = `800 ${Math.max(13, canvas.width * 0.018)}px Inter, sans-serif`;
  ctx.fillText(post.theme.toUpperCase(), canvas.width * 0.1, canvas.height * 0.12);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > maxWidth && index > 0) {
      ctx.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });

  ctx.fillText(line, x, y);
}

function drawHero() {
  const featured = posts.find((post) => post.published) || posts[0];
  featuredTitle.textContent = featured.title;
  featuredTheme.textContent = featured.theme;
  featuredExcerpt.textContent = featured.excerpt;
  drawPostCover(heroCanvas, featured);
}

function filteredPosts() {
  const query = searchInput.value.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesFilter = activeFilter === "All" || post.theme === activeFilter;
    const haystack = `${post.title} ${post.theme} ${post.excerpt} ${post.body}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });
}

function renderPosts() {
  const visiblePosts = filteredPosts();
  postCount.textContent = `${visiblePosts.length} ${visiblePosts.length === 1 ? "post" : "posts"}`;

  postGrid.innerHTML = "";

  if (!visiblePosts.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No posts match this view yet.";
    postGrid.append(empty);
    return;
  }

  visiblePosts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${post.title}`);

    const cover = document.createElement("canvas");
    cover.width = 760;
    cover.height = 520;
    drawPostCover(cover, post);

    const content = document.createElement("div");
    content.className = "card-content";
    content.innerHTML = `
      <div class="card-topline">
        <span class="theme-chip">${escapeHtml(post.theme)}</span>
        <span class="status-pill ${post.published ? "" : "draft"}">${post.published ? "Live" : "Draft"}</span>
      </div>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt || makeExcerpt(post.body))}</p>
      <div class="card-meta">
        <span>${escapeHtml(post.date)}</span>
        <span>${escapeHtml(post.readTime || estimateReadTime(post.body))}</span>
      </div>
    `;

    card.append(cover, content);
    card.addEventListener("click", () => openPost(post));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPost(post);
      }
    });
    postGrid.append(card);
  });
}

function openPost(post) {
  drawPostCover(dialogCanvas, post);
  dialogTitle.textContent = post.title;
  dialogTheme.textContent = post.theme;
  dialogExcerpt.textContent = post.excerpt || makeExcerpt(post.body);
  dialogDate.textContent = post.date;
  dialogReadTime.textContent = post.readTime || estimateReadTime(post.body);
  dialogStatus.textContent = post.published ? "Published" : "Draft";
  dialogBody.innerHTML = post.body
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("");
  dialog.showModal();
}

function makeExcerpt(body) {
  const cleanBody = body.trim().replace(/\s+/g, " ");
  return cleanBody.length > 140 ? `${cleanBody.slice(0, 137)}...` : cleanBody;
}

function estimateReadTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector("#postTitle").value.trim();
    const theme = document.querySelector("#postTheme").value;
    const readTime = document.querySelector("#postReadTime").value.trim();
    const excerpt = document.querySelector("#postExcerpt").value.trim();
    const body = document.querySelector("#postBody").value.trim();
    const published = document.querySelector("#postPublished").checked;

    posts = [
      {
        id: makeId(),
        title,
        theme,
        readTime: readTime || estimateReadTime(body),
        date: formatDate(new Date()),
        excerpt: excerpt || makeExcerpt(body),
        body,
        published,
      },
      ...posts,
    ];

    savePosts();
    form.reset();
    document.querySelector("#postPublished").checked = true;
    activeFilter = "All";
    filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === "All"));
    renderPosts();
    drawHero();
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderPosts();
  });
});

searchInput.addEventListener("input", renderPosts);

document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

drawHero();
renderPosts();

function makeId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `post-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
