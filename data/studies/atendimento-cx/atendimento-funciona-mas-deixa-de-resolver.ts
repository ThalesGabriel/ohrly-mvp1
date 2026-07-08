import { StudyDetail } from "../types";

export const atendimentoFuncionaMasDeixaDeResolver: StudyDetail = {
  slug: "atendimento-funciona-mas-deixa-de-resolver",
  title: "Quando um atendimento funciona, mas deixa de resolver",
  description:
    "Como aumento de recontato, fila, handoff e tempo de resolução podem indicar perda de saúde no atendimento antes da reclamação formal aparecer.",
  category: "Atendimento e CX",
  type: "Fluxo aplicado",
  readingTime: "9 min de leitura",
  publishedAt: "2026-07-01",
  tags: ["CX", "Atendimento", "Recontato", "Handoff", "Resolução"],
  icon: "headphones",
  visualClass: "from-violet-700 to-slate-950",
  accentClass: "text-violet-800 bg-violet-50 border-violet-100",
  author: {
    name: "Ohrly",
    role: "Estudos de Saúde Operacional",
  },
  summary: [
    "Um atendimento pode continuar respondendo e ainda assim perder capacidade de resolver.",
    "Recontato, fila, handoff, demora e encerramento sem resolução clara são sinais vitais importantes.",
    "A perda de saúde no atendimento costuma aparecer antes da reclamação formal.",
    "O problema não é apenas atender mais rápido, mas entender quando o fluxo está transferindo esforço para o cliente ou para o time.",
    "O Ohrly observa esses sinais para identificar quando um fluxo de atendimento ainda funciona, mas começa a perder consistência.",
  ],
  content: [
    {
      type: "paragraph",
      content:
        "Em CX, muitos problemas não começam como reclamação. Eles começam como aumento de esforço. O cliente volta mais vezes, espera mais, é transferido com mais frequência ou precisa explicar o mesmo problema novamente.",
    },
    {
      type: "paragraph",
      content:
        "O atendimento ainda está funcionando. A equipe responde, o bot conversa, os tickets são encerrados e os canais continuam ativos. Mas, por baixo desses indicadores, o fluxo pode estar perdendo capacidade de resolver com previsibilidade.",
    },
    {
      type: "quote",
      content:
        "O atendimento pode continuar operando e, ainda assim, deixar de resolver do jeito que deveria.",
    },
    {
      type: "heading",
      content: "Responder não é o mesmo que resolver",
    },
    {
      type: "paragraph",
      content:
        "Muitas operações medem atendimento por volume, tempo médio, quantidade de chamados encerrados ou cumprimento de SLA. Essas métricas são importantes, mas podem esconder uma diferença essencial: responder não significa resolver.",
    },
    {
      type: "paragraph",
      content:
        "Um cliente pode receber resposta rápida e ainda assim precisar voltar depois. Um ticket pode ser encerrado e ainda assim não ter eliminado a causa do contato. Um bot pode conversar com o cliente e ainda assim transferir a maior parte dos casos relevantes para humanos.",
    },
    {
      type: "callout",
      title: "Definição prática",
      content:
        "Um fluxo de atendimento saudável é aquele que resolve com consistência, reduz esforço do cliente e não depende cada vez mais de exceções, retornos ou intervenção manual.",
    },
    {
      type: "heading",
      content: "Os sinais aparecem antes da reclamação",
    },
    {
      type: "paragraph",
      content:
        "A reclamação formal costuma ser um sinal tardio. Antes dela, o atendimento geralmente já vinha emitindo sinais de desgaste. O problema é que esses sinais podem parecer pequenos quando vistos isoladamente.",
    },
    {
      type: "list",
      items: [
        "O cliente volta mais vezes pelo mesmo motivo.",
        "O tempo até a primeira resposta começa a aumentar.",
        "O tempo de resolução cresce em determinados assuntos.",
        "Mais atendimentos precisam ser transferidos para humanos.",
        "A fila se concentra em horários, canais ou temas específicos.",
        "Casos são encerrados, mas voltam em poucos dias.",
        "Alguns assuntos passam a exigir mais exceções ou tratativas manuais.",
      ],
    },
    {
      type: "paragraph",
      content:
        "Cada sinal pode ter uma explicação pontual. Mas quando aparecem juntos, se repetem ou se sustentam por vários dias, eles podem indicar que o atendimento ainda funciona, mas está perdendo saúde.",
    },
    {
      type: "heading",
      content: "O recontato como sinal vital",
    },
    {
      type: "paragraph",
      content:
        "Recontato é um dos sinais mais importantes em atendimento. Quando o cliente volta pelo mesmo motivo, a operação recebe uma mensagem clara: algo no fluxo anterior não foi suficiente.",
    },
    {
      type: "paragraph",
      content:
        "Isso não significa que todo recontato seja problema. Alguns casos são naturalmente complexos. Mas quando o recontato aumenta em determinados assuntos, canais, períodos ou etapas, ele pode revelar perda de resolução real.",
    },
    {
      type: "callout",
      title: "Pergunta operacional",
      content:
        "O cliente voltou porque o problema mudou ou porque o atendimento anterior não resolveu o que precisava resolver?",
    },
    {
      type: "heading",
      content: "Handoff: quando o fluxo transfere demais",
    },
    {
      type: "paragraph",
      content:
        "O handoff, ou transbordo para humano, não é necessariamente ruim. Em muitos casos, transferir para uma pessoa é a melhor decisão. O problema começa quando o fluxo automatizado passa a transferir mais do que o esperado, ou quando certos assuntos deixam de ser resolvidos no caminho previsto.",
    },
    {
      type: "paragraph",
      content:
        "Um aumento de handoff pode indicar que o bot não está compreendendo bem a demanda, que a jornada está mal desenhada, que o cliente está chegando com dúvidas mais complexas ou que alguma etapa anterior está gerando confusão.",
    },
    {
      type: "list",
      items: [
        "Mais clientes abandonam o bot antes da resolução.",
        "Mais conversas chegam ao humano sem contexto suficiente.",
        "O atendimento humano precisa refazer perguntas já feitas.",
        "Alguns assuntos deixam de ser resolvidos automaticamente.",
        "O tempo total de atendimento aumenta depois da transferência.",
      ],
    },
    {
      type: "heading",
      content: "Fila e demora não são apenas problemas de capacidade",
    },
    {
      type: "paragraph",
      content:
        "Quando a fila cresce, a interpretação mais imediata costuma ser falta de equipe. Às vezes é isso mesmo. Mas fila também pode ser consequência de fluxos que deixaram de resolver bem antes.",
    },
    {
      type: "paragraph",
      content:
        "Se o cliente volta mais vezes, se o bot transfere mais, se determinados assuntos exigem exceções e se o time precisa corrigir problemas repetidos, a fila pode ser sintoma de perda de saúde do fluxo, não apenas de volume.",
    },
    {
      type: "quote",
      content:
        "A fila visível muitas vezes é o acúmulo de pequenas falhas invisíveis.",
    },
    {
      type: "heading",
      content: "Encerrar chamado não garante resolução",
    },
    {
      type: "paragraph",
      content:
        "Muitas operações usam encerramento como indicador de produtividade. Isso faz sentido, mas pode gerar uma leitura incompleta. Um chamado encerrado não significa necessariamente que o cliente teve a necessidade resolvida.",
    },
    {
      type: "paragraph",
      content:
        "Quando chamados encerrados geram recontato, reclamação posterior ou nova abertura sobre o mesmo tema, a operação precisa olhar além do status final. O importante é entender se o fluxo produziu resolução real ou apenas removeu o item da fila.",
    },
    {
      type: "list",
      items: [
        "O cliente abriu outro contato sobre o mesmo assunto?",
        "O atendimento precisou ser refeito por outro agente?",
        "A resolução dependeu de uma exceção fora do processo padrão?",
        "O caso foi encerrado sem evidência clara de solução?",
        "O mesmo tema voltou a aparecer em volume nos dias seguintes?",
      ],
    },
    {
      type: "heading",
      content: "O custo invisível para o cliente",
    },
    {
      type: "paragraph",
      content:
        "Quando o atendimento perde saúde, parte do custo é transferida para o cliente. Ele precisa esperar mais, repetir informações, mudar de canal, insistir no contato ou aceitar uma solução parcial.",
    },
    {
      type: "paragraph",
      content:
        "Esse custo nem sempre aparece imediatamente como reclamação. Às vezes aparece como desistência, queda de confiança, menor recompra, avaliação negativa ou preferência por outro fornecedor no futuro.",
    },
    {
      type: "callout",
      title: "Esforço do cliente",
      content:
        "Quanto mais o cliente precisa insistir para resolver algo, mais o atendimento deixa de ser apenas um canal e passa a ser parte do problema percebido.",
    },
    {
      type: "heading",
      content: "O custo invisível para o time",
    },
    {
      type: "paragraph",
      content:
        "A perda de saúde também aparece no esforço interno. A equipe passa a lidar com mais exceções, mais retrabalho, mais casos repetidos e mais pressão para compensar falhas de fluxo.",
    },
    {
      type: "paragraph",
      content:
        "Quando isso acontece, o time pode continuar performando no limite, mas com um custo operacional maior. A operação parece funcionar porque as pessoas estão sustentando manualmente aquilo que o fluxo deveria resolver com mais consistência.",
    },
    {
      type: "heading",
      content: "Como diferenciar variação normal de perda de saúde",
    },
    {
      type: "paragraph",
      content:
        "Nem todo aumento de fila, handoff ou recontato indica problema estrutural. Operações têm sazonalidade, campanhas, picos, mudanças de produto e variações normais de demanda.",
    },
    {
      type: "paragraph",
      content:
        "A questão é observar se o sinal tem recorrência, contexto e impacto suficientes para merecer investigação.",
    },
    {
      type: "list",
      items: [
        "Frequência: o sinal apareceu uma vez ou vem se repetindo?",
        "Concentração: acontece em um assunto, canal, turno ou etapa específica?",
        "Duração: o fluxo volta ao normal ou continua degradado?",
        "Composição: o sinal aparece junto com outros sinais, como fila, recontato e handoff?",
        "Impacto: afeta cliente, esforço do time, SLA, receita ou reputação?",
        "Recuperação: depois do pico, o fluxo se estabiliza ou mantém comportamento pior?",
      ],
    },
    {
      type: "heading",
      content: "Exemplo prático",
    },
    {
      type: "paragraph",
      content:
        "Imagine uma operação em que o volume de atendimentos se mantém estável. O dashboard mostra que o time continua respondendo e que a maioria dos chamados é encerrada. À primeira vista, não parece existir um problema grave.",
    },
    {
      type: "paragraph",
      content:
        "Mas uma leitura por sinais vitais mostra outro cenário: o recontato sobre segunda via aumentou, o bot passou a transferir mais casos para humanos, o tempo médio de resolução cresceu em determinados horários e a fila começou a se concentrar em um assunto específico.",
    },
    {
      type: "paragraph",
      content:
        "Nesse caso, o atendimento ainda funciona. Mas os sinais indicam que ele pode estar deixando de resolver bem um fluxo específico. Se a operação esperar a reclamação formal crescer, talvez já tenha absorvido dias ou semanas de esforço invisível.",
    },
    {
      type: "heading",
      content: "A pergunta certa para CX",
    },
    {
      type: "paragraph",
      content:
        "Em vez de perguntar apenas se o atendimento está respondendo, vale perguntar se ele está resolvendo com consistência.",
    },
    {
      type: "list",
      items: [
        "O cliente precisa voltar pelo mesmo motivo?",
        "A resolução depende cada vez mais de humanos?",
        "O tempo total para resolver está crescendo?",
        "A fila está concentrada em temas específicos?",
        "O atendimento está encerrando casos ou resolvendo causas?",
        "O fluxo consegue se recuperar depois de um pico?",
      ],
    },
    {
      type: "quote",
      content:
        "Um atendimento saudável não é o que apenas responde. É o que reduz esforço, resolve com previsibilidade e evita que o cliente precise insistir.",
    },
    {
      type: "heading",
      content: "O papel do Ohrly",
    },
    {
      type: "paragraph",
      content:
        "O Ohrly observa sinais vitais de fluxos de atendimento para identificar mudanças de comportamento antes da urgência. O objetivo não é substituir ferramentas de help desk, CRM, bot ou BI, mas criar uma camada de leitura sobre os sinais que esses sistemas já produzem.",
    },
    {
      type: "paragraph",
      content:
        "Na prática, isso significa olhar para tempo, recontato, handoff, fila, status de resolução, recorrência e contexto para entender quando um fluxo ainda funciona, mas começa a perder saúde.",
    },
    {
      type: "callout",
      title: "A leitura que importa",
      content:
        "O atendimento está apenas operando ou ainda está resolvendo com consistência?",
    },
    {
      type: "heading",
      content: "Conclusão",
    },
    {
      type: "paragraph",
      content:
        "Um atendimento pode funcionar tecnicamente e ainda assim deixar de resolver. Essa perda não aparece primeiro como falha total. Ela aparece como aumento de esforço, recontato, fila, handoff, demora e recorrência.",
    },
    {
      type: "paragraph",
      content:
        "Para o Ohrly, esses sinais ajudam a perceber quando o fluxo de atendimento começou a se degradar antes que a reclamação formal, a queda de satisfação ou o retrabalho explícito tomem a decisão pela operação.",
    },
  ],
  relatedSlugs: [
    "chatbot-transferindo-demais-para-humanos",
    "sinais-vitais-de-um-fluxo",
    "dashboards-nem-sempre-mostram-saude",
    "quando-esperar-deixa-de-ser-neutro",
  ],
};