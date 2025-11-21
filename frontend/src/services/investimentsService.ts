import axios from 'axios';

export interface InvestmentOption {
  id: string;
  name: string;
  rate: number;
  description?: string;
  recommended?: boolean;
  category?: 'renda_fixa' | 'tesouro' | 'poupanca';
  risk?: 'baixo' | 'medio' | 'alto';
  liquidity?: 'diaria' | 'mensal' | 'vencimento';
}

export interface InvestmentRatesResponse {
  rates: InvestmentOption[];
  lastUpdate: string;
  source: string;
  rawData?: {
    selic: number;
    cdi: number;
    ipca: number;
  };
}

interface BrasilAPITaxa {
  nome: string;
  valor: number;
}


export const fetchInvestmentRates = async (): Promise<InvestmentRatesResponse> => {
  try {
    
    const response = await axios.get<BrasilAPITaxa[]>(
      'https://brasilapi.com.br/api/taxas/v1',
      {
        timeout: 5000,
      }
    );

    const taxas = response.data;
    console.log('📊 Taxas da BrasilAPI:', taxas);

    
    const selic = taxas.find(t => t.nome === 'Selic')?.valor || 11.25;
    const cdi = taxas.find(t => t.nome === 'CDI')?.valor || 10.75;
    const ipca = taxas.find(t => t.nome === 'IPCA')?.valor || 4.68;

    console.log('💰 Taxas extraídas:', { selic, cdi, ipca });

    
    const rates: InvestmentOption[] = [
     
      {
        id: 'poupanca',
        name: 'Poupança',
        rate: (selic * 0.70) / 100, // 70% da Selic
        description: `Rendimento de 70% da Selic (${(selic * 0.70).toFixed(2)}% a.a.)`,
        category: 'poupanca',
        risk: 'baixo',
        liquidity: 'diaria',
      },

      
      {
        id: 'cdb_100',
        name: 'CDB (100% CDI)',
        rate: cdi / 100, // 100% do CDI
        description: `Certificado de Depósito Bancário - ${cdi.toFixed(2)}% a.a.`,
        recommended: true,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'vencimento',
      },

     
      {
        id: 'cdb_110',
        name: 'CDB (110% CDI)',
        rate: (cdi * 1.10) / 100, // 110% do CDI
        description: `CDB com rentabilidade acima do mercado - ${(cdi * 1.10).toFixed(2)}% a.a.`,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'vencimento',
      },

      
      {
        id: 'tesouro_selic',
        name: 'Tesouro Selic',
        rate: selic / 100, 
        description: `Título público atrelado à taxa Selic - ${selic.toFixed(2)}% a.a.`,
        category: 'tesouro',
        risk: 'baixo',
        liquidity: 'diaria',
      },

      
      {
        id: 'tesouro_ipca',
        name: 'Tesouro IPCA+',
        rate: (ipca + 6.0) / 100, 
        description: `Proteção contra inflação - IPCA (${ipca.toFixed(2)}%) + 6% = ${(ipca + 6.0).toFixed(2)}% a.a.`,
        category: 'tesouro',
        risk: 'baixo',
        liquidity: 'vencimento',
      },

     
      {
        id: 'lci_lca',
        name: 'LCI/LCA (95% CDI)',
        rate: (cdi * 0.95) / 100, // 95% do CDI
        description: `Isento de IR - ${(cdi * 0.95).toFixed(2)}% a.a.`,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'vencimento',
      },

     
      {
        id: 'cdb_85',
        name: 'CDB (85% CDI)',
        rate: (cdi * 0.85) / 100, // 85% do CDI
        description: `CDB com liquidez diária - ${(cdi * 0.85).toFixed(2)}% a.a.`,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'diaria',
      },
    ];

    return {
      rates,
      lastUpdate: new Date().toISOString(),
      source: 'brasilapi',
      rawData: { selic, cdi, ipca },
    };
  } catch (error) {
    console.error('❌ Erro ao buscar taxas da BrasilAPI:', error);
    return getFallbackRates();
  }
};

