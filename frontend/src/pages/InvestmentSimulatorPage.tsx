import React, { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  RefreshCw,
  Clock,
  Calculator,
  BarChart3,
} from "lucide-react";
import Button from "../components/common/Button";
import { useToast } from "../hooks/useToast";
import {
  fetchInvestmentRates,
  calculateInvestment,
  formatRate,
  getCachedRates,
  setCachedRates,
  type InvestmentOption,
  type InvestmentRatesResponse,
} from "../services/investimentsService";

import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  HeroSection,
  HeroHeader,
  HeroContent,
  UpdateBadge,
  MarketStatsGrid,
  MarketStatCard,
  SimulatorGrid,
  FormContainer,
  FormTitle,
  ResultContainer,
  InputGroup,
  Label,
  Input,
  InvestmentSelectWrapper,
  ResultHeader,
  StatsGrid,
  StatItem,
  ChartSection,
  ChartHeader,
  ChartLegendCustom,
  LegendItem,
  EmptyState,
  InsightCard,
  LoadingOverlay,
} from "./InvestmentSimulatorPage.styles";
import InvestmentSelect from "../components/gamification/InvestmentSelect";

interface SimulationResult {
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  monthlyData: Array<{
    month: number;
    invested: number;
    total: number;
  }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  const theme = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
      <p
        style={{
          margin: 0,
          marginBottom: theme.spacing.sm,
          fontWeight: theme.typography.fontWeight.semiBold,
          color: theme.colors.textDark,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: "0.875rem",
        }}
      >
        Mês {label}
      </p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{
            margin: 0,
            marginTop: index > 0 ? theme.spacing.xs : 0,
            color: entry.color,
            fontFamily: theme.typography.fontFamily.body,
            fontSize: "0.875rem",
            display: "flex",
            justifyContent: "space-between",
            gap: theme.spacing.md,
          }}
        >
          <span>{entry.dataKey === "invested" ? "Investido:" : "Total:"}</span>
          <strong>{formatCurrency(entry.value)}</strong>
        </p>
      ))}
    </div>
  );
};

