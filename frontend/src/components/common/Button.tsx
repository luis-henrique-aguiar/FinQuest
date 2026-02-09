import React, { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';


type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

type BaseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
> & Pick<HTMLMotionProps<'button'>, 'whileTap'>;

interface ButtonOwnProps extends BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  'data-testid'?: string;
  className?: string;
}

type ButtonProps = ButtonOwnProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  whileTap,
  className,
  disabled,
  ...rest
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#FFA500] text-[#333333] hover:bg-[#FFA500]/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-zinc-900 border border-[#FFA500]",
    secondary: "bg-[#007ACC] text-white hover:bg-[#007ACC]/90 shadow-sm hover:shadow-md",
    outline: "bg-transparent text-[#007ACC] border-2 border-[#007ACC] hover:bg-[#007ACC]/10",
    text: "bg-transparent text-[#007ACC] hover:bg-[#007ACC]/10 px-2",
  };

  const sizes = {
    small: "text-sm py-1 px-3 h-8 gap-1.5",
    medium: "text-base py-2 px-4 h-10 gap-2",
    large: "text-lg py-3 px-6 h-12 gap-3",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";
  const flexDirection = iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], widthStyle, flexDirection, className)}
      whileTap={!disabled ? (whileTap ?? { scale: 0.98 }) : undefined}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className={cn(iconPosition === 'right' ? 'ml-1' : 'mr-1')}>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;