const getFallbackRates = (): InvestmentRatesResponse => {
  console.warn('⚠️ Usando taxas de fallback (BrasilAPI indisponível)');
  
  
  const selic = 11.25;
  const cdi = 10.75;
  const ipca = 4.5;

  return {
    rates: [
      {
        id: 'poupanca',
        name: 'Poupança',
        rate: (selic * 0.70) / 100,
        description: `Rendimento de 70% da Selic (${(selic * 0.70).toFixed(2)}% a.a.)`,
        category: 'poupanca',
        risk: 'baixo',
        liquidity: 'diaria',
      },
      {
        id: 'cdb_100',
        name: 'CDB (100% CDI)',
        rate: cdi / 100,
        description: `Certificado de Depósito Bancário - ${cdi.toFixed(2)}% a.a.`,
        recommended: true,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'vencimento',
      },
      {
        id: 'cdb_110',
        name: 'CDB (110% CDI)',
        rate: (cdi * 1.10) / 100,
        description: `CDB com rentabilidade acima do mercado - ${(cdi * 1.10).toFixed(2)}% a.a.`,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'vencimento',
      },
      {
        id: 'tesouro_selic',
        name: 'Tesouro Selic',
        rate: selic / 100,
        description: `Título público atrelado à taxa Selic - ${selic.toFixed(2)}% a.a.`,
        category: 'tesouro',
        risk: 'baixo',
        liquidity: 'diaria',
      },
      {
        id: 'tesouro_ipca',
        name: 'Tesouro IPCA+',
        rate: (ipca + 6.0) / 100,
        description: `Proteção contra inflação - IPCA (${ipca.toFixed(2)}%) + 6% = ${(ipca + 6.0).toFixed(2)}% a.a.`,
        category: 'tesouro',
        risk: 'baixo',
        liquidity: 'vencimento',
      },
      {
        id: 'lci_lca',
        name: 'LCI/LCA (95% CDI)',
        rate: (cdi * 0.95) / 100,
        description: `Isento de IR - ${(cdi * 0.95).toFixed(2)}% a.a.`,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'vencimento',
      },
      {
        id: 'cdb_85',
        name: 'CDB (85% CDI)',
        rate: (cdi * 0.85) / 100,
        description: `CDB com liquidez diária - ${(cdi * 0.85).toFixed(2)}% a.a.`,
        category: 'renda_fixa',
        risk: 'baixo',
        liquidity: 'diaria',
      },
    ],
    lastUpdate: new Date().toISOString(),
    source: 'fallback',
    rawData: { selic, cdi, ipca },
  };
};


export const calculateInvestment = (
  initialValue: number,
  monthlyValue: number,
  years: number,
  annualRate: number
): {
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  monthlyData: Array<{
    month: number;
    invested: number;
    total: number;
  }>;
} => {
  const n = years * 12; 
  const r = annualRate / 12;

 
  const futureValueInitial = initialValue * Math.pow(1 + r, n);

  
  const futureValueMonthly = monthlyValue > 0
    ? monthlyValue * ((Math.pow(1 + r, n) - 1) / r)
    : 0;

  const finalAmount = futureValueInitial + futureValueMonthly;
  const totalInvested = initialValue + monthlyValue * n;
  const totalInterest = finalAmount - totalInvested;

  
  const monthlyData = [];
  for (let month = 0; month <= n; month++) {
    const invested = initialValue + monthlyValue * month;
    const futureInitial = initialValue * Math.pow(1 + r, month);
    const futureMonthly = month > 0
      ? monthlyValue * ((Math.pow(1 + r, month) - 1) / r)
      : 0;
    const total = futureInitial + futureMonthly;

    monthlyData.push({
      month,
      invested,
      total,
    });
  }

  return {
    totalInvested,
    totalInterest,
    finalAmount,
    monthlyData,
  };
};


export const formatRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2).replace('.', ',')}%`;
};

const CACHE_KEY = 'finquest_investment_rates';
const CACHE_DURATION = 60 * 60 * 1000 * 24 * 7; // 1 semana

export const getCachedRates = (): InvestmentRatesResponse | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const cacheAge = Date.now() - new Date(data.lastUpdate).getTime();

    if (cacheAge > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log('✅ Usando taxas do cache');
    return data;
  } catch {
    return null;
  }
};

export const setCachedRates = (data: InvestmentRatesResponse): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao cachear taxas:', error);
  }
};