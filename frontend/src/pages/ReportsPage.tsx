import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import {
  type YearlyReportDTO,
  type ExpensesReportDTO,
  type DailyExpensesReportDTO,
  getYearlyReport,
  getExpensesByCategory,
  getDailyExpenses,
  getSumByType,
  formatCurrency,
  getMonthRange,
  MONTH_NAMES,
  CHART_COLORS,
} from '../services/reportsService';
import * as S from './ReportsPage.styles ';

type PeriodType = 'month' | 'year';

interface ChartData {
  yearlyData: YearlyReportDTO | null;
  categoryData: ExpensesReportDTO | null;
  dailyData: DailyExpensesReportDTO | null;
  totalIncome: number;
  totalExpense: number;
  previousIncome: number;
  previousExpense: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const theme = useTheme();

  if (!active || !payload) return null;

  return (
    <div
      style={{
        background: theme.colors.white,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.md,
        boxShadow: theme.shadows.medium,
      }}
    >
      <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: 0, color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

export const ReportsPage: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToast();

  // State
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
    yearlyData: null,
    categoryData: null,
    dailyData: null,
    totalIncome: 0,
    totalExpense: 0,
    previousIncome: 0,
    previousExpense: 0,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Busca dados anuais
      const yearlyData = await getYearlyReport(currentYear);

      // Range do mês atual
      const { startDate, endDate } = getMonthRange(currentYear, currentMonth);

      // Range do mês anterior
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const { startDate: prevStartDate, endDate: prevEndDate } = getMonthRange(prevYear, prevMonth);

      const [categoryData, dailyData, incomeSum, expenseSum, prevIncomeSum, prevExpenseSum] =
        await Promise.all([
          getExpensesByCategory(startDate, endDate),
          getDailyExpenses(startDate, endDate),
          getSumByType('INCOME', startDate, endDate),
          getSumByType('EXPENSE', startDate, endDate),
          getSumByType('INCOME', prevStartDate, prevEndDate),
          getSumByType('EXPENSE', prevStartDate, prevEndDate),
        ]);

      setChartData({
        yearlyData,
        categoryData,
        dailyData,
        totalIncome: incomeSum.total,
        totalExpense: expenseSum.total,
        previousIncome: prevIncomeSum.total,
        previousExpense: prevExpenseSum.total,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      addToast('Erro ao carregar relatórios', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, currentYear, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear((prev) => (direction === 'prev' ? prev - 1 : prev + 1));
  };

  const periodLabel = useMemo(() => {
    if (periodType === 'year') {
      return `Ano ${currentYear}`;
    }
    return `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  }, [periodType, currentMonth, currentYear]);

  const saldo = chartData.totalIncome - chartData.totalExpense;
  const savingsRate =
    chartData.totalIncome > 0
      ? ((saldo / chartData.totalIncome) * 100).toFixed(1)
      : '0.0';

  const incomeChange =
    chartData.previousIncome > 0
      ? ((chartData.totalIncome - chartData.previousIncome) / chartData.previousIncome) * 100
      : 0;

  const expenseChange =
    chartData.previousExpense > 0
      ? ((chartData.totalExpense - chartData.previousExpense) / chartData.previousExpense) * 100
      : 0;

  // Dados formatados para os gráficos
  const yearlyChartData = useMemo(() => {
    if (!chartData.yearlyData) return [];
    return chartData.yearlyData.reports.map((report) => ({
      month: report.month,
      receitas: report.receitas,
      despesas: report.despesas,
      saldo: report.saldo,
    }));
  }, [chartData.yearlyData]);

  const categoryChartData = useMemo(() => {
    if (!chartData.categoryData) return [];
    return chartData.categoryData.expenses.map((expense) => ({
      name: expense.category,
      value: expense.amount,
      percentage: expense.percentage,
      count: expense.count,
    }));
  }, [chartData.categoryData]);

  const dailyChartData = useMemo(() => {
    if (!chartData.dailyData) return [];
    return chartData.dailyData.expenses.map((expense) => ({
      day: expense.day,
      value: expense.value,
      count: expense.count,
    }));
  }, [chartData.dailyData]);

  const insights = useMemo(() => {
    const items: Array<{
      type: 'success' | 'warning' | 'info';
      title: string;
      text: string;
    }> = [];

    if (saldo > 0) {
      items.push({
        type: 'success',
        title: 'Economia no Caminho Certo! 🎉',
        text: `Você economizou ${formatCurrency(saldo)} este mês, representando ${savingsRate}% da sua renda. Continue assim!`,
      });
    } else if (saldo < 0) {
      items.push({
        type: 'warning',
        title: 'Atenção ao Saldo Negativo',
        text: `Suas despesas superaram suas receitas em ${formatCurrency(Math.abs(saldo))}. Considere revisar seus gastos.`,
      });
    }

    if (categoryChartData.length > 0) {
      const topCategory = categoryChartData[0];
      if (topCategory.percentage > 40) {
        items.push({
          type: 'warning',
          title: `Gastos Concentrados em ${topCategory.name}`,
          text: `Essa categoria representa ${topCategory.percentage.toFixed(1)}% das despesas. Considere diversificar ou reduzir.`,
        });
      }
    }

    if (expenseChange < -10) {
      items.push({
        type: 'success',
        title: 'Redução nas Despesas',
        text: `Suas despesas diminuíram ${Math.abs(expenseChange).toFixed(1)}% comparado ao mês anterior. Ótimo trabalho!`,
      });
    } else if (expenseChange > 20) {
      items.push({
        type: 'info',
        title: 'Aumento nas Despesas',
        text: `Suas despesas aumentaram ${expenseChange.toFixed(1)}% em relação ao mês anterior. Fique atento aos gastos.`,
      });
    }

    return items;
  }, [saldo, savingsRate, categoryChartData, expenseChange]);

  const hasData =
    chartData.yearlyData &&
    chartData.yearlyData.reports.some((r) => r.transactionCount > 0);

  return (
    <S.PageContainer>
      {/* Hero Section */}
      <S.HeroSection>
        <S.HeroHeader>
          <S.HeroContent>
            <S.Title>
              <BarChart3 size={32} />
              Relatórios Financeiros
            </S.Title>
            <S.Subtitle>
              Análise detalhada dos seus hábitos financeiros e insights
              personalizados.
            </S.Subtitle>
          </S.HeroContent>

          <S.ControlsContainer>
            <S.MonthSelector>
              <S.MonthButton
                onClick={() =>
                  periodType === 'year' ? navigateYear('prev') : navigateMonth('prev')
                }
              >
                <ChevronLeft size={20} />
              </S.MonthButton>
              <S.MonthDisplay>{periodLabel}</S.MonthDisplay>
              <S.MonthButton
                onClick={() =>
                  periodType === 'year' ? navigateYear('next') : navigateMonth('next')
                }
              >
                <ChevronRight size={20} />
              </S.MonthButton>
            </S.MonthSelector>

            <S.FilterTabs>
              <S.FilterTab
                $active={periodType === 'month'}
                onClick={() => setPeriodType('month')}
              >
                Mensal
              </S.FilterTab>
              <S.FilterTab
                $active={periodType === 'year'}
                onClick={() => setPeriodType('year')}
              >
                Anual
              </S.FilterTab>
            </S.FilterTabs>
          </S.ControlsContainer>
        </S.HeroHeader>

        {/* Stats Grid */}
        {!isLoading && (
          <S.StatsGrid>
            <S.StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <S.StatIcon $color="#28A745">
                <TrendingUp />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue $color="#28A745">
                  {formatCurrency(chartData.totalIncome)}
                </S.StatValue>
                <S.StatLabel>Receitas</S.StatLabel>
                {incomeChange !== 0 && (
                  <S.StatChange $positive={incomeChange >= 0}>
                    {incomeChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                    {Math.abs(incomeChange).toFixed(1)}% vs mês anterior
                  </S.StatChange>
                )}
              </S.StatContent>
            </S.StatCard>

            <S.StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <S.StatIcon $color="#DC3545">
                <TrendingDown />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue $color="#DC3545">
                  {formatCurrency(chartData.totalExpense)}
                </S.StatValue>
                <S.StatLabel>Despesas</S.StatLabel>
                {expenseChange !== 0 && (
                  <S.StatChange $positive={expenseChange <= 0}>
                    {expenseChange <= 0 ? <TrendingDown /> : <TrendingUp />}
                    {Math.abs(expenseChange).toFixed(1)}% vs mês anterior
                  </S.StatChange>
                )}
              </S.StatContent>
            </S.StatCard>

            <S.StatCard
              $highlight={saldo > 0}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <S.StatIcon $color={saldo >= 0 ? '#28A745' : '#DC3545'}>
                <DollarSign />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue $color={saldo >= 0 ? '#28A745' : '#DC3545'}>
                  {formatCurrency(saldo)}
                </S.StatValue>
                <S.StatLabel>Saldo do Período</S.StatLabel>
              </S.StatContent>
            </S.StatCard>

            <S.StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <S.StatIcon $color="#007ACC">
                <Percent />
              </S.StatIcon>
              <S.StatContent>
                <S.StatValue>{savingsRate}%</S.StatValue>
                <S.StatLabel>Taxa de Economia</S.StatLabel>
              </S.StatContent>
            </S.StatCard>
          </S.StatsGrid>
        )}
      </S.HeroSection>

      {/* Loading State */}
      {isLoading ? (
        <S.LoadingContainer>
          <div className="spinner" />
          <p>Carregando relatórios...</p>
        </S.LoadingContainer>
      ) : !hasData ? (
        <S.EmptyState>
          <div className="icon">📊</div>
          <h3>Nenhum dado disponível</h3>
          <p>
            Registre suas transações para visualizar relatórios e insights
            personalizados sobre suas finanças.
          </p>
        </S.EmptyState>
      ) : (
        <>
          {/* Charts */}
          <S.ChartsGrid>
            {/* Evolução Anual */}
            <S.ChartCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <S.ChartHeader>
                <div>
                  <S.ChartTitle>Evolução ao Longo do Ano</S.ChartTitle>
                  <S.ChartSubtitle>
                    Comparação entre receitas e despesas mensais
                  </S.ChartSubtitle>
                </div>
              </S.ChartHeader>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yearlyChartData}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#28A745" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#28A745" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC3545" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC3545" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.textMedium + '33'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.colors.textMedium}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={theme.colors.textMedium}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    stroke="#28A745"
                    strokeWidth={2}
                    fill="url(#colorReceitas)"
                    name="Receitas"
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stroke="#DC3545"
                    strokeWidth={2}
                    fill="url(#colorDespesas)"
                    name="Despesas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </S.ChartCard>

            {/* Row com 2 gráficos */}
            <S.ChartRow>
              {/* Gastos por Categoria */}
              <S.ChartCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <S.ChartHeader>
                  <div>
                    <S.ChartTitle>Gastos por Categoria</S.ChartTitle>
                    <S.ChartSubtitle>Distribuição percentual</S.ChartSubtitle>
                  </div>
                </S.ChartHeader>
                {categoryChartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                        >
                          {categoryChartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <S.CategoryList>
                      {categoryChartData.map((category, index) => (
                        <S.CategoryItem key={category.name}>
                          <S.CategoryInfo>
                            <S.CategoryDot
                              $color={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                            <S.CategoryName>{category.name}</S.CategoryName>
                          </S.CategoryInfo>
                          <div>
                            <S.CategoryValue>
                              {formatCurrency(category.value)}
                            </S.CategoryValue>
                            <S.CategoryPercentage>
                              ({category.percentage.toFixed(1)}%)
                            </S.CategoryPercentage>
                          </div>
                        </S.CategoryItem>
                      ))}
                    </S.CategoryList>
                  </>
                ) : (
                  <S.EmptyState>
                    <div className="icon">🗂️</div>
                    <p>Sem despesas neste período</p>
                  </S.EmptyState>
                )}
              </S.ChartCard>

              {/* Despesas Diárias */}
              <S.ChartCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <S.ChartHeader>
                  <div>
                    <S.ChartTitle>Despesas Diárias</S.ChartTitle>
                    <S.ChartSubtitle>
                      Padrão de gastos ao longo do mês
                    </S.ChartSubtitle>
                  </div>
                </S.ChartHeader>
                {dailyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dailyChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.colors.textMedium + '33'}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        stroke={theme.colors.textMedium}
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={theme.colors.textMedium}
                        tickFormatter={(value) => `R$ ${value}`}
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        fill={theme.colors.primary}
                        radius={[4, 4, 0, 0]}
                        name="Despesas"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <S.EmptyState>
                    <div className="icon">📅</div>
                    <p>Sem despesas neste período</p>
                  </S.EmptyState>
                )}
              </S.ChartCard>
            </S.ChartRow>
          </S.ChartsGrid>

          {/* Insights */}
          {insights.length > 0 && (
            <S.SectionContainer>
              <S.SectionTitle>
                <Lightbulb size={24} />
                Insights Personalizados
              </S.SectionTitle>
              <S.InsightsSection>
                {insights.map((insight, index) => (
                  <S.InsightCard
                    key={index}
                    $type={insight.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <S.InsightIcon>
                      {insight.type === 'success' && (
                        <TrendingUp size={32} color={theme.colors.success} />
                      )}
                      {insight.type === 'warning' && (
                        <AlertCircle size={32} color={theme.colors.warning} />
                      )}
                      {insight.type === 'info' && (
                        <TrendingDown size={32} color={theme.colors.primary} />
                      )}
                    </S.InsightIcon>
                    <S.InsightContent>
                      <S.InsightTitle>{insight.title}</S.InsightTitle>
                      <S.InsightText>{insight.text}</S.InsightText>
                    </S.InsightContent>
                  </S.InsightCard>
                ))}
              </S.InsightsSection>
            </S.SectionContainer>
          )}
        </>
      )}
    </S.PageContainer>
  );
};

export default ReportsPage;