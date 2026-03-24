// Dados simulados para o sistema Mandato360

export interface Eleitor {
  id: string
  nome: string
  telefone: string
  email: string
  bairro: string
  dataCadastro: string
  totalSolicitacoes: number
  observacoes?: string
  statusRelacionamento: 'apoiador' | 'simpatizante' | 'neutro' | 'problema'
}

export interface Lideranca {
  id: string
  nome: string
  telefone: string
  bairro: string
  tipo: 'lider_comunitario' | 'religioso' | 'comerciante' | 'sindico' | 'presidente_associacao' | 'outro'
  influenciaEstimada: string
  anotacoes?: string
  dataCadastro: string
}

export interface Assessor {
  id: string
  nome: string
  cargo: string
  email: string
  telefone: string
  bairroAtuacao: string
  status: 'ativo' | 'inativo'
  demandasResolvidas: number
  demandasEmAndamento: number
  dataCadastro: string
}

export interface Demanda {
  id: string
  eleitorId: string
  eleitorNome: string
  bairro: string
  tipo: string
  descricao: string
  data: string
  status: 'novo' | 'analise' | 'encaminhado' | 'resolvido'
}

export interface ProjetoLei {
  id: string
  titulo: string
  numero: string
  data: string
  status: 'tramitando' | 'aprovado' | 'rejeitado' | 'arquivado'
  descricao: string
}

export interface Indicacao {
  id: string
  titulo: string
  bairro: string
  data: string
  status: 'pendente' | 'aprovada' | 'em_execucao' | 'concluida'
}

export interface LeiAprovada {
  id: string
  numero: string
  titulo: string
  data: string
  descricao: string
}

export interface Publicacao {
  id: string
  titulo: string
  imagem: string
  conteudo: string
  data: string
}

export interface ConfiguracaoVereador {
  nome: string
  partido: string
  cidade: string
  foto: string
  biografia: string
  corPrimaria: string
  corSecundaria: string
}

// Eleitores
export const eleitores: Eleitor[] = [
  { id: '1', nome: 'Maria Silva Santos', telefone: '(11) 99999-1111', email: 'maria.silva@email.com', bairro: 'Centro', dataCadastro: '2024-01-15', totalSolicitacoes: 3, observacoes: 'Moradora antiga do bairro, muito participativa nas reuniões.', statusRelacionamento: 'apoiador' },
  { id: '2', nome: 'João Carlos Oliveira', telefone: '(11) 99999-2222', email: 'joao.oliveira@email.com', bairro: 'Vila Nova', dataCadastro: '2024-02-20', totalSolicitacoes: 5, statusRelacionamento: 'problema' },
  { id: '3', nome: 'Ana Paula Ferreira', telefone: '(11) 99999-3333', email: 'ana.ferreira@email.com', bairro: 'Jardim América', dataCadastro: '2024-03-10', totalSolicitacoes: 2, statusRelacionamento: 'simpatizante' },
  { id: '4', nome: 'Pedro Henrique Costa', telefone: '(11) 99999-4444', email: 'pedro.costa@email.com', bairro: 'Santa Maria', dataCadastro: '2024-03-25', totalSolicitacoes: 1, statusRelacionamento: 'neutro' },
  { id: '5', nome: 'Lucia Aparecida Mendes', telefone: '(11) 99999-5555', email: 'lucia.mendes@email.com', bairro: 'Centro', dataCadastro: '2024-04-05', totalSolicitacoes: 4, statusRelacionamento: 'apoiador' },
  { id: '6', nome: 'Roberto Alves Junior', telefone: '(11) 99999-6666', email: 'roberto.junior@email.com', bairro: 'Parque Industrial', dataCadastro: '2024-04-18', totalSolicitacoes: 2, statusRelacionamento: 'simpatizante' },
  { id: '7', nome: 'Fernanda Lima Souza', telefone: '(11) 99999-7777', email: 'fernanda.souza@email.com', bairro: 'Vila Nova', dataCadastro: '2024-05-02', totalSolicitacoes: 3, statusRelacionamento: 'apoiador' },
  { id: '8', nome: 'Carlos Eduardo Ribeiro', telefone: '(11) 99999-8888', email: 'carlos.ribeiro@email.com', bairro: 'Jardim América', dataCadastro: '2024-05-15', totalSolicitacoes: 1, statusRelacionamento: 'neutro' },
  { id: '9', nome: 'Mariana Gomes Pereira', telefone: '(11) 99999-9999', email: 'mariana.pereira@email.com', bairro: 'Santa Maria', dataCadastro: '2024-06-01', totalSolicitacoes: 2, statusRelacionamento: 'problema' },
  { id: '10', nome: 'Antonio José da Silva', telefone: '(11) 99999-0000', email: 'antonio.silva@email.com', bairro: 'Centro', dataCadastro: '2024-06-20', totalSolicitacoes: 6, statusRelacionamento: 'apoiador' },
]

