# TanStack Query Hooks - Migration Patterns

## Overview

Este documento descreve os padrões estabelecidos para migração de services API para TanStack Query hooks. Todos os hooks seguem convenções consistentes para facilitar manutenção e escalabilidade.

## Hook Patterns

### 1. Query Keys

Sempre defina query keys estruturadas para fácil invalidação:

\`\`\`typescript
export const resourceKeys = {
  all: ['resource'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (filters?: any) => [...resourceKeys.lists(), filters] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
};
\`\`\`

### 2. Query Hooks (Leitura)

Para queries (GET):

\`\`\`typescript
export function useResource(id: string | undefined) {
  return useQuery({
    queryKey: resourceKeys.detail(id || ''),
    queryFn: () => getResource(id!),
    enabled: !!id, // Só executa se id existir
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
\`\`\`

### 3. Mutation Hooks (Escrita)

Para mutations (POST, PATCH, DELETE):

\`\`\`typescript
export function useUpdateResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateDTO) => updateResource(data),
    
    onSuccess: (updatedData, variables) => {
      // 1. Atualizar cache específico
      queryClient.setQueryData(
        resourceKeys.detail(variables.id),
        updatedData
      );
      
      // 2. Invalidar listas relacionadas
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
      
      // 3. Toast de sucesso
      toast.success('Atualizado com sucesso!');
    },
    
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar';
      toast.error(message);
    },
  });
}
\`\`\`

## Hooks Criados

### Profile Feature

**Arquivo**: `src/features/profile/hooks/useProfile.ts`

| Hook | Tipo | Descrição |
|------|------|-----------|
| `useUserProfile(userId)` | Query | Busca perfil de usuário específico |
| `useCurrentUserProfile()` | Query | Busca perfil do usuário autenticado |
| `useUpdateAvatar()` | Mutation | Atualiza avatar do usuário |
| `useUpdateProfile()` | Mutation | Atualiza informações do perfil |

**Exemplo de uso**:
\`\`\`tsx
function ProfilePage() {
  const { data: profile, isLoading } = useCurrentUserProfile();
  const updateProfile = useUpdateProfile();
  
  const handleSubmit = (data) => {
    updateProfile.mutate(data);
  };
  
  if (isLoading) return <Spinner />;
  return <ProfileForm profile={profile} onSubmit={handleSubmit} />;
}
\`\`\`

---

### Goals Feature (Finance)

**Arquivo**: `src/features/finance/hooks/useGoals.ts`

| Hook | Tipo | Descrição |
|------|------|-----------|
| `useGoals()` | Query | Lista todas as metas do usuário |
| `useGoal(goalId)` | Query | Busca meta específica |
| `useCreateGoal()` | Mutation | Cria nova meta |
| `useUpdateGoal()` | Mutation | Atualiza meta (com gamificação) |
| `useDeleteGoal()` | Mutation | Remove meta |

**Gamificação integrada**:
- Detecta level up e mostra toast especial
- Detecta conquistas desbloqueadas
- Atualiza auth store automaticamente

**Exemplo de uso**:
\`\`\`tsx
function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const updateGoal = useUpdateGoal();
  
  const handleUpdate = (goalId: string, amount: number) => {
    updateGoal.mutate({
      goalId,
      updates: { currentAmount: amount }
    });
    // Toast automático + notificações de level up/badges
  };
}
\`\`\`

---

### Course Feature

**Arquivo**: `src/features/course/hooks/useCourse.ts`

| Hook | Tipo | Descrição |
|------|------|-----------|
| `useCourses()` | Query | Lista todos os cursos |
| `useCourse(courseId)` | Query | Detalhes do curso + lições |
| `useEnrollInCourse()` | Mutation | Matricula em curso |
| `useLesson(lessonId)` | Query | Detalhes da lição |
| `useLessonQuiz(lessonId)` | Query | Quiz da lição |
| `useCompleteLesson()` | Mutation | Completa lição (com gamificação) |

**Exemplo de uso**:
\`\`\`tsx
function LessonPage({ lessonId, courseId }) {
  const { data: lesson } = useLesson(lessonId);
  const { data: quiz } = useLessonQuiz(lessonId);
  const completeLesson = useCompleteLesson();
  
  const handleComplete = () => {
    completeLesson.mutate({ lessonId, courseId });
    // Toasts automáticos: FinPoints, level up, badges, progresso
  };
}
\`\`\`

---

## Features dos Hooks

### ✅ Cache Automático

TanStack Query cacheia automaticamente:
- Stale Time: 5 minutos (queries gerais), 10 minutos (conteúdo estático como lições)
- Cache Time: 10 minutos (conforme `query-client.ts`)

### ✅ Invalidação Inteligente

Ao atualizar dados, os hooks invalidam automaticamente queries relacionadas:

\`\`\`typescript
// Exemplo: ao completar lição, invalida:
queryClient.invalidateQueries({ queryKey: lessonKeys.detail(lessonId) });
queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
\`\`\`

### ✅ Toast Notifications

Todos os mutations incluem toasts automáticos:
- ✅ **Sucesso**: "Atualizado com sucesso!"  
- ❌ **Erro**: Mensagem da API ou fallback genérico
- 🎉 **Gamificação**: Level up, badges, progresso

### ✅ Sincronização com Auth Store

Hooks que afetam o usuário atualizam o `authStore` automaticamente:

\`\`\`typescript
const updateUser = useAuthStore((state) => state.updateUser);

onSuccess: (data) => {
  updateUser({
    totalFinPoints: data.totalFinPoints,
    level: data.level,
  });
}
\`\`\`

### ✅ Loading & Error States

Todos os hooks retornam estados padrão do TanStack Query:

\`\`\`typescript
const { data, isLoading, error, refetch } = useResource();

// Para mutations:
const mutation = useMutation(...);
mutation.isPending  // Loading
mutation.isError    // Erro
mutation.isSuccess  // Sucesso
\`\`\`

## Próximos Services a Migrar

Seguindo o mesmo padrão:

- [ ] **Missions** (`missionService` → `useMissions`)
- [ ] **Investments** (`investimentsService` → `useInvestments`)  
- [ ] **Transactions** (`transactionService` → `useTransactions`)
- [ ] **Reports** (`reportsService` → `useReports`)
- [ ] **Admin** (`adminService` → `useAdmin`)

## Migration Checklist

Para migrar um novo service:

1. ✅ Criar `feature/services/resource-api.ts` com funções tipadas
2. ✅ Criar `feature/types/resource.types.ts` com interfaces
3. ✅ Criar `feature/hooks/useResource.ts` com hooks do TanStack Query
4. ✅ Definir `resourceKeys` para query keys
5. ✅ Implementar queries (`useQuery`) para leitura
6. ✅ Implementar mutations (`useMutation`) para escrita
7. ✅ Adicionar `onSuccess` com cache update + toast
8. ✅ Adicionar `onError` com toast de erro
9. ✅ Sincronizar com `authStore` se relevante
10. ✅ Testar loading, success e error states

## Best Practices

1. **Sempre use query keys estruturadas** - facilita invalidação
2. **Prefira invalidação a update manual** - mais seguro
3. **Use `enabled`** em queries condicionais
4. **Configure `staleTime`** baseado na frequência de mudança dos dados
5. **Toast para todas as mutations** - feedback ao usuário
6. **Error handling robusto** - mensagens claras
7. **TypeScript strict** - evita bugs

## Referências

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tkdodo.eu/blog/effective-react-query-keys)
- Pattern estabelecido em: `src/features/profile/hooks/useProfile.ts`
