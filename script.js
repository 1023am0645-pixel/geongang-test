const TYPES = [
  {
    id: "geoni",
    name: "건이",
    color: "#70d8d2",
    dark: "#229a9b",
    image: "assets/geoni-front.jpeg",
    items: [
      "변화에\n잘 적응",
      "확실한거\n좋아!",
      "짧고 굵게",
      "원칙은\n지켜야지",
      "환불하고 싶어?\n내가 말할게!",
      "말 보다는\n행동",
      "울면\n해결돼?",
      "현재에\n집중",
    ],
  },
  {
    id: "gangi",
    name: "강이",
    color: "#ffc9d7",
    dark: "#ce6484",
    image: "assets/gangi-front.jpeg",
    items: [
      "공감능력\n뛰어남",
      "다른 사람이\n탈때까지\n엘리베이터\n꼭 기다려줌",
      "여행계획,\n코스 짜기\n쉽다. 쉬워!",
      "제 일은\n제가 할게요",
      "여러 사람보다\n1:1 대화가\n편해",
      "처음 보는\n사람이라도\n말 거는 건\n어렵지 않지",
      "배려왕",
      "책임감\n강함",
    ],
  },
  {
    id: "deongi",
    name: "덩이",
    color: "#ffb531",
    dark: "#c87800",
    image: "assets/deongi-front.jpeg",
    items: [
      "타고난\n협력자",
      "리액션\nGood!",
      "새롭게\n배우는 거\n좋아",
      "카톡<전화",
      "다른 사람\n챙겨줄 때\n행-복-!",
      "팀 활동\n재밌어",
      "변화를\n잘 알아봄",
      "고민이 뭐야?\n말해봐!",
    ],
  },
  {
    id: "gyuni",
    name: "균이",
    color: "#ff5125",
    dark: "#b83a22",
    image: "assets/gyuni-front.jpeg",
    items: [
      "예의 중시",
      "규칙적인\n생활 좋아",
      "YES맨",
      "아닌건,\n아니야.",
      "멀티태스킹\nOK",
      "나서는 건\n싫지만...\n해야하면 할게",
      "차근차근\n꼼꼼하게",
      "공과 사는\n구분해야지~",
    ],
  },
];

const selected = new Set();
let currentIndex = 0;

const board = document.querySelector("#board");
const currentTypeName = document.querySelector("#currentTypeName");
const stepCount = document.querySelector("#stepCount");
const stepTabs = document.querySelector("#stepTabs");
const selectedCount = document.querySelector("#selectedCount");
const nextButton = document.querySelector("#nextButton");
const prevButton = document.querySelector("#prevButton");
const resetButton = document.querySelector("#resetButton");
const resultDialog = document.querySelector("#resultDialog");
const resultCard = document.querySelector("#resultCard");
const closeDialog = document.querySelector("#closeDialog");
const keepChoosingButton = document.querySelector("#keepChoosingButton");
const restartButton = document.querySelector("#restartButton");
const resultTitle = document.querySelector("#resultTitle");
const resultMascots = document.querySelector("#resultMascots");
const cardTemplate = document.querySelector("#typeCardTemplate");

const gridOrder = [0, 1, 2, 3, "center", 4, 5, 6, 7];
const tabIconNames = ["smile", "heart", "star", "sparkles"];

const ICON_PATHS = {
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "check-circle": '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  "gamepad-2": '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.702-7.41A4 4 0 0 0 17.32 5z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.751a.53.53 0 0 1 .294.904l-3.736 3.644a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.75a2.12 2.12 0 0 0 1.596-1.16z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  trophy: '<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 22h10a5 5 0 0 0-2.024-4.018A2 2 0 0 1 14 16.286V14.66"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

function createIcon(name, className = "") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2.35");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("lucide-icon");
  className.split(/\s+/).filter(Boolean).forEach((name) => svg.classList.add(name));
  svg.innerHTML = ICON_PATHS[name] || ICON_PATHS.sparkles;
  return svg;
}

function createTextSpan(text, className) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function setButtonContent(button, iconName, label) {
  button.innerHTML = "";
  button.append(createIcon(iconName, "button-icon"), createTextSpan(label, "button-label"));
}

function hydrateInlineIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((placeholder) => {
    const icon = createIcon(placeholder.dataset.icon, placeholder.className);
    placeholder.replaceWith(icon);
  });
}

function renderStepTabs() {
  stepTabs.innerHTML = "";

  TYPES.forEach((type, index) => {
    const tab = document.createElement("button");
    tab.className = "step-tab";
    tab.type = "button";
    tab.append(createIcon(tabIconNames[index], "tab-icon"), createTextSpan(type.name, "tab-label"));
    tab.style.setProperty("--tab-color", type.color);
    tab.style.setProperty("--tab-dark", type.dark);
    tab.addEventListener("click", () => setCurrentIndex(index, true));
    stepTabs.append(tab);
  });
}

function renderBoard() {
  TYPES.forEach((type, typeIndex) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const typeBoard = card.querySelector(".type-board");

    card.dataset.type = type.id;
    card.style.setProperty("--type-color", type.color);
    card.style.setProperty("--type-dark", type.dark);
    card.hidden = typeIndex !== currentIndex;

    gridOrder.forEach((entry, index) => {
      if (entry === "center") {
        const center = document.createElement("div");
        center.className = "center-tile";
        center.style.gridColumn = `${(index % 3) + 1}`;
        center.style.gridRow = `${Math.floor(index / 3) + 1}`;
        const label = document.createElement("span");
        label.className = "center-label";
        label.textContent = type.name;
        center.append(label);
        typeBoard.append(center);
        return;
      }

      const itemId = `${type.id}-${entry}`;
      const tile = document.createElement("button");
      tile.className = "tile";
      tile.type = "button";
      tile.dataset.type = type.id;
      tile.dataset.itemId = itemId;
      tile.style.gridColumn = `${(index % 3) + 1}`;
      tile.style.gridRow = `${Math.floor(index / 3) + 1}`;
      tile.append(createTextSpan(type.items[entry], "tile-label"));
      const textLength = type.items[entry].replace(/\s/g, "").length;
      if (textLength > 25) {
        tile.classList.add("tile-dense");
      } else if (textLength > 16) {
        tile.classList.add("tile-long");
      }
      tile.setAttribute("aria-pressed", "false");
      tile.addEventListener("click", () => toggleTile(tile));
      typeBoard.append(tile);
    });

    board.append(card);
  });
}

