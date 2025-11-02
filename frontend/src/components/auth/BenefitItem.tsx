import React from 'react';
import { BenefitItemStyled } from '../../pages/RegisterPage.styles';

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

export const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description, delay }) => {
  return (
    <BenefitItemStyled
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      {icon}
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </BenefitItemStyled>
  );
};