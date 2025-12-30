import React from 'react';
import {
  FiBold,
  FiItalic,
  FiCode,
  FiList,
  FiLink,
  FiImage,
  FiEdit,
  FiEye,
  FiColumns,
} from 'react-icons/fi';
import * as S from './MarkdownToolbar.styles';

interface MarkdownToolbarProps {
  onInsertMarkdown: (markdown: string) => void;
  activeView: 'edit' | 'preview' | 'split';
  onViewChange: (view: 'edit' | 'preview' | 'split') => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  onInsertMarkdown,
  activeView,
  onViewChange,
}) => {
  const tools = [
    {
      icon: <FiBold size={18} />,
      title: 'Negrito',
      onClick: () => onInsertMarkdown('\n**texto em negrito**\n'),
    },
    {
      icon: <FiItalic size={18} />,
      title: 'Itálico',
      onClick: () => onInsertMarkdown('\n*texto em itálico*\n'),
    },
    {
      icon: <FiCode size={18} />,
      title: 'Código',
      onClick: () => onInsertMarkdown('\n```\ncódigo aqui\n```\n'),
    },
    {
      icon: <FiList size={18} />,
      title: 'Lista',
      onClick: () => onInsertMarkdown('\n- Item 1\n- Item 2\n- Item 3\n'),
    },
    {
      icon: <FiLink size={18} />,
      title: 'Link',
      onClick: () => onInsertMarkdown('\n[texto do link](url)\n'),
    },
    {
      icon: <FiImage size={18} />,
      title: 'Imagem',
      onClick: () => onInsertMarkdown('\n![descrição](url-da-imagem)\n'),
    },
  ];

  return (
    <S.ToolbarContainer>
      <S.ToolbarTitle>Ferramentas de Formatação</S.ToolbarTitle>
      <S.ToolbarButtons>
        {tools.map((tool, index) => (
          <S.ToolButton
            key={index}
            onClick={tool.onClick}
            title={tool.title}
            aria-label={tool.title}
          >
            {tool.icon}
          </S.ToolButton>
        ))}
        <S.ToolButton
          onClick={() => onViewChange('edit')}
          title="Modo Edição"
          style={{
            marginLeft: 'auto',
            backgroundColor: activeView === 'edit' ? '#007ACC' : 'transparent',
            color: activeView === 'edit' ? 'white' : 'inherit',
          }}
        >
          <FiEdit size={18} />
        </S.ToolButton>
        <S.ToolButton
          onClick={() => onViewChange('split')}
          title="Modo Dividido"
          style={{
            backgroundColor: activeView === 'split' ? '#007ACC' : 'transparent',
            color: activeView === 'split' ? 'white' : 'inherit',
          }}
        >
          <FiColumns size={18} />
        </S.ToolButton>
        <S.ToolButton
          onClick={() => onViewChange('preview')}
          title="Modo Visualização"
          style={{
            backgroundColor: activeView === 'preview' ? '#007ACC' : 'transparent',
            color: activeView === 'preview' ? 'white' : 'inherit',
          }}
        >
          <FiEye size={18} />
        </S.ToolButton>
      </S.ToolbarButtons>
    </S.ToolbarContainer>
  );
};

export default MarkdownToolbar;
