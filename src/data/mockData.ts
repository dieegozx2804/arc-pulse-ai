// Mock commercial data for JARVIS COMERCIAL - Unimed Bauru

export interface Vendedor {
  id: string;
  nome: string;
  contratos: number;
  meta: number;
  conversao: number;
  ticketMedio: number;
  leads: number;
  propostas: number;
  foto?: string;
}

export interface VendaMensal {
  mes: string;
  pf: number;
  pj: number;
  total: number;
}

export interface FunilItem {
  etapa: string;
  quantidade: number;
  cor: string;
}

export interface Alerta {
  id: string;
  tipo: 'oportunidade' | 'risco' | 'info';
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

export const vendedores: Vendedor[] = [
  { id: '1', nome: 'Carlos Silva', contratos: 17, meta: 20, conversao: 42, ticketMedio: 890, leads: 45, propostas: 28 },
  { id: '2', nome: 'Ana Oliveira', contratos: 15, meta: 18, conversao: 38, ticketMedio: 1120, leads: 40, propostas: 25 },
  { id: '3', nome: 'Roberto Santos', contratos: 12, meta: 15, conversao: 35, ticketMedio: 780, leads: 38, propostas: 22 },
  { id: '4', nome: 'Maria Costa', contratos: 11, meta: 14, conversao: 33, ticketMedio: 950, leads: 35, propostas: 20 },
  { id: '5', nome: 'Pedro Lima', contratos: 9, meta: 12, conversao: 28, ticketMedio: 720, leads: 32, propostas: 18 },
  { id: '6', nome: 'Juliana Ferreira', contratos: 8, meta: 12, conversao: 25, ticketMedio: 850, leads: 30, propostas: 15 },
];

export const vendasMensais: VendaMensal[] = [
  { mes: 'Jan', pf: 45, pj: 22, total: 67 },
  { mes: 'Fev', pf: 52, pj: 28, total: 80 },
  { mes: 'Mar', pf: 48, pj: 35, total: 83 },
  { mes: 'Abr', pf: 61, pj: 30, total: 91 },
  { mes: 'Mai', pf: 55, pj: 38, total: 93 },
  { mes: 'Jun', pf: 67, pj: 42, total: 109 },
  { mes: 'Jul', pf: 58, pj: 35, total: 93 },
  { mes: 'Ago', pf: 72, pj: 45, total: 117 },
  { mes: 'Set', pf: 65, pj: 40, total: 105 },
  { mes: 'Out', pf: 78, pj: 48, total: 126 },
  { mes: 'Nov', pf: 70, pj: 52, total: 122 },
  { mes: 'Dez', pf: 82, pj: 56, total: 138 },
];

export const funil: FunilItem[] = [
  { etapa: 'Leads Gerados', quantidade: 420, cor: 'hsl(152 100% 40%)' },
  { etapa: 'Contato Realizado', quantidade: 310, cor: 'hsl(152 80% 35%)' },
  { etapa: 'Proposta Enviada', quantidade: 185, cor: 'hsl(152 60% 30%)' },
  { etapa: 'Negociação', quantidade: 98, cor: 'hsl(152 50% 25%)' },
  { etapa: 'Fechamento', quantidade: 72, cor: 'hsl(152 40% 20%)' },
];

export const alertas: Alerta[] = [
  { id: '1', tipo: 'oportunidade', titulo: 'Empresa ABC Ltda com 50+ colaboradores', descricao: 'Lead PJ de alto valor detectado. Potencial de contrato corporativo acima de R$15.000/mês.', prioridade: 'alta' },
  { id: '2', tipo: 'risco', titulo: 'Queda na conversão do vendedor Pedro', descricao: 'Taxa de conversão caiu 15% nas últimas 2 semanas. Recomenda-se acompanhamento.', prioridade: 'media' },
  { id: '3', tipo: 'oportunidade', titulo: 'Renovação de 12 contratos PJ', descricao: '12 contratos PJ vencem nos próximos 30 dias. Oportunidade de upsell.', prioridade: 'alta' },
  { id: '4', tipo: 'info', titulo: 'Meta mensal a 78%', descricao: 'Equipe atingiu 78% da meta com 10 dias restantes. Ritmo adequado.', prioridade: 'baixa' },
];

export const kpis = {
  contratosAtivos: 1247,
  receitaMensal: 'R$ 1.12M',
  taxaConversaoGeral: 34.2,
  ticketMedioGeral: 892,
  leadsMes: 420,
  propostasMes: 185,
  metaAtingida: 78,
  crescimentoMensal: 12.5,
};

export const previsao = {
  contratosPrevisto: 138,
  receitaPrevista: 'R$ 1.28M',
  tendencia: 'crescimento',
  confianca: 87,
};
