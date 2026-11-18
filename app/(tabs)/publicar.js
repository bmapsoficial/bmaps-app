import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  BotaoAdesivo,
  Etiqueta,
  Respingo,
  Rotulo,
  Tela,
  TituloGrafite,
} from '../../src/components/Rua';
import {
  ListaDeDias,
  OpcoesUnicas,
  ProgramacaoEncontros,
  ProgramacaoSemanal,
} from '../../src/components/Programacao';
import InfoPublicacao from '../../src/components/InfoPublicacao';
import { cores, coresCategoria, fontes, sombraAdesivo } from '../../src/theme';
import {
  CONDICOES_AULA,
  FORMATOS_AULA,
  FREQUENCIAS_AULA,
  VERSAO_PUBLICACAO,
  descreverProgramacao,
  montarDias,
  montarEncontros,
  montarSemanal,
} from '../../src/programacao';

// Campos de cada tipo, seguindo o documento de conceito.
const TIPOS = {
  Evento: [
    { chave: 'nome', rotulo: 'Nome do evento', dica: 'Ex.: nome da batalha ou jam' },
    { chave: 'programacao', especial: true },
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou nome do lugar' },
    { chave: 'formato', rotulo: 'Formato', dica: 'Ex.: 1x1, 2x2, crew vs crew' },
    { chave: 'entrada', rotulo: 'Entrada', dica: 'Gratuita ou valor' },
  ],
  Treino: [
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou nome do lugar' },
    { chave: 'programacao', especial: true },
    { chave: 'nivel', rotulo: 'Pra quem é', dica: 'Ex.: iniciantes, todos os níveis' },
    { chave: 'como', rotulo: 'Como vai ser', dica: 'Ex.: bate-papo, workshop, treino livre' },
  ],
  Pico: [
    { chave: 'nome', rotulo: 'Nome do pico', dica: 'Como a galera chama o lugar' },
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou ponto de referência' },
    { chave: 'piso', rotulo: 'Tipo de piso', dica: 'Ex.: concreto liso, linóleo' },
    { chave: 'programacao', especial: true },
  ],
  Aula: [
    { chave: 'local', rotulo: 'Local', dica: 'Endereço ou nome do lugar' },
    { chave: 'professor', rotulo: 'Professor(a)', dica: 'Nome artístico' },
    { chave: 'formatoAula', especial: true },
    { chave: 'condicao', especial: true },
    { chave: 'programacao', especial: true },
    { chave: 'nivel', rotulo: 'Nível', dica: 'Ex.: iniciante' },
  ],
};
const NOMES_TIPOS = Object.keys(TIPOS);
// Cor de destaque de cada tipo quando selecionado (padrão oficial das categorias).
const COR_TIPO = {
  Evento: coresCategoria.evento,
  Treino: coresCategoria.treino,
  Pico: coresCategoria.pico,
  Aula: coresCategoria.aula,
};
const INCLINACOES = [-3, 1, -1, 2];
// Descrição curta exibida abaixo dos cards, conforme a categoria selecionada.
const DESCRICOES = {
  Evento: 'Para divulgar batalhas, campeonatos, competições e encontros com data marcada.',
  Treino: 'Para divulgar treinos abertos, livres ou guiados em datas específicas.',
  Pico: 'Para compartilhar lugares e horários em que a galera costuma se encontrar.',
  Aula: 'Para professores e projetos divulgarem aulas, oficinas e cursos.',
};
// Chave da categoria usada nos dados salvos.
const CHAVE_TIPO = { Evento: 'evento', Treino: 'treino', Pico: 'pico', Aula: 'aula' };

let contadorDias = 0;
const novoDia = () => ({ id: `dia-${contadorDias++}`, data: '', inicio: '', fim: '' });
const novaSemanal = () => ({ diasSemana: [], inicio: '', fim: '', dataInicio: '', dataFim: '' });

