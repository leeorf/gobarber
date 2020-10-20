import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';
import ButtonLoader from '../ButtonLoader';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => {
  return (
    <Container type="button" {...rest}>
      {loading ? <ButtonLoader /> : children}
    </Container>
  );
};

export default Button;
