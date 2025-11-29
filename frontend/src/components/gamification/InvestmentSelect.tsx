import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, TrendingUp, Landmark, PiggyBank } from "lucide-react";
import { type InvestmentOption } from "../../services/investimentsService";

interface InvestmentSelectProps {
  options: InvestmentOption[];
  value: string;
  onChange: (id: string) => void;
  formatRate: (rate: number) => string;
}

type CategoryType = "renda_fixa" | "tesouro" | "poupanca";

interface CategoryConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid
    ${({ $isOpen, theme }) =>
      $isOpen ? theme.colors.primary : theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: left;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary}22;
  }
`;

const SelectedContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SelectedName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const SelectedDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const RateText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const ChevronIcon = styled(motion.div)<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMedium};
  flex-shrink: 0;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textLight};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.textMedium};
    }
  }
`;

const CategoryGroup = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const CategoryHeader = styled.div<{ $color: string }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  position: sticky;
  top: 0;
  z-index: 1;

  svg {
    width: 16px;
    height: 16px;
    color: ${({ $color }) => $color};
  }

  span {
    font-size: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.textMedium};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const OptionItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? `${theme.colors.primary}08` : "transparent"};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast} ease;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}11;
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.primary}11;
  }
`;

const OptionCheckbox = styled.div<{ $isSelected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 2px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary : "transparent"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all ${({ theme }) => theme.animations.fast} ease;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const OptionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const OptionName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textDark};
  font-size: ${({ theme }) => theme.typography.fontSize.body};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: 2px;
`;

const OptionRate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.caption};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const OptionDescription = styled.div`
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.4;
  margin-top: 2px;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const Tag = styled.span<{ $color: string }>`
  font-size: 0.6rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ $color }) => `${$color}18`};
  color: ${({ $color }) => $color};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  letter-spacing: 0.2px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.6rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

export const InvestmentSelect: React.FC<InvestmentSelectProps> = ({
  options,
  value,
  onChange,
  formatRate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  const categoryConfig: Record<CategoryType, CategoryConfig> = {
    renda_fixa: {
      label: "Renda Fixa",
      icon: <TrendingUp />,
      color: "#007ACC",
    },
    tesouro: {
      label: "Tesouro Direto",
      icon: <Landmark />,
      color: "#28A745",
    },
    poupanca: {
      label: "Poupança",
      icon: <PiggyBank />,
      color: "#FFA500",
    },
  };

  const groupedOptions = options.reduce((acc, option) => {
    const category = option.category || "renda_fixa";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, InvestmentOption[]>);

  const categoryOrder: CategoryType[] = ["renda_fixa", "tesouro", "poupanca"];

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "baixo":
        return "#28A745";
      case "medio":
        return "#FD7E14";
      case "alto":
        return "#DC3545";
      default:
        return "#6C757D";
    }
  };

  const getLiquidityLabel = (liquidity?: string) => {
    switch (liquidity) {
      case "diaria":
        return "Liquidez Diária";
      case "mensal":
        return "Liquidez Mensal";
      case "vencimento":
        return "No Vencimento";
      default:
        return liquidity;
    }
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectTrigger
        type="button"
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <SelectedContent>
          {selectedOption ? (
            <>
              <SelectedName>
                {selectedOption.name}
                {selectedOption.recommended && <Badge>Recomendado</Badge>}
              </SelectedName>
              <SelectedDetails>
                <RateText>{formatRate(selectedOption.rate)} ao ano</RateText>
                {selectedOption.risk && (
                  <Tag $color={getRiskColor(selectedOption.risk)}>
                    Risco {selectedOption.risk}
                  </Tag>
                )}
                {selectedOption.liquidity && (
                  <Tag $color="#17A2B8">
                    {getLiquidityLabel(selectedOption.liquidity)}
                  </Tag>
                )}
              </SelectedDetails>
            </>
          ) : (
            <Placeholder>Selecione um investimento...</Placeholder>
          )}
        </SelectedContent>

        <ChevronIcon
          $isOpen={isOpen}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </ChevronIcon>
      </SelectTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            {categoryOrder.map((category) => {
              const categoryOptions = groupedOptions[category];
              if (!categoryOptions || categoryOptions.length === 0) return null;

              const config = categoryConfig[category];

              return (
                <CategoryGroup key={category}>
                  <CategoryHeader $color={config.color}>
                    {config.icon}
                    <span>{config.label}</span>
                  </CategoryHeader>

                  {categoryOptions.map((option) => {
                    const isSelected = option.id === value;

                    return (
                      <OptionItem
                        key={option.id}
                        $isSelected={isSelected}
                        onClick={() => handleSelect(option.id)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <OptionCheckbox $isSelected={isSelected}>
                          {isSelected && <Check />}
                        </OptionCheckbox>

                        <OptionContent>
                          <OptionName>
                            {option.name}
                            {option.recommended && <Badge>Recomendado</Badge>}
                          </OptionName>
                          <OptionRate>
                            {formatRate(option.rate)} ao ano
                          </OptionRate>
                          {option.description && (
                            <OptionDescription>
                              {option.description}
                            </OptionDescription>
                          )}
                          {(option.risk || option.liquidity) && (
                            <TagsContainer>
                              {option.risk && (
                                <Tag $color={getRiskColor(option.risk)}>
                                  Risco {option.risk}
                                </Tag>
                              )}
                              {option.liquidity && (
                                <Tag $color="#17A2B8">
                                  {getLiquidityLabel(option.liquidity)}
                                </Tag>
                              )}
                            </TagsContainer>
                          )}
                        </OptionContent>
                      </OptionItem>
                    );
                  })}
                </CategoryGroup>
              );
            })}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </SelectContainer>
  );
};

export default InvestmentSelect;