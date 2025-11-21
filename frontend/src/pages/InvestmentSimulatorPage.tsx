import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
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

// --- Styled Components ---

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textDark};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const UpdateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const UpdateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textMedium};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.pill};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary}11;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SimulatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  height: fit-content;
  position: relative;
`;

const ResultContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  min-height: 500px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  transition: all ${({ theme }) => theme.animations.fast} ease;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &[type="number"] {
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const InvestmentOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ $selected, theme }) =>
    $selected ? `${theme.colors.primary}11` : theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}11`};
    transform: translateY(-2px);
  }

  input {
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const InvestmentInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    flex-wrap: wrap;
  }

  .rate {
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
  }

  .description {
    font-size: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textLight};
    margin-top: 2px;
  }
`;

const Badge = styled.span<{ $variant: 'recommended' | 'info' }>`
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  text-transform: uppercase;
  letter-spacing: 0.3px;

  ${({ $variant, theme }) => {
    if ($variant === 'recommended') {
      return `
        background: ${theme.colors.success};
        color: ${theme.colors.white};
      `;
    }
    return `
      background: ${theme.colors.info}22;
      color: ${theme.colors.info};
    `;
  }}
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  .period-label {
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .final-value {
    font-size: 2.5rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.success};
    margin: 0;
    line-height: 1;
  }

  .investment-name {
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  .label {
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMedium};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};

  .icon {
    font-size: 4rem;
    opacity: 0.5;
  }

  h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    color: ${({ theme }) => theme.colors.textDark};
  }

  p {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    max-width: 350px;
    line-height: 1.6;
  }
`;

const InsightCard = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success}11 0%,
    ${({ theme }) => theme.colors.accent}11 100%
  );
  border-left: 4px solid ${({ theme }) => theme.colors.success};
  box-shadow: ${({ theme }) => theme.shadows.small};

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.success};
    font-size: 1.125rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin: 0;
    line-height: 1.7;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textDark};
  }

  strong {
    color: ${({ theme }) => theme.colors.success};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.white}ee;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  z-index: 10;
  gap: ${({ theme }) => theme.spacing.md};

  .spinner {
    animation: spin 1s linear infinite;
  }

  p {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    color: ${({ theme }) => theme.colors.textMedium};
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// --- Interfaces ---

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

// --- Componente Principal ---

export const InvestmentSimulatorPage: React.FC = () => {
  const [initialValue, setInitialValue] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [period, setPeriod] = useState("5");
  const [type, setType] = useState("cdb_100");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [investmentOptions, setInvestmentOptions] = useState<InvestmentOption[]>([]);
  const [ratesData, setRatesData] = useState<InvestmentRatesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const { addToast } = useToast();

  // ✅ Carrega taxas ao montar o componente
  useEffect(() => {
    loadInvestmentRates();
  }, []);

  const loadInvestmentRates = async () => {
    // ✅ Tenta buscar do cache primeiro
    const cached = getCachedRates();
    if (cached) {
      setRatesData(cached);
      setInvestmentOptions(cached.rates);
      console.log('✅ Usando taxas do cache');
      return;
    }

    // ✅ Se não tem cache, busca da API
    setIsLoading(true);
    try {
      const data = await fetchInvestmentRates();
      setRatesData(data);
      setInvestmentOptions(data.rates);
      
      // ✅ Salva no cache
      setCachedRates(data);
      
      if (data.source === 'fallback') {
        addToast("Usando taxas padrão (BrasilAPI offline)", "info");
      } else {
        addToast("Taxas atualizadas da BrasilAPI!", "success");
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

    const calculatedResult = calculateInvestment(P, PMT, years, selectedInvestment.rate);
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
      <Header>
        <Title>
          <TrendingUp size={32} />
          Simulador de Investimentos
        </Title>
        <Subtitle>
          Veja como seu dinheiro pode crescer com o poder dos juros compostos!
        </Subtitle>
        {ratesData && (
          <UpdateInfo>
            <UpdateBadge>
              <AlertCircle />
              Atualizado em {formatLastUpdate(ratesData.lastUpdate)}
            </UpdateBadge>
            <RefreshButton onClick={loadInvestmentRates} disabled={isLoading}>
              <RefreshCw />
              Atualizar Taxas
            </RefreshButton>
          </UpdateInfo>
        )}
      </Header>

      <SimulatorGrid>
        <FormContainer>
          {isLoading && (
            <LoadingOverlay>
              <RefreshCw size={32} className="spinner" />
              <p>Carregando taxas...</p>
            </LoadingOverlay>
          )}

          <InputGroup>
            <Label htmlFor="initialValue">Valor Inicial (R$)</Label>
            <Input
              id="initialValue"
              type="number"
              placeholder="Ex: 1000"
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
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {investmentOptions.map((opt) => (
                <InvestmentOption key={opt.id} $selected={type === opt.id}>
                  <input
                    type="radio"
                    name="investmentType"
                    value={opt.id}
                    checked={type === opt.id}
                    onChange={() => setType(opt.id)}
                  />
                  <InvestmentInfo>
                    <div className="name">
                      {opt.name}
                      {opt.recommended && (
                        <Badge $variant="recommended">Recomendado</Badge>
                      )}
                    </div>
                    <div className="rate">
                      {formatRate(opt.rate)} ao ano
                    </div>
                    {opt.description && (
                      <div className="description">{opt.description}</div>
                    )}
                  </InvestmentInfo>
                </InvestmentOption>
              ))}
            </div>
          </InputGroup>

          <Button
            variant="primary"
            size="large"
            onClick={handleSimulate}
            fullWidth
          >
            Simular Investimento
          </Button>
        </FormContainer>

        <ResultContainer>
          {result ? (
            <>
              <ResultHeader>
                <div className="period-label">
                  Em {period} {parseInt(period) === 1 ? "ano" : "anos"}, você teria
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
                  <div
                    className="value"
                    style={{ color: theme.colors.success }}
                  >
                    {formatCurrency(result.totalInterest)}
                  </div>
                </StatItem>
              </StatsGrid>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={result.monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.border}
                  />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Meses",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    tick={{ fontSize: 12, fill: theme.colors.textMedium }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                    tick={{ fontSize: 12, fill: theme.colors.textMedium }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mês ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke={theme.colors.primary}
                    name="Investido"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={theme.colors.success}
                    name="Total"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <EmptyState>
              <div className="icon">📊</div>
              <h3>Comece a Simular!</h3>
              <p>
                Preencha os dados ao lado e clique em "Simular Investimento"
                para ver como seu dinheiro pode crescer!
              </p>
            </EmptyState>
          )}
        </ResultContainer>
      </SimulatorGrid>

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