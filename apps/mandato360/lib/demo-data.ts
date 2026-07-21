// ─── Demo Data: Dados mockados completos para demonstração ───
// Usado pela rota /demo/dashboard/* sem acesso ao banco de dados

// ─── Tenant Demo ───
export const demoTenant = {
  id: "demo-tenant-id-00000000",
  slug: "demo",
  name: "Vereador Eduardo Martins",
  primaryColor: "#0F2B5B",
  secondaryColor: "#0D9F6E",
  logoUrl: null,
  fotoPerfilUrl: null,
  biografia: "Líder comunitário em Itaguaí há mais de 15 anos. Eduardo iniciou sua trajetória na Associação de Moradores de Monte Serrat, lutando por saneamento e urbanização. Hoje, em seu mandato, foca em transformar a riqueza do Porto em benefícios reais para a população, com foco em educação, emprego jovem e saúde descentralizada.",
  partido: "REDE",
  cidade: "Itaguaí",
  cargo: "Vereador",
  heroHeadline: "Por uma Itaguaí de",
  heroHighlight: "Resultados",
  heroBadge: "Mandato Participativo",
  heroImageUrl: null,
  heroDescription: "Trabalho transparente e participativo para transformar nossa cidade.",
  heroCtaText: "Solicitar Demanda",
  tagline: "Mandato Participativo",
  whatsapp: "(21) 99999-0001",
  telefone: "(21) 3333-0001",
  email: "contato@eduardomartins.com.br",
  instagram: "@eduardomartins",
  endereco: "Câmara Municipal de Itaguaí - RJ",
  showLeis: true,
  showIndicacoes: true,
  showAgenda: true,
  destaques: [
    { text: "47 Leis Aprovadas", icon: "scale" },
    { text: "1.200+ Atendimentos", icon: "users" },
    { text: "32 Bairros Atendidos", icon: "map-pin" },
  ],
  config: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2026-07-15"),
}

// ─── Dashboard Stats ───
export const demoStats = {
  leads: 247,
  liderancas: 18,
  indicacoesLeg: 12,
  projetosTramitando: 7,
  bairros: 7,
  assessores: 5,
  agendas: 8,
  pesquisas: 3,
}

// ─── Funil de Leads ───
export const demoFunilData = [
  { funil: "novo", count: 82 },
  { funil: "contato", count: 54 },
  { funil: "engajado", count: 48 },
  { funil: "apoiador", count: 38 },
  { funil: "lideranca", count: 18 },
  { funil: "inativo", count: 7 },
]

// ─── Projetos Status Chart ───
export const demoProjetosChart = [
  { status: "tramitando", count: 7 },
  { status: "aprovado", count: 12 },
  { status: "rejeitado", count: 2 },
  { status: "pendente", count: 4 },
  { status: "concluido", count: 8 },
]

// ─── Upcoming Agenda ───
const now = new Date()
const futureDate = (daysAhead: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() + daysAhead)
  return d
}

export const demoAgenda = [
  { id: "ag-1", titulo: "Audiência Pública - Saneamento", descricao: "Audiência com moradores sobre o projeto de saneamento", local: "Câmara Municipal", dataEvento: futureDate(2), tipo: "audiencia", visivel: true, createdAt: now },
  { id: "ag-2", titulo: "Visita ao Bairro Monte Serrat", descricao: "Visita para acompanhar obras de pavimentação", local: "Monte Serrat", dataEvento: futureDate(4), tipo: "visita", visivel: true, createdAt: now },
  { id: "ag-3", titulo: "Reunião com Secretário de Saúde", descricao: "Pauta: UBS do Engenho", local: "Prefeitura", dataEvento: futureDate(7), tipo: "reuniao", visivel: true, createdAt: now },
  { id: "ag-4", titulo: "Evento Comunidade Brisamar", descricao: "Entrega de kits esportivos", local: "Praça Brisamar", dataEvento: futureDate(10), tipo: "evento", visivel: true, createdAt: now },
  { id: "ag-5", titulo: "Sessão Ordinária da Câmara", descricao: "Votação do PL de Iluminação", local: "Câmara Municipal", dataEvento: futureDate(14), tipo: "outro", visivel: true, createdAt: now },
  { id: "ag-6", titulo: "Ação Social - Vila Margarida", descricao: "Mutirão de documentação", local: "Escola Municipal Vila Margarida", dataEvento: futureDate(18), tipo: "acao", visivel: true, createdAt: now },
  { id: "ag-7", titulo: "Reunião Lideranças do Centro", descricao: "Alinhamento de pautas prioritárias", local: "Gabinete", dataEvento: futureDate(21), tipo: "reuniao", visivel: true, createdAt: now },
  { id: "ag-8", titulo: "Visita Técnica - Arco Metropolitano", descricao: "Inspeção do trecho com iluminação solar", local: "Arco Metropolitano", dataEvento: futureDate(25), tipo: "visita", visivel: true, createdAt: now },
]

