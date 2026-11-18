// Fonte única das notificações do app, usada pelo sininho da tela Início
// e pela tela Notificações.
//
// Ainda não existe servidor nem armazenamento de notificações: por isso a
// lista é vazia de verdade e não há nada não lido. Quando o servidor for
// ligado, só esta função muda — o sininho e a tela já leem daqui.

// Cor discreta do sininho quando há notificações não lidas.
export const COR_NAO_LIDA = '#E05252';

export function useNotificacoes() {
  const lista = [];
  const naoLidas = lista.filter((n) => !n.lida).length;
  return { lista, naoLidas };
}
