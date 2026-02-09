import React from 'react';
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import {
  formatCurrency,
  MONTH_NAMES,
  CHART_COLORS,
} from '@/features/finance/services/reports-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useReportsLogic } from '@/features/finance/hooks/useReportsLogic';

// Chart theme colors matching Tailwind variables
const CHART_THEME = {
  primary: '#3b82f6', // blue-500
  success: '#22c55e', // green-500
  error: '#ef4444',   // red-500
  warning: '#f59e0b', // amber-500
  background: '#ffffff',
  text: '#374151',
};

const ReportsPage: React.FC = () => {
  const {
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
  } = useReportsLogic();

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500">Carregando relatórios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 gap-4">
          <AlertCircle size={48} className="text-red-500 opacity-60" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Erro ao carregar dados</h3>
          <p className="text-zinc-500 max-w-sm">Não foi possível gerar o relatório. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-green-500/10 p-6 md:p-8 rounded-3xl border border-primary/20 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2 text-zinc-900 dark:text-zinc-50">
            <TrendingUp className="text-primary w-8 h-8" />
            Relatórios Financeiros
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Acompanhe sua evolução e analise seus hábitos financeiros
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex p-1 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <button
              onClick={() => setPeriodType('month')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                periodType === 'month'
                  ? "bg-primary text-white shadow-sm"
                  : "text-zinc-500 hover:text-primary hover:bg-primary/5"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriodType('year')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                periodType === 'year'
                  ? "bg-primary text-white shadow-sm"
                  : "text-zinc-500 hover:text-primary hover:bg-primary/5"
              )}
            >
              Anual
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
              onClick={() =>
                periodType === 'month'
                  ? handleMonthChange('prev')
                  : handleYearChange('prev')
              }
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="min-w-[140px] text-center font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
              {periodType === 'month'
                ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
                : currentYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
              onClick={() =>
                periodType === 'month'
                  ? handleMonthChange('next')
                  : handleYearChange('next')
              }
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:-translate-y-1 transition-transform cursor-default">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Receitas</p>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</h3>
                <div className={cn("flex items-center gap-1 text-xs mt-1", incomeChange >= 0 ? "text-green-600" : "text-red-500")}>
                  {incomeChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(incomeChange).toFixed(1)}% vs anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:-translate-y-1 transition-transform cursor-default">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <TrendingDown size={28} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Despesas</p>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpense)}</h3>
                <div className={cn("flex items-center gap-1 text-xs mt-1", expenseChange <= 0 ? "text-green-600" : "text-red-500")}>
                  {expenseChange <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  <span>{Math.abs(expenseChange).toFixed(1)}% vs anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:-translate-y-1 transition-transform cursor-default border-primary/50 bg-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Saldo</p>
                <h3 className="text-2xl font-bold text-primary">{formatCurrency(balance)}</h3>
                <div className={cn("flex items-center gap-1 text-xs mt-1", balanceChange >= 0 ? "text-green-600" : "text-red-500")}>
                  {balanceChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{Math.abs(balanceChange).toFixed(1)}% vs anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:-translate-y-1 transition-transform cursor-default">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Percent size={28} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Taxa de Poupança</p>
                <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{savingsRate.toFixed(1)}%</h3>
                <p className="text-xs text-zinc-400 mt-1">da renda mensal</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col gap-8">
        {periodType === 'year' && (
          <Card>
            <CardHeader>
              <CardTitle>Visão Anual</CardTitle>
              <CardDescription>Evolução mensal de receitas e despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="receitas" fill={CHART_THEME.success} name="Receitas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="despesas" fill={CHART_THEME.error} name="Despesas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {periodType === 'month' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição dos gastos do período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center h-[300px]">
                  <ResponsiveContainer width="100%" height="100%" className="!w-full md:!w-1/2">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="w-full md:w-1/2 flex flex-col gap-2 overflow-y-auto max-h-[280px] pr-2">
                    {categoryChartData.slice(0, 5).map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(entry.value)}</div>
                          <div className="text-xs text-zinc-500">{entry.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Despesas Diárias</CardTitle>
                <CardDescription>Fluxo de gastos ao longo do mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyChartData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_THEME.error} stopOpacity={0.1} />
                          <stop offset="95%" stopColor={CHART_THEME.error} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={CHART_THEME.error}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                        name="Gasto"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Insights Section */}
        {insights.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Lightbulb className="text-amber-500" />
              Insights Financeiros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 rounded-2xl border-l-4 shadow-sm flex items-start gap-4",
                    insight.type === 'success' ? "bg-green-50 dark:bg-green-900/10 border-l-green-500" :
                      insight.type === 'warning' ? "bg-amber-50 dark:bg-amber-900/10 border-l-amber-500" :
                        "bg-blue-50 dark:bg-blue-900/10 border-l-blue-500"
                  )}
                >
                  <div className="shrink-0">
                    {insight.type === 'success' && <TrendingUp size={24} className="text-green-600" />}
                    {insight.type === 'warning' && <AlertCircle size={24} className="text-amber-600" />}
                    {insight.type === 'info' && <Lightbulb size={24} className="text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{insight.title}</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;