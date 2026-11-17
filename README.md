# B-Maps

App gratuito que mantém a cena do breaking conectada e atualizada no Brasil inteiro: eventos, batalhas, treinos, picos e aulas.

Feito com React Native + Expo (Expo Router), pensado para App Store e Google Play.

## Etapa 1 (esta versão)

- Identidade visual oficial (versão rua) e logo oficial
- Menu inferior: Início, Mapa, Publicar, Agenda e Perfil
- Telas sem dados inventados: onde ainda não há conteúdo, aparece um aviso
- Ainda **não** tem servidor, login, mapa real nem notificações (próximas etapas)
- Nada do que é preenchido nas telas é enviado ou salvo

## Como testar no iPhone (Windows)

Faça uma vez só (passos 1 a 5) e depois só o passo 6 a cada teste.

1. **Instale o Node.js**: baixe a versão **LTS** em https://nodejs.org e instale com as opções padrão.
2. **Baixe o código**: logado no GitHub como `bmapsoficial`, abra este repositório, clique em **Code > Download ZIP** e extraia a pasta (por exemplo, em `Documentos\bmaps-app`).
3. **Abra o PowerShell na pasta**: abra a pasta extraída no Explorador de Arquivos, clique na barra de endereço, digite `powershell` e aperte Enter.
4. **Instale as dependências** (pode demorar alguns minutos). Rode um comando de cada vez:

   ```
   npm install
   ```

   ```
   npx expo install react react-native expo-router expo-font expo-status-bar expo-linking expo-constants react-native-safe-area-context react-native-screens @expo/vector-icons @expo-google-fonts/inter @expo-google-fonts/anton @expo-google-fonts/permanent-marker @expo-google-fonts/sedgwick-ave-display
   ```

5. **Entre na conta Expo** (a mesma do Expo Go no iPhone, `bmapsoficial`):

   ```
   npx expo login
   ```

6. **Abra o app**:

   ```
   npx expo start
   ```

   Vai aparecer um QR code no PowerShell. Com o iPhone **na mesma rede Wi-Fi do computador**, aponte a câmera para o QR code e toque no aviso para abrir no **Expo Go**.

### Se der problema

- **"execução de scripts foi desabilitada"**: rode `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, confirme com `S` e tente de novo.
- **O iPhone não conecta**: pare com `Ctrl + C` e rode `npx expo start --tunnel`.
- **Qualquer outro erro**: copie a mensagem inteira (ou tire um print) e mande no chat.

## Organização do código

- `app/` — telas (cada arquivo é uma tela; `app/(tabs)/` são as abas do menu)
- `src/theme/` — cores e fontes oficiais
- `src/components/` — peças visuais reaproveitadas (botão adesivo, cartão de papel, menu inferior)
- `assets/` — logo oficial