// ─── Recent Leads ───
export const demoRecentLeads = [
  { id: "l-1", nome: "Maria Silva Santos", telefone: "(21) 99999-1111", email: "maria@email.com", bairro: "Centro", funil: "apoiador", createdAt: new Date("2026-07-14") },
  { id: "l-2", nome: "João Carlos Oliveira", telefone: "(21) 99999-2222", email: "joao@email.com", bairro: "Monte Serrat", funil: "novo", createdAt: new Date("2026-07-13") },
  { id: "l-3", nome: "Ana Paula Ferreira", telefone: "(21) 99999-3333", email: "ana@email.com", bairro: "Engenho", funil: "engajado", createdAt: new Date("2026-07-12") },
  { id: "l-4", nome: "Pedro Henrique Costa", telefone: "(21) 99999-4444", email: "pedro@email.com", bairro: "Chaperó", funil: "contato", createdAt: new Date("2026-07-11") },
  { id: "l-5", nome: "Lucia Aparecida Mendes", telefone: "(21) 99999-5555", email: "lucia@email.com", bairro: "Centro", funil: "lideranca", createdAt: new Date("2026-07-10") },
]

// ─── Eleitores (completo) ───
export const demoEleitores = [
  { id: "e-1", nome: "Maria Silva Santos", telefone: "(21) 99999-1111", email: "maria.silva@email.com", bairro: "Centro", funil: "apoiador", origem: "manual", observacoes: "Moradora antiga do bairro, muito participativa nas reuniões.", cpf: "123.456.789-00", dataNascimento: "1985-03-15", createdAt: new Date("2024-01-15"), updatedAt: new Date("2026-07-14") },
  { id: "e-2", nome: "João Carlos Oliveira", telefone: "(21) 99999-2222", email: "joao.oliveira@email.com", bairro: "Monte Serrat", funil: "novo", origem: "landing_cta", observacoes: null, cpf: null, dataNascimento: null, createdAt: new Date("2024-02-20"), updatedAt: new Date("2026-07-13") },
  { id: "e-3", nome: "Ana Paula Ferreira", telefone: "(21) 99999-3333", email: "ana.ferreira@email.com", bairro: "Engenho", funil: "engajado", origem: "whatsapp", observacoes: "Professora na escola municipal.", cpf: null, dataNascimento: "1990-07-22", createdAt: new Date("2024-03-10"), updatedAt: new Date("2026-07-12") },
  { id: "e-4", nome: "Pedro Henrique Costa", telefone: "(21) 99999-4444", email: "pedro.costa@email.com", bairro: "Chaperó", funil: "contato", origem: "pesquisa", observacoes: null, cpf: null, dataNascimento: null, createdAt: new Date("2024-03-25"), updatedAt: new Date("2026-07-11") },
  { id: "e-5", nome: "Lucia Aparecida Mendes", telefone: "(21) 99999-5555", email: "lucia.mendes@email.com", bairro: "Centro", funil: "lideranca", origem: "manual", observacoes: "Coordenadora da Associação de Moradores do Centro.", cpf: "987.654.321-00", dataNascimento: "1975-11-03", createdAt: new Date("2024-04-05"), updatedAt: new Date("2026-07-10") },
  { id: "e-6", nome: "Roberto Alves Junior", telefone: "(21) 99999-6666", email: "roberto.junior@email.com", bairro: "Brisamar", funil: "apoiador", origem: "indicacao", observacoes: null, cpf: null, dataNascimento: null, createdAt: new Date("2024-04-18"), updatedAt: new Date("2026-07-09") },
  { id: "e-7", nome: "Fernanda Lima Souza", telefone: "(21) 99999-7777", email: "fernanda.souza@email.com", bairro: "Monte Serrat", funil: "engajado", origem: "whatsapp", observacoes: "Enfermeira no posto de saúde.", cpf: null, dataNascimento: "1988-09-18", createdAt: new Date("2024-05-02"), updatedAt: new Date("2026-07-08") },
  { id: "e-8", nome: "Carlos Eduardo Ribeiro", telefone: "(21) 99999-8888", email: "carlos.ribeiro@email.com", bairro: "Engenho", funil: "contato", origem: "landing_cta", observacoes: null, cpf: null, dataNascimento: null, createdAt: new Date("2024-05-15"), updatedAt: new Date("2026-07-07") },
  { id: "e-9", nome: "Mariana Gomes Pereira", telefone: "(21) 99999-9999", email: "mariana.pereira@email.com", bairro: "Vila Margarida", funil: "novo", origem: "pesquisa", observacoes: "Indicada pelo Sr. Antonio do condomínio.", cpf: null, dataNascimento: null, createdAt: new Date("2024-06-01"), updatedAt: new Date("2026-07-06") },
  { id: "e-10", nome: "Antonio José da Silva", telefone: "(21) 99999-0000", email: "antonio.silva@email.com", bairro: "Centro", funil: "apoiador", origem: "manual", observacoes: "Apoiador desde a campanha, muito ativo.", cpf: "111.222.333-44", dataNascimento: "1968-01-30", createdAt: new Date("2024-06-20"), updatedAt: new Date("2026-07-05") },
  { id: "e-11", nome: "Sandra Regina Torres", telefone: "(21) 98888-1111", email: "sandra.torres@email.com", bairro: "Vila Geni", funil: "engajado", origem: "indicacao", observacoes: null, cpf: null, dataNascimento: null, createdAt: new Date("2024-07-05"), updatedAt: new Date("2026-07-04") },
  { id: "e-12", nome: "Ricardo Mendes Neto", telefone: "(21) 98888-2222", email: "ricardo.mendes@email.com", bairro: "Chaperó", funil: "novo", origem: "landing_cta", observacoes: "Empresário local, dono de padaria.", cpf: null, dataNascimento: "1982-05-12", createdAt: new Date("2024-08-10"), updatedAt: new Date("2026-07-03") },
  { id: "e-13", nome: "Patricia Oliveira Lima", telefone: "(21) 98888-3333", email: "patricia.lima@email.com", bairro: "Brisamar", funil: "contato", origem: "whatsapp", observacoes: null, cpf: null, dataNascimento: null, createdAt: new Date("2024-09-15"), updatedAt: new Date("2026-07-02") },
  { id: "e-14", nome: "Fernando Costa Santos", telefone: "(21) 98888-4444", email: "fernando.costa@email.com", bairro: "Monte Serrat", funil: "apoiador", origem: "manual", observacoes: "Motorista de ônibus, conhece toda a cidade.", cpf: null, dataNascimento: "1979-12-08", createdAt: new Date("2024-10-20"), updatedAt: new Date("2026-07-01") },
  { id: "e-15", nome: "Claudia Ramos Silva", telefone: "(21) 98888-5555", email: "claudia.ramos@email.com", bairro: "Centro", funil: "inativo", origem: "pesquisa", observacoes: "Mudou-se para outro município.", cpf: null, dataNascimento: null, createdAt: new Date("2024-11-25"), updatedAt: new Date("2026-06-30") },
]

