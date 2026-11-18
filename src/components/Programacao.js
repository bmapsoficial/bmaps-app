// Peças reaproveitáveis de data, horário e dias da semana da tela Avisar a cena.
// Seguem o mesmo padrão visual dos campos que já existiam no formulário.
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BotaoAdesivo, Etiqueta, Rotulo } from './Rua';
import { cores, fontes } from '../theme';
import { DIAS_SEMANA, mascararData, mascararHora } from '../programacao';

const INCLINACOES = [-2, 1.5, -1, 1, -1.5, 2, -1];

// Campo de texto com máscara de data (DD/MM/AAAA) ou horário (HH:MM).
export function CampoMascara({ rotulo, valor, aoMudar, tipo = 'data', dica, flexivel }) {
  const mascarar = tipo === 'data' ? mascararData : mascararHora;
  return (
    <View style={[{ gap: 6 }, flexivel && { flex: 1 }]}>
      <Rotulo cor={cores.textoSuave}>{rotulo}</Rotulo>
      <TextInput
        value={valor}
        onChangeText={(t) => aoMudar(mascarar(t))}
        placeholder={dica || (tipo === 'data' ? 'DD/MM/AAAA' : 'HH:MM')}
        placeholderTextColor={cores.cinza}
        keyboardType="number-pad"
        maxLength={tipo === 'data' ? 10 : 5}
        accessibilityLabel={rotulo}
        style={estilos.campo}
      />
    </View>
  );
}

// Horário de início e de término lado a lado.
export function CamposHorario({ inicio, fim, aoMudarInicio, aoMudarFim }) {
  return (
    <View style={estilos.linha}>
      <CampoMascara rotulo="Início" tipo="hora" valor={inicio} aoMudar={aoMudarInicio} flexivel />
      <CampoMascara rotulo="Término" tipo="hora" valor={fim} aoMudar={aoMudarFim} flexivel />
    </View>
  );
}

// Escolha de uma opção entre várias (formato da aula, condição, frequência).
export function OpcoesUnicas({ rotulo, opcoes, valor, aoEscolher, cor }) {
  return (
    <View style={{ gap: 10 }}>
      <Rotulo cor={cores.textoSuave}>{rotulo}</Rotulo>
      <View style={estilos.opcoes}>
        {opcoes.map((o, i) => (
          <Etiqueta
            key={o.chave}
            titulo={o.nome}
            ativa={valor === o.chave}
            aoTocar={() => aoEscolher(o.chave)}
            inclinacao={INCLINACOES[i % INCLINACOES.length]}
            corAtiva={cor}
          />
        ))}
      </View>
    </View>
  );
}

// Seleção de um ou vários dias da semana.
export function SeletorDiasSemana({ selecionados, aoAlternar, cor }) {
  return (
    <View style={{ gap: 10 }}>
      <Rotulo cor={cores.textoSuave}>Dias da semana</Rotulo>
      <View style={estilos.opcoes}>
        {DIAS_SEMANA.map((d, i) => (
          <Etiqueta
            key={d.chave}
            titulo={d.nome}
            ativa={selecionados.includes(d.chave)}
            aoTocar={() => aoAlternar(d.chave)}
            inclinacao={INCLINACOES[i]}
            corAtiva={cor}
          />
        ))}
      </View>
    </View>
  );
}

