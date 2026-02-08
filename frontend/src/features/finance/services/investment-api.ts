// Investment API service functions
import api from '@/services/api';

export interface InvestmentOption {
    id: string;
    name: string;
    description: string;
    rate: number;
    risk: 'baixo' | 'medio' | 'alto';
    liquidity: 'diaria' | 'mensal' | 'vencimento';
}

export interface RawMarketData {
    selic: number;
    cdi: number;
    ipca: number;
    tr: number;
}

export interface InvestmentRatesResponse {
    rates: InvestmentOption[];
    rawData: RawMarketData;
    lastUpdate: string;
    source: 'bcb' | 'fallback';
}

export interface SimulationResult {
    totalInvested: number;
    totalInterest: number;
    finalAmount: number;
    monthlyData: Array<{
        month: number;
        invested: number;
        total: number;
    }>;
}

/**
 * Fetch investment rates from BCB API or use fallback data
 */
export const fetchInvestmentRates = async (): Promise<InvestmentRatesResponse> => {
    try {
        const response = await api.get('/investments/rates');
        return response.data;
    } catch (error) {
        // Fallback data if API fails
        console.warn('BCB API não disponível, usando fallback');
        return getFallbackRates();
    }
};

/**
 * Calculate investment returns over time
 */
export const calculateInvestment = (
    initialValue: number,
    monthlyContribution: number,
    years: number,
    annualRate: number
): SimulationResult => {
    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    let totalInvested = initialValue;
    let total = initialValue;
    const monthlyData: SimulationResult['monthlyData'] = [];

    for (let month = 1; month <= months; month++) {
        total = total * (1 + monthlyRate) + monthlyContribution;
        totalInvested += monthlyContribution;

        monthlyData.push({
            month,
            invested: totalInvested,
            total,
        });
    }

    const totalInterest = total - totalInvested;

    return {
        totalInvested,
        totalInterest,
        finalAmount: total,
        monthlyData,
    };
};

/**
 * Format rate for display
 */
export const formatRate = (rate: number): string => {
    return `${rate.toFixed(2)}% a.a.`;
};

/**
 * Fallback rates when BCB API is unavailable
 */
function getFallbackRates(): InvestmentRatesResponse {
    const selic = 11.75;
    const cdi = 11.65;
    const ipca = 4.5;
    const tr = 0.08;

    return {
        rates: [
            {
                id: 'poupanca',
                name: 'Poupança',
                description: 'Rendimento de 70% da Selic + TR',
                rate: selic * 0.7 + tr,
                risk: 'baixo',
                liquidity: 'diaria',
            },
            {
                id: 'cdb_100',
                name: 'CDB 100% CDI',
                description: 'Certificado de Depósito Bancário pagando 100% do CDI',
                rate: cdi,
                risk: 'baixo',
                liquidity: 'vencimento',
            },
            {
                id: 'cdb_110',
                name: 'CDB 110% CDI',
                description: 'CDB com rendimento acima do CDI',
                rate: cdi * 1.1,
                risk: 'baixo',
                liquidity: 'vencimento',
            },
            {
                id: 'lci_lca',
                name: 'LCI/LCA 90% CDI',
                description: 'Letra de Crédito (isenta de IR)',
                rate: cdi * 0.9,
                risk: 'baixo',
                liquidity: 'vencimento',
            },
            {
                id: 'tesouro_selic',
                name: 'Tesouro Selic',
                description: 'Título público atrelado à taxa Selic',
                rate: selic,
                risk: 'baixo',
                liquidity: 'diaria',
            },
            {
                id: 'tesouro_ipca',
                name: 'Tesouro IPCA+ 2035',
                description: 'IPCA + taxa prefixada (~6%)',
                rate: ipca + 6.0,
                risk: 'medio',
                liquidity: 'vencimento',
            },
        ],
        rawData: {
            selic,
            cdi,
            ipca,
            tr,
        },
        lastUpdate: new Date().toISOString(),
        source: 'fallback',
    };
}
