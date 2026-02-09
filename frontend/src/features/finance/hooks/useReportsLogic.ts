import { useState, useMemo } from 'react';
import {
    MONTH_NAMES,
} from '@/features/finance/services/reports-api';
import {
    useMonthlyReportData,
    useYearlyReport,
} from '@/features/finance/hooks/useReports';

type PeriodType = 'month' | 'year';

export const useReportsLogic = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [periodType, setPeriodType] = useState<PeriodType>('month');

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // TanStack Query Hooks
    const {
        categoryData,
        dailyData,
        totalIncome,
        totalExpense,
        previousIncome,
        previousExpense,
        isLoading: isLoadingMonthly,
        error: monthlyError,
    } = useMonthlyReportData(currentYear, currentMonth);

    const {
        data: yearlyData,
        isLoading: isLoadingYearly,
        error: yearlyError,
    } = useYearlyReport(currentYear);

    const isLoading = isLoadingMonthly || (periodType === 'year' && isLoadingYearly);
    const error = monthlyError || (periodType === 'year' ? yearlyError : null);

    // Derived Data & Calculations
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    const previousBalance = previousIncome - previousExpense;
    const balanceChange = previousBalance !== 0 ? ((balance - previousBalance) / Math.abs(previousBalance)) * 100 : 0;
    const incomeChange = previousIncome !== 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0;
    const expenseChange = previousExpense !== 0 ? ((totalExpense - previousExpense) / previousExpense) * 100 : 0;

    // Chart Data Preparation
    const categoryChartData = useMemo(() => {
        if (!categoryData) return [];
        return categoryData.expenses.map((item) => ({
            name: item.category,
            value: item.total,
            percentage: item.percentage,
        }));
    }, [categoryData]);

    const dailyChartData = useMemo(() => {
        if (!dailyData) return [];
        return dailyData.dailyExpenses.map((item) => ({
            day: parseInt(item.date.split('-')[2]),
            amount: item.totalExpense,
        }));
    }, [dailyData]);

    const yearlyChartData = useMemo(() => {
        if (!yearlyData) return [];
        return yearlyData.months.map((m) => ({
            name: MONTH_NAMES[m.month].substring(0, 3),
            receitas: m.totalIncome,
            despesas: m.totalExpense,
            saldo: m.balance,
        }));
    }, [yearlyData]);

    // Insights Generation
    const insights = useMemo(() => {
        const list = [];

        if (savingsRate > 20) {
            list.push({
                type: 'success' as const,
                title: 'Ótima Taxa de Poupança',
                message: `Você poupou ${savingsRate.toFixed(0)}% da sua renda este mês. Continue assim!`,
            });
        } else if (savingsRate < 0) {
            list.push({
                type: 'warning' as const,
                title: 'Atenção aos Gastos',
                message: 'Suas despesas superaram suas receitas. Revise seu orçamento.',
            });
        }

        if (totalExpense < previousExpense) {
            list.push({
                type: 'success' as const,
                title: 'Redução de Despesas',
                message: 'Você gastou menos que no mês passado. Parabéns pela economia!',
            });
        }

        const highestCategory = categoryChartData.length > 0 ? categoryChartData[0] : null;
        if (highestCategory) {
            list.push({
                type: 'info' as const,
                title: 'Maior Gasto',
                message: `Sua maior despesa foi com ${highestCategory.name} representa ${highestCategory.percentage.toFixed(0)}% do total.`,
            });
        }

        return list;
    }, [savingsRate, totalExpense, previousExpense, categoryChartData]);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const handleYearChange = (direction: 'prev' | 'next') => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setFullYear(prev.getFullYear() - 1);
            } else {
                newDate.setFullYear(prev.getFullYear() + 1);
            }
            return newDate;
        });
    };

    return {
        currentDate,
        periodType,
        setPeriodType,
        currentYear,
        currentMonth,
        totalIncome,
        totalExpense,
        balance,
        savingsRate,
        incomeChange,
        expenseChange,
        balanceChange,
        categoryChartData,
        dailyChartData,
        yearlyChartData,
        insights,
        handleMonthChange,
        handleYearChange,
        isLoading,
        error,
    };
};