// Liderancas
export const liderancas: Lideranca[] = [
  { id: '1', nome: 'Jose Pereira', telefone: '(11) 98888-1111', bairro: 'Centro', tipo: 'lider_comunitario', influenciaEstimada: '200 familias', anotacoes: 'Presidente do bairro ha 10 anos, muito respeitado.', dataCadastro: '2024-01-10' },
  { id: '2', nome: 'Pastor Marcos Silva', telefone: '(11) 98888-2222', bairro: 'Vila Nova', tipo: 'religioso', influenciaEstimada: '500 membros', anotacoes: 'Igreja evangelica com grande alcance no bairro.', dataCadastro: '2024-02-15' },
  { id: '3', nome: 'Dona Maria do Comercio', telefone: '(11) 98888-3333', bairro: 'Jardim América', tipo: 'comerciante', influenciaEstimada: '50 comerciantes locais', dataCadastro: '2024-03-20' },
  { id: '4', nome: 'Sr. Antonio Sindico', telefone: '(11) 98888-4444', bairro: 'Santa Maria', tipo: 'sindico', influenciaEstimada: '120 apartamentos', anotacoes: 'Condominio Parque das Flores.', dataCadastro: '2024-04-05' },
  { id: '5', nome: 'Carla Souza', telefone: '(11) 98888-5555', bairro: 'Parque Industrial', tipo: 'presidente_associacao', influenciaEstimada: '300 moradores', anotacoes: 'Associacao de Moradores do Parque Industrial.', dataCadastro: '2024-05-10' },
]

// Assessores
export const assessores: Assessor[] = [
  { id: '1', nome: 'Ana Costa', cargo: 'Assessora Parlamentar', email: 'ana.costa@gabinete.gov.br', telefone: '(11) 3333-1111', bairroAtuacao: 'Centro', status: 'ativo', demandasResolvidas: 45, demandasEmAndamento: 8, dataCadastro: '2023-01-15' },
  { id: '2', nome: 'Carlos Mendes', cargo: 'Assessor de Comunicacao', email: 'carlos.mendes@gabinete.gov.br', telefone: '(11) 3333-2222', bairroAtuacao: 'Vila Nova', status: 'ativo', demandasResolvidas: 32, demandasEmAndamento: 5, dataCadastro: '2023-03-20' },
  { id: '3', nome: 'Patricia Lima', cargo: 'Assessora Juridica', email: 'patricia.lima@gabinete.gov.br', telefone: '(11) 3333-3333', bairroAtuacao: 'Jardim América', status: 'ativo', demandasResolvidas: 28, demandasEmAndamento: 12, dataCadastro: '2023-06-10' },
  { id: '4', nome: 'Roberto Santos', cargo: 'Assessor Comunitario', email: 'roberto.santos@gabinete.gov.br', telefone: '(11) 3333-4444', bairroAtuacao: 'Santa Maria', status: 'ativo', demandasResolvidas: 52, demandasEmAndamento: 15, dataCadastro: '2022-11-05' },
  { id: '5', nome: 'Juliana Freitas', cargo: 'Assessora de Gabinete', email: 'juliana.freitas@gabinete.gov.br', telefone: '(11) 3333-5555', bairroAtuacao: 'Parque Industrial', status: 'inativo', demandasResolvidas: 18, demandasEmAndamento: 0, dataCadastro: '2023-02-01' },
]