// ─── Lideranças ───
export const demoLiderancas = [
  { id: "lid-1", nome: "José Pereira dos Santos", telefone: "(21) 98888-1001", email: "jose.pereira@email.com", cpf: null, bairro: "Centro", tipo: "lider_comunitario" as const, influenciaEstimada: "200 famílias", endereco: "Rua Principal, 100", anotacoes: "Presidente da associação há 10 anos, muito respeitado.", createdAt: new Date("2024-01-10") },
  { id: "lid-2", nome: "Pastor Marcos Silva", telefone: "(21) 98888-1002", email: "marcos.silva@email.com", cpf: null, bairro: "Monte Serrat", tipo: "religioso" as const, influenciaEstimada: "500 membros", endereco: null, anotacoes: "Igreja evangélica com grande alcance no bairro.", createdAt: new Date("2024-02-15") },
  { id: "lid-3", nome: "Dona Maria do Comércio", telefone: "(21) 98888-1003", email: null, cpf: null, bairro: "Engenho", tipo: "comerciante" as const, influenciaEstimada: "50 comerciantes locais", endereco: null, anotacoes: "Presidente da CDL local.", createdAt: new Date("2024-03-20") },
  { id: "lid-4", nome: "Sr. Antonio Síndico", telefone: "(21) 98888-1004", email: "antonio.sindico@email.com", cpf: null, bairro: "Vila Margarida", tipo: "sindico" as const, influenciaEstimada: "120 apartamentos", endereco: "Condomínio Parque das Flores", anotacoes: null, createdAt: new Date("2024-04-05") },
  { id: "lid-5", nome: "Carla Souza", telefone: "(21) 98888-1005", email: "carla.souza@email.com", cpf: null, bairro: "Brisamar", tipo: "presidente_associacao" as const, influenciaEstimada: "300 moradores", endereco: null, anotacoes: "Associação de Moradores da Brisamar.", createdAt: new Date("2024-05-10") },
  { id: "lid-6", nome: "Padre Francisco Lima", telefone: "(21) 98888-1006", email: null, cpf: null, bairro: "Chaperó", tipo: "religioso" as const, influenciaEstimada: "800 fiéis", endereco: "Paróquia São José", anotacoes: "Paróquia com grande atuação social.", createdAt: new Date("2024-06-15") },
  { id: "lid-7", nome: "Dona Tereza Líder", telefone: "(21) 98888-1007", email: "tereza@email.com", cpf: null, bairro: "Vila Geni", tipo: "lider_comunitario" as const, influenciaEstimada: "150 famílias", endereco: null, anotacoes: "Ativista pela urbanização do bairro.", createdAt: new Date("2024-07-20") },
  { id: "lid-8", nome: "Mestre Reginaldo", telefone: "(21) 98888-1008", email: null, cpf: null, bairro: "Centro", tipo: "outro" as const, influenciaEstimada: "100 jovens", endereco: "Centro Cultural", anotacoes: "Professor de capoeira, referência cultural.", createdAt: new Date("2024-08-25") },
]

