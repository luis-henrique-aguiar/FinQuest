# Design System Components

## Overview

A biblioteca de componentes foi construída usando **Shadcn/ui** integrado com nosso sistema de design Tailwind v4. Todos os componentes seguem os tokens de design do `theme.ts` e suportam modo claro/escuro automaticamente.

## Componentes Disponíveis

### Formulários e Inputs

#### Button
Componente de botão com múltiplas variantes e tamanhos.

```tsx
import { Button } from '@/components/ui/button';

// Variantes
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Variantes disponíveis:**
- `default` - Cor primária (#007ACC)
- `destructive` - Para ações destrutivas
- `outline` - Botão com borda
- `secondary` - Cor secundária (#28A745)
- `ghost` - Sem fundo
- `link` - Estilo de link

---

#### Input
Campo de entrada de texto.

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="seu@email.com" 
  />
</div>
```

---

#### Label
Rótulo para campos de formulário.

```tsx
import { Label } from '@/components/ui/label';

<Label htmlFor="username">Nome de usuário</Label>
```

---

#### Select
Componente de seleção dropdown.

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opcao1">Opção 1</SelectItem>
    <SelectItem value="opcao2">Opção 2</SelectItem>
    <SelectItem value="opcao3">Opção 3</SelectItem>
  </SelectContent>
</Select>
```

---

#### Form
Sistema de formulários com React Hook Form + Zod.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
```

---

### Layout e Containers

#### Card
Container com estilo de card.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

---

#### Separator
Linha separadora horizontal ou vertical.

```tsx
import { Separator } from '@/components/ui/separator';

<div>
  <p>Seção 1</p>
  <Separator className="my-4" />
  <p>Seção 2</p>
</div>
```

---

### Navegação e Tabs

#### Tabs
Sistema de abas para organizar conteúdo.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Aba 1</TabsTrigger>
    <TabsTrigger value="tab2">Aba 2</TabsTrigger>
    <TabsTrigger value="tab3">Aba 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Conteúdo da Aba 1</TabsContent>
  <TabsContent value="tab2">Conteúdo da Aba 2</TabsContent>
  <TabsContent value="tab3">Conteúdo da Aba 3</TabsContent>
</Tabs>
```

---

### Feedback e Notificações

#### Dialog
Modal/diálogo para conteúdo sobreposto.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Dialog</DialogTitle>
      <DialogDescription>
        Descrição do conteúdo do dialog
      </DialogDescription>
    </DialogHeader>
    <div>Conteúdo do dialog</div>
  </DialogContent>
</Dialog>
```

---

#### Toast (Sonner)
Sistema de notificações toast usando Sonner integrado com nosso tema.

**Setup** (adicionar no App.tsx ou main.tsx):

```tsx
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Toaster />
      {/* resto do app */}
    </>
  );
}
```

**Uso** (em qualquer componente):

```tsx
import { toast } from 'sonner';

// Toast simples
toast('Mensagem simples');

// Toast com tipo
toast.success('Operação bem-sucedida!');
toast.error('Erro ao processar');
toast.warning('Atenção!');
toast.info('Informação importante');

// Toast com ação
toast('Arquivo deletado', {
  action: {
    label: 'Desfazer',
    onClick: () => console.log('Desfazer'),
  },
});

// Toast com descrição
toast.success('Perfil atualizado', {
  description: 'Suas informações foram salvas com sucesso',
});

// Toast com duração customizada
toast('Salvando...', { duration: 5000 });

// Toast com promessa
toast.promise(
  saveData(),
  {
    loading: 'Salvando...',
    success: 'Dados salvos!',
    error: 'Erro ao salvar',
  }
);
```

---

### Display Components

#### Avatar
Componente de avatar/foto de perfil.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="https://github.com/username.png" alt="@username" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

---

#### Badge
Etiqueta/badge para status ou categorias.

```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## Integração com o Sistema de Design

Todos os componentes já estão configurados para usar:

- **Cores do tema**: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`
- **Espaçamento**: Sistema de spacing do Tailwind mapeado do `theme.ts`
- **Tipografia**: Poppins (headings) e Nunito Sans (body)
- **Border Radius**: Valores consistentes do tema
- **Sombras**: Níveis sm, md, lg
- **Dark Mode**: Automático via `useThemeStore`

## Customização

Para customizar um componente, você pode:

1. **Usar className para ajustes pontuais:**
```tsx
<Button className="rounded-full">Botão Arredondado</Button>
```

2. **Criar variantes customizadas** (editar o arquivo do componente em `src/components/ui/`)

3. **Usar as cores do tema:**
```tsx
<div className="bg-primary text-primary-foreground">
  Usando cor primária
</div>

<div className="bg-success text-white">
  Usando cor de sucesso
</div>
```

## Best Practices

1. **Sempre use os componentes Shadcn** em vez de criar elementos HTML básicos
2. **Combine com hooks customizados** para separar lógica de apresentação
3. **Use o sistema de cores do tema** em vez de cores hardcoded
4. **Aproveite o FormField** para formulários com validação
5. **Use toast para feedback** em vez de alerts do navegador

## Migration Notes

Durante a migração das páginas antigas:

- Substitua `styled-components` por componentes Shadcn + Tailwind classes
- Use `Form` + `FormField` para todos os formulários
- Substitua modais customizados por `Dialog`
- Use `toast()` do sonner em vez do antigo `ToastContext`
- Substitua botões customizados pelo componente `Button`
