import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BlocoSpray, EstadoVazio, Etiqueta, Tela, TituloGrafite } from '../../src/components/Rua';
import { cores, coresSelecao, fontes, sombraAdesivo } from '../../src/theme';

const DIAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

// Os próximos 7 dias a partir de hoje (datas reais do celular).
function proximosSeteDias() {
  const hoje = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    return {
      chave: d.toDateString(),
      dia: d.getDate(),
      semana: DIAS[d.getDay()],
      mes: d.getMonth(),
    };
  });
}

export default function Agenda() {
  const dias = useMemo(proximosSeteDias, []);
  const [selecionado, setSelecionado] = useState(dias[0].chave);
  const [filtro, setFiltro] = useState('tudo');
  const diaAtual = dias.find((d) => d.chave === selecionado) || dias[0];

  return (
    <Tela fundo={0}>
      <View style={estilos.topo}>
        {/* "Rolês" ocupa o espaço ao lado dos filtros, com recuo de 20%; só diminui se
            não couber (iPhones menores). */}
        <TituloGrafite
          tamanho={52}
          linhas={1}
          ajustar
          gotas={[0.122, 0.491, 0.897]}
          sublinhado={[0.075, 0.96]}
          estilo={estilos.titulo}
        >
          rolês
        </TituloGrafite>
        <View style={estilos.filtros}>
          <Etiqueta
            titulo="Todos"
            ativa={filtro === 'tudo'}
            aoTocar={() => setFiltro('tudo')}
            inclinacao={-2}
          />
          <Etiqueta
            titulo="Eu vou"
            ativa={filtro === 'euvou'}
            aoTocar={() => setFiltro('euvou')}
            inclinacao={1.5}
            corAtiva={cores.verde}
          />
        </View>
      </View>

      <Text style={estilos.mes}>{MESES[diaAtual.mes]}</Text>

      <View style={estilos.semana}>
        {dias.map((d, i) => {
          const ativo = d.chave === selecionado;
          return (
            <Pressable
              key={d.chave}
              onPress={() => setSelecionado(d.chave)}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
              accessibilityLabel={`${d.semana} ${d.dia}${i === 0 ? ', hoje' : ''}`}
              style={[
                estilos.dia,
                ativo
                  ? {
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                      transform: [{ rotate: '-3deg' }],
                    }
                  : [{ borderColor: cores.texto }, sombraAdesivo('#000000', 2)],
              ]}
            >
              {ativo ? (
                <BlocoSpray cor={coresSelecao.fundo} corSombra={cores.texto} distancia={3} />
              ) : null}
              <Text
                style={[
                  estilos.diaSemana,
                  { color: ativo ? coresSelecao.texto : cores.textoSuave },
                ]}
              >
                {d.semana}
              </Text>
              <Text
                style={[estilos.diaNumero, { color: ativo ? coresSelecao.texto : cores.texto }]}
              >
                {d.dia}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filtro === 'tudo' ? (
        <EstadoVazio
          titulo="Nada marcado pra esse dia"
          texto="Eventos, treinos e aulas publicados pela galera aparecem aqui, separados por dia."
        />
      ) : (
        <EstadoVazio
          titulo="Você ainda não marcou presença"
          texto="Quando tocar em “Eu vou” num evento, treino ou aula, ele aparece aqui."
        />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titulo: {
    flex: 1,
    minWidth: 0,
    paddingLeft: '20%',
    paddingRight: 4,
    marginBottom: 0,
  },
  // Os filtros mantêm tamanho e área de toque; quem cede espaço é o título.
  filtros: {
    flexDirection: 'row',
    flexShrink: 0,
    gap: 8,
  },
  mes: {
    fontFamily: fontes.marcador,
    fontSize: 15,
    textTransform: 'uppercase',
    color: cores.textoSuave,
    marginTop: -6,
  },
  semana: {
    flexDirection: 'row',
    gap: 6,
  },
  dia: {
    flex: 1,
    height: 62,
    borderWidth: 2,
    backgroundColor: '#0B0B0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaSemana: {
    fontFamily: fontes.bloco,
    fontSize: 11,
  },
  diaNumero: {
    fontFamily: fontes.bloco,
    fontSize: 22,
    lineHeight: 26,
  },
});
