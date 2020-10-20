import React from 'react';
import Loader from 'react-loader-spinner';

import { Container } from './styles';

const FetchDataLoader: React.FC = () => {
  return (
    <Container>
      <Loader type="Oval" color="#ff9000" height={120} width={120} />
    </Container>
  );
};

export default FetchDataLoader;
