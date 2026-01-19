import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownToolbar from './MarkdownToolbar';
import * as S from './MarkdownEditor.styles';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  activeView?: 'edit' | 'preview' | 'split';
  onViewChange?: (view: 'edit' | 'preview' | 'split') => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = '',
  onChange,
  activeView: externalActiveView,
  onViewChange: externalOnViewChange,
}) => {
  const [content, setContent] = useState(initialValue);
  const [internalActiveView, setInternalActiveView] = useState<'edit' | 'preview' | 'split'>('split');
  
  const activeView = externalActiveView ?? internalActiveView;
  const setActiveView = externalOnViewChange ?? setInternalActiveView;

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onChange?.(value);
  };

  const handleInsertMarkdown = (markdownText: string) => {
    setContent((prev) => prev + markdownText);
    onChange?.(content + markdownText);
  };

  return (
    <S.EditorContainer>
      <MarkdownToolbar
        onInsertMarkdown={handleInsertMarkdown}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <S.EditorContent>
        {(activeView === 'edit' || activeView === 'split') && (
          <S.EditorPane isFullWidth={activeView === 'edit'}>
            <S.Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Digite seu conteúdo em Markdown..."
            />
          </S.EditorPane>
        )}

        {(activeView === 'preview' || activeView === 'split') && (
          <S.PreviewPane isFullWidth={activeView === 'preview'}>
            <S.MarkdownContent>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Nenhum conteúdo para visualizar*'}
              </ReactMarkdown>
            </S.MarkdownContent>
          </S.PreviewPane>
        )}
      </S.EditorContent>
    </S.EditorContainer>
  );
};

export default MarkdownEditor;
