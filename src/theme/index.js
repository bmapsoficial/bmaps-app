// Identidade visual oficial do B-Maps (versão rua).
// Código de cores: laranja = ação, verde = confirmar presença / ao vivo,
// branco e cinza = informação.

export const cores = {
  fundo: '#0E0E0F',
  fundoBarra: '#0A0A0B',
  cartao: '#17171A',
  papel: '#ECEAE4',
  texto: '#F5F5F5',
  textoSuave: '#C8C8CC',
  cinza: '#8E8E93',
  borda: '#3A3A3E',
  laranja: '#FF6A1A',
  laranjaClaro: '#FF8A47',
  laranjaEscuro: '#B23E00',
  verde: '#009225',
  verdeClaro: '#7BD88F',
  textoPapel: '#111111',
};

export const fontes = {
  grafite: 'SedgwickAveDisplay_400Regular',
  marcador: 'PermanentMarker_400Regular',
  bloco: 'Anton_400Regular',
  texto: 'Inter_400Regular',
  textoSemi: 'Inter_600SemiBold',
  textoNegrito: 'Inter_700Bold',
  textoExtra: 'Inter_800ExtraBold',
};

// Sombra "adesivo": deslocada e sem desfoque.
export const sombraAdesivo = (cor = cores.texto, distancia = 3) => ({
  shadowColor: cor,
  shadowOffset: { width: distancia, height: distancia },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 0,
});
