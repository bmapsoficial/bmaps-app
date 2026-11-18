// Programação das publicações do B-Maps (datas, horários e dias da semana).
//
// Este arquivo define o FORMATO DOS DADOS, a validação e o texto de exibição.
// Ele não salva nada: o app ainda não tem servidor nem armazenamento. Quando o
// salvamento existir, a publicação montada aqui é o que deve ser gravado, e as
// telas de card, detalhe e agenda devem usar `descreverProgramacao` para exibir.
//
// Formato salvo (versao 2):
//   Evento:  programacao = { tipo: 'dias', dias: [{ data, inicio, fim }] }
//   Treino:  programacao = { tipo: 'semanal', diasSemana, inicio, fim, dataInicio, dataFim }
//   Aula avulsa:  { tipo: 'dias', dias: [{ data, inicio, fim }] }
//   Aula regular: { tipo: 'semanal', ... }  (dataFim opcional)
//   Curso/turma:  { tipo: 'periodo', diasSemana, inicio, fim, dataInicio, dataFim }
//   Pico: sem programação.
// Datas são guardadas como 'AAAA-MM-DD' e horários como 'HH:MM'.
// Publicações antigas (sem `programacao`) continuam exibindo o texto livre `quando`.

export const VERSAO_PUBLICACAO = 2;

export const DIAS_SEMANA = [
  { chave: 'seg', nome: 'Segunda-feira', plural: 'segundas' },
  { chave: 'ter', nome: 'Terça-feira', plural: 'terças' },
  { chave: 'qua', nome: 'Quarta-feira', plural: 'quartas' },
  { chave: 'qui', nome: 'Quinta-feira', plural: 'quintas' },
  { chave: 'sex', nome: 'Sexta-feira', plural: 'sextas' },
  { chave: 'sab', nome: 'Sábado', plural: 'sábados' },
  { chave: 'dom', nome: 'Domingo', plural: 'domingos' },
];

export const FORMATOS_AULA = [
  { chave: 'particular', nome: 'Aula particular' },
  { chave: 'grupo', nome: 'Aula em grupo' },
  { chave: 'aberta', nome: 'Aula aberta ao público' },
  { chave: 'curso', nome: 'Curso ou turma regular' },
];

export const CONDICOES_AULA = [
  { chave: 'gratuita', nome: 'Gratuita' },
  { chave: 'paga', nome: 'Paga' },
  { chave: 'consultar', nome: 'Consultar informações' },
];

export const FREQUENCIAS_AULA = [
  { chave: 'avulsa', nome: 'Aula avulsa' },
  { chave: 'regular', nome: 'Aulas regulares' },
];

const ABREV_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const dois = (n) => String(n).padStart(2, '0');

// ---------- Máscaras de digitação ----------

