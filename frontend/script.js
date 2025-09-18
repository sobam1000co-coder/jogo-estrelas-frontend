const API_URL = "http://localhost:3000"; // Troque para URL do deploy
const playerId = "player1"; // exemplo fixo, pode usar login depois

let points = 0;

document.getElementById("play").addEventListener("click", () => {
  points += Math.floor(Math.random() * 50) + 10; // soma pontos aleatórios
  document.getElementById("points").innerText = points;
});

document.getElementById("claim").addEventListener("click", async () => {
  const res = await fetch(`${API_URL}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, points })
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("message").innerText =
      `Você ganhou ${data.reward} STR! Dificuldade atual: ${data.difficulty}`;
    document.getElementById("balance").innerText = data.newBalance;
    points = 0; // reseta pontos
    document.getElementById("points").innerText = points;
  } else {
    document.getElementById("message").innerText = data.message;
  }
});

document.getElementById("next").addEventListener("click", () => {
  points = 0;
  document.getElementById("points").innerText = points;
  document.getElementById("message").innerText = "Nova partida iniciada!";
});

document.getElementById("exit").addEventListener("click", () => {
  points = 0;
  document.getElementById("points").innerText = points;
  document.getElementById("message").innerText = "Você saiu da partida!";
});
