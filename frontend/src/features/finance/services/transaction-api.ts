// Transaction API service functions
import api from '@/services/api';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
    notes?: string;
    createdAt: string;
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
    transactionCount: number;
}

export interface CreateTransactionResponse {
    transaction: Transaction;
    message: string;
    missionCompletion?: {
        missionId: string;
        missionName: string;
        didLevelUp: boolean;
        level: number;
        totalFinPoints: number;
        unlockedBadge?: {
            id: string;
            name: string;
            description: string;
            imageUrl: string;
        };
    };
}

/**
 * Fetch all transactions for a date range
 */
export const getAllTransactions = async (
    startDate: string,
    endDate: string
): Promise<Transaction[]> => {
    const response = await api.get('/transactions', {
        params: { startDate, endDate },
    });
    return response.data;
};

/**
 * Get financial overview for a date range
 */
export const getFinancialOverview = async (
    startDate: string,
    endDate: string
): Promise<FinancialOverview> => {
    const response = await api.get('/transactions/overview', {
        params: { startDate, endDate },
    });
    return response.data;
};

/**
 * Create a new transaction
 */
export const createTransaction = async (
    data: CreateTransactionDTO
): Promise<CreateTransactionResponse> => {
    const response = await api.post('/transactions', data);
    return response.data;
};

/**
 * Update a transaction
 */
export const updateTransaction = async (
    id: string,
    data: UpdateTransactionDTO
): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
};

// Utility functions
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatMonthYear = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

export const getCurrentMonthKey = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

export const monthKeyToRange = (
    monthKey: string
): { startDate: string; endDate: string } => {
    const [year, month] = monthKey.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;
    return { startDate, endDate };
};

// Categories
export const EXPENSE_CATEGORIES = [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Outros',
];

export const INCOME_CATEGORIES = [
    'Salário',
    'Freelance',
    'Investimentos',
    'Prêmios',
    'Outros',
];