// Demandas
export const demandas: Demanda[] = [
  { id: '1', eleitorId: '1', eleitorNome: 'Maria Silva Santos', bairro: 'Centro', tipo: 'Iluminação Pública', descricao: 'Lâmpadas queimadas na Rua das Flores, trecho entre números 100 e 200.', data: '2024-06-25', status: 'novo' },
  { id: '2', eleitorId: '2', eleitorNome: 'João Carlos Oliveira', bairro: 'Vila Nova', tipo: 'Infraestrutura', descricao: 'Buraco grande na Av. Principal causando acidentes.', data: '2024-06-24', status: 'analise' },
  { id: '3', eleitorId: '3', eleitorNome: 'Ana Paula Ferreira', bairro: 'Jardim América', tipo: 'Saúde', descricao: 'Falta de médicos no posto de saúde do bairro.', data: '2024-06-23', status: 'encaminhado' },
  { id: '4', eleitorId: '4', eleitorNome: 'Pedro Henrique Costa', bairro: 'Santa Maria', tipo: 'Segurança', descricao: 'Necessidade de ronda policial noturna na região.', data: '2024-06-22', status: 'resolvido' },
  { id: '5', eleitorId: '5', eleitorNome: 'Lucia Aparecida Mendes', bairro: 'Centro', tipo: 'Limpeza Urbana', descricao: 'Terreno baldio com acúmulo de lixo.', data: '2024-06-21', status: 'novo' },
  { id: '6', eleitorId: '6', eleitorNome: 'Roberto Alves Junior', bairro: 'Parque Industrial', tipo: 'Transporte', descricao: 'Linha de ônibus com poucos horários.', data: '2024-06-20', status: 'analise' },
  { id: '7', eleitorId: '7', eleitorNome: 'Fernanda Lima Souza', bairro: 'Vila Nova', tipo: 'Educação', descricao: 'Falta de vagas em creches municipais.', data: '2024-06-19', status: 'encaminhado' },
  { id: '8', eleitorId: '8', eleitorNome: 'Carlos Eduardo Ribeiro', bairro: 'Jardim América', tipo: 'Iluminação Pública', descricao: 'Poste com fiação exposta oferecendo risco.', data: '2024-06-18', status: 'resolvido' },
  { id: '9', eleitorId: '9', eleitorNome: 'Mariana Gomes Pereira', bairro: 'Santa Maria', tipo: 'Infraestrutura', descricao: 'Calçadas quebradas dificultando acessibilidade.', data: '2024-06-17', status: 'novo' },
  { id: '10', eleitorId: '10', eleitorNome: 'Antonio José da Silva', bairro: 'Centro', tipo: 'Saúde', descricao: 'Demora no atendimento do SAMU na região.', data: '2024-06-16', status: 'analise' },
  { id: '11', eleitorId: '1', eleitorNome: 'Maria Silva Santos', bairro: 'Centro', tipo: 'Segurança', descricao: 'Câmeras de monitoramento danificadas.', data: '2024-06-15', status: 'resolvido' },
  { id: '12', eleitorId: '2', eleitorNome: 'João Carlos Oliveira', bairro: 'Vila Nova', tipo: 'Limpeza Urbana', descricao: 'Coleta de lixo irregular no bairro.', data: '2024-06-14', status: 'encaminhado' },
]

// Projetos de Lei
export const projetosLei: ProjetoLei[] = [
  { id: '1', titulo: 'Porto para Itaguaí: Taxação Social', numero: 'PL 012/2026', data: '2026-01-20', status: 'tramitando', descricao: 'Proposta para destinar parte dos impostos portuários diretamente para fundos de educação e saúde do município.' },
  { id: '2', titulo: 'Iluminação Solar no Arco Metropolitano', numero: 'PL 015/2026', data: '2026-02-15', status: 'aprovado', descricao: 'Instalação de iluminação solar auto-sustentável nos trechos urbanos do Arco Metropolitano em Itaguaí.' },
  { id: '3', titulo: 'Hortas Comunitárias de Monte Serrat', numero: 'PL 018/2026', data: '2026-03-10', status: 'tramitando', descricao: 'Criação de centros de agricultura urbana para combate à insegurança alimentar.' },
  { id: '4', titulo: 'Acessibilidade em Prédios Públicos', numero: 'PL 004/2024', data: '2024-04-05', status: 'aprovado', descricao: 'Obriga adequação de acessibilidade em todos os prédios públicos municipais.' },
  { id: '5', titulo: 'Polo Tecnológico de Chaperó', numero: 'PL 022/2026', data: '2026-05-20', status: 'tramitando', descricao: 'Incentivos fiscais para empresas de tecnologia se instalarem no distrito industrial.' },
]

// Indicações
export const indicacoes: Indicacao[] = [
  { id: '1', titulo: 'Construção de lombada na Rua das Palmeiras', bairro: 'Centro', data: '2024-03-15', status: 'concluida' },
  { id: '2', titulo: 'Instalação de parquinho no Jardim América', bairro: 'Jardim América', data: '2024-04-10', status: 'em_execucao' },
  { id: '3', titulo: 'Poda de árvores na Av. Brasil', bairro: 'Vila Nova', data: '2024-05-05', status: 'aprovada' },
  { id: '4', titulo: 'Sinalização de trânsito na escola municipal', bairro: 'Santa Maria', data: '2024-05-25', status: 'pendente' },
  { id: '5', titulo: 'Reforma da praça central', bairro: 'Centro', data: '2024-06-01', status: 'em_execucao' },
  { id: '6', titulo: 'Instalação de abrigos de ônibus', bairro: 'Parque Industrial', data: '2024-06-15', status: 'pendente' },
]

