const terminal = document.querySelector("#terminal");
const eventFeed = document.querySelector("#eventFeed");
const commandForm = document.querySelector("#commandForm");
const commandInput = document.querySelector("#commandInput");
const sessionId = document.querySelector("#sessionId");
const tracePercent = document.querySelector("#tracePercent");
const accessState = document.querySelector("#accessState");
const nodeCount = document.querySelector("#nodeCount");
const routeLabel = document.querySelector("#routeLabel");
const mapGrid = document.querySelector("#mapGrid");
const clock = document.querySelector("#clock");
const meters = {
  cpu: document.querySelector("#cpuMeter"),
  signal: document.querySelector("#signalMeter"),
  entropy: document.querySelector("#entropyMeter")
};

const presetCopy = {
  mainframe: {
    route: "LOCALHOST LOOP",
    access: "Sandbox",
    lines: ["booting phantom shell", "routing through simulated proxy mesh", "mainframe facade online"]
  },
  satellite: {
    route: "ORBITAL RELAY",
    access: "Relay",
    lines: ["aligning fake uplink array", "spoofing star tracker telemetry", "satellite stage armed"]
  },
  vault: {
    route: "VAULT MIRROR",
    access: "Cipher",
    lines: ["loading theatrical cipher deck", "mirroring vault facade", "bypass animation ready"]
  },
  ghost: {
    route: "GHOST TRACE",
    access: "Counter",
    lines: ["counter-trace decoy spawned", "noise bloom injected", "ghost trail recording"]
  }
};

const commands = {
  launch: ["initializing fake intrusion cinematic", "opening sandbox windows", "no external systems touched"],
  scan: ["scanning imaginary ports 0000-9999", "13 synthetic endpoints painted", "scan complete"],
  decrypt: ["rotating cipher wheel", "keyspace sparkle at 88%", "decryption animation complete"],
  spoof: ["forging visual-only credentials", "identity mask applied to demo feed", "spoof routine contained"],
  trace: ["trace timer accelerated", "decoy packets orbiting", "counter-trace avoided"],
  lock: ["locking interface panels", "freezing route map", "control shell remains local"],
  clear: []
};

const bootLines = [
  "PHANTOMOPS SAFE SIMULATOR v4.2",
  "This is a visual toy. No network probing, exploitation, or data access occurs.",
  "Type launch, scan, decrypt, spoof, trace, lock, or clear."
];

const feedMessages = [
  "Decoy node accepted handshake",
  "Synthetic trace packet bounced",
  "Cipher wheel rotated",
  "Sandbox integrity verified",
  "Proxy theatre refreshed",
  "Visual payload staged",
  "Route map repainted",
  "Fake alert acknowledged"
];

let trace = 0;
let nodes = 0;
let activePreset = "mainframe";
let autoTimer = null;
let audioContext = null;
let soundOn = false;

function randomId() {
  return `PX-${Math.floor(1000 + Math.random() * 9000)}`;
}

function writeLine(text, tone = "") {
  const line = document.createElement("p");
  line.className = tone;
  line.textContent = `> ${text}`;
  terminal.append(line);
  while (terminal.children.length > 34) {
    terminal.firstElementChild.remove();
  }
  terminal.scrollTop = terminal.scrollHeight;
}

function addFeed(text) {
  const item = document.createElement("li");
  item.textContent = text;
  eventFeed.prepend(item);
  while (eventFeed.children.length > 8) {
    eventFeed.lastElementChild.remove();
  }
}

function tickStats() {
  trace = Math.min(99, trace + Math.floor(Math.random() * 4));
  nodes = Math.min(99, nodes + Math.floor(Math.random() * 3));
  tracePercent.textContent = `${trace}%`;
  nodeCount.textContent = String(nodes).padStart(2, "0");
  meters.cpu.value = 18 + Math.floor(Math.random() * 74);
  meters.signal.value = 38 + Math.floor(Math.random() * 58);
  meters.entropy.value = 24 + Math.floor(Math.random() * 71);
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;

  writeLine(`root@phantom:~$ ${command}`, "cyan");
  if (command === "clear") {
    terminal.replaceChildren();
    return;
  }

  const output = commands[command] || [
    `unknown simulator verb: ${command}`,
    "try launch, scan, decrypt, spoof, trace, lock, or clear"
  ];

  output.forEach((line, index) => {
    setTimeout(() => {
      const tone = line.includes("no external") || line.includes("contained") ? "ok" : index === 0 ? "warn" : "";
      writeLine(line, tone);
      addFeed(feedMessages[Math.floor(Math.random() * feedMessages.length)]);
      tickStats();
      beep(180 + index * 70, 0.035);
    }, 120 * (index + 1));
  });
}

