const API_URL = "https://star-game-backend.onrender.com'',, // troque depois pelo link do backend deployado

let username = "";
let score = 0;
let strBalance = 0;

// login simples (sem senha ainda)
document.getElementById("login-button").onclick = () => {
  username = document.getElementById("login-user").value;
  if (username) {
    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("main-menu-screen").classList.remove("hidden");
    loadBalance();
  }
};

// carregar saldo
async function loadBalance() {
  const res = await fetch(`${API_URL}/balance/${username}`);
  const data = await res.json();
  strBalance = data.balance;
  document.getElementById("total-str-balance").innerText = strBalance;
}

// iniciar jogo
document.getElementById("start-game-button").onclick = () => {
  document.getElementById("main-menu-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
};

// salvar pontos e enviar STR
async function endGame(points) {
  const earned = Math.floor(points / 100); // 1 STR a cada 100 pontos
  if (earned > 0) {
    await fetch(`${API_URL}/earn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, amount: earned })
    });
    loadBalance();
  }
  document.getElementById("final-score").innerText = points;
  document.getElementById("game-over-screen").classList.remove("hidden");
}
