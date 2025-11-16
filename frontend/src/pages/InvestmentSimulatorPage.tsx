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
import { TrendingUp, RefreshCw } from "react-feather";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import SectionTitle from "../components/common/SectionTitle";
import { useToast } from "../hooks/useToast";
import api from "../services/api";

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SimulatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  height: fit-content;
`;

const ResultContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  min-height: 400px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  label {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ theme }) => theme.colors.textMedium}33;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textDark};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }

  &[type="number"] {
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
      $selected ? theme.colors.primary : `${theme.colors.textMedium}33`};
  background: ${({ $selected, theme }) =>
    $selected ? `${theme.colors.primary}11` : theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}11`};
  }

  input {
    cursor: pointer;
  }
`;

const InvestmentInfo = styled.div`
  flex: 1;

  .name {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: 4px;
  }

  .rate {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textMedium};
  }

  .badge {
    display: inline-block;
    font-size: 0.7rem;
    background: ${({ theme }) => theme.colors.secondary};
    color: white;
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    margin-left: 6px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  .period-label {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .final-value {
    font-size: 2.5rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.secondary};
    margin: 0;
    line-height: 1;
  }

  .investment-name {
    font-size: 0.9rem;
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
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: 4px;
  }

  .value {
    font-size: 1.1rem;
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

  .icon {
    font-size: 3rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
    max-width: 300px;
  }
`;

const InsightCard = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}11 0%,
    ${({ theme }) => theme.colors.secondary}11 100%
  );
  border-left: 4px solid ${({ theme }) => theme.colors.secondary};

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textDark};
  }

  strong {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.white}99;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  z-index: 10;
`;

const UpdateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMedium};
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// --- Interfaces ---

interface InvestmentOption {
  id: string;
  name: string;
  rate: number;
  description?: string;
  recommended?: boolean;
}

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

// --- Mock da API ---
// TODO: Substituir por chamada real à API
const fetchInvestmentRates = async (): Promise<InvestmentOption[]> => {

  const response = await api.get("");

  // Simula delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simula resposta da API com taxas atualizadas
  return [
    {
      id: "poupanca",
      name: "Poupança",
      rate: 0.0617,
      description: "Rendimento de 70% da Selic + TR",
    },
    {
      id: "cdb",
      name: "CDB (100% CDI)",
      rate: 0.1075,
      description: "Certificado de Depósito Bancário",
      recommended: true,
    },
    {
      id: "selic",
      name: "Tesouro Selic",
      rate: 0.1125,
      description: "Título público atrelado à taxa Selic",
    },
    {
      id: "ipca",
      name: "Tesouro IPCA+",
      rate: 0.118,
      description: "Título protegido da inflação",
    },
  ];
};

// --- Componente Principal ---

export const InvestmentSimulatorPage: React.FC = () => {
  const [initialValue, setInitialValue] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [period, setPeriod] = useState("5");
  const [type, setType] = useState("cdb");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [investmentOptions, setInvestmentOptions] = useState<
    InvestmentOption[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const theme = useTheme();
  const { addToast } = useToast();

  // Carrega taxas ao montar o componente
  useEffect(() => {
    loadInvestmentRates();
  }, []);

  const loadInvestmentRates = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchInvestmentRates();
      setInvestmentOptions(rates);
      setLastUpdate(new Date());
      addToast("Taxas atualizadas com sucesso!", "success");
    } catch (error) {
      addToast("Erro ao carregar taxas. Usando valores padrão.", "error");
      // Fallback para taxas padrão
      setInvestmentOptions([
        { id: "poupanca", name: "Poupança", rate: 0.06 },
        { id: "cdb", name: "CDB (100% CDI)", rate: 0.1, recommended: true },
        { id: "selic", name: "Tesouro Selic", rate: 0.105 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = () => {
    const P = parseFloat(initialValue) || 0;
    const PMT = parseFloat(monthlyValue) || 0;
    const years = parseInt(period) || 1;
    const n = years * 12;

    const selectedInvestment = investmentOptions.find((opt) => opt.id === type);
    if (!selectedInvestment) return;

    const r = selectedInvestment.rate / 12;

    // Calcula valor final
    const finalAmount =
      P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
    const totalInvested = P + PMT * n;
    const totalInterest = finalAmount - totalInvested;

    // Gera dados mensais para o gráfico
    const monthlyData = [];
    for (let month = 0; month <= n; month++) {
      const invested = P + PMT * month;
      const total =
        P * Math.pow(1 + r, month) +
        (month > 0 ? PMT * ((Math.pow(1 + r, month) - 1) / r) : 0);
      monthlyData.push({ month, invested, total });
    }

    setResult({ totalInvested, totalInterest, finalAmount, monthlyData });
    addToast("Simulação calculada!", "success");
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const selectedInvestment = investmentOptions.find((opt) => opt.id === type);

  return (
    <PageContainer>
      <div>
        <SectionTitle>Simulador de Investimentos</SectionTitle>
        <p>
          Veja como seu dinheiro pode crescer com o poder dos juros compostos!
        </p>
        {lastUpdate && (
          <UpdateBadge>
            <RefreshCw size={12} />
            Atualizado em {lastUpdate.toLocaleTimeString("pt-BR")}
          </UpdateBadge>
        )}
      </div>

      <SimulatorGrid>
        <FormContainer variant="elevated">
          {isLoading && (
            <LoadingOverlay>
              <RefreshCw
                size={32}
                style={{ animation: "spin 1s linear infinite" }}
              />
            </LoadingOverlay>
          )}

          <InputGroup>
            <label htmlFor="initialValue">Valor Inicial (R$)</label>
            <Input
              id="initialValue"
              type="number"
              placeholder="Ex: 1000"
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="monthlyValue">Aporte Mensal (R$)</label>
            <Input
              id="monthlyValue"
              type="number"
              placeholder="Ex: 200"
              value={monthlyValue}
              onChange={(e) => setMonthlyValue(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="period">Período (Anos)</label>
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
            <label>Tipo de Investimento</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
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
                        <span className="badge">Recomendado</span>
                      )}
                    </div>
                    <div className="rate">
                      {(opt.rate * 100).toFixed(2)}% ao ano
                    </div>
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
            icon={<TrendingUp size={18} />}
          >
            Simular Investimento
          </Button>
        </FormContainer>

        <ResultContainer variant="elevated">
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
                  <div
                    className="value"
                    style={{ color: theme.colors.secondary }}
                  >
                    {formatCurrency(result.totalInterest)}
                  </div>
                </StatItem>
              </StatsGrid>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.textMedium + "33"}
                  />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Meses",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                    tick={{ fontSize: 12 }}
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
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={theme.colors.secondary}
                    name="Total"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <EmptyState>
              <div className="icon">📊</div>
              <p>
                Preencha os dados ao lado e clique em "Simular Investimento"
                para ver como seu dinheiro pode crescer!
              </p>
            </EmptyState>
          )}
        </ResultContainer>
      </SimulatorGrid>

      {result && (
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
              {((result.totalInterest / result.totalInvested) * 100).toFixed(1)}
              %
            </strong>{" "}
            sobre o valor investido! É o seu dinheiro trabalhando para você! 🚀
          </p>
        </InsightCard>
      )}
    </PageContainer>
  );
};

export default InvestmentSimulatorPage;
