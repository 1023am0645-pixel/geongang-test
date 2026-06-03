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

function renderStepTabs() {
  stepTabs.innerHTML = "";

  TYPES.forEach((type, index) => {
    const tab = document.createElement("button");
    tab.className = "step-tab";
    tab.type = "button";
    tab.textContent = type.name;
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
        center.style.setProperty("--tilt", `${typeIndex % 2 === 0 ? -1.2 : 1.2}deg`);

        const image = document.createElement("img");
        image.className = "center-character";
        image.src = type.image;
        image.alt = "";
        center.append(image);

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
      tile.style.setProperty("--tilt", `${[-1.4, 0.7, -0.6, 1.2, -1, 0.9, -0.8, 1.4][entry]}deg`);
      tile.textContent = type.items[entry];
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
    nextButton.textContent = selected.size === 0 ? "문장 선택 후 결과 보기" : "결과 보기";
    nextButton.disabled = selected.size === 0;
  } else {
    nextButton.textContent = "다음";
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