// ─── Bairros ───
export const demoBairros = [
  { id: "b-1", nome: "Centro", zona: "centro", observacoes: "Região comercial e administrativa.", createdAt: new Date("2024-01-01") },
  { id: "b-2", nome: "Monte Serrat", zona: "norte", observacoes: "Bairro com maior concentração populacional.", createdAt: new Date("2024-01-01") },
  { id: "b-3", nome: "Engenho", zona: "leste", observacoes: "Área com demandas de saneamento.", createdAt: new Date("2024-01-01") },
  { id: "b-4", nome: "Chaperó", zona: "oeste", observacoes: "Região industrial e residencial.", createdAt: new Date("2024-01-01") },
  { id: "b-5", nome: "Brisamar", zona: "sul", observacoes: "Bairro costeiro, área de lazer.", createdAt: new Date("2024-01-01") },
  { id: "b-6", nome: "Vila Margarida", zona: "centro", observacoes: "Região com condomínios.", createdAt: new Date("2024-01-01") },
  { id: "b-7", nome: "Vila Geni", zona: "norte", observacoes: "Área em processo de urbanização.", createdAt: new Date("2024-01-01") },
]

// ─── Assessores ───
export const demoAssessores = [
  { id: "as-1", nome: "Ana Costa", cargo: "Assessora Parlamentar", email: "ana.costa@gabinete.gov.br", telefone: "(21) 3333-1111", bairroAtuacao: "Centro", status: "ativo" as const, userId: null, createdAt: new Date("2023-01-15") },
  { id: "as-2", nome: "Carlos Mendes", cargo: "Assessor de Comunicação", email: "carlos.mendes@gabinete.gov.br", telefone: "(21) 3333-2222", bairroAtuacao: "Monte Serrat", status: "ativo" as const, userId: null, createdAt: new Date("2023-03-20") },
  { id: "as-3", nome: "Patricia Lima", cargo: "Assessora Jurídica", email: "patricia.lima@gabinete.gov.br", telefone: "(21) 3333-3333", bairroAtuacao: "Engenho", status: "ativo" as const, userId: null, createdAt: new Date("2023-06-10") },
  { id: "as-4", nome: "Roberto Santos", cargo: "Assessor Comunitário", email: "roberto.santos@gabinete.gov.br", telefone: "(21) 3333-4444", bairroAtuacao: "Vila Margarida", status: "ativo" as const, userId: null, createdAt: new Date("2022-11-05") },
  { id: "as-5", nome: "Juliana Freitas", cargo: "Assessora de Gabinete", email: "juliana.freitas@gabinete.gov.br", telefone: "(21) 3333-5555", bairroAtuacao: "Brisamar", status: "inativo" as const, userId: null, createdAt: new Date("2023-02-01") },
]

