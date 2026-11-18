// Filtro de categorias da aba Mapa: no máximo uma categoria ativa por vez.
// `null` significa nenhum filtro, ou seja, mostrar todas as categorias.

// Tocar na categoria já ativa remove o filtro; tocar em outra troca direto para ela.
export function alternarFiltro(atual, categoria) {
  return atual === categoria ? null : categoria;
}

// Diz se um item de determinada categoria deve aparecer com o filtro atual.
export function categoriaVisivel(filtro, categoria) {
  return filtro === null || filtro === categoria;
}
