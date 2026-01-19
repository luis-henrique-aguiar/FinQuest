import React from 'react';
import { FiX, FiBook } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as S from './MarkdownStyleGuide.styles';

interface MarkdownStyleGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarkdownStyleGuide: React.FC<MarkdownStyleGuideProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const examples = [
    {
      title: '📝 Títulos',
      description: 'Use # para criar títulos de diferentes níveis',
      markdown: `# Título Nível 1
## Título Nível 2
### Título Nível 3
#### Título Nível 4`,
    },
    {
      title: '✨ Formatação de Texto',
      description: 'Formate seu texto com negrito, itálico e código',
      markdown: `**Texto em negrito**

*Texto em itálico*

***Texto em negrito e itálico***

\`código inline\`

~~Texto riscado~~`,
    },
    {
      title: '📋 Listas',
      description: 'Crie listas ordenadas e não ordenadas',
      markdown: `**Lista não ordenada:**
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
- Item 3

**Lista ordenada:**
1. Primeiro item
2. Segundo item
3. Terceiro item`,
    },
    {
      title: '🔗 Links e Imagens',
      description: 'Adicione links e imagens ao conteúdo',
      markdown: `[Texto do link](https://exemplo.com)

![Descrição da imagem](url-da-imagem.jpg)`,
    },
    {
      title: '💻 Blocos de Código',
      description: 'Use três crases para blocos de código',
      markdown: `\`\`\`javascript
function exemplo() {
  console.log("Olá, mundo!");
}
\`\`\``,
    },
    {
      title: '💬 Citações',
      description: 'Use > para criar citações ou dicas importantes',
      markdown: `> Esta é uma citação ou dica importante
> que pode ocupar múltiplas linhas.
> 
> Use para destacar informações relevantes!`,
    },
    {
      title: '📊 Tabelas',
      description: 'Crie tabelas para organizar informações',
      markdown: `| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Linha 1  | Dado A   | Dado B   |
| Linha 2  | Dado C   | Dado D   |`,
    },
    {
      title: '➖ Linha Horizontal',
      description: 'Use --- para criar uma linha divisória',
      markdown: `Texto acima da linha

---

Texto abaixo da linha`,
    },
    {
      title: '✅ Lista de Tarefas',
      description: 'Crie checklists interativos',
      markdown: `- [x] Tarefa concluída
- [ ] Tarefa pendente
- [ ] Outra tarefa pendente`,
    },
  ];

  return (
    <S.Overlay onClick={onClose}>
      <S.GuideContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <S.Header>
          <S.HeaderLeft>
            <FiBook size={24} />
            <S.Title>Guia de Estilos Markdown</S.Title>
          </S.HeaderLeft>
          <S.CloseButton onClick={onClose}>
            <FiX size={24} />
          </S.CloseButton>
        </S.Header>

        <S.Content>
          <S.Introduction>
            <S.IntroTitle>👋 Bem-vindo ao Editor Markdown!</S.IntroTitle>
            <S.IntroText>
              Use os exemplos abaixo para formatar o conteúdo das suas lições.
              Markdown é uma linguagem simples que permite criar textos
              formatados de forma rápida e intuitiva.
            </S.IntroText>
          </S.Introduction>

          <S.ExamplesGrid>
            {examples.map((example, index) => (
              <S.ExampleCard key={index}>
                <S.ExampleHeader>
                  <S.ExampleTitle>{example.title}</S.ExampleTitle>
                  <S.ExampleDescription>
                    {example.description}
                  </S.ExampleDescription>
                </S.ExampleHeader>

                <S.ExampleContent>
                  <S.CodeSection>
                    <S.SectionLabel>Como escrever:</S.SectionLabel>
                    <S.CodeBlock>{example.markdown}</S.CodeBlock>
                  </S.CodeSection>

                  <S.PreviewSection>
                    <S.SectionLabel>Como fica:</S.SectionLabel>
                    <S.PreviewBlock>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {example.markdown}
                      </ReactMarkdown>
                    </S.PreviewBlock>
                  </S.PreviewSection>
                </S.ExampleContent>
              </S.ExampleCard>
            ))}
          </S.ExamplesGrid>

          <S.Tips>
            <S.TipsTitle>💡 Dicas Importantes</S.TipsTitle>
            <S.TipsList>
              <S.TipItem>
                <strong>Combine estilos:</strong> Você pode combinar diferentes
                formatações para criar conteúdo rico e interessante.
              </S.TipItem>
              <S.TipItem>
                <strong>Use visualização:</strong> Alterne para o modo
                "Dividido" ou "Visualizar" para ver como o conteúdo ficará.
              </S.TipItem>
              <S.TipItem>
                <strong>Salve frequentemente:</strong> Use "Salvar Rascunho"
                regularmente para não perder seu trabalho.
              </S.TipItem>
              <S.TipItem>
                <strong>Seja consistente:</strong> Mantenha um padrão de
                formatação em todas as lições para uma melhor experiência dos
                alunos.
              </S.TipItem>
            </S.TipsList>
          </S.Tips>
        </S.Content>
      </S.GuideContainer>
    </S.Overlay>
  );
};

export default MarkdownStyleGuide;