// Leis Aprovadas
export const leisAprovadas: LeiAprovada[] = [
  { id: '1', numero: 'Lei 3.456/2026', titulo: 'Arco Seguro e Iluminado', data: '2026-04-20', descricao: 'Implementação de iluminação inteligente LED em todo o perímetro urbano do Arco Metropolitano.' },
  { id: '2', numero: 'Lei 3.457/2026', titulo: 'Itaguaí Sem Barreiras', data: '2026-05-15', descricao: 'Obriga a adequação de acessibilidade em todos os prédios públicos municipais no prazo de 1 ano.' },
  { id: '3', numero: 'Lei 3.400/2025', titulo: 'Escola em Tempo Integral', data: '2025-11-10', descricao: 'Institui as diretrizes para a ampliação progressiva do horário escolar na rede municipal.' },
  { id: '4', numero: 'Lei 3.380/2025', titulo: 'Tarifa Zero Social', data: '2025-08-25', descricao: 'Concede gratuidade no transporte público para desempregados e estudantes de baixa renda.' },
]

// Publicações
export const publicacoes: Publicacao[] = [
  { id: '1', titulo: 'Inauguração da Nova Praça do Centro', imagem: '/inauguracao_praca_itaguai_1774389806246.png', conteudo: 'Foi inaugurada nesta semana a nova praça do centro da cidade, fruto de uma indicação do nosso mandato. O espaço conta com área de lazer, academia ao ar livre e playground para crianças.', data: '2024-06-20' },
  { id: '2', titulo: 'Reunião com Moradores da Vila Nova', imagem: '/reuniao_comunitaria_itaguai_1774389822226.png', conteudo: 'Realizamos uma reunião com os moradores da Vila Nova para ouvir suas demandas e apresentar os projetos em andamento para o bairro.', data: '2024-06-15' },
  { id: '3', titulo: 'Aprovação do Projeto de Iluminação LED', imagem: '/iluminacao_led_itaguai_1774389837457.png', conteudo: 'Grande vitória! Foi aprovado por unanimidade nosso projeto de lei que determina a substituição de toda iluminação pública por LED.', data: '2024-06-10' },
]

// Configuracao do Vereador
export const configuracaoVereador: ConfiguracaoVereador = {
  nome: 'Carlos Eduardo (Cadu do Povo)',
  partido: 'REDE',
  cidade: 'Itaguaí',
  foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
  biografia: 'Liderança comunitária em Itaguaí há mais de 15 anos. Cadu iniciou sua trajetória na Associação de Moradores de Monte Serrat, lutando por saneamento e urbanização. Hoje, em seu mandato, foca em transformar a riqueza do Porto em benefícios reais para a população, com foco em educação, emprego jovem e saúde descentralizada.',
  corPrimaria: '#1E3A8A', // Navy Blue
  corSecundaria: '#F59E0B', // Gold/Amber
}

// Dados para gráficos
export const demandasPorBairro = [
  { bairro: 'Centro', quantidade: 8 },
  { bairro: 'Vila Nova', quantidade: 6 },
  { bairro: 'Jardim América', quantidade: 4 },
  { bairro: 'Santa Maria', quantidade: 5 },
  { bairro: 'Parque Industrial', quantidade: 3 },
]

export const demandasPorCategoria = [
  { categoria: 'Iluminação Pública', quantidade: 5 },
  { categoria: 'Infraestrutura', quantidade: 7 },
  { categoria: 'Saúde', quantidade: 4 },
  { categoria: 'Segurança', quantidade: 3 },
  { categoria: 'Limpeza Urbana', quantidade: 4 },
  { categoria: 'Transporte', quantidade: 2 },
  { categoria: 'Educação', quantidade: 3 },
]

export const crescimentoEleitores = [
  { mes: 'Jan', quantidade: 2 },
  { mes: 'Fev', quantidade: 3 },
  { mes: 'Mar', quantidade: 4 },
  { mes: 'Abr', quantidade: 6 },
  { mes: 'Mai', quantidade: 8 },
  { mes: 'Jun', quantidade: 10 },
]

// Tipos de solicitação disponíveis
export const tiposSolicitacao = [
  'Iluminação Pública',
  'Infraestrutura',
  'Saúde',
  'Segurança',
  'Limpeza Urbana',
  'Transporte',
  'Educação',
  'Assistência Social',
  'Meio Ambiente',
  'Outros',
]

// Bairros disponíveis
export const bairros = [
  'Centro',
  'Monte Serrat',
  'Engenho',
  'Chaperó',
  'Brisamar',
  'Vila Margarida',
  'Vila Geni',
]
