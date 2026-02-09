import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    calculateInvestment,
} from '@/features/finance/services/investment-api';
import { useInvestmentRates } from '@/features/finance/hooks/useInvestments';

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

export const useInvestmentSimulator = () => {
    const [initialValue, setInitialValue] = useState('');
    const [monthlyValue, setMonthlyValue] = useState('');
    const [period, setPeriod] = useState('5');
    const [type, setType] = useState('cdb_100');
    const [result, setResult] = useState<SimulationResult | null>(null);

    // TanStack Query hook
    const { data: ratesData, isLoading, error } = useInvestmentRates();

    // Show status toasts
    useEffect(() => {
        if (ratesData) {
            if (ratesData.source === 'fallback') {
                toast.info('Usando taxas padrão (API offline)');
            } else {
                toast.success('Taxas atualizadas com sucesso!');
            }
        }
    }, [ratesData]);

    // Show error toast
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

    return {
        initialValue,
        setInitialValue,
        monthlyValue,
        setMonthlyValue,
        period,
        setPeriod,
        type,
        setType,
        result,
        ratesData,
        isLoading,
        handleSimulate,
        formatCurrency,
        formatLastUpdate,
        selectedInvestment,
    };
};
