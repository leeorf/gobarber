import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  header {
    height: 144px;
    padding: 32px 0;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      margin: 0 10%;

      svg {
        color: #999591;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  margin-top: -11.5%;

  width: 100%;

  form {
    margin: 80px 0;
    width: 340px;
    display: flex;
    flex-direction: column;

    div:nth-child(5) {
      margin-top: 24px;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 24px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  label {
    position: absolute;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background-color: #ff9000;
    border: none;
    bottom: 0;
    right: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }

  img {
    height: 240px;
    width: 240px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
