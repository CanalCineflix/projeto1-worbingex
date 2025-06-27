const { criarCobranca } = require("./efi");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve o index.html

// Rota de cadastro
app.post("/api/cadastrar", async (req, res) => {
  const { nome, email, senha } = req.body;

  console.log("Cadastro recebido:", nome, email);

  try {
    const resultado = await criarCobranca(nome, email);

    if (resultado.sucesso) {
      res.json({
        mensagem: "Cobrança criada com sucesso!",
        qr_code: resultado.qr_code,
        copia_cola: resultado.copia_cola,
      });
    } else {
      res.status(500).json({
        mensagem: "Erro ao criar cobrança Pix",
        erro: resultado.erro,
      });
    }
  } catch (erro) {
    console.error("Erro geral ao processar cadastro:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
