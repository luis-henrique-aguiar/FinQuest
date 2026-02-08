import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * 
 * Default options for all queries and mutations in the application.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time: Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Cache time: Unused data is garbage collected after 10 minutes
            gcTime: 10 * 60 * 1000,

            // Retry failed requests up to 3 times with exponential backoff
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,

            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
});
