let usuarioLogado = false;
let planoPago = false;

window.onload = () => {
  const dadosUsuario = localStorage.getItem("usuarioLogado");
  planoPago = localStorage.getItem("planoPago") === "true";

  if (dadosUsuario) {
    const usuario = JSON.parse(dadosUsuario);
    usuarioLogado = true;

    document.getElementById("saudacaoUsuario").textContent = `Olá, ${usuario.nome}`;
    document.querySelector(".saudacao-usuario").style.display = "block";
    document.querySelector(".button-logout").style.display = "block";
    document.getElementById("loginOverlay").style.display = "none";
    carregarFilmes();
  } else {
    document.getElementById("loginOverlay").style.display = "flex";
  }
};

function cadastrar() {
  const nome = document.getElementById("cadastroNome").value;
  const email = document.getElementById("cadastroEmail").value;
  const senha = document.getElementById("cadastroSenha").value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuario = { nome, email, senha };
  localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));
  alert("Cadastro realizado com sucesso!");
  showLogin();
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;
  const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioCadastrado"));

  if (usuarioSalvo && usuarioSalvo.email === email && usuarioSalvo.senha === senha) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioSalvo));
    usuarioLogado = true;

    document.getElementById("saudacaoUsuario").textContent = `Olá, ${usuarioSalvo.nome}`;
    document.querySelector(".saudacao-usuario").style.display = "block";
    document.querySelector(".button-logout").style.display = "block";
    document.getElementById("loginOverlay").style.display = "none";
    carregarFilmes();
  } else {
    alert("Credenciais inválidas.");
  }
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("planoPago");
  usuarioLogado = false;
  planoPago = false;

  document.querySelector(".saudacao-usuario").style.display = "none";
  document.querySelector(".button-logout").style.display = "none";
  document.getElementById("loginOverlay").style.display = "flex";
  document.querySelector(".movies-list").innerHTML = "";
  closeModal();
}

function showCadastro() {
  document.getElementById("loginOverlay").style.display = "none";
  document.getElementById("cadastroOverlay").style.display = "flex";
}

function showLogin() {
  document.getElementById("cadastroOverlay").style.display = "none";
  document.getElementById("loginOverlay").style.display = "flex";
}

function gerarPix() {
  localStorage.setItem("planoPago", true);
  planoPago = true;
  alert("Pagamento via PIX confirmado.");
  fecharModalPlanos();
}

function gerarBoleto() {
  localStorage.setItem("planoPago", true);
  planoPago = true;
  alert("Pagamento via Boleto confirmado.");
  fecharModalPlanos();
}

function gerarCartao() {
  localStorage.setItem("planoPago", true);
  planoPago = true;
  alert("Pagamento via Cartão confirmado.");
  fecharModalPlanos();
}

function abrirModalPlanos() {
  document.getElementById("modalPlanos").style.display = "flex";
}

function fecharModalPlanos() {
  document.getElementById("modalPlanos").style.display = "none";
}

function openModal(videoPath) {
  if (!usuarioLogado) {
    document.getElementById("loginOverlay").style.display = "flex";
    return;
  }

  const isPremium =
    videoPath.includes("capitao") ||
    videoPath.includes("harry-potter") ||
    videoPath.includes("resgate") ||
    videoPath.includes("compadecida2") ||
    videoPath.includes("nas-terras");

  if (isPremium && !planoPago) {
    abrirModalPlanos();
    return;
  }

  const video = document.getElementById("videoPlayer");
  video.src = videoPath;
  document.getElementById("myModal").style.display = "block";
  video.play();
}

function closeModal() {
  const video = document.getElementById("videoPlayer");
  video.pause();
  video.src = "";
  document.getElementById("myModal").style.display = "none";
  fecharModalPlanos();
}

function selecionarPlano(dias, metodo) {
  if (metodo === 'pix') gerarPix();
  if (metodo === 'boleto') gerarBoleto();
  if (metodo === 'cartao') gerarCartao();
}

function filterCategory(category) {
  const items = document.querySelectorAll(".movie-item");
  document.getElementById("categoryTitle").innerText = category.toUpperCase();

  items.forEach(item => {
    const categorias = item.getAttribute("data-category").split(",");
    item.style.display = categorias.includes(category) ? "block" : "none";
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const filmes = document.querySelectorAll(".movie-item");

  filmes.forEach(item => {
    const titulo = item.innerText.toLowerCase();
    item.style.display = titulo.includes(termo) ? "block" : "none";
  });
});

function carregarFilmes() {
  fetch("filmesfree")
    .then(res => res.text())
    .then(html => {
      document.querySelector(".movies-list").innerHTML += html;
    });

  fetch("filmespremium")
    .then(res => res.text())
    .then(html => {
      document.querySelector(".movies-list").innerHTML += html;
    });
}
