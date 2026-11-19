// EXPERIMENTO (branch experimento/firebase-auth) — não usar fora do protótipo.
//
// Armazenamento da sessão do Firebase no Keychain (iOS) / Keystore (Android) via
// expo-secure-store, no formato que o Firebase espera (getItem / setItem / removeItem,
// todos assíncronos). Não há criptografia própria aqui: quem cifra é o sistema.
//
// Dois problemas do SecureStore resolvidos neste arquivo:
// 1. Nomes de chave: o SecureStore só aceita letras, números, ".", "-" e "_", e o
//    Firebase usa nomes como "firebase:authUser:<apiKey>:[DEFAULT]". Cada caractere
//    não permitido (e o próprio "_") vira "_<código hex>_", o que mantém nomes
//    distintos sempre distintos.
// 2. Tamanho: valores grandes podem ser recusados pelo iOS (historicamente acima de
//    ~2048 bytes). O valor é dividido em partes de até 600 unidades de texto (no
//    máximo ~1800 bytes em UTF-8), cada parte numa entrada própria do Keychain.
import * as SecureStore from 'expo-secure-store';

const TAMANHO_PARTE = 600;
const OPCOES = {
  // Só disponível com o aparelho desbloqueado e nunca copiado para backup/outro aparelho.
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export function nomeSeguro(chave) {
  return String(chave).replace(/[^A-Za-z0-9.-]/g, (c) => `_${c.charCodeAt(0).toString(16)}_`);
}

const chaveContagem = (base) => `${base}.n`;
const chaveParte = (base, i) => `${base}.${i}`;

// Divide o texto sem quebrar um caractere de dois códigos (ex.: emoji) entre partes,
// o que corromperia o valor na conversão para UTF-8 feita pelo sistema.
export function dividir(texto) {
  const partes = [];
  let inicio = 0;
  while (inicio < texto.length) {
    let fim = Math.min(inicio + TAMANHO_PARTE, texto.length);
    const codigo = texto.charCodeAt(fim - 1);
    if (fim < texto.length && codigo >= 0xd800 && codigo <= 0xdbff) fim -= 1;
    partes.push(texto.slice(inicio, fim));
    inicio = fim;
  }
  return partes.length > 0 ? partes : [''];
}

async function lerContagem(base) {
  const bruto = await SecureStore.getItemAsync(chaveContagem(base), OPCOES);
  const n = bruto === null ? 0 : Number.parseInt(bruto, 10);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

async function apagarPartes(base, de, ate) {
  for (let i = de; i < ate; i += 1) {
    await SecureStore.deleteItemAsync(chaveParte(base, i), OPCOES);
  }
}

export const armazenamentoSeguro = {
  async getItem(chave) {
    const base = nomeSeguro(chave);
    const n = await lerContagem(base);
    if (n === 0) return null;
    const partes = [];
    for (let i = 0; i < n; i += 1) {
      const parte = await SecureStore.getItemAsync(chaveParte(base, i), OPCOES);
      if (parte === null) {
        // Gravação incompleta (ex.: app fechado no meio). Descarta tudo: a pessoa
        // entra de novo, em vez de o app usar uma sessão corrompida.
        await this.removeItem(chave);
        return null;
      }
      partes.push(parte);
    }
    return partes.join('');
  },

  async setItem(chave, valor) {
    const base = nomeSeguro(chave);
    const texto = String(valor);
    const anterior = await lerContagem(base);
    const partes = dividir(texto);
    const n = partes.length;
    // A contagem é zerada antes e gravada por último: se algo falhar no meio, a leitura
    // encontra contagem 0 (ou parte faltando) e trata como "sem sessão".
    await SecureStore.deleteItemAsync(chaveContagem(base), OPCOES);
    for (let i = 0; i < n; i += 1) {
      await SecureStore.setItemAsync(chaveParte(base, i), partes[i], OPCOES);
    }
    await apagarPartes(base, n, anterior);
    await SecureStore.setItemAsync(chaveContagem(base), String(n), OPCOES);
  },

  async removeItem(chave) {
    const base = nomeSeguro(chave);
    const n = await lerContagem(base);
    await SecureStore.deleteItemAsync(chaveContagem(base), OPCOES);
    await apagarPartes(base, 0, Math.max(n, 1));
  },
};
