/* ==========================================================
   El Corazón de Pixi — Match emocional (drag o tap)
   Estilo premium morado/rosa (sin verde-azul)
   ========================================================== */

// 🔧 Ajusta los nombres de archivos EXACTOS como los tengas en assets/
const ASSETS = {
  enamorado: "assets/pixi_enamorado.png",
  aburrido: "assets/pixi_aburrido.png",
  dormido: "assets/pixi_dormido.png",
  triste: "assets/pixi_triste.png",
  normal: "assets/pixi_normal.png",

  ok: "assets/pixi_sonriente.png",
  bad: "assets/pixi_confundido.png",
};

const EMOTIONS = [
  { key: "enamorado", label: "ENAMORADO", icon: "💗" },
  { key: "aburrido", label: "ABURRIDO", icon: "◻️" },
  { key: "dormido", label: "DORMIDO", icon: "🌙" },
  { key: "triste", label: "TRISTE", icon: "💧" },
  { key: "normal", label: "NORMAL", icon: "●" },
];

// UI
const pixiImg = document.getElementById("pixiImg");
const pixiName = document.getElementById("pixiName");
const dropZone = document.getElementById("dropZone");
const optionsWrap = document.getElementById("options");
const progress = document.getElementById("progress");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMsg = document.getElementById("overlayMsg");
const overlaySmall = document.getElementById("overlaySmall");
const feedbackImg = document.getElementById("feedbackImg");
const nextBtn = document.getElementById("nextBtn");
const retryBtn = document.getElementById("retryBtn");

let order = [];
let idx = 0;
let solved = 0;
let lastAnswerCorrect = false;

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function showOverlay(title, msg, imgSrc, smallText){
  overlayTitle.textContent = title;
  overlayMsg.textContent = msg;
  overlaySmall.textContent = smallText || "";
  feedbackImg.src = imgSrc;
  overlay.classList.remove("hidden");
}

function hideOverlay(){
  overlay.classList.add("hidden");
}

function setPixi(emotionKey, emotionLabel){
  pixiImg.src = ASSETS[emotionKey];
  pixiName.textContent = `PIXI ${emotionLabel}`;
}

function buildOptions(){
  optionsWrap.innerHTML = "";
  const opts = shuffle(EMOTIONS);

  for (const e of opts){
    const el = document.createElement("div");
    el.className = "option";
    el.draggable = true;
    el.dataset.key = e.key;

    el.innerHTML = `
      <div class="optLeft">
        <div class="badge">${e.icon}</div>
        <div class="optName">${e.label}</div>
      </div>
      <div class="optRight">Arrastra / Toca</div>
    `;

    // Drag
    el.addEventListener("dragstart", (ev)=>{
      ev.dataTransfer.setData("text/plain", e.key);
      ev.dataTransfer.effectAllowed = "move";
    });

    // Tap (móvil)
    el.addEventListener("click", ()=>{
      attempt(e.key, el);
    });

    optionsWrap.appendChild(el);
  }
}

function updateProgress(){
  progress.textContent = `${solved} / ${EMOTIONS.length}`;
}

function attempt(answerKey, optionEl){
  const target = order[idx];
  const correct = answerKey === target.key;
  lastAnswerCorrect = correct;

  // Limpia estados visuales
  document.querySelectorAll(".option").forEach(o=>{
    o.classList.remove("correct","wrong");
  });

  if (optionEl){
    optionEl.classList.add(correct ? "correct" : "wrong");
  }

  if (correct){
    solved++;
    updateProgress();

    showOverlay(
      "¡Muy bien!",
      "Así se siente Pixi 💓",
      ASSETS.ok,
      "✨ + Chispas"
    );
  }else{
    showOverlay(
      "Casi…",
      "Observa mejor sus ojos y su corazón",
      ASSETS.bad,
      "Intenta de nuevo"
    );
  }
}

function next(){
  hideOverlay();

  if (lastAnswerCorrect){
    idx++;
  }

  // Fin del juego (micro reflexión)
  if (solved >= EMOTIONS.length){
    setTimeout(()=>{
      showOverlay(
        "¡Lo lograste!",
        "¿Alguna vez tú te has sentido como Pixi? Reconocer emociones nos ayuda a entendernos mejor.",
        ASSETS.ok,
        "🏅 Insignia: Entiendo las emociones de Pixi"
      );
      // reinicio suave al presionar continuar
      lastAnswerCorrect = true;
      idx = 0;
      solved = 0;
      order = shuffle(EMOTIONS);
      updateProgress();
      setPixi(order[idx].key, order[idx].label);
      buildOptions();
    }, 150);
    return;
  }

  // Carga siguiente emoción
  const target = order[idx];
  setPixi(target.key, target.label);
}

function retry(){
  hideOverlay();
}

// Drop zone
dropZone.addEventListener("dragover", (ev)=>{
  ev.preventDefault();
});

dropZone.addEventListener("drop", (ev)=>{
  ev.preventDefault();
  const key = ev.dataTransfer.getData("text/plain");
  const optionEl = [...document.querySelectorAll(".option")]
    .find(o => o.dataset.key === key);
  attempt(key, optionEl);
});

nextBtn.addEventListener("click", next);
retryBtn.addEventListener("click", retry);

// Init
function init(){
  order = shuffle(EMOTIONS);
  idx = 0;
  solved = 0;

  updateProgress();
  buildOptions();

  // Pantalla inicial (no corre nada)
  setPixi(order[idx].key, order[idx].label);

  showOverlay(
    "¡Listo para jugar!",
    "Arrastra o toca una emoción para ayudar a Pixi.",
    ASSETS.ok,
    "Tip: mira sus ojos y su corazón 💗"
  );
}

init();