// ─── Demandas ───
export const demoDemandas = [
  { id: "d-1", eleitorId: "e-1", eleitorNome: "Maria Silva Santos", bairro: "Centro", tipo: "Iluminação Pública", descricao: "Lâmpadas queimadas na Rua das Flores, trecho entre números 100 e 200.", data: "2026-07-10", status: "novo" as const },
  { id: "d-2", eleitorId: "e-2", eleitorNome: "João Carlos Oliveira", bairro: "Monte Serrat", tipo: "Infraestrutura", descricao: "Buraco grande na Av. Principal causando acidentes.", data: "2026-07-09", status: "analise" as const },
  { id: "d-3", eleitorId: "e-3", eleitorNome: "Ana Paula Ferreira", bairro: "Engenho", tipo: "Saúde", descricao: "Falta de médicos no posto de saúde do bairro.", data: "2026-07-08", status: "encaminhado" as const },
  { id: "d-4", eleitorId: "e-4", eleitorNome: "Pedro Henrique Costa", bairro: "Chaperó", tipo: "Segurança", descricao: "Necessidade de ronda policial noturna na região.", data: "2026-07-07", status: "resolvido" as const },
  { id: "d-5", eleitorId: "e-5", eleitorNome: "Lucia Aparecida Mendes", bairro: "Centro", tipo: "Limpeza Urbana", descricao: "Terreno baldio com acúmulo de lixo na Rua Marechal Deodoro.", data: "2026-07-06", status: "novo" as const },
  { id: "d-6", eleitorId: "e-6", eleitorNome: "Roberto Alves Junior", bairro: "Brisamar", tipo: "Transporte", descricao: "Linha de ônibus com poucos horários no período noturno.", data: "2026-07-05", status: "analise" as const },
  { id: "d-7", eleitorId: "e-7", eleitorNome: "Fernanda Lima Souza", bairro: "Monte Serrat", tipo: "Educação", descricao: "Falta de vagas em creches municipais do bairro.", data: "2026-07-04", status: "encaminhado" as const },
  { id: "d-8", eleitorId: "e-8", eleitorNome: "Carlos Eduardo Ribeiro", bairro: "Engenho", tipo: "Iluminação Pública", descricao: "Poste com fiação exposta oferecendo risco aos pedestres.", data: "2026-07-03", status: "resolvido" as const },
  { id: "d-9", eleitorId: "e-9", eleitorNome: "Mariana Gomes Pereira", bairro: "Vila Margarida", tipo: "Infraestrutura", descricao: "Calçadas quebradas dificultando acessibilidade para idosos.", data: "2026-07-02", status: "novo" as const },
  { id: "d-10", eleitorId: "e-10", eleitorNome: "Antonio José da Silva", bairro: "Centro", tipo: "Saúde", descricao: "Demora no atendimento do SAMU na região central.", data: "2026-07-01", status: "analise" as const },
  { id: "d-11", eleitorId: "e-11", eleitorNome: "Sandra Regina Torres", bairro: "Vila Geni", tipo: "Segurança", descricao: "Câmeras de monitoramento danificadas na praça principal.", data: "2026-06-30", status: "resolvido" as const },
  { id: "d-12", eleitorId: "e-12", eleitorNome: "Ricardo Mendes Neto", bairro: "Chaperó", tipo: "Limpeza Urbana", descricao: "Coleta de lixo irregular, não passa há 3 dias.", data: "2026-06-29", status: "encaminhado" as const },
  { id: "d-13", eleitorId: "e-13", eleitorNome: "Patricia Oliveira Lima", bairro: "Brisamar", tipo: "Meio Ambiente", descricao: "Poluição sonora de obra irregular no bairro.", data: "2026-06-28", status: "novo" as const },
  { id: "d-14", eleitorId: "e-14", eleitorNome: "Fernando Costa Santos", bairro: "Monte Serrat", tipo: "Assistência Social", descricao: "Família em situação de vulnerabilidade precisa de cesta básica.", data: "2026-06-27", status: "encaminhado" as const },
  { id: "d-15", eleitorId: "e-15", eleitorNome: "Claudia Ramos Silva", bairro: "Centro", tipo: "Transporte", descricao: "Ponto de ônibus sem cobertura na Av. Principal.", data: "2026-06-26", status: "analise" as const },
]

