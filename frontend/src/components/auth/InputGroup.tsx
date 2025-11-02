import React from "react";
import {
  InputGroupStyled,
  Label,
  InputWrapper,
  Input,
} from "../../pages/RegisterPage.styles";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  id: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  icon,
  id,
  ...inputProps
}) => {
  return (
    <InputGroupStyled>
      <Label htmlFor={id}>{label}</Label>
      <InputWrapper>
        {icon}
        <Input id={id} {...inputProps} />
      </InputWrapper>
    </InputGroupStyled>
  );
};
