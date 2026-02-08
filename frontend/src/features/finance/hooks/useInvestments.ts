/**
 * TanStack Query hooks for investment simulator
 */
import { useQuery } from '@tanstack/react-query';
import { fetchInvestmentRates, type InvestmentRatesResponse } from '../services/investment-api';

/**
 * Query Keys for investments
 */
export const investmentsKeys = {
    all: ['investments'] as const,
    rates: () => [...investmentsKeys.all, 'rates'] as const,
};

/**
 * Hook to fetch investment rates
 * Automatically caches for 30 minutes (rates don't change frequently)
 */
export function useInvestmentRates() {
    return useQuery<InvestmentRatesResponse>({
        queryKey: investmentsKeys.rates(),
        queryFn: fetchInvestmentRates,
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 2,
    });
}
