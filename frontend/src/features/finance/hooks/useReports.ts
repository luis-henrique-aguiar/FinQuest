/**
 * TanStack Query hooks for financial reports
 */
import { useQuery } from '@tanstack/react-query';
import {
    getYearlyReport,
    getExpensesByCategory,
    getDailyExpenses,
    getSumByType,
    getMonthRange,
    type YearlyReportDTO,
    type ExpensesReportDTO,
    type DailyExpensesReportDTO,
    type TypeSumDTO,
} from '../services/reports-api';

/**
 * Query Keys for reports
 */
export const reportsKeys = {
    all: ['reports'] as const,
    yearly: (year: number) => [...reportsKeys.all, 'yearly', year] as const,
    categoryExpenses: (startDate: string, endDate: string) =>
        [...reportsKeys.all, 'category', startDate, endDate] as const,
    dailyExpenses: (startDate: string, endDate: string) =>
        [...reportsKeys.all, 'daily', startDate, endDate] as const,
    sumByType: (type: 'INCOME' | 'EXPENSE', startDate: string, endDate: string) =>
        [...reportsKeys.all, 'sum', type, startDate, endDate] as const,
};

/**
 * Hook to fetch yearly report
 */
export function useYearlyReport(year: number) {
    return useQuery<YearlyReportDTO>({
        queryKey: reportsKeys.yearly(year),
        queryFn: () => getYearlyReport(year),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch expenses by category for a date range
 */
export function useCategoryExpenses(startDate: string, endDate: string) {
    return useQuery<ExpensesReportDTO>({
        queryKey: reportsKeys.categoryExpenses(startDate, endDate),
        queryFn: () => getExpensesByCategory(startDate, endDate),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch daily expenses for a date range
 */
export function useDailyExpenses(startDate: string, endDate: string) {
    return useQuery<DailyExpensesReportDTO>({
        queryKey: reportsKeys.dailyExpenses(startDate, endDate),
        queryFn: () => getDailyExpenses(startDate, endDate),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch sum by type (INCOME or EXPENSE)
 */
export function useSumByType(
    type: 'INCOME' | 'EXPENSE',
    startDate: string,
    endDate: string
) {
    return useQuery<TypeSumDTO>({
        queryKey: reportsKeys.sumByType(type, startDate, endDate),
        queryFn: () => getSumByType(type, startDate, endDate),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Composite hook that fetches all monthly report data at once
 * This combines multiple queries for the ReportsPage
 */
export function useMonthlyReportData(year: number, month: number) {
    const { startDate, endDate } = getMonthRange(year, month);

    // Previous month calculation
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const { startDate: prevStartDate, endDate: prevEndDate } = getMonthRange(prevYear, prevMonth);

    // All queries for current month
    const categoryExpenses = useCategoryExpenses(startDate, endDate);
    const dailyExpenses = useDailyExpenses(startDate, endDate);
    const incomeSum = useSumByType('INCOME', startDate, endDate);
    const expenseSum = useSumByType('EXPENSE', startDate, endDate);

    // Previous month sums for comparison
    const prevIncomeSum = useSumByType('INCOME', prevStartDate, prevEndDate);
    const prevExpenseSum = useSumByType('EXPENSE', prevStartDate, prevEndDate);

    const isLoading =
        categoryExpenses.isLoading ||
        dailyExpenses.isLoading ||
        incomeSum.isLoading ||
        expenseSum.isLoading ||
        prevIncomeSum.isLoading ||
        prevExpenseSum.isLoading;

    const error =
        categoryExpenses.error ||
        dailyExpenses.error ||
        incomeSum.error ||
        expenseSum.error ||
        prevIncomeSum.error ||
        prevExpenseSum.error;

    return {
        categoryData: categoryExpenses.data || null,
        dailyData: dailyExpenses.data || null,
        totalIncome: incomeSum.data?.total || 0,
        totalExpense: expenseSum.data?.total || 0,
        previousIncome: prevIncomeSum.data?.total || 0,
        previousExpense: prevExpenseSum.data?.total || 0,
        isLoading,
        error,
    };
}