// ─── Legislativo ───
export const demoLegislativo = [
  // Projetos de Lei
  { id: "leg-1", tipo: "projeto_lei", numero: "PL 012/2026", titulo: "Porto para Itaguaí: Taxação Social", descricao: "Proposta para destinar parte dos impostos portuários diretamente para fundos de educação e saúde do município.", status: "tramitando", data: new Date("2026-01-20") },
  { id: "leg-2", tipo: "projeto_lei", numero: "PL 015/2026", titulo: "Iluminação Solar no Arco Metropolitano", descricao: "Instalação de iluminação solar auto-sustentável nos trechos urbanos do Arco Metropolitano.", status: "aprovado", data: new Date("2026-02-15") },
  { id: "leg-3", tipo: "projeto_lei", numero: "PL 018/2026", titulo: "Hortas Comunitárias de Monte Serrat", descricao: "Criação de centros de agricultura urbana para combate à insegurança alimentar.", status: "tramitando", data: new Date("2026-03-10") },
  { id: "leg-4", tipo: "projeto_lei", numero: "PL 004/2025", titulo: "Acessibilidade em Prédios Públicos", descricao: "Obriga adequação de acessibilidade em todos os prédios públicos municipais.", status: "aprovado", data: new Date("2025-04-05") },
  { id: "leg-5", tipo: "projeto_lei", numero: "PL 022/2026", titulo: "Polo Tecnológico de Chaperó", descricao: "Incentivos fiscais para empresas de tecnologia se instalarem no distrito industrial.", status: "tramitando", data: new Date("2026-05-20") },
  { id: "leg-6", tipo: "projeto_lei", numero: "PL 008/2025", titulo: "Programa Primeiro Emprego Jovem", descricao: "Cria programa municipal de estágio e primeiro emprego para jovens de 16 a 24 anos.", status: "aprovado", data: new Date("2025-06-15") },
  { id: "leg-7", tipo: "projeto_lei", numero: "PL 025/2026", titulo: "Saúde Mental nas Escolas", descricao: "Implementa psicólogos e assistentes sociais em todas as escolas municipais.", status: "tramitando", data: new Date("2026-06-01") },
  // Indicações
  { id: "leg-8", tipo: "indicacao", numero: null, titulo: "Construção de lombada na Rua das Palmeiras", descricao: "Indicação para o bairro Centro", status: "concluido", data: new Date("2024-03-15") },
  { id: "leg-9", tipo: "indicacao", numero: null, titulo: "Instalação de parquinho no Engenho", descricao: "Indicação para o bairro Engenho", status: "pendente", data: new Date("2024-04-10") },
  { id: "leg-10", tipo: "indicacao", numero: null, titulo: "Poda de árvores na Av. Brasil", descricao: "Indicação para o bairro Monte Serrat", status: "aprovado", data: new Date("2024-05-05") },
  { id: "leg-11", tipo: "indicacao", numero: null, titulo: "Sinalização de trânsito na escola municipal", descricao: "Indicação para o bairro Vila Margarida", status: "pendente", data: new Date("2024-05-25") },
  { id: "leg-12", tipo: "indicacao", numero: null, titulo: "Reforma da praça central", descricao: "Indicação para o bairro Centro", status: "concluido", data: new Date("2024-06-01") },
  // Leis Aprovadas
  { id: "leg-13", tipo: "lei_aprovada", numero: "Lei 3.456/2026", titulo: "Arco Seguro e Iluminado", descricao: "Implementação de iluminação inteligente LED em todo o perímetro urbano do Arco Metropolitano.", status: "aprovado", data: new Date("2026-04-20") },
  { id: "leg-14", tipo: "lei_aprovada", numero: "Lei 3.457/2026", titulo: "Itaguaí Sem Barreiras", descricao: "Obriga a adequação de acessibilidade em todos os prédios públicos municipais no prazo de 1 ano.", status: "aprovado", data: new Date("2026-05-15") },
  { id: "leg-15", tipo: "lei_aprovada", numero: "Lei 3.400/2025", titulo: "Escola em Tempo Integral", descricao: "Institui as diretrizes para a ampliação progressiva do horário escolar na rede municipal.", status: "aprovado", data: new Date("2025-11-10") },
  { id: "leg-16", tipo: "lei_aprovada", numero: "Lei 3.380/2025", titulo: "Tarifa Zero Social", descricao: "Concede gratuidade no transporte público para desempregados e estudantes de baixa renda.", status: "aprovado", data: new Date("2025-08-25") },
]

