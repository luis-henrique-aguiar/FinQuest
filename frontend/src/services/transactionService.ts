import api from './api';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateTransactionDTO {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export interface FinancialOverview {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  recentTransactions: Transaction[];
}

export interface AchievementDTO {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredLevel: number;
}

export interface MissionCompletionDTO {
  totalFinPoints: number;
  level: number;
  didLevelUp: boolean;
  unlockedBadge: AchievementDTO | null;
}

export interface TransactionResponseDTO {
  transaction: Transaction;
  missionCompletion: MissionCompletionDTO | null;
}

export const createTransaction = async (
  data: CreateTransactionDTO
): Promise<TransactionResponseDTO> => {
  const response = await api.post<TransactionResponseDTO>('/transactions', data);
  return response.data;
};

export const updateTransaction = async (
  id: string,
  data: UpdateTransactionDTO
): Promise<Transaction> => {
  const response = await api.put<Transaction>(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const getAllTransactions = async (
  startDate?: string,
  endDate?: string
): Promise<Transaction[]> => {
  const params: Record<string, string> = {};
  
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get<Transaction[]>('/transactions', { params });
  return response.data;
};

export const getFinancialOverview = async (
  startDate?: string,
  endDate?: string
): Promise<FinancialOverview> => {
  const params: Record<string, string> = {};
  
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get<FinancialOverview>('/transactions/overview', { params });
  return response.data;
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Roupas',
  'Serviços',
  'Outros Gastos',
];

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Vendas',
  'Presente',
  'Outros Ganhos',
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getCurrentMonthRange = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const getMonthRange = (
  year: number,
  month: number
): { startDate: string; endDate: string } => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const monthKeyToRange = (
  monthKey: string
): { startDate: string; endDate: string } => {
  const [year, month] = monthKey.split('-').map(Number);
  return getMonthRange(year, month - 1);
};

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const formatMonthYear = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};