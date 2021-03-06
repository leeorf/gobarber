import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  color: #312e38;
  height: 56px;
  border-radius: 10px;
  border: none;
  margin-top: 16px;
  padding: 0 16px;
  width: 100%;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }

  ${props =>
    props.disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}
`;
