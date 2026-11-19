# Experimento: autenticação com Firebase (branch `experimento/firebase-auth`)

Protótipo isolado. Não juntar com `etapa1/configuracoes` nem com `main` sem aprovação.

## O que o protótipo faz

- O app inteiro exige conta com e-mail confirmado (`app/_layout.js`, `Stack.Protected`).
- Telas: `entrar`, `cadastrar`, `recuperar-senha`, `confirmar-email` e `sessao-teste`
  (diagnóstico, acessível em Configurações).
- Sessão guardada no Keychain/Keystore por `src/auth/armazenamentoSeguro.js`
  (expo-secure-store, sem criptografia própria; nomes de chave convertidos e valor
  dividido em partes pequenas). Nada de sessão no AsyncStorage.
- Ao voltar para o app depois de confirmar o e-mail no navegador, o app recarrega o
  usuário e força um token novo (`src/auth/Sessao.js`).

## Projeto Firebase criado

- Nome: **B-MAPS Brasil** · ID: `b-maps-brasil` · conta Google: bmapsbrasil@gmail.com
- Plano **Spark** (sem cartão), sem Google Analytics e sem Gemini.
- Authentication: só **E-mail/senha** ativo; proteção contra enumeração de e-mails ativa;
  política de senha **exigida**: mínimo 10 caracteres, com letra minúscula e número.
- App Web registrado (sem Hosting). E-mails e página de ações em pt-BR (`languageCode`).

## Antes de testar (precisa de autorização) — já feito, mantido como referência

1. Criar o projeto no Firebase, no plano **Spark** (sem cartão).
2. Em Authentication: ativar **E-mail/senha**, a **proteção contra enumeração de e-mails**
   e uma **política de senha** forte; colocar os modelos de e-mail em português.
3. Registrar um app **Web** no projeto e copiar a configuração para um arquivo `.env`
   (modelo em `.env.example`; o `.env` não vai para o Git).
4. No computador, nesta branch: `npx expo install firebase expo-secure-store`.

## Roteiro de teste no iPhone (Expo Go)

1. Cadastrar com nome, e-mail e senha → deve abrir "Confirme o e-mail".
2. Abrir o link do e-mail no iPhone → página do Firebase confirma → voltar ao Expo Go →
   o app deve entrar sozinho (ou pelo botão "Já confirmei").
3. Configurações → Sessão (teste): "E-mail confirmado (token)" = sim; "Sessão no
   Keychain" = sim.
4. Fechar o Expo Go por completo e abrir de novo → deve entrar direto, sem login.
5. "Forçar renovação do token" → horário de emissão muda.
6. Sair → volta para "Entrar"; abrir de novo → continua fora.
7. "Esqueci minha senha" → link → nova senha na página do Firebase → entrar com ela.
8. Senha errada várias vezes → mensagem de muitas tentativas.

## Fora deste protótipo

- Validação do token no Worker e vínculo com o D1 (etapa separada).
- "Sair de todos os aparelhos" (depende do Worker).
- Link abrindo o app direto (depende de domínio próprio e conta Apple Developer).
- Limpeza da sessão após reinstalar o app no iOS (o Keychain sobrevive à desinstalação).