// ─── Pesquisas ───
export const demoPesquisas = [
  {
    id: "pes-1",
    titulo: "Satisfação com o Mandato 2026",
    descricao: "Pesquisa de opinião sobre o desempenho do mandato no primeiro semestre.",
    status: "ativa",
    publica: true,
    perguntas: [
      { id: "p1", type: "scale", question: "De 1 a 5, como avalia nosso mandato?", options: ["1", "2", "3", "4", "5"], required: true },
      { id: "p2", type: "choice", question: "Qual área mais precisa de atenção?", options: ["Saúde", "Educação", "Segurança", "Infraestrutura", "Transporte"], required: true },
      { id: "p3", type: "text", question: "Deixe sua sugestão:", required: false },
    ],
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-07-15"),
    _count: { respostas: 142 },
  },
  {
    id: "pes-2",
    titulo: "Prioridades para Monte Serrat",
    descricao: "O que o bairro Monte Serrat mais precisa?",
    status: "ativa",
    publica: true,
    perguntas: [
      { id: "p4", type: "checkbox", question: "Selecione as melhorias urgentes:", options: ["Saneamento", "Iluminação", "Pavimentação", "Segurança", "Saúde"], required: true },
      { id: "p5", type: "text", question: "Observações adicionais:", required: false },
    ],
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-07-10"),
    _count: { respostas: 87 },
  },
  {
    id: "pes-3",
    titulo: "Avaliação dos Serviços de Saúde",
    descricao: "Pesquisa sobre a qualidade do atendimento nos postos de saúde.",
    status: "encerrada",
    publica: false,
    perguntas: [
      { id: "p6", type: "scale", question: "De 1 a 5, como avalia o atendimento?", options: ["1", "2", "3", "4", "5"], required: true },
      { id: "p7", type: "choice", question: "Qual posto de saúde frequenta?", options: ["UBS Centro", "UBS Monte Serrat", "UBS Engenho", "UBS Chaperó", "Outro"], required: true },
    ],
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-12-15"),
    _count: { respostas: 234 },
  },
]

// ─── Publicações ───
export const demoPublicacoes = [
  { id: "pub-1", titulo: "Inauguração da Nova Praça do Centro", conteudo: "Foi inaugurada nesta semana a nova praça do centro da cidade, fruto de uma indicação do nosso mandato. O espaço conta com área de lazer, academia ao ar livre e playground para crianças.", imagemUrl: "/inauguracao_praca_itaguai_1774389806246.png", data: new Date("2026-06-20") },
  { id: "pub-2", titulo: "Reunião com Moradores de Monte Serrat", conteudo: "Realizamos uma reunião com os moradores de Monte Serrat para ouvir suas demandas e apresentar os projetos em andamento para o bairro.", imagemUrl: "/reuniao_comunitaria_itaguai_1774389822226.png", data: new Date("2026-06-15") },
  { id: "pub-3", titulo: "Aprovação do Projeto de Iluminação LED", conteudo: "Grande vitória! Foi aprovado por unanimidade nosso projeto de lei que determina a substituição de toda iluminação pública por LED no Arco Metropolitano.", imagemUrl: "/iluminacao_led_itaguai_1774389837457.png", data: new Date("2026-06-10") },
]

