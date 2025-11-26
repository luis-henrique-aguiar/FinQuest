import api from './api';

export interface TransactionTypeSumDTO {
  total: number;
}

export interface ExpenseInfoDTO {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface ExpensesReportDTO {
  expenses: ExpenseInfoDTO[];
}

export interface MonthlyReportDTO {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
  transactionCount: number;
}

export interface YearlyReportDTO {
  reports: MonthlyReportDTO[];
}

export interface DailyExpenseDTO {
  day: string;
  value: number;
  count: number;
}

export interface DailyExpensesReportDTO {
  expenses: DailyExpenseDTO[];
}

export const getSumByType = async (
  type: 'INCOME' | 'EXPENSE',
  startDate: string,
  endDate: string
): Promise<TransactionTypeSumDTO> => {
  const response = await api.get<TransactionTypeSumDTO>('/transactions/sum', {
    params: { type, startDate, endDate }
  });
  return response.data;
};

export const getExpensesByCategory = async (
  startDate: string,
  endDate: string
): Promise<ExpensesReportDTO> => {
  const response = await api.get<ExpensesReportDTO>('/transactions/categories', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getYearlyReport = async (year: number): Promise<YearlyReportDTO> => {
  const response = await api.get<YearlyReportDTO>('/transactions/yearly', {
    params: { year }
  });
  return response.data;
};

export const getDailyExpenses = async (
  startDate: string,
  endDate: string
): Promise<DailyExpensesReportDTO> => {
  const response = await api.get<DailyExpensesReportDTO>('/transactions/daily', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getMonthRange = (year: number, month: number): { startDate: string; endDate: string } => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CHART_COLORS = [
  '#007ACC', // primary
  '#28A745', // success
  '#FFA500', // accent
  '#FD7E14', // warning
  '#DC3545', // error
  '#6C757D', // textMedium
  '#17A2B8', // info
  '#6610f2', // purple
];