// Um ou mais dias, cada um com data, início e término (evento e aula avulsa).
// `permitirVarios` mostra o botão "+ Adicionar outro dia".
export function ListaDeDias({ dias, aoMudar, permitirVarios = true }) {
  const atualizar = (id, campo, valor) =>
    aoMudar(dias.map((d) => (d.id === id ? { ...d, [campo]: valor } : d)));
  const remover = (id) => aoMudar(dias.filter((d) => d.id !== id));
  const adicionar = () =>
    aoMudar([...dias, { id: `${Date.now()}-${dias.length}`, data: '', inicio: '', fim: '' }]);

  return (
    <View style={{ gap: 14 }}>
      {dias.map((d, i) => (
        <View key={d.id} style={dias.length > 1 ? estilos.blocoDia : null}>
          {dias.length > 1 && (
            <View style={estilos.cabecalhoDia}>
              <Rotulo cor={cores.texto}>{`Dia ${i + 1}`}</Rotulo>
              <Pressable
                onPress={() => remover(d.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remover dia ${i + 1}`}
                hitSlop={10}
                style={estilos.remover}
              >
                <Ionicons name="close" size={18} color={cores.texto} />
              </Pressable>
            </View>
          )}
          <View style={{ gap: 12 }}>
            <CampoMascara
              rotulo="Data"
              valor={d.data}
              aoMudar={(v) => atualizar(d.id, 'data', v)}
            />
            <CamposHorario
              inicio={d.inicio}
              fim={d.fim}
              aoMudarInicio={(v) => atualizar(d.id, 'inicio', v)}
              aoMudarFim={(v) => atualizar(d.id, 'fim', v)}
            />
          </View>
        </View>
      ))}
      {permitirVarios && (
        <BotaoAdesivo titulo="+ Adicionar outro dia" variante="contorno" aoTocar={adicionar} />
      )}
    </View>
  );
}

// Programação semanal: dias, horário, data de início e encerramento.
export function ProgramacaoSemanal({ valor, aoMudar, cor, fimObrigatorio = false }) {
  const mudar = (campo, v) => aoMudar({ ...valor, [campo]: v });
  const alternarDia = (chave) =>
    mudar(
      'diasSemana',
      valor.diasSemana.includes(chave)
        ? valor.diasSemana.filter((c) => c !== chave)
        : [...valor.diasSemana, chave],
    );

  return (
    <View style={{ gap: 12 }}>
      <SeletorDiasSemana selecionados={valor.diasSemana} aoAlternar={alternarDia} cor={cor} />
      <CamposHorario
        inicio={valor.inicio}
        fim={valor.fim}
        aoMudarInicio={(v) => mudar('inicio', v)}
        aoMudarFim={(v) => mudar('fim', v)}
      />
      <View style={estilos.linha}>
        <CampoMascara
          rotulo="Começa em"
          valor={valor.dataInicio}
          aoMudar={(v) => mudar('dataInicio', v)}
          flexivel
        />
        <CampoMascara
          rotulo={fimObrigatorio ? 'Termina em' : 'Termina em (opcional)'}
          valor={valor.dataFim}
          aoMudar={(v) => mudar('dataFim', v)}
          flexivel
        />
      </View>
    </View>
  );
}

// Pico: dias e horários habituais de encontro. Cada dia marcado tem seu próprio horário.
// `valor` é { seg: { inicio, fim }, ... } só com os dias marcados.
export function ProgramacaoEncontros({ valor, aoMudar, cor }) {
  const alternarDia = (chave) => {
    if (valor[chave]) {
      const resto = { ...valor };
      delete resto[chave];
      aoMudar(resto);
    } else {
      aoMudar({ ...valor, [chave]: { inicio: '', fim: '' } });
    }
  };
  const mudarHorario = (chave, campo, v) =>
    aoMudar({ ...valor, [chave]: { ...valor[chave], [campo]: v } });

  return (
    <View style={{ gap: 12 }}>
      <SeletorDiasSemana selecionados={Object.keys(valor)} aoAlternar={alternarDia} cor={cor} />
      {DIAS_SEMANA.filter((d) => valor[d.chave]).map((d) => (
        <View key={d.chave} style={{ gap: 8 }}>
          <Rotulo cor={cores.texto}>{d.nome}</Rotulo>
          <CamposHorario
            inicio={valor[d.chave].inicio}
            fim={valor[d.chave].fim}
            aoMudarInicio={(v) => mudarHorario(d.chave, 'inicio', v)}
            aoMudarFim={(v) => mudarHorario(d.chave, 'fim', v)}
          />
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  // Mesmo estilo dos campos que já existiam na tela Avisar a cena.
  campo: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    color: cores.texto,
    paddingHorizontal: 12,
    fontFamily: fontes.marcador,
    fontSize: 16,
  },
  linha: {
    flexDirection: 'row',
    gap: 10,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  blocoDia: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: cores.borda,
    padding: 12,
    gap: 10,
  },
  cabecalhoDia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  remover: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
