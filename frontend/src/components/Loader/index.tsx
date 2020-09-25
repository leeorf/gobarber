import React from 'react';
import { FiLoader } from 'react-icons/fi';

import { Container } from './styles';

const Loader: React.FC = () => {
  return (
    <Container>
      <FiLoader size={20} />
    </Container>
  );
};

export default Loader;
