import React, { useState, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import Card from "../components/common/Card";
import SectionTitle from "../components/common/SectionTitle";

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FilterSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PeriodSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PeriodButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}11;
  }
`;

const PeriodDisplay = styled.div`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  min-width: 200px;
  text-align: center;
  text-transform: capitalize;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.white : "transparent"};
  color: ${({ theme }) => theme.colors.textDark};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.white : `${theme.colors.white}88`};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SummaryCard = styled(Card)<{ $color?: string; $highlight?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid
    ${({ $color, theme }) => $color || theme.colors.primary};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;

  ${({ $highlight, theme }) =>
    $highlight &&
    `
    background: linear-gradient(135deg, ${theme.colors.accent}11 0%, ${theme.colors.accent}22 100%);
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 0.9rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  .icon {
    opacity: 0.5;
  }

  .value {
    font-size: 1.75rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $color, theme }) => $color || theme.colors.textDark};
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }

  .comparison {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 4px;

    &.positive {
      color: ${({ theme }) => theme.colors.secondary};
    }

    &.negative {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    h3 {
      margin: 0;
      font-size: 1.1rem;
      color: ${({ theme }) => theme.colors.textDark};
    }

    .subtitle {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.colors.textMedium};
    }
  }
`;

const TwoColumnCharts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const InsightsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InsightCard = styled(Card)<{ $type: "success" | "warning" | "info" }>`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  border-left: 4px solid
    ${({ $type, theme }) => {
      switch ($type) {
        case "success":
          return theme.colors.secondary;
        case "warning":
          return theme.colors.warning;
        case "info":
          return theme.colors.primary;
        default:
          return theme.colors.primary;
      }
    }};
  background: ${({ $type, theme }) => {
    switch ($type) {
      case "success":
        return `${theme.colors.secondary}11`;
      case "warning":
        return `${theme.colors.warning}11`;
      case "info":
        return `${theme.colors.primary}11`;
      default:
        return theme.colors.white;
    }
  }};

  .icon {
    flex-shrink: 0;
  }

  .content {
    flex: 1;

    h4 {
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
      font-size: 1rem;
      color: ${({ theme }) => theme.colors.textDark};
    }

    p {
      margin: 0;
      line-height: 1.6;
      color: ${({ theme }) => theme.colors.textDark};
      font-size: 0.95rem;
    }

    strong {
      color: ${({ $type, theme }) => {
        switch ($type) {
          case "success":
            return theme.colors.secondary;
          case "warning":
            return theme.colors.warning;
          case "info":
            return theme.colors.primary;
          default:
            return theme.colors.textDark;
        }
      }};
    }
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  .category-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .name {
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
  }

  .value {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMedium};

  .icon {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    margin: 0;
    font-size: 1.1rem;
  }
`;

// --- Mock Data ---

const COLORS = [
  "#007ACC",
  "#28A745",
  "#FFCC00",
  "#FD7E14",
  "#DC3545",
  "#6C757D",
];

const mockMonthlyData = [
  { month: "Jan", receitas: 3200, despesas: 1800 },
  { month: "Fev", receitas: 3100, despesas: 1950 },
  { month: "Mar", receitas: 3250, despesas: 2100 },
  { month: "Abr", receitas: 3300, despesas: 1850 },
  { month: "Mai", receitas: 3200, despesas: 2200 },
  { month: "Jun", receitas: 3400, despesas: 2050 },
  { month: "Jul", receitas: 3200, despesas: 1800 },
  { month: "Ago", receitas: 3250, despesas: 2021 },
  { month: "Set", receitas: 3300, despesas: 2140 },
  { month: "Out", receitas: 3500, despesas: 1950 },
  { month: "Nov", receitas: 3400, despesas: 2100 },
  { month: "Dez", receitas: 3600, despesas: 2300 },
];

const mockExpensesByCategory = [
  { name: "Alimentação", value: 680 },
  { name: "Moradia", value: 1200 },
  { name: "Transporte", value: 250 },
  { name: "Lazer", value: 180 },
  { name: "Saúde", value: 150 },
  { name: "Outros", value: 240 },
];

const mockDailyExpenses = [
  { day: "1", value: 45 },
  { day: "5", value: 120 },
  { day: "8", value: 80 },
  { day: "10", value: 200 },
  { day: "12", value: 95 },
  { day: "15", value: 150 },
  { day: "18", value: 70 },
  { day: "20", value: 180 },
  { day: "22", value: 60 },
  { day: "25", value: 300 },
  { day: "28", value: 110 },
];

type PeriodType = "month" | "quarter" | "year" | "custom";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ReportsPage: React.FC = () => {
  const theme = useTheme();
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [currentMonth, setCurrentMonth] = useState(11); // Dezembro (0-indexed)
  const [currentYear] = useState(2024);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      if (direction === "prev") {
        return prev === 0 ? 11 : prev - 1;
      } else {
        return prev === 11 ? 0 : prev + 1;
      }
    });
  };

  const getPeriodLabel = () => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    switch (periodType) {
      case "month":
        return `${monthNames[currentMonth]} ${currentYear}`;
      case "quarter":
        return `Q${Math.floor(currentMonth / 3) + 1} ${currentYear}`;
      case "year":
        return `Ano ${currentYear}`;
      default:
        return `${monthNames[currentMonth]} ${currentYear}`;
    }
  };

  const currentData = useMemo(() => {
    const data = mockMonthlyData[currentMonth];
    const previousData =
      mockMonthlyData[currentMonth === 0 ? 11 : currentMonth - 1];

    const receitas = data.receitas;
    const despesas = data.despesas;
    const saldo = receitas - despesas;
    const economizado = saldo;

    // Comparações com mês anterior
    const receitasChange =
      ((receitas - previousData.receitas) / previousData.receitas) * 100;
    const despesasChange =
      ((despesas - previousData.despesas) / previousData.despesas) * 100;

    return {
      receitas,
      despesas,
      saldo,
      economizado,
      receitasChange,
      despesasChange,
    };
  }, [currentMonth]);

  const hasData = mockMonthlyData.length > 0;

  return (
    <PageContainer>
      <div>
        <SectionTitle>Relatórios Financeiros</SectionTitle>
        <p>
          Análise detalhada dos seus hábitos financeiros e insights
          personalizados.
        </p>
      </div>

      <FilterSection variant="elevated">
        <PeriodSelector>
          <PeriodButton onClick={() => navigateMonth("prev")}>
            <ChevronLeft size={20} />
          </PeriodButton>
          <PeriodDisplay>{getPeriodLabel()}</PeriodDisplay>
          <PeriodButton onClick={() => navigateMonth("next")}>
            <ChevronRight size={20} />
          </PeriodButton>
        </PeriodSelector>

        <FilterTabs>
          <FilterTab
            $active={periodType === "month"}
            onClick={() => setPeriodType("month")}
          >
            Mensal
          </FilterTab>
          <FilterTab
            $active={periodType === "quarter"}
            onClick={() => setPeriodType("quarter")}
          >
            Trimestral
          </FilterTab>
          <FilterTab
            $active={periodType === "year"}
            onClick={() => setPeriodType("year")}
          >
            Anual
          </FilterTab>
        </FilterTabs>
      </FilterSection>

      {!hasData ? (
        <EmptyState>
          <div className="icon">📊</div>
          <p>Nenhum dado disponível para o período selecionado.</p>
        </EmptyState>
      ) : (
        <>
          <SummaryGrid>
            <SummaryCard $color={theme.colors.secondary}>
              <div className="header">
                <h3>Receitas</h3>
                <TrendingUp
                  className="icon"
                  size={20}
                  color={theme.colors.secondary}
                />
              </div>
              <div className="value">
                {formatCurrency(currentData.receitas)}
              </div>
              <div
                className={`comparison ${
                  currentData.receitasChange >= 0 ? "positive" : "negative"
                }`}
              >
                {currentData.receitasChange >= 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {Math.abs(currentData.receitasChange).toFixed(1)}% vs mês
                anterior
              </div>
            </SummaryCard>

            <SummaryCard $color={theme.colors.error}>
              <div className="header">
                <h3>Despesas</h3>
                <TrendingDown
                  className="icon"
                  size={20}
                  color={theme.colors.error}
                />
              </div>
              <div className="value">
                {formatCurrency(currentData.despesas)}
              </div>
              <div
                className={`comparison ${
                  currentData.despesasChange <= 0 ? "positive" : "negative"
                }`}
              >
                {currentData.despesasChange <= 0 ? (
                  <TrendingDown size={14} />
                ) : (
                  <TrendingUp size={14} />
                )}
                {Math.abs(currentData.despesasChange).toFixed(1)}% vs mês
                anterior
              </div>
            </SummaryCard>

            <SummaryCard $color={theme.colors.primary}>
              <div className="header">
                <h3>Saldo do Período</h3>
                <Calendar
                  className="icon"
                  size={20}
                  color={theme.colors.primary}
                />
              </div>
              <div className="value">{formatCurrency(currentData.saldo)}</div>
              <div className="comparison positive">
                Taxa de economia:{" "}
                {((currentData.saldo / currentData.receitas) * 100).toFixed(1)}%
              </div>
            </SummaryCard>

            <SummaryCard $color={theme.colors.accent} $highlight>
              <div className="header">
                <h3>Total Economizado</h3>
                <TrendingUp
                  className="icon"
                  size={20}
                  color={theme.colors.accent}
                />
              </div>
              <div className="value" style={{ color: theme.colors.accent }}>
                {formatCurrency(currentData.economizado)}
              </div>
              <div className="comparison positive">Continue assim! 🎯</div>
            </SummaryCard>
          </SummaryGrid>

          <ChartsContainer>
            <ChartCard variant="elevated">
              <div className="chart-header">
                <div>
                  <h3>Evolução ao Longo do Ano</h3>
                  <div className="subtitle">
                    Comparação entre receitas e despesas mensais
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockMonthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.textMedium + "33"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.colors.textMedium}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={theme.colors.textMedium}
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      border: `1px solid ${theme.colors.primary}`,
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="receitas"
                    stroke={theme.colors.secondary}
                    strokeWidth={3}
                    name="Receitas"
                    dot={{ fill: theme.colors.secondary, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="despesas"
                    stroke={theme.colors.error}
                    strokeWidth={3}
                    name="Despesas"
                    dot={{ fill: theme.colors.error, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <TwoColumnCharts>
              <ChartCard variant="elevated">
                <div className="chart-header">
                  <div>
                    <h3>Gastos por Categoria</h3>
                    <div className="subtitle">Distribuição percentual</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockExpensesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {mockExpensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <CategoryList>
                  {mockExpensesByCategory.map((category, index) => (
                    <CategoryItem key={category.name}>
                      <div className="category-info">
                        <div
                          className="color-dot"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="name">{category.name}</span>
                      </div>
                      <span className="value">
                        {formatCurrency(category.value)}
                      </span>
                    </CategoryItem>
                  ))}
                </CategoryList>
              </ChartCard>

              <ChartCard variant="elevated">
                <div className="chart-header">
                  <div>
                    <h3>Despesas Diárias</h3>
                    <div className="subtitle">
                      Padrão de gastos ao longo do mês
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDailyExpenses}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.colors.textMedium + "33"}
                    />
                    <XAxis
                      dataKey="day"
                      stroke={theme.colors.textMedium}
                      label={{
                        value: "Dia do Mês",
                        position: "insideBottom",
                        offset: -5,
                      }}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke={theme.colors.textMedium}
                      tickFormatter={(value) => `R$ ${value}`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: theme.colors.white,
                        border: `1px solid ${theme.colors.primary}`,
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={theme.colors.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </TwoColumnCharts>
          </ChartsContainer>

          <div>
            <SectionTitle>💡 Insights Personalizados</SectionTitle>
            <InsightsSection>
              <InsightCard $type="success">
                <TrendingUp
                  className="icon"
                  size={32}
                  color={theme.colors.secondary}
                />
                <div className="content">
                  <h4>Economia no Caminho Certo! 🎉</h4>
                  <p>
                    Você conseguiu economizar{" "}
                    <strong>{formatCurrency(currentData.saldo)}</strong> este
                    mês, representando{" "}
                    <strong>
                      {(
                        (currentData.saldo / currentData.receitas) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>{" "}
                    da sua renda. Continue assim para atingir suas metas
                    financeiras!
                  </p>
                </div>
              </InsightCard>

              <InsightCard $type="warning">
                <AlertCircle
                  className="icon"
                  size={32}
                  color={theme.colors.warning}
                />
                <div className="content">
                  <h4>Atenção aos Gastos com Moradia</h4>
                  <p>
                    Seus gastos com moradia representam <strong>42%</strong> das
                    suas despesas totais. O ideal é manter essa categoria entre
                    25-30% da renda. Considere revisar seus custos fixos.
                  </p>
                </div>
              </InsightCard>

              <InsightCard $type="info">
                <TrendingDown
                  className="icon"
                  size={32}
                  color={theme.colors.primary}
                />
                <div className="content">
                  <h4>Redução em Transporte</h4>
                  <p>
                    Suas despesas com transporte diminuíram <strong>15%</strong>{" "}
                    comparado ao mês anterior. Essa economia de{" "}
                    <strong>{formatCurrency(45)}</strong> pode ser direcionada
                    para suas metas de investimento!
                  </p>
                </div>
              </InsightCard>
            </InsightsSection>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default ReportsPage;
