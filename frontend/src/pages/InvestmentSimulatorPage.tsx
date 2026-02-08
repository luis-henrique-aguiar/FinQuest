import React, { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  RefreshCw,
  Clock,
  Calculator,
  BarChart3,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  calculateInvestment,
  formatRate,
  type InvestmentOption,
} from '../services/investimentsService';
import { useInvestmentRates } from '@/features/finance/hooks/useInvestments';
import InvestmentSelect from '../components/gamification/InvestmentSelect';
import { motion } from 'framer-motion';

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

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2 text-sm">
        Mês {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex justify-between gap-4 text-sm mt-1">
          <span style={{ color: entry.color }}>
            {entry.name}:
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export const InvestmentSimulatorPage: React.FC = () => {
  const [initialValue, setInitialValue] = useState('');
  const [monthlyValue, setMonthlyValue] = useState('');
  const [period, setPeriod] = useState('5');
  const [type, setType] = useState('cdb_100');
  const [result, setResult] = useState<SimulationResult | null>(null);

  const { data: ratesData, isLoading, error } = useInvestmentRates();

  useEffect(() => {
    if (ratesData) {
      if (ratesData.source === 'fallback') {
        toast.info('Usando taxas padrão (API offline)');
      } else {
        toast.success('Taxas atualizadas com sucesso!');
      }
    }
  }, [ratesData]);

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar taxas. Usando valores padrão.');
    }
  }, [error]);

  const handleSimulate = () => {
    const P = parseFloat(initialValue) || 0;
    const PMT = parseFloat(monthlyValue) || 0;
    const years = parseInt(period) || 1;

    if (P === 0 && PMT === 0) {
      toast.error('Informe um valor inicial ou aporte mensal');
      return;
    }

    if (years < 1) {
      toast.error('O período deve ser de pelo menos 1 ano');
      return;
    }

    if (!ratesData) {
      toast.error('Aguarde o carregamento das taxas');
      return;
    }

    const selectedInvestment = ratesData.rates.find((opt) => opt.id === type);
    if (!selectedInvestment) {
      toast.error('Selecione um tipo de investimento');
      return;
    }

    const calculatedResult = calculateInvestment(
      P,
      PMT,
      years,
      selectedInvestment.rate
    );
    setResult(calculatedResult);
    toast.success('Simulação calculada!');
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedInvestment = ratesData?.rates.find((opt) => opt.id === type);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10 mb-8">
          <div className="flex-1 min-w-[280px]">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3 mb-2">
              <TrendingUp size={32} className="text-primary" />
              Simulador de Investimentos
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Veja como seu dinheiro pode crescer com o poder dos juros compostos!
            </p>
          </div>

          {ratesData && (
            <Badge variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 py-1.5 px-3 flex items-center gap-1.5 shadow-sm">
              <Clock size={14} />
              <span>Atualizado em {formatLastUpdate(ratesData.lastUpdate)}</span>
            </Badge>
          )}
        </div>

        {/* Market Stats Grid */}
        {ratesData?.rawData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {Object.entries(ratesData.rawData).map(([key, value]) => (
              <div key={key} className="bg-white dark:bg-zinc-900 rounded-xl p-4 text-center border border-zinc-200 dark:border-zinc-800 shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">{key}</div>
                <div className="text-xl md:text-2xl font-bold text-primary">{value.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 h-fit hover:border-primary/20 transition-colors">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-3xl">
              <RefreshCw size={32} className="text-primary animate-spin" />
              <p className="text-zinc-500 font-medium">Carregando taxas...</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <Calculator className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Configure sua Simulação</h3>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="initialValue">Valor Inicial (R$)</Label>
              <Input
                id="initialValue"
                type="number"
                placeholder="Ex: 1.000"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                min="0"
                step="100"
                className="text-lg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="monthlyValue">Aporte Mensal (R$)</Label>
              <Input
                id="monthlyValue"
                type="number"
                placeholder="Ex: 200"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
                min="0"
                step="50"
                className="text-lg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period">Período (Anos)</Label>
              <div className="relative">
                <Input
                  id="period"
                  type="number"
                  placeholder="Ex: 5"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  min="1"
                  max="30"
                  className="text-lg"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none">anos</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tipo de Investimento</Label>
              <InvestmentSelect
                options={(ratesData?.rates as InvestmentOption[]) || []}
                value={type}
                onChange={setType}
                formatRate={formatRate}
              />
            </div>

            <Button size="lg" onClick={handleSimulate} className="w-full mt-4 text-base gap-2">
              <TrendingUp size={20} />
              Simular Investimento
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className={cn(
          "bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col min-h-[500px] transition-colors",
          result ? "border-green-100 dark:border-green-900/20 hover:border-green-200" : "border-zinc-200 dark:border-zinc-800"
        )}>
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <div className="text-center mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-zinc-500 mb-2">
                  Em {period} {parseInt(period) === 1 ? 'ano' : 'anos'}, você teria
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-500 mb-2 tracking-tight">
                  {formatCurrency(result.finalAmount)}
                </h2>
                <p className="text-sm text-zinc-500">
                  com {selectedInvestment?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Total Investido</div>
                  <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(result.totalInvested)}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
                  <div className="text-xs font-semibold uppercase tracking-wider text-green-600/70 dark:text-green-400/70 mb-1">Juros Ganhos</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-500">
                    +{formatCurrency(result.totalInterest)}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <BarChart3 size={18} className="text-primary" />
                    Evolução do Patrimônio
                  </h4>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                      Investido
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Total
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.monthlyData}>
                      <defs>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#71717a' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 11, fill: '#71717a' }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        stroke="#818cf8"
                        fill="url(#colorInvested)"
                        strokeWidth={2}
                        name="Investido"
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#22c55e"
                        fill="url(#colorTotal)"
                        strokeWidth={2}
                        name="Total"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4 opacity-70">
              <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-800  rounded-full flex items-center justify-center mb-2">
                <BarChart3 size={48} className="text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Comece a Simular!</h3>
              <p className="text-zinc-500 max-w-sm leading-relaxed">
                Preencha os dados ao lado e clique em "Simular Investimento" para visualizar como seu dinheiro pode crescer ao longo do tempo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insight Card */}
      {result && selectedInvestment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/5 rounded-3xl p-6 md:p-8 border border-green-100 dark:border-green-900/20 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-start gap-4 reltive z-10">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl shrink-0 text-green-600 dark:text-green-400">
              <Info size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                Insight FinQuest
              </h3>
              <p className="text-green-900/80 dark:text-green-200/80 leading-relaxed text-lg">
                Veja o poder dos juros compostos! Você investiu um total de{' '}
                <strong className="text-green-700 dark:text-green-300 font-bold">{formatCurrency(result.totalInvested)}</strong>, e seu
                dinheiro gerou{' '}
                <strong className="text-green-700 dark:text-green-300 font-bold">{formatCurrency(result.totalInterest)}</strong> em
                rendimentos. Isso representa um retorno de{' '}
                <strong className="text-green-700 dark:text-green-300 font-bold">
                  {((result.totalInterest / result.totalInvested) * 100).toFixed(1)}%
                </strong>{' '}
                sobre o valor investido! É o seu dinheiro trabalhando para você! 🚀
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InvestmentSimulatorPage;