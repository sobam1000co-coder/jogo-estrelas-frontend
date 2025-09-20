// script.js (frontend)
const API_URL = "https://star-game-backend.onrender.com"; // troque depois pelo link do backend deployado
let playerId = "";
let points = 0;

// ------- UI helpers -------
function show(id) { document.getElementById(id).classList.remove("hidden"); }
function hide(id) { document.getElementById(id).classList.add("hidden"); }

// login simples (pode ser MetaMask depois)
document.getElementById("login-button")?.addEventListener("click", () => {
  const user = document.getElementById("login-user").value.trim();
  if (!user) return alert("Digite um nome de usuário");
  playerId = user;
  hide("auth-screen");
  show("main-menu-screen");
  loadBalance();
});

// conectar MetaMask (opcional) — usa endereço como playerId
document.getElementById("connect-wallet")?.addEventListener("click", async () => {
  if (!window.ethereum) return alert("MetaMask não encontrada");
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (accounts?.length) {
    playerId = accounts[0];
    document.getElementById("wallet-message").innerText = `Carteira: ${playerId}`;
    loadBalance();
  }
});

// carregar saldo do backend
async function loadBalance() {
  if (!playerId) return;
  const res = await fetch(`${API_URL}/balance/${encodeURIComponent(playerId)}`);
  const data = await res.json();
  document.getElementById("total-str-balance").innerText = data.balance ?? 0;
}

// iniciar partida (exemplo simples)
document.getElementById("start-game-button")?.addEventListener("click", () => {
  points = 0;
  hide("main-menu-screen");
  hide("game-over-screen");
  show("stats");
  // aqui começa a sua lógica de jogo real (spawns, timer, etc.)
  // exemplo: simular pontuação automática
  document.getElementById("score").innerText = points;
});

// função chamada quando a partida termina (você chama isso)
async function endGame(finalScore) {
  points = finalScore;
  document.getElementById("final-score").innerText = finalScore;
  // chama o backend pra converter pontos → STR
  if (!playerId) {
    alert("Conecte-se ou faça login para salvar seu STR");
  } else {
    const res = await fetch(`${API_URL}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, points: finalScore })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById("session-str").innerText = data.earned;
      alert(`Você ganhou ${data.earned} STR! (requiredPoints=${data.requiredPoints})`);
      loadBalance();
    } else {
      alert(data.message || "Nenhuma STR ganha nesta rodada");
    }
  }
  hide("stats");
  show("game-over-screen");
}

// Botões: restart, voltar ao menu, exit, skip
document.getElementById("restart-button")?.addEventListener("click", () => {
  hide("game-over-screen");
  show("stats");
  // reinicie a lógica do jogo
});
document.getElementById("menu-button")?.addEventListener("click", () => {
  hide("game-over-screen");
  show("main-menu-screen");
});
document.getElementById("exit-game-button")?.addEventListener("click", () => {
  // limpa estado e volta ao menu
  points = 0;
  hide("game-over-screen");
  show("main-menu-screen");
});
document.getElementById("skip-game-button")?.addEventListener("click", () => {
  // lógica de pular partida: você pode decidir dar 0 prêmio
  points = 0;
  hide("game-over-screen");
  show("main-menu-screen");
});

// saque (placeholder — atualiza só o saldo interno)
document.getElementById("withdraw-button")?.addEventListener("click", async () => {
  if (!playerId) return alert("Faça login ou conecte carteira");
  // aqui você chamaria endpoint /withdraw que implementa integração on-chain
  alert("Saque on-chain ainda não configurado. Em breve implementamos.");
});