export default function Publicar() {
  const [tipo, setTipo] = useState('Evento');
  const [valores, setValores] = useState({});
  // Programação de cada categoria, guardada separadamente para não se perder ao trocar de tipo.
  const [diasEvento, setDiasEvento] = useState(() => [novoDia()]);
  const [diasTreino, setDiasTreino] = useState(() => [novoDia()]);
  const [encontrosPico, setEncontrosPico] = useState({});
  const [infoVisivel, setInfoVisivel] = useState(false);
  const [aula, setAula] = useState(() => ({
    formato: null,
    condicao: null,
    frequencia: null,
    dias: [novoDia()],
    semanal: novaSemanal(),
  }));

  const atualizar = (chave, texto) => setValores((v) => ({ ...v, [chave]: texto }));
  const mudarAula = (campo, valor) => setAula((a) => ({ ...a, [campo]: valor }));

  // Monta a publicação no formato que será salvo. Ainda não é enviada a lugar nenhum.
  const montarPublicacao = () => {
    const campos = {};
    TIPOS[tipo]
      .filter((c) => !c.especial)
      .forEach((c) => {
        campos[c.chave] = (valores[`${tipo}-${c.chave}`] || '').trim();
      });
    const publicacao = { versao: VERSAO_PUBLICACAO, tipo: CHAVE_TIPO[tipo], ...campos };

    if (tipo === 'Evento') {
      const r = montarDias(diasEvento);
      return r.erros.length
        ? { erros: r.erros }
        : { publicacao: { ...publicacao, programacao: r.programacao } };
    }
    if (tipo === 'Treino') {
      const r = montarDias(diasTreino);
      return r.erros.length
        ? { erros: r.erros }
        : { publicacao: { ...publicacao, programacao: r.programacao } };
    }
    if (tipo === 'Aula') {
      const erros = [];
      if (!aula.formato) erros.push('Escolha o formato da aula.');
      if (!aula.condicao) erros.push('Escolha a condição de participação.');
      let r = { erros: [] };
      if (aula.formato === 'curso') {
        r = montarSemanal(aula.semanal, { tipo: 'periodo', exigirFim: true });
      } else if (aula.formato) {
        if (aula.frequencia === 'avulsa') r = montarDias(aula.dias);
        else if (aula.frequencia === 'regular') r = montarSemanal(aula.semanal);
        else erros.push('Escolha se é aula avulsa ou aulas regulares.');
      }
      erros.push(...r.erros);
      if (erros.length) return { erros };
      return {
        publicacao: {
          ...publicacao,
          formatoAula: aula.formato,
          condicao: aula.condicao,
          programacao: r.programacao,
        },
      };
    }
    if (tipo === 'Pico') {
      const r = montarEncontros(encontrosPico);
      if (r.erros.length) return { erros: r.erros };
      return {
        publicacao: r.programacao ? { ...publicacao, programacao: r.programacao } : publicacao,
      };
    }
    return { publicacao };
  };

  const aoPublicar = () => {
    const { erros, publicacao } = montarPublicacao();
    if (erros) {
      Alert.alert('Falta ajustar', erros.join('\n'));
      return;
    }
    const linhas = descreverProgramacao(publicacao);
    if (publicacao.tipo === 'aula') {
      const formato = FORMATOS_AULA.find((f) => f.chave === publicacao.formatoAula).nome;
      const condicao = CONDICOES_AULA.find((c) => c.chave === publicacao.condicao).nome;
      linhas.unshift(`${formato} · ${condicao}`);
    }
    Alert.alert(
      'Versão de teste',
      'Nada foi publicado nem salvo: o envio de verdade entra quando o servidor do B-Maps for ligado.' +
        (linhas.length ? `\n\nAssim a programação vai aparecer:\n${linhas.join('\n')}` : ''),
    );
  };

  const corTipo = COR_TIPO[tipo];

  // Campos especiais de programação, conforme a categoria.
  const renderizarEspecial = (chave) => {
    if (chave === 'programacao' && tipo === 'Evento') {
      return (
        <View style={{ gap: 10 }}>
          <Rotulo cor={cores.textoSuave}>Datas e horários</Rotulo>
          <ListaDeDias dias={diasEvento} aoMudar={setDiasEvento} />
        </View>
      );
    }
    if (chave === 'programacao' && tipo === 'Treino') {
      return (
        <View style={{ gap: 10 }}>
          <Rotulo cor={cores.textoSuave}>Datas e horários</Rotulo>
          <ListaDeDias dias={diasTreino} aoMudar={setDiasTreino} />
        </View>
      );
    }
    if (chave === 'programacao' && tipo === 'Pico') {
      return (
        <View style={{ gap: 10 }}>
          <Rotulo cor={cores.textoSuave}>Dias e horários de encontro no pico</Rotulo>
          <Text style={estilos.nota}>
            Opcional. Os dias e horários em que a galera costuma colar, não o horário de
            funcionamento do lugar.
          </Text>
          <ProgramacaoEncontros valor={encontrosPico} aoMudar={setEncontrosPico} cor={corTipo} />
        </View>
      );
    }
    if (chave === 'formatoAula') {
      return (
        <OpcoesUnicas
          rotulo="Formato da aula"
          opcoes={FORMATOS_AULA}
          valor={aula.formato}
          aoEscolher={(v) => mudarAula('formato', v)}
          cor={corTipo}
        />
      );
    }
    if (chave === 'condicao') {
      return (
        <OpcoesUnicas
          rotulo="Participação"
          opcoes={CONDICOES_AULA}
          valor={aula.condicao}
          aoEscolher={(v) => mudarAula('condicao', v)}
          cor={corTipo}
        />
      );
    }
    if (chave === 'programacao' && tipo === 'Aula') {
      if (!aula.formato) {
        return (
          <Text style={estilos.nota}>Escolha o formato da aula para informar a programação.</Text>
        );
      }
      if (aula.formato === 'curso') {
        return (
          <View style={{ gap: 10 }}>
            <Rotulo cor={cores.textoSuave}>Período e horários</Rotulo>
            <ProgramacaoSemanal
              valor={aula.semanal}
              aoMudar={(v) => mudarAula('semanal', v)}
              cor={corTipo}
              fimObrigatorio
            />
          </View>
        );
      }
      return (
        <View style={{ gap: 12 }}>
          <OpcoesUnicas
            rotulo="Programação"
            opcoes={FREQUENCIAS_AULA}
            valor={aula.frequencia}
            aoEscolher={(v) => mudarAula('frequencia', v)}
            cor={corTipo}
          />
          {aula.frequencia === 'avulsa' && (
            <ListaDeDias
              dias={aula.dias}
              aoMudar={(v) => mudarAula('dias', v)}
              permitirVarios={false}
            />
          )}
          {aula.frequencia === 'regular' && (
            <ProgramacaoSemanal
              valor={aula.semanal}
              aoMudar={(v) => mudarAula('semanal', v)}
              cor={corTipo}
            />
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <Tela fundo={2}>
      {/* Título e botão de informações na mesma linha, centralizados na vertical. */}
      <View style={estilos.topo}>
        <TituloGrafite
          tamanho={42}
          linhas={1}
          ajustar
          gotas={[0.033, 0.583, 0.967]}
          estilo={estilos.titulo}
        >
          Avisar a cena
        </TituloGrafite>
        <Pressable
          onPress={() => setInfoVisivel(true)}
          accessibilityRole="button"
          accessibilityLabel="Qual publicação fazer?"
          style={[estilos.botaoInfo, sombraAdesivo(cores.laranja, 4)]}
        >
          <Ionicons name="information-circle-outline" size={22} color={cores.laranja} />
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        <Rotulo cor={cores.textoSuave}>O que vai rolar?</Rotulo>
        <View style={estilos.tipos}>
          {NOMES_TIPOS.map((nome, i) => (
            <View key={nome} style={{ flex: 1 }}>
              <Etiqueta
                titulo={nome}
                ativa={tipo === nome}
                aoTocar={() => setTipo(nome)}
                inclinacao={INCLINACOES[i]}
                corAtiva={COR_TIPO[nome]}
              />
            </View>
          ))}
        </View>
        <Text style={estilos.descricao}>{DESCRICOES[tipo]}</Text>
      </View>

      <View>
        <Respingo tipo={2} largura={80} estilo={estilos.flyerRespingo} />
        <Pressable
          onPress={() =>
            Alert.alert('Em breve', 'A leitura automática do flyer entra numa próxima etapa.')
          }
          accessibilityRole="button"
          accessibilityLabel="Subir o flyer (em breve)"
          style={estilos.flyer}
        >
          <View style={[estilos.flyerIcone, sombraAdesivo(cores.texto, 3)]}>
            <Ionicons name="image-outline" size={24} color={cores.fundo} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.flyerTitulo}>Subir o flyer</Text>
            <Text style={estilos.flyerTexto}>em breve: o app lê e preenche pra você</Text>
          </View>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        {TIPOS[tipo].map((campo) =>
          campo.especial ? (
            <View key={`${tipo}-${campo.chave}`}>{renderizarEspecial(campo.chave)}</View>
          ) : (
            <View key={`${tipo}-${campo.chave}`} style={{ gap: 6 }}>
              <Rotulo cor={cores.textoSuave}>{campo.rotulo}</Rotulo>
              <TextInput
                value={valores[`${tipo}-${campo.chave}`] || ''}
                onChangeText={(t) => atualizar(`${tipo}-${campo.chave}`, t)}
                placeholder={campo.dica}
                placeholderTextColor={cores.cinza}
                accessibilityLabel={campo.rotulo}
                style={estilos.campo}
              />
            </View>
          ),
        )}
      </View>

      <BotaoAdesivo titulo="Publicar e avisar a cena" aoTocar={aoPublicar} inclinacao={-1} largo />
      <Text style={estilos.nota}>
        Versão de teste: o que você preencher aqui ainda não é enviado nem salvo.
      </Text>

      <InfoPublicacao visivel={infoVisivel} aoFechar={() => setInfoVisivel(false)} />
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
  // Recuo do título aprovado na proposta visual.
  titulo: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
    marginLeft: 12,
  },
  // Mesmo desenho dos botões de notificações (Início) e configurações (Perfil).
  botaoInfo: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '3deg' }],
  },
  descricao: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
    color: cores.textoSuave,
  },
  tipos: {
    flexDirection: 'row',
    gap: 8,
  },
  flyer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: cores.laranja,
    backgroundColor: 'rgba(11,11,12,0.9)',
  },
  flyerRespingo: {
    right: -26,
    top: -22,
    opacity: 0.8,
    transform: [{ rotate: '60deg' }],
  },
  flyerIcone: {
    width: 46,
    height: 46,
    backgroundColor: cores.laranja,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-5deg' }],
  },
  flyerTitulo: {
    fontFamily: fontes.bloco,
    fontSize: 19,
    letterSpacing: 1,
    color: cores.texto,
    textTransform: 'uppercase',
  },
  flyerTexto: {
    fontFamily: fontes.marcador,
    fontSize: 14,
    color: cores.laranjaClaro,
  },
  campo: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: cores.texto,
    backgroundColor: cores.fundo,
    color: cores.texto,
    paddingHorizontal: 12,
    fontFamily: fontes.marcador,
    fontSize: 16,
    ...sombraAdesivo('#000000', 3),
  },
  nota: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
    color: cores.textoSuave,
  },
});