function toggleTile(tile) {
  const itemId = tile.dataset.itemId;

  if (selected.has(itemId)) {
    selected.delete(itemId);
    tile.classList.remove("is-selected");
    tile.setAttribute("aria-pressed", "false");
  } else {
    selected.add(itemId);
    tile.classList.add("is-selected", "pop");
    tile.setAttribute("aria-pressed", "true");
    window.setTimeout(() => tile.classList.remove("pop"), 240);
  }

  updateStatus();
}

function getScores() {
  return TYPES.map((type) => ({
    ...type,
    score: Array.from(selected).filter((itemId) => itemId.startsWith(`${type.id}-`)).length,
  }));
}

function hasTypeSelection(type) {
  return Array.from(selected).some((itemId) => itemId.startsWith(`${type.id}-`));
}

function setCurrentIndex(index, shouldScroll = false) {
  currentIndex = Math.max(0, Math.min(index, TYPES.length - 1));

  document.querySelectorAll(".type-card").forEach((card, cardIndex) => {
    card.hidden = cardIndex !== currentIndex;
  });

  updateStatus();

  if (shouldScroll) {
    board.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateStatus() {
  const currentType = TYPES[currentIndex];

  currentTypeName.textContent = currentType.name;
  currentTypeName.style.color = currentType.dark;
  stepCount.textContent = `${currentIndex + 1} / ${TYPES.length}`;
  selectedCount.textContent = selected.size;
  prevButton.disabled = currentIndex === 0;

  document.querySelectorAll(".step-tab").forEach((tab, index) => {
    const type = TYPES[index];
    const isCurrent = index === currentIndex;
    tab.classList.toggle("is-current", isCurrent);
    tab.classList.toggle("has-selection", hasTypeSelection(type));
    tab.setAttribute("aria-current", isCurrent ? "step" : "false");
  });

  if (currentIndex === TYPES.length - 1) {
    const label = selected.size === 0 ? "문장 선택 후 결과 보기" : "결과 보기";
    setButtonContent(nextButton, selected.size === 0 ? "sparkles" : "trophy", label);
    nextButton.disabled = selected.size === 0;
  } else {
    setButtonContent(nextButton, "arrow-right", "다음");
    nextButton.disabled = false;
  }
}

function showResult() {
  if (selected.size === 0) {
    nextButton.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 220, easing: "ease-out" },
    );
    return;
  }

  const scores = getScores();
  const maxScore = Math.max(...scores.map((type) => type.score));
  const winners = scores.filter((type) => type.score === maxScore);

  resultMascots.innerHTML = "";
  winners.forEach((type) => resultMascots.append(createResultCharacter(type)));

  resultCard.style.setProperty("--type-color", winners[0].color);
  resultCard.style.setProperty("--type-dark", winners[0].dark);
  resultTitle.textContent = winners.map((type) => type.name).join(" + ");
  resultDialog.showModal();
}

function createResultCharacter(type) {
  const figure = document.createElement("figure");
  figure.className = "result-character";
  figure.style.setProperty("--type-color", type.color);
  figure.style.setProperty("--type-dark", type.dark);

  const image = document.createElement("img");
  image.src = type.image;
  image.alt = type.name;
  image.loading = "eager";
  figure.append(image);

  const caption = document.createElement("figcaption");
  caption.textContent = type.name;
  figure.append(caption);

  return figure;
}

function resetSelections() {
  selected.clear();
  document.querySelectorAll(".tile.is-selected").forEach((tile) => {
    tile.classList.remove("is-selected");
    tile.setAttribute("aria-pressed", "false");
  });
  updateStatus();
}

function registerServiceWorker() {
  const canUseServiceWorker = "serviceWorker" in navigator;
  const isWebPage = ["http:", "https:"].includes(window.location.protocol);
  const isOfflineBundle = document.documentElement.dataset.offlineBundle === "true";

  if (!canUseServiceWorker || !isWebPage || isOfflineBundle) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

hydrateInlineIcons();
setButtonContent(resetButton, "rotate-ccw", "초기화");
setButtonContent(prevButton, "arrow-left", "이전");
setButtonContent(keepChoosingButton, "arrow-left", "계속 고르기");
setButtonContent(restartButton, "rotate-ccw", "다시 하기");
renderStepTabs();
renderBoard();
updateStatus();
registerServiceWorker();

nextButton.addEventListener("click", () => {
  if (currentIndex === TYPES.length - 1) {
    showResult();
    return;
  }

  setCurrentIndex(currentIndex + 1, true);
});

prevButton.addEventListener("click", () => setCurrentIndex(currentIndex - 1, true));
resetButton.addEventListener("click", resetSelections);
closeDialog.addEventListener("click", () => resultDialog.close());
keepChoosingButton.addEventListener("click", () => resultDialog.close());
restartButton.addEventListener("click", () => {
  resultDialog.close();
  resetSelections();
  setCurrentIndex(0, false);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

resultDialog.addEventListener("click", (event) => {
  if (event.target === resultDialog) {
    resultDialog.close();
  }
});