// ─── Indicações Populares ───
export const demoIndicacoesPopulares = [
  { id: "ip-1", liderancaId: "lid-1", bairroId: "b-1", descricao: "Necessidade de instalação de redutores de velocidade na Rua das Flores.", tipo: "infraestrutura", status: "pendente", observacoes: null, createdAt: new Date("2026-05-01"), updatedAt: new Date("2026-07-10") },
  { id: "ip-2", liderancaId: "lid-2", bairroId: "b-2", descricao: "Posto de saúde com falta de medicamentos básicos.", tipo: "saude", status: "encaminhada", observacoes: "Encaminhado para a Secretaria de Saúde.", createdAt: new Date("2026-04-15"), updatedAt: new Date("2026-07-08") },
  { id: "ip-3", liderancaId: "lid-3", bairroId: "b-3", descricao: "Iluminação pública precária na Av. Principal do Engenho.", tipo: "infraestrutura", status: "resolvida", observacoes: "10 postes substituídos.", createdAt: new Date("2026-03-20"), updatedAt: new Date("2026-06-30") },
  { id: "ip-4", liderancaId: "lid-5", bairroId: "b-5", descricao: "Área de lazer para crianças no bairro Brisamar.", tipo: "infraestrutura", status: "analise", observacoes: null, createdAt: new Date("2026-05-20"), updatedAt: new Date("2026-07-12") },
  { id: "ip-5", liderancaId: "lid-7", bairroId: "b-7", descricao: "Segurança viária no entorno da escola municipal.", tipo: "seguranca", status: "pendente", observacoes: null, createdAt: new Date("2026-06-10"), updatedAt: new Date("2026-07-14") },
]

// ─── Dados para Gráficos (crescimento de eleitores) ───
export const demoCrescimentoEleitores = [
  { mes: "Jan", quantidade: 18 },
  { mes: "Fev", quantidade: 25 },
  { mes: "Mar", quantidade: 32 },
  { mes: "Abr", quantidade: 41 },
  { mes: "Mai", quantidade: 53 },
  { mes: "Jun", quantidade: 67 },
  { mes: "Jul", quantidade: 82 },
]

export const demoDemandasPorBairro = [
  { bairro: "Centro", quantidade: 12 },
  { bairro: "Monte Serrat", quantidade: 9 },
  { bairro: "Engenho", quantidade: 7 },
  { bairro: "Chaperó", quantidade: 5 },
  { bairro: "Brisamar", quantidade: 4 },
  { bairro: "Vila Margarida", quantidade: 3 },
  { bairro: "Vila Geni", quantidade: 2 },
]

export const demoDemandasPorCategoria = [
  { categoria: "Iluminação Pública", quantidade: 8 },
  { categoria: "Infraestrutura", quantidade: 11 },
  { categoria: "Saúde", quantidade: 6 },
  { categoria: "Segurança", quantidade: 5 },
  { categoria: "Limpeza Urbana", quantidade: 4 },
  { categoria: "Transporte", quantidade: 3 },
  { categoria: "Educação", quantidade: 4 },
  { categoria: "Meio Ambiente", quantidade: 2 },
]

// ─── Tipos/Bairros disponíveis ───
export const demoTiposSolicitacao = [
  "Iluminação Pública",
  "Infraestrutura",
  "Saúde",
  "Segurança",
  "Limpeza Urbana",
  "Transporte",
  "Educação",
  "Assistência Social",
  "Meio Ambiente",
  "Outros",
]

export const demoBairrosNomes = [
  "Centro",
  "Monte Serrat",
  "Engenho",
  "Chaperó",
  "Brisamar",
  "Vila Margarida",
  "Vila Geni",
]
