import React from 'react';
import { FiLoader } from 'react-icons/fi';

import { Container } from './styles';

const ButtonLoader: React.FC = () => {
  return (
    <Container>
      <FiLoader size={20} />
    </Container>
  );
};

export default ButtonLoader;
