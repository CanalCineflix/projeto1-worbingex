const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const https = require("https");

const agent = new https.Agent({
  cert: fs.readFileSync("./certificado.pem"),
  key: fs.readFileSync("./chave.pem"),
  rejectUnauthorized: false, // só para sandbox
});

async function criarCobranca(nome, email) {
  try {
    // 1. Autenticar e obter o access_token
    const authResponse = await axios.post(
      "https://api-pix-h.gerencianet.com.br/oauth/token",
      "grant_type=client_credentials",
      {
        auth: {
          username: process.env.EFINET_CLIENT_ID,
          password: process.env.EFINET_CLIENT_SECRET,
        },
        httpsAgent: agent,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = authResponse.data.access_token;

    // 2. Criar a cobrança
    const body = {
      calendario: { expiracao: 3600 },
      devedor: { nome, cpf: "12345678909" }, // CPF genérico válido
      valor: { original: "0.50" },
      chave: "SUA_CHAVE_PIX_AQUI",
      solicitacaoPagador: "Pagamento para acesso",
    };

    const response = await axios.post(
      "https://api-pix-h.gerencianet.com.br/v2/cob",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        httpsAgent: agent,
      }
    );

    const txid = response.data.loc.id;

    // 3. Gerar QR Code
    const qr = await axios.get(
      `https://api-pix-h.gerencianet.com.br/v2/loc/${txid}/qrcode`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent: agent,
      }
    );

    return {
      sucesso: true,
      qr_code: qr.data.imagemQrcode,
      copia_cola: qr.data.qrcode,
    };
  } catch (erro) {
    console.error("Erro ao criar cobrança Pix:", erro.response?.data || erro);
    return { sucesso: false, erro: erro.response?.data || erro };
  }
}

module.exports = { criarCobranca };
