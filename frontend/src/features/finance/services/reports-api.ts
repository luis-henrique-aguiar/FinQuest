// Reports API service functions
import api from '@/services/api';

export interface YearlyReportDTO {
    year: number;
    months: Array<{
        month: number;
        totalIncome: number;
        totalExpense: number;
        balance: number;
    }>;
    yearTotalIncome: number;
    yearTotalExpense: number;
    yearBalance: number;
}

export interface CategoryExpense {
    category: string;
    total: number;
    percentage: number;
}

export interface ExpensesReportDTO {
    expenses: CategoryExpense[];
    totalExpenses: number;
}

export interface DailyExpense {
    date: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

export interface DailyExpensesReportDTO {
    dailyExpenses: DailyExpense[];
    periodTotalIncome: number;
    periodTotalExpense: number;
    periodBalance: number;
}

export interface TypeSumDTO {
    total: number;
    count: number;
}

/**
 * Get yearly financial report
 */
export const getYearlyReport = async (year: number): Promise<YearlyReportDTO> => {
    const response = await api.get(`/reports/yearly/${year}`);
    return response.data;
};

/**
 * Get expenses grouped by category
 */
export const getExpensesByCategory = async (
    startDate: string,
    endDate: string
): Promise<ExpensesReportDTO> => {
    const response = await api.get('/reports/expenses-by-category', {
        params: { startDate, endDate },
    });
    return response.data;
};

/**
 * Get daily expenses breakdown
 */
export const getDailyExpenses = async (
    startDate: string,
    endDate: string
): Promise<DailyExpensesReportDTO> => {
    const response = await api.get('/reports/daily-expenses', {
        params: { startDate, endDate },
    });
    return response.data;
};

/**
 * Get sum of transactions by type (INCOME or EXPENSE)
 */
export const getSumByType = async (
    type: 'INCOME' | 'EXPENSE',
    startDate: string,
    endDate: string
): Promise<TypeSumDTO> => {
    const response = await api.get('/reports/sum-by-type', {
        params: { type, startDate, endDate },
    });
    return response.data;
};

// Utility functions
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const getMonthRange = (
    year: number,
    month: number
): { startDate: string; endDate: string } => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return { startDate, endDate };
};

export const MONTH_NAMES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

export const CHART_COLORS = [
    '#007ACC',
    '#28A745',
    '#FFC107',
    '#DC3545',
    '#6F42C1',
    '#FD7E14',
    '#20C997',
    '#E83E8C',
];