export const InvestmentSimulatorPage: React.FC = () => {
  const [initialValue, setInitialValue] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [period, setPeriod] = useState("5");
  const [type, setType] = useState("cdb_100");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [investmentOptions, setInvestmentOptions] = useState<InvestmentOption[]>(
    []
  );
  const [ratesData, setRatesData] = useState<InvestmentRatesResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const { addToast } = useToast();

  useEffect(() => {
    loadInvestmentRates();
  }, []);

  const loadInvestmentRates = async () => {
    const cached = getCachedRates();
    if (cached) {
      setRatesData(cached);
      setInvestmentOptions(cached.rates);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchInvestmentRates();
      setRatesData(data);
      setInvestmentOptions(data.rates);
      setCachedRates(data);

      if (data.source === "fallback") {
        addToast("Usando taxas padrão (API offline)", "info");
      } else {
        addToast("Taxas atualizadas com sucesso!", "success");
      }
    } catch (error) {
      addToast("Erro ao carregar taxas. Usando valores padrão.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = () => {
    const P = parseFloat(initialValue) || 0;
    const PMT = parseFloat(monthlyValue) || 0;
    const years = parseInt(period) || 1;

    if (P === 0 && PMT === 0) {
      addToast("Informe um valor inicial ou aporte mensal", "error");
      return;
    }

    if (years < 1) {
      addToast("O período deve ser de pelo menos 1 ano", "error");
      return;
    }

    const selectedInvestment = investmentOptions.find((opt) => opt.id === type);
    if (!selectedInvestment) {
      addToast("Selecione um tipo de investimento", "error");
      return;
    }

    const calculatedResult = calculateInvestment(
      P,
      PMT,
      years,
      selectedInvestment.rate
    );
    setResult(calculatedResult);
    addToast("Simulação calculada!", "success");
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedInvestment = investmentOptions.find((opt) => opt.id === type);

  return (
    <PageContainer>
      {/* Hero Section com Header + Market Stats */}
      <HeroSection>
        <HeroHeader>
          <HeroContent>
            <Header>
              <Title>
                <TrendingUp size={32} />
                Simulador de Investimentos
              </Title>
              <Subtitle>
                Veja como seu dinheiro pode crescer com o poder dos juros
                compostos! Compare diferentes tipos de investimento e planeje
                seu futuro financeiro.
              </Subtitle>
            </Header>
          </HeroContent>

          {ratesData && (
            <UpdateBadge>
              <Clock size={14} />
              Atualizado em {formatLastUpdate(ratesData.lastUpdate)}
            </UpdateBadge>
          )}
        </HeroHeader>

        {/* Market Stats Grid */}
        {ratesData?.rawData && (
          <MarketStatsGrid>
            <MarketStatCard>
              <div className="rate-name">Selic</div>
              <div className="rate-value">
                {ratesData.rawData.selic.toFixed(2)}%
              </div>
            </MarketStatCard>
            <MarketStatCard>
              <div className="rate-name">CDI</div>
              <div className="rate-value">
                {ratesData.rawData.cdi.toFixed(2)}%
              </div>
            </MarketStatCard>
            <MarketStatCard>
              <div className="rate-name">IPCA</div>
              <div className="rate-value">
                {ratesData.rawData.ipca.toFixed(2)}%
              </div>
            </MarketStatCard>
            <MarketStatCard>
              <div className="rate-name">TR</div>
              <div className="rate-value">
                {ratesData.rawData.tr.toFixed(2)}%
              </div>
            </MarketStatCard>
          </MarketStatsGrid>
        )}
      </HeroSection>

      {/* Simulator Grid */}
      <SimulatorGrid>
        {/* Form */}
        <FormContainer>
          {isLoading && (
            <LoadingOverlay>
              <RefreshCw size={32} className="spinner" />
              <p>Carregando taxas atualizadas...</p>
            </LoadingOverlay>
          )}

          <FormTitle>
            <Calculator size={20} />
            Configure sua Simulação
          </FormTitle>

          <InputGroup>
            <Label htmlFor="initialValue">Valor Inicial (R$)</Label>
            <Input
              id="initialValue"
              type="number"
              placeholder="Ex: 1.000"
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              min="0"
              step="100"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="monthlyValue">Aporte Mensal (R$)</Label>
            <Input
              id="monthlyValue"
              type="number"
              placeholder="Ex: 200"
              value={monthlyValue}
              onChange={(e) => setMonthlyValue(e.target.value)}
              min="0"
              step="50"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="period">Período (Anos)</Label>
            <Input
              id="period"
              type="number"
              placeholder="Ex: 5"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              min="1"
              max="30"
            />
          </InputGroup>

          <InputGroup>
            <Label>Tipo de Investimento</Label>
            <InvestmentSelectWrapper>
              <InvestmentSelect
                options={investmentOptions}
                value={type}
                onChange={setType}
                formatRate={formatRate}
              />
            </InvestmentSelectWrapper>
          </InputGroup>

          <Button variant="primary" size="large" onClick={handleSimulate} fullWidth>
            <TrendingUp size={18} style={{ marginRight: "8px" }} />
            Simular Investimento
          </Button>
        </FormContainer>

        {/* Results */}
        <ResultContainer>
          {result ? (
            <>
              <ResultHeader>
                <div className="period-label">
                  Em {period} {parseInt(period) === 1 ? "ano" : "anos"}, você
                  teria
                </div>
                <h2 className="final-value">
                  {formatCurrency(result.finalAmount)}
                </h2>
                <div className="investment-name">
                  com {selectedInvestment?.name}
                </div>
              </ResultHeader>

              <StatsGrid>
                <StatItem>
                  <div className="label">Total Investido</div>
                  <div className="value">
                    {formatCurrency(result.totalInvested)}
                  </div>
                </StatItem>
                <StatItem>
                  <div className="label">Juros Ganhos</div>
                  <div className="value" style={{ color: theme.colors.success }}>
                    +{formatCurrency(result.totalInterest)}
                  </div>
                </StatItem>
              </StatsGrid>

              <ChartSection>
                <ChartHeader>
                  <h4>
                    <BarChart3 size={18} />
                    Evolução do Patrimônio
                  </h4>
                  <ChartLegendCustom>
                    <LegendItem $color={theme.colors.primary}>
                      Investido
                    </LegendItem>
                    <LegendItem $color={theme.colors.success}>Total</LegendItem>
                  </ChartLegendCustom>
                </ChartHeader>

                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={result.monthlyData}>
                    <defs>
                      <linearGradient
                        id="colorInvested"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={theme.colors.primary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.colors.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={theme.colors.success}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.colors.success}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.colors.border}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: theme.colors.textMedium }}
                      axisLine={{ stroke: theme.colors.border }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `R$ ${(value / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 11, fill: theme.colors.textMedium }}
                      axisLine={false}
                      tickLine={false}
                      width={65}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke={theme.colors.primary}
                      fill="url(#colorInvested)"
                      strokeWidth={2}
                      name="Investido"
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={theme.colors.success}
                      fill="url(#colorTotal)"
                      strokeWidth={2}
                      name="Total"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartSection>
            </>
          ) : (
            <EmptyState>
              <div className="icon">📊</div>
              <h3>Comece a Simular!</h3>
              <p>
                Preencha os dados ao lado e clique em "Simular Investimento"
                para visualizar como seu dinheiro pode crescer ao longo do
                tempo.
              </p>
            </EmptyState>
          )}
        </ResultContainer>
      </SimulatorGrid>

      {/* Insight Card */}
      {result && selectedInvestment && (
        <InsightCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>💡 Insight FinQuest</h3>
          <p>
            Veja o poder dos juros compostos! Você investiu um total de{" "}
            <strong>{formatCurrency(result.totalInvested)}</strong>, e seu
            dinheiro gerou{" "}
            <strong>{formatCurrency(result.totalInterest)}</strong> em
            rendimentos. Isso representa um retorno de{" "}
            <strong>
              {((result.totalInterest / result.totalInvested) * 100).toFixed(1)}%
            </strong>{" "}
            sobre o valor investido! É o seu dinheiro trabalhando para você! 🚀
          </p>
        </InsightCard>
      )}
    </PageContainer>
  );
};

export default InvestmentSimulatorPage;