function setPreset(name) {
  activePreset = name;
  document.querySelectorAll(".preset").forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === name);
  });
  routeLabel.textContent = presetCopy[name].route;
  accessState.textContent = presetCopy[name].access;
  presetCopy[name].lines.forEach((line, index) => {
    setTimeout(() => writeLine(line, index === 2 ? "ok" : ""), index * 90);
  });
  drawMap();
}

function drawMap() {
  mapGrid.replaceChildren();
  const points = Array.from({ length: 9 }, () => ({
    x: 8 + Math.random() * 84,
    y: 12 + Math.random() * 76
  }));

  points.forEach((point) => {
    const node = document.createElement("span");
    node.className = "node";
    node.style.left = `${point.x}%`;
    node.style.top = `${point.y}%`;
    mapGrid.append(node);
  });

  points.slice(1).forEach((point, index) => {
    const previous = points[index];
    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const route = document.createElement("span");
    route.className = "route";
    route.style.left = `${previous.x}%`;
    route.style.top = `${previous.y}%`;
    route.style.width = `${length}%`;
    route.style.transform = `rotate(${angle}deg)`;
    mapGrid.append(route);
  });
}

function panicWipe() {
  document.body.classList.add("wiping");
  terminal.replaceChildren();
  eventFeed.replaceChildren();
  trace = 0;
  nodes = 0;
  tracePercent.textContent = "0%";
  nodeCount.textContent = "00";
  accessState.textContent = "Sandbox";
  setTimeout(() => {
    document.body.classList.remove("wiping");
    boot();
  }, 1300);
}

function boot() {
  sessionId.textContent = randomId();
  bootLines.forEach((line, index) => {
    setTimeout(() => writeLine(line, index === 1 ? "ok" : ""), index * 160);
  });
  drawMap();
}

function startAutoRun() {
  const sequence = ["launch", "scan", "decrypt", "spoof", "trace"];
  let index = 0;
  clearInterval(autoTimer);
  runCommand(sequence[index]);
  autoTimer = setInterval(() => {
    index = (index + 1) % sequence.length;
    runCommand(sequence[index]);
  }, 2300);
}

function beep(frequency, duration) {
  if (!soundOn) return;
  audioContext ||= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "square";
  gain.gain.setValueAtTime(0.035, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString("en-US", { hour12: false });
}

function setupRain() {
  const canvas = document.querySelector("#rainCanvas");
  const context = canvas.getContext("2d");
  const glyphs = "01ABCDEF#$%<>[]{}";
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array.from({ length: Math.ceil(canvas.width / 18) }, () => Math.random() * canvas.height);
  }

  function draw() {
    context.fillStyle = "rgba(3, 8, 6, 0.12)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#45f59d";
    context.font = "16px Consolas, monospace";
    drops.forEach((drop, index) => {
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      context.fillText(glyph, index * 18, drop);
      drops[index] = drop > canvas.height && Math.random() > 0.965 ? 0 : drop + 18;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

document.querySelectorAll(".preset").forEach((button) => {
  button.addEventListener("click", () => setPreset(button.dataset.preset));
});

document.querySelector("#autoRun").addEventListener("click", startAutoRun);
document.querySelector("#panic").addEventListener("click", panicWipe);
document.querySelector("#soundToggle").addEventListener("click", (event) => {
  soundOn = !soundOn;
  event.currentTarget.setAttribute("aria-pressed", String(soundOn));
  event.currentTarget.classList.toggle("active", soundOn);
  beep(440, 0.05);
});

document.querySelector("#scanlines").addEventListener("change", (event) => {
  document.querySelector(".scanline-layer").classList.toggle("off", !event.target.checked);
});

document.querySelector("#matrixMode").addEventListener("change", (event) => {
  document.querySelector("#rainCanvas").classList.toggle("off", !event.target.checked);
});

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(commandInput.value);
  commandInput.value = "";
});

setInterval(() => {
  tickStats();
  if (Math.random() > 0.55) addFeed(feedMessages[Math.floor(Math.random() * feedMessages.length)]);
}, 1600);

setInterval(updateClock, 1000);
updateClock();
setupRain();
boot();