export function mascararData(texto) {
  const d = (texto || '').replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascararHora(texto) {
  const d = (texto || '').replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

// ---------- Leitura (texto digitado -> valor salvo) ----------

// 'DD/MM/AAAA' -> 'AAAA-MM-DD' ou null se a data não existir.
export function lerData(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto || '');
  if (!m) return null;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const d = new Date(ano, mes - 1, dia);
  if (d.getFullYear() !== ano || d.getMonth() !== mes - 1 || d.getDate() !== dia) return null;
  return `${ano}-${dois(mes)}-${dois(dia)}`;
}

// 'HH:MM' -> 'HH:MM' ou null se o horário for inválido.
export function lerHora(texto) {
  const m = /^(\d{2}):(\d{2})$/.exec(texto || '');
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${dois(h)}:${dois(min)}`;
}

// ---------- Exibição ----------

function dataDeIso(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

// '2027-12-11' -> 'Sáb, 11/12/2027'
export function formatarDataComDia(iso) {
  const d = dataDeIso(iso);
  return `${ABREV_SEMANA[d.getDay()]}, ${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// '2027-12-11' -> '11/12/2027'
export function formatarData(iso) {
  const d = dataDeIso(iso);
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// '18:00' -> '18h' · '18:30' -> '18h30'
export function formatarHora(hora) {
  const [h, m] = hora.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

function formatarIntervalo(inicio, fim) {
  return `das ${formatarHora(inicio)} às ${formatarHora(fim)}`;
}

function juntarComE(itens) {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

function descreverDiasSemana(chaves) {
  const ordenados = DIAS_SEMANA.filter((d) => chaves.includes(d.chave)).map((d) => d.plural);
  const texto = juntarComE(ordenados);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Linhas de texto para mostrar a programação em cards, detalhes e agenda.
// Funciona com publicações antigas (texto livre em `quando`).
export function descreverProgramacao(publicacao) {
  const p = publicacao && publicacao.programacao;
  if (!p) {
    return publicacao && publicacao.quando ? [publicacao.quando] : [];
  }
  if (p.tipo === 'dias') {
    return p.dias.map(
      (d) => `${formatarDataComDia(d.data)} · ${formatarIntervalo(d.inicio, d.fim)}`,
    );
  }
  if (p.tipo === 'semanal') {
    const periodo = p.dataFim
      ? `De ${formatarData(p.dataInicio)} a ${formatarData(p.dataFim)}`
      : `A partir de ${formatarData(p.dataInicio)}, sem data para terminar`;
    return [
      `${descreverDiasSemana(p.diasSemana)} · ${formatarIntervalo(p.inicio, p.fim)}`,
      periodo,
    ];
  }
  if (p.tipo === 'periodo') {
    return [
      `De ${formatarData(p.dataInicio)} a ${formatarData(p.dataFim)}`,
      `${descreverDiasSemana(p.diasSemana)} · ${formatarIntervalo(p.inicio, p.fim)}`,
    ];
  }
  return [];
}

// ---------- Validação e montagem (texto do formulário -> dados) ----------

function validarHorario(inicioTexto, fimTexto, prefixo, erros) {
  const inicio = lerHora(inicioTexto);
  const fim = lerHora(fimTexto);
  if (!inicio) erros.push(`${prefixo}: horário de início inválido (use HH:MM).`);
  if (!fim) erros.push(`${prefixo}: horário de término inválido (use HH:MM).`);
  if (inicio && fim && fim <= inicio) {
    erros.push(`${prefixo}: o término precisa ser depois do início.`);
  }
  return { inicio, fim };
}

// Evento (e aula avulsa): um ou mais dias, cada um com seus horários.
// Ordena por data e não aceita a mesma data duas vezes.
export function montarDias(diasFormulario) {
  const erros = [];
  const dias = [];
  diasFormulario.forEach((d, i) => {
    const prefixo = diasFormulario.length > 1 ? `Dia ${i + 1}` : 'Data';
    const data = lerData(d.data);
    if (!data) erros.push(`${prefixo}: data inválida (use DD/MM/AAAA).`);
    const { inicio, fim } = validarHorario(d.inicio, d.fim, prefixo, erros);
    if (data && inicio && fim) dias.push({ data, inicio, fim });
  });
  const vistas = new Set();
  dias.forEach((d) => {
    if (vistas.has(d.data)) erros.push(`A data ${formatarData(d.data)} aparece mais de uma vez.`);
    vistas.add(d.data);
  });
  dias.sort((a, b) =>
    a.data === b.data ? a.inicio.localeCompare(b.inicio) : a.data.localeCompare(b.data),
  );
  return erros.length ? { erros } : { erros, programacao: { tipo: 'dias', dias } };
}

// Treino e aula regular (dataFim opcional) ou curso/turma (dataFim obrigatória).
export function montarSemanal(semanal, { tipo = 'semanal', exigirFim = false } = {}) {
  const erros = [];
  const diasSemana = DIAS_SEMANA.map((d) => d.chave).filter((c) => semanal.diasSemana.includes(c));
  if (diasSemana.length === 0) erros.push('Escolha pelo menos um dia da semana.');
  const { inicio, fim } = validarHorario(semanal.inicio, semanal.fim, 'Horário', erros);
  const dataInicio = lerData(semanal.dataInicio);
  if (!dataInicio) erros.push('Data de início inválida (use DD/MM/AAAA).');
  let dataFim = null;
  if (semanal.dataFim) {
    dataFim = lerData(semanal.dataFim);
    if (!dataFim) erros.push('Data de encerramento inválida (use DD/MM/AAAA).');
  } else if (exigirFim) {
    erros.push('Informe a data de encerramento do período.');
  }
  if (dataInicio && dataFim && dataFim < dataInicio) {
    erros.push('O encerramento precisa ser depois do início.');
  }
  if (erros.length) return { erros };
  return { erros, programacao: { tipo, diasSemana, inicio, fim, dataInicio, dataFim } };